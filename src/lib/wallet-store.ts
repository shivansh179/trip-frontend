/**
 * Server-side wallet store using Upstash Redis REST API.
 * Falls back gracefully if env vars are not set.
 *
 * Keys:
 *   wl:bal:{id}   → balance in rupees (integer string)
 *   wl:txns:{id}  → JSON array of last 100 transactions
 *   wl:done:{ref} → dedup sentinel for cashback credits
 */

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const CASHBACK_RATE = 0.10; // 10%
export const MAX_TRANSACTIONS = 100;

export interface WalletTxn {
  id: string;
  date: string;
  type: 'cashback' | 'used' | 'welcome';
  amount: number;
  bookingRef: string;
  description: string;
}

export interface WalletData {
  balance: number;
  transactions: WalletTxn[];
}

/** Normalize phone → strip non-digits, handle +91 prefix */
export function normalizeId(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // Strip leading 91 if 12 digits (Indian international format)
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
}

function isConfigured(): boolean {
  return Boolean(REDIS_URL && REDIS_TOKEN);
}

async function redisCmd<T = unknown>(...args: (string | number)[]): Promise<T | null> {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(REDIS_URL!, {
      method:  'POST',
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(args),
    });
    const json = await res.json() as { result: T };
    return json.result ?? null;
  } catch {
    return null;
  }
}

/** Get wallet balance for an identifier (phone/email). Returns 0 if not found. */
export async function getBalance(id: string): Promise<number> {
  if (!isConfigured()) return 0;
  const raw = await redisCmd<string>('GET', `wl:bal:${id}`);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

/** Get wallet transactions for an identifier. Returns [] if not found. */
export async function getTransactions(id: string): Promise<WalletTxn[]> {
  if (!isConfigured()) return [];
  const raw = await redisCmd<string>('GET', `wl:txns:${id}`);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Get full wallet data (balance + transactions). */
export async function getWallet(id: string): Promise<WalletData> {
  const [balance, transactions] = await Promise.all([getBalance(id), getTransactions(id)]);
  return { balance, transactions };
}

/**
 * Credit cashback after a successful booking.
 * Idempotent — dedup key prevents double-credit.
 * Returns the credited amount (0 if already done or error).
 */
export async function creditCashback(
  id: string,
  bookingRef: string,
  bookingTotal: number,
  tripName: string,
): Promise<number> {
  if (!isConfigured()) return 0;
  const dedupKey = `wl:done:${bookingRef}`;

  // Atomic check-and-set: SET NX (only set if not exists)
  const set = await redisCmd<string>('SET', dedupKey, '1', 'NX', 'EX', 60 * 60 * 24 * 365);
  if (!set) return 0; // already credited

  const amount = Math.round(bookingTotal * CASHBACK_RATE);
  if (amount <= 0) return 0;

  // Increment balance atomically
  await redisCmd('INCRBY', `wl:bal:${id}`, amount);

  // Prepend transaction
  const txns = await getTransactions(id);
  const newTxn: WalletTxn = {
    id:          `cb-${Date.now()}`,
    date:        new Date().toISOString(),
    type:        'cashback',
    amount,
    bookingRef,
    description: `10% cashback — ${tripName}`,
  };
  const updated = [newTxn, ...txns].slice(0, MAX_TRANSACTIONS);
  await redisCmd('SET', `wl:txns:${id}`, JSON.stringify(updated));

  return amount;
}

/**
 * Deduct wallet balance at checkout.
 * Returns { success, newBalance }.
 */
export async function deductWallet(
  id: string,
  amount: number,
  bookingRef: string,
): Promise<{ success: boolean; newBalance: number }> {
  if (!isConfigured() || amount <= 0) return { success: false, newBalance: 0 };

  const balance = await getBalance(id);
  if (amount > balance) return { success: false, newBalance: balance };

  const newBalance = await redisCmd<number>('DECRBY', `wl:bal:${id}`, amount) ?? balance;

  const txns = await getTransactions(id);
  const txn: WalletTxn = {
    id:          `use-${Date.now()}`,
    date:        new Date().toISOString(),
    type:        'used',
    amount,
    bookingRef,
    description: 'WanderLoot wallet discount applied',
  };
  await redisCmd('SET', `wl:txns:${id}`, JSON.stringify([txn, ...txns].slice(0, MAX_TRANSACTIONS)));

  return { success: true, newBalance: Number(newBalance) };
}
