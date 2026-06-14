'use client';

// All non-critical layout widgets are lazy-loaded here so they never block
// first paint. This file is a client component so dynamic({ ssr: false }) works.
import dynamic from 'next/dynamic';

const WhatsAppButton    = dynamic(() => import('@/components/WhatsAppButton'),    { ssr: false });
const MobileStickyCTA   = dynamic(() => import('@/components/MobileStickyCTA'),   { ssr: false });
const SecurityShield    = dynamic(() => import('@/components/SecurityShield'),    { ssr: false });
const ExitIntentPopup   = dynamic(() => import('@/components/ExitIntentPopup'),   { ssr: false });
const EmailCapturePopup = dynamic(() => import('@/components/EmailCapturePopup'), { ssr: false });
const ActiveUserPing    = dynamic(() => import('@/components/ActiveUserPing'),    { ssr: false });

export default function LayoutWidgets() {
  return (
    <>
      <ActiveUserPing />
      <SecurityShield />
      <ExitIntentPopup />
      <EmailCapturePopup />
      <WhatsAppButton phoneNumber="918427831127" />
      <MobileStickyCTA />
    </>
  );
}
