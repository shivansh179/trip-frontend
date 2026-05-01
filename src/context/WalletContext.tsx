'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

const BALANCE_KEY = 'ylootrips-wallet-balance';
const TRANSACTIONS_KEY = 'ylootrips-wallet-transactions';
const WELCOME_BONUS_KEY = 'ylootrips-wallet-welcome-bonus';
const WELCOME_BONUS_AMOUNT = 500;

export const CASHBACK_RATE = 0.10; // 10% on every booking

export interface WalletTransaction {
  id: string;
  date: string; // ISO string
  type: 'cashback' | 'used';
  amount: number; // INR, always positive
  bookingRef: string;
  description: string;
}

interface WalletContextValue {
  balance: number;
  transactions: WalletTransaction[];
  /** Credit 10% cashback on a booking total. Returns the cashback amount. */
  addCashback: (bookingTotal: number, bookingRef: string, tripName?: string) => number;
  /** Credit a fixed amount directly (e.g. memory upload reward). */
  creditWallet: (amount: number, ref: string, description: string) => void;
  /** Deduct an amount from wallet. Returns false if insufficient balance. */
  deductBalance: (amount: number, bookingRef: string) => boolean;
}

const WalletContext = createContext<WalletContextValue>({
  balance: 0,
  transactions: [],
  addCashback: () => 0,
  creditWallet: () => {},
  deductBalance: () => false,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const savedTxns = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]') as WalletTransaction[];
        const txns = Array.isArray(savedTxns) ? savedTxns : [];
        let savedBalance = parseFloat(localStorage.getItem(BALANCE_KEY) || '0') || 0;

        // Grant welcome bonus to new users (only once)
        if (!localStorage.getItem(WELCOME_BONUS_KEY)) {
          const welcomeTxn: WalletTransaction = {
            id: `welcome-${Date.now()}`,
            date: new Date().toISOString(),
            type: 'cashback',
            amount: WELCOME_BONUS_AMOUNT,
            bookingRef: 'WELCOME',
            description: `🎁 Welcome bonus — ₹${WELCOME_BONUS_AMOUNT} WanderLoot credits`,
          };
          savedBalance += WELCOME_BONUS_AMOUNT;
          txns.unshift(welcomeTxn);
          localStorage.setItem(WELCOME_BONUS_KEY, '1');
          localStorage.setItem(BALANCE_KEY, String(savedBalance));
          localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns));
        }

        setBalance(savedBalance);
        setTransactions(txns);

        // Sync from server if customer has identified themselves (post-booking)
        const walletId = localStorage.getItem('ylootrips-wallet-id');
        if (walletId) {
          try {
            const res = await fetch(`/api/wallet/balance?id=${encodeURIComponent(walletId)}`);
            if (res.ok) {
              const data = await res.json();
              const serverBalance: number = data.balance ?? 0;
              const serverTxns: WalletTransaction[] = Array.isArray(data.transactions) ? data.transactions : [];
              // Use server balance if higher (server is source of truth after first booking)
              if (serverBalance > 0) {
                const merged = serverBalance + WELCOME_BONUS_AMOUNT;
                setBalance(merged);
                setTransactions([...serverTxns, ...txns.filter(t => t.bookingRef === 'WELCOME')]);
                localStorage.setItem(BALANCE_KEY, String(merged));
              }
            }
          } catch { /* server unavailable — use localStorage */ }
        }
      } catch {
        /* ignore */
      }
      setHydrated(true);
    };
    init();
  }, []);

  const persist = useCallback((newBalance: number, newTxns: WalletTransaction[]) => {
    setBalance(newBalance);
    setTransactions(newTxns);
    try {
      localStorage.setItem(BALANCE_KEY, String(newBalance));
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTxns));
    } catch { /* ignore */ }
  }, []);

  const addCashback = useCallback((bookingTotal: number, bookingRef: string, tripName = 'your booking') => {
    const cashbackAmount = Math.round(bookingTotal * CASHBACK_RATE);
    if (cashbackAmount <= 0) return 0;
    const txn: WalletTransaction = {
      id: `cb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: new Date().toISOString(),
      type: 'cashback',
      amount: cashbackAmount,
      bookingRef,
      description: `10% cashback — ${tripName}`,
    };
    setBalance((prev) => {
      const newBal = prev + cashbackAmount;
      setTransactions((prevTxns) => {
        const newTxns = [txn, ...prevTxns];
        try {
          localStorage.setItem(BALANCE_KEY, String(newBal));
          localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTxns));
        } catch { /* ignore */ }
        return newTxns;
      });
      return newBal;
    });
    return cashbackAmount;
  }, []);

  const creditWallet = useCallback((amount: number, ref: string, description: string) => {
    if (amount <= 0) return;
    const txn: WalletTransaction = {
      id: `cr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: new Date().toISOString(),
      type: 'cashback',
      amount,
      bookingRef: ref,
      description,
    };
    setBalance((prev) => {
      const newBal = prev + amount;
      setTransactions((prevTxns) => {
        const newTxns = [txn, ...prevTxns];
        try {
          localStorage.setItem(BALANCE_KEY, String(newBal));
          localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTxns));
        } catch { /* ignore */ }
        return newTxns;
      });
      return newBal;
    });
  }, []);

  const deductBalance = useCallback((amount: number, bookingRef: string) => {
    if (amount <= 0) return true;
    let success = false;
    setBalance((prev) => {
      if (amount > prev) return prev; // insufficient
      success = true;
      const newBal = prev - amount;
      const txn: WalletTransaction = {
        id: `use-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        date: new Date().toISOString(),
        type: 'used',
        amount,
        bookingRef,
        description: `Wallet discount applied`,
      };
      setTransactions((prevTxns) => {
        const newTxns = [txn, ...prevTxns];
        try {
          localStorage.setItem(BALANCE_KEY, String(newBal));
          localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTxns));
        } catch { /* ignore */ }
        return newTxns;
      });
      return newBal;
    });
    return success;
  }, []);

  if (!hydrated) {
    // Avoid hydration mismatch — render children but with zero balance until mounted
    return (
      <WalletContext.Provider value={{ balance: 0, transactions: [], addCashback, creditWallet, deductBalance }}>
        {children}
      </WalletContext.Provider>
    );
  }

  return (
    <WalletContext.Provider value={{ balance, transactions, addCashback, creditWallet, deductBalance }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
