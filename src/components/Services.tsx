'use client';

import { Sparkles, Users, Shield, Globe } from 'lucide-react';

interface Service {
    icon: any;
    title: string;
    description: string;
}

const services: Service[] = [
    {
        icon: Sparkles,
        title: 'Fully Personalised Journeys Crafted Just for You',
        description: 'Every LocalHi trip is created from scratch — no off-the-shelf packages. We begin by understanding your travel style, wishes and rhythm, then our destination & local experts curate a journey through India, Sri Lanka, Vietnam, Thailand or Bali that resonates with your taste in adventure, luxury and discovery.',
    },
    {
        icon: Users,
        title: 'Insider Access and Boutique Luxury with Local Soul',
        description: 'We select boutique retreats, heritage-homes and unique villas, and facilitate experiences you wont find on generic "luxury tours". Think private cultural encounters with local artisans, gourmet meals in lesser-known enclaves, or sunrise explorations before others arrive — all handled with LocalHis signature local knowledge.',
    },
    {
        icon: Shield,
        title: 'Seamless, White-Glove Service from Start to Finish',
        description: 'From first enquiry to your return home, our travel designers and local team manage every detail — smooth airport transfers, streamlined check-ins, reliable local hosts and 24/7 concierge support. Your only job: relish the journey.',
    },
    {
        icon: Globe,
        title: 'Authentic Luxury, Deeply Rooted in Place',
        description: 'Luxury doesnt mean "only big and branded". At LocalHi it means authentic – weaving the luxury of comfort, taste and service with meaningful immersion in each destinations character. Whether its the spice markets of Kerala, the tea hills of Sri Lanka or the beach-villas of Bali, youll feel the place, not just stay in it.',
    },
];

export default function Services() {
    return (
        <section className="section-padding bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
                        Other Services We Offer
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group p-8 bg-white border border-border transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="mb-6">
                                <div className="w-16 h-16 flex items-center justify-center border border-border group-hover:border-foreground transition-colors">
                                    <service.icon size={32} className="text-foreground" />
                                </div>
                            </div>
                            
                            <h3 className="text-2xl text-red-900 font-light text-foreground mb-4">
                                {service.title}
                            </h3>
                            
                            <p className="text-text-secondary font-light leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

