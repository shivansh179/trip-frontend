'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Shield, CreditCard, XCircle, Plane, Heart, Lock, Calendar, Users, AlertCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';

export default function PrivacyPolicyPage() {
    const sections = [
        {
            id: 'introduction',
            icon: FileText,
            title: 'Introduction',
            content: `Welcome to YlooTrips (operated by Ambe Enterprises)! By booking or using our services, you agree to abide by these Terms & Conditions. These terms constitute a legally binding agreement between you and YlooTrips regarding your use of our travel services.`
        },
        {
            id: 'booking',
            icon: CreditCard,
            title: 'Booking & Payments',
            list: [
                'A deposit is required to confirm your booking and secure your spot',
                'Balance must be paid as per booking confirmation deadlines',
                'Payments can be made via card, UPI, bank transfer, and other accepted methods',
                'All prices are in Indian Rupees (INR) unless otherwise specified'
            ]
        },
        {
            id: 'cancellation',
            icon: XCircle,
            title: 'Cancellation & Refund Policy',
            subsections: [
                {
                    subtitle: 'Cancellation by Traveler',
                    content: 'Cancellation charges apply based on notice period. Please refer to your booking confirmation for specific cancellation terms.'
                },
                {
                    subtitle: 'Cancellation by Company',
                    content: 'We may cancel due to unforeseen circumstances (natural disasters, government restrictions, etc.). You may choose an alternate trip/date or receive a full refund.'
                }
            ]
        },
        {
            id: 'documents',
            icon: Plane,
            title: 'Travel Documents',
            content: 'Travelers are responsible for carrying valid ID, visas, and permits. We are not responsible for denied entry due to incomplete or incorrect documents.'
        },
        {
            id: 'health',
            icon: Heart,
            title: 'Health & Safety',
            content: 'Travelers must ensure they are medically fit for the trip and disclose pre-existing medical conditions in advance.'
        },
        {
            id: 'insurance',
            icon: Shield,
            title: 'Insurance',
            content: 'We strongly recommend purchasing comprehensive travel insurance for emergencies, cancellations, medical coverage, or baggage loss.'
        },
        {
            id: 'itinerary',
            icon: Calendar,
            title: 'Itinerary Changes',
            content: 'We may modify itineraries due to weather conditions or safety issues. Alternatives of equal value will be provided whenever possible.'
        },
        {
            id: 'behavior',
            icon: Users,
            title: 'Behavior & Liability',
            content: 'Travelers must behave respectfully towards fellow travelers, guides, and locals. We are not liable for delays, injuries, or losses caused by circumstances beyond our control.'
        },
        {
            id: 'liability',
            icon: AlertCircle,
            title: 'Limitation of Liability',
            content: 'Our liability is limited to the total trip cost. We are not responsible for lost, stolen, or damaged personal belongings.'
        },
        {
            id: 'privacy',
            icon: Lock,
            title: 'Privacy Policy',
            content: 'We collect personal information solely for booking and communication purposes. Your data is never sold to third parties. We implement industry-standard security measures to protect your information.',
            list: [
                'Personal data is encrypted and stored securely',
                'We only share information with partners necessary for your trip',
                'You may request deletion of your data at any time by contacting us'
            ]
        }
    ];

    return (
        <>
            <PageHero
                breadcrumb="Legal"
                title="Terms & Conditions"
                subtitle="Please read these terms carefully before using our services"
                backgroundImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070"
            />

            <section className="py-20 md:py-32 bg-cream">
                <div className="container-luxury">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Link */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors mb-12"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Home</span>
                        </Link>

                        {/* Table of Contents */}
                        <div className="bg-cream-dark p-8 mb-12">
                            <h2 className="font-display text-xl text-primary mb-6">Table of Contents</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {sections.map((section) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="text-sm text-primary/70 hover:text-secondary transition-colors"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Sections */}
                        <div className="space-y-12">
                            {sections.map((section) => (
                                <div key={section.id} id={section.id} className="scroll-mt-32">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                            <section.icon className="w-6 h-6 text-secondary" />
                                        </div>
                                        <h2 className="font-display text-2xl text-primary">{section.title}</h2>
                                    </div>

                                    {section.content && (
                                        <p className="text-primary/70 leading-relaxed mb-4">{section.content}</p>
                                    )}

                                    {section.list && (
                                        <ul className="space-y-3 text-primary/70">
                                            {section.list.map((item, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {section.subsections && (
                                        <div className="space-y-6">
                                            {section.subsections.map((sub, index) => (
                                                <div key={index} className="pl-6 border-l-2 border-secondary/20">
                                                    <h3 className="font-medium text-primary mb-2">{sub.subtitle}</h3>
                                                    <p className="text-primary/70">{sub.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Company Info */}
                        <div className="mt-16 p-8 bg-primary text-cream">
                            <h3 className="font-display text-xl mb-6">Company Information</h3>
                            <div className="grid md:grid-cols-2 gap-8 text-sm">
                                <div>
                                    <p className="text-cream/50 uppercase tracking-wider text-xs mb-2">Office Address (Gurugram)</p>
                                    <p>Ambe Enterprises</p>
                                    <p>301, Plot 130-131, Avenue 69,</p>
                                    <p>Sector 69, Gurugram, Haryana 122101</p>
                                </div>
                                <div>
                                    <p className="text-cream/50 uppercase tracking-wider text-xs mb-2">GST Registered Address (Delhi)</p>
                                    <p>Ambe Enterprises</p>
                                    <p>First Floor, D-86/1, Laxmi Nagar, Gali No.4,</p>
                                    <p>Laxmi Nagar, East Delhi, Delhi 110092</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-cream/50 text-xs">Mobile: +91 8427831127 | Email: hello@ylootrips.com</p>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="mt-12 text-center">
                            <h3 className="font-display text-xl text-primary mb-4">Need Help?</h3>
                            <p className="text-primary/60 mb-6">Have questions about our terms? Our team is here to help.</p>
                            <Link
                                href="/contact"
                                className="btn-primary inline-flex"
                            >
                                <span>Contact Us</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
