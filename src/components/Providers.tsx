'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { WalletProvider } from '@/context/WalletContext';
import SocialProofToast from '@/components/SocialProofToast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <VisitorProvider>
          <WalletProvider>
            <SocialProofToast />
            {children}
          </WalletProvider>
        </VisitorProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}
