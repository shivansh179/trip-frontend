'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { WalletProvider } from '@/context/WalletContext';
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
      <SessionProvider>
        <CurrencyProvider>
          <VisitorProvider>
            <WalletProvider>
              {children}
            </WalletProvider>
          </VisitorProvider>
        </CurrencyProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
