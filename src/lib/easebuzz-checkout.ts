/* Easebuzz payment utility — redirects to full payment page with all options */

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

/**
 * Initiates Easebuzz payment.
 * Uses direct redirect to the Easebuzz hosted page which shows all payment
 * modes (UPI, Credit Card, Debit Card, NetBanking, EMI) on both mobile & desktop.
 */
export async function initiateEasebuzzPayment({
  accessKey,
  onSuccess,
  onFailure,
}: {
  accessKey: string;
  onSuccess: (response: EasebuzzResponse) => void;
  onFailure: (response: EasebuzzResponse) => void;
}): Promise<void> {
  const env = (process.env.NEXT_PUBLIC_EASEBUZZ_ENV || 'production').trim();
  const base = env === 'production' ? 'https://pay.easebuzz.in' : 'https://testpay.easebuzz.in';
  // Redirect to full Easebuzz payment page — shows all payment methods
  window.location.href = `${base}/pay/${accessKey}`;
}
