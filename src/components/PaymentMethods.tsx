'use client';

import { CreditCard, Smartphone, Building2, QrCode, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentMethodsProps {
    selectedMethod: string;
    onMethodChange: (method: string) => void;
    amount: number;
    bookingReference?: string;
}

export default function PaymentMethods({ selectedMethod, onMethodChange, amount, bookingReference }: PaymentMethodsProps) {
    const [showQRCode, setShowQRCode] = useState(false);
    const [cardData, setCardData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
    });

    const paymentMethods = [
        {
            id: 'upi',
            name: 'UPI',
            icon: Smartphone,
            discount: 5,
            description: 'Pay using UPI apps like PhonePe, Google Pay, Paytm',
        },
        {
            id: 'card',
            name: 'Credit/Debit Card',
            icon: CreditCard,
            discount: 3,
            description: 'Visa, Mastercard, RuPay, Amex',
        },
        {
            id: 'netbanking',
            name: 'Net Banking',
            icon: Building2,
            discount: 0,
            description: 'Pay directly from your bank account',
        },
    ];

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        }
        return v;
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const generateUPIQRCode = () => {
        // Generate UPI payment URL
        const upiId = 'ylootrips@paytm'; // Replace with your actual UPI ID
        const merchantName = 'YlooTrips';
        const transactionNote = bookingReference ? `Booking ${bookingReference}` : 'Trip Booking';
        const amountStr = amount.toFixed(2);

        // UPI Deep Link Format
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amountStr}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

        return upiUrl;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-light mb-6 flex items-center gap-3">
                <CreditCard size={28} className="text-secondary" />
                Payment Method
            </h2>

            {/* Payment Method Selection */}
            <div className="space-y-3">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;

                    return (
                        <label
                            key={method.id}
                            className={`flex items-start gap-4 p-5 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                ? 'border-secondary bg-secondary/5'
                                : 'border-primary/20 bg-white hover:border-primary/40'
                                }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={isSelected}
                                onChange={(e) => {
                                    onMethodChange(e.target.value);
                                    setShowQRCode(false);
                                }}
                                className="mt-1 text-secondary"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <Icon size={24} className={isSelected ? 'text-secondary' : 'text-primary/60'} />
                                    <span className="text-body-lg font-medium">{method.name}</span>
                                    {method.discount > 0 && (
                                        <span className="text-body-sm text-success font-medium bg-success/10 px-2 py-1 rounded">
                                            {method.discount}% OFF
                                        </span>
                                    )}
                                </div>
                                <p className="text-body-sm text-text-secondary">{method.description}</p>
                            </div>
                            {isSelected && (
                                <CheckCircle size={20} className="text-secondary flex-shrink-0 mt-1" />
                            )}
                        </label>
                    );
                })}
            </div>

            {/* UPI QR Code Section */}
            {selectedMethod === 'upi' && (
                <div className="mt-6 p-6 bg-cream-light border border-primary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-light flex items-center gap-2">
                            <QrCode size={24} className="text-secondary" />
                            UPI Payment
                        </h3>
                        <button
                            type="button"
                            onClick={() => setShowQRCode(!showQRCode)}
                            className="text-body-sm text-secondary hover:text-primary transition-colors"
                        >
                            {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                        </button>
                    </div>

                    {showQRCode ? (
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-primary/20 flex flex-col items-center">
                                <div className="w-64 h-64 bg-white border-2 border-primary/10 rounded-lg flex items-center justify-center mb-4 p-4">
                                    <QRCodeSVG
                                        value={generateUPIQRCode()}
                                        size={240}
                                        level="H"
                                        includeMargin={true}
                                        className="w-full h-full"
                                    />
                                </div>
                                <p className="text-body-sm text-text-secondary text-center mb-4">
                                    Scan this QR code with PhonePe, Google Pay, Paytm, or any UPI app
                                </p>
                                <div className="bg-primary/5 p-4 rounded-lg w-full">
                                    <p className="text-caption text-text-secondary mb-1">UPI ID</p>
                                    <p className="text-body-lg font-mono">ylootrips@paytm</p>
                                </div>
                                <div className="bg-primary/5 p-4 rounded-lg w-full mt-2">
                                    <p className="text-caption text-text-secondary mb-1">Amount</p>
                                    <p className="text-body-lg font-semibold">₹{amount.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="bg-accent/10 p-4 rounded-lg">
                                <p className="text-body-sm text-text-secondary">
                                    <strong>Note:</strong> After scanning and completing payment, click "Complete Booking" to proceed.
                                    Your payment will be verified automatically.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-4 rounded-lg border border-primary/10">
                            <p className="text-body-sm text-text-secondary">
                                Click "Show QR Code" to display the payment QR code, or proceed to pay via UPI gateway.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Card Payment Form */}
            {selectedMethod === 'card' && (
                <div className="mt-6 p-6 bg-cream-light border border-primary/10 rounded-lg">
                    <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                        <CreditCard size={24} className="text-secondary" />
                        Card Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-caption text-text-secondary mb-2 block">
                                Cardholder Name *
                            </label>
                            <input
                                type="text"
                                value={cardData.cardholderName}
                                onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                                placeholder="John Doe"
                                className="w-full p-4 border border-primary/20 bg-white text-primary rounded-lg focus:outline-none focus:border-secondary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-caption text-text-secondary mb-2 block">
                                Card Number *
                            </label>
                            <input
                                type="text"
                                value={cardData.cardNumber}
                                onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                className="w-full p-4 border border-primary/20 bg-white text-primary rounded-lg focus:outline-none focus:border-secondary transition-colors font-mono"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-caption text-text-secondary mb-2 block">
                                    Expiry Date *
                                </label>
                                <input
                                    type="text"
                                    value={cardData.expiryDate}
                                    onChange={(e) => {
                                        const formatted = formatExpiryDate(e.target.value);
                                        if (formatted.length <= 5) {
                                            setCardData({ ...cardData, expiryDate: formatted });
                                        }
                                    }}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className="w-full p-4 border border-primary/20 bg-white text-primary rounded-lg focus:outline-none focus:border-secondary transition-colors font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-caption text-text-secondary mb-2 block">
                                    CVV *
                                </label>
                                <input
                                    type="text"
                                    value={cardData.cvv}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, '');
                                        if (v.length <= 4) {
                                            setCardData({ ...cardData, cvv: v });
                                        }
                                    }}
                                    placeholder="123"
                                    maxLength={4}
                                    className="w-full p-4 border border-primary/20 bg-white text-primary rounded-lg focus:outline-none focus:border-secondary transition-colors font-mono"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <div className="flex gap-2">
                                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">V</span>
                                </div>
                                <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">MC</span>
                                </div>
                                <div className="w-8 h-5 bg-orange-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">R</span>
                                </div>
                            </div>
                            <p className="text-body-sm text-text-secondary ml-2">
                                We accept Visa, Mastercard, RuPay, and Amex
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Net Banking Info */}
            {/* {selectedMethod === 'netbanking' && (
                <div className="mt-6 p-6 bg-cream-light border border-primary/10 rounded-lg">
                    <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                        <Building2 size={24} className="text-secondary" />
                        Net Banking
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-primary/10">
                        <p className="text-body-sm text-text-secondary mb-4">
                            You will be redirected to your bank's secure payment page to complete the transaction.
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                                <div
                                    key={bank}
                                    className="p-3 border border-primary/10 rounded-lg text-center hover:border-secondary transition-colors cursor-pointer"
                                >
                                    <p className="text-body-sm font-medium">{bank}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )} */}

            {/* Security Notice */}
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-body-sm font-medium text-primary mb-1">Secure Payment</p>
                        <p className="text-body-sm text-text-secondary">
                            Your payment information is encrypted and secure. We never store your card details.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

