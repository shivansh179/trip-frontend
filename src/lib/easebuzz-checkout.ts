/* Easebuzz JS SDK utility — opens a mobile-friendly payment modal on our page */

declare global {
  interface Window {
    EasebuzzCheckout: new (key: string, env: string) => {
      initiatePayment: (options: Record<string, unknown>) => void;
    };
  }
}

const SDK_URL = 'https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js';

function loadSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Not in browser'));
    if (window.EasebuzzCheckout) return resolve();
    const existing = document.getElementById('easebuzz-sdk');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('SDK load failed')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'easebuzz-sdk';
    script.src = SDK_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Easebuzz SDK'));
    document.head.appendChild(script);
  });
}

export interface EasebuzzResponse {
  status: string;
  txnid: string;
  amount: string;
  email: string;
  phone: string;
  firstname: string;
  productinfo: string;
  [key: string]: string;
}

export async function initiateEasebuzzPayment({
  accessKey,
  onSuccess,
  onFailure,
}: {
  accessKey: string;
  onSuccess: (response: EasebuzzResponse) => void;
  onFailure: (response: EasebuzzResponse) => void;
}): Promise<void> {
  const key = process.env.NEXT_PUBLIC_EASEBUZZ_KEY || '';
  const rawEnv = (process.env.NEXT_PUBLIC_EASEBUZZ_ENV || 'production').trim();
  const env = rawEnv === 'production' ? 'prod' : 'test';

  if (!key) {
    throw new Error('NEXT_PUBLIC_EASEBUZZ_KEY is not set');
  }

  await loadSDK();

  const checkout = new window.EasebuzzCheckout(key, env);
  checkout.initiatePayment({
    access_key: accessKey,
    onResponse: (response: EasebuzzResponse) => {
      if (response.status === 'success') {
        onSuccess(response);
      } else {
        onFailure(response);
      }
    },
  });
}
