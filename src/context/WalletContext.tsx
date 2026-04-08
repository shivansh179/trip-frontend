'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

const BALANCE_KEY = 'ylootrips-wallet-balance';
const TRANSACTIONS_KEY = 'ylootrips-wallet-transactions';

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
  /** Deduct an amount from wallet. Returns false if insufficient balance. */
  deductBalance: (amount: number, bookingRef: string) => boolean;
}

const WalletContext = createContext<WalletContextValue>({
  balance: 0,
  transactions: [],
  addCashback: () => 0,
  deductBalance: () => false,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedBalance = parseFloat(localStorage.getItem(BALANCE_KEY) || '0') || 0;
      const savedTxns = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]') as WalletTransaction[];
      setBalance(savedBalance);
      setTransactions(Array.isArray(savedTxns) ? savedTxns : []);
    } catch {
      /* ignore */
    }
    setHydrated(true);
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
      <WalletContext.Provider value={{ balance: 0, transactions: [], addCashback, deductBalance }}>
        {children}
      </WalletContext.Provider>
    );
  }

  return (
    <WalletContext.Provider value={{ balance, transactions, addCashback, deductBalance }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
