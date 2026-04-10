import PaymentOptions from '@/components/PaymentOptions';

export default function PaymentDemoPage() {
  return (
    <div className="min-h-screen bg-cream-light py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-2">Payment Options</p>
          <h1 className="font-display text-display-lg text-primary">Choose how to pay</h1>
          <p className="text-secondary text-sm mt-2">Manali Adventure — 5 Days · 4 Nights</p>
        </div>
        <PaymentOptions
          tripPrice={24999}
          tripTitle="Manali Adventure — 5 Days / 4 Nights"
          onProceed={(payload) => {
            console.log('Payment payload:', payload);
            alert(`Selected: ${payload.mode.toUpperCase()} · Paying now: ₹${payload.amountNow.toLocaleString('en-IN')}`);
          }}
        />
      </div>
    </div>
  );
}
