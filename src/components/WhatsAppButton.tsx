'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber = '918427831127',
  message = 'Hi! I want to book a trip. Please share the best package price and available dates.',
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp — we reply within 1 hour"
      className="hidden md:flex fixed bottom-8 right-5 z-50 group flex-col items-end gap-2"
    >
      {/* Main button */}
      <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
        <MessageCircle size={22} className="fill-white shrink-0" />
        <span className="text-sm font-semibold pr-1 hidden sm:block">WhatsApp</span>
      </div>
    </a>
  );
}
