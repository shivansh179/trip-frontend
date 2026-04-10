'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Currency } from '@/lib/currency';

// Re-export so existing imports still work
export { USD_TO_INR } from '@/lib/currency';
export type { Currency } from '@/lib/currency';

interface CurrencyContextValue {
  currency: Currency;
  toggle: () => void;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'INR',
  toggle: () => {},
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Always start with 'INR' to match server render, then hydrate from localStorage
  const [currency, setCurrencyState] = useState<Currency>('INR');

  // Hydrate from localStorage after mount to avoid SSR/client mismatch
  useEffect(() => {
    try {
      const visitor = localStorage.getItem('ylootrips-visitor');
      if (visitor === 'foreigner') setCurrencyState('USD');
    } catch {
      // ignore
    }
  }, []);

  // Keep currency in sync when visitor changes (VisitorContext writes to localStorage
  // and dispatches a 'visitorchange' event)
  useEffect(() => {
    const handler = (e: Event) => {
      const visitor = (e as CustomEvent<string>).detail;
      setCurrencyState(visitor === 'foreigner' ? 'USD' : 'INR');
    };
    window.addEventListener('visitorchange', handler);
    return () => window.removeEventListener('visitorchange', handler);
  }, []);

  const toggle = () =>
    setCurrencyState((prev) => (prev === 'INR' ? 'USD' : 'INR'));

  const setCurrency = (c: Currency) => setCurrencyState(c);

  return (
    <CurrencyContext.Provider value={{ currency, toggle, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
