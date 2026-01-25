'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
}

export default function WhatsAppButton({
    phoneNumber = '918427831127',
    message = 'Hi! I am interested in booking a trip. Can you help me?'
}: WhatsAppButtonProps) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group inline-flex items-center justify-center"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={28} className="fill-white" />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Chat with us
            </span>

            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25 pointer-events-none"></span>
        </a>
    );
}
