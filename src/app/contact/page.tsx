'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import PageHero from '@/components/PageHero';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelers: '',
    dates: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <PageHero
        title="Plan Your Journey"
        subtitle="Let our travel experts design a bespoke experience tailored to your dreams. Every great adventure starts with a conversation."
        breadcrumb="Contact"
      />

      <section className="py-16 md:py-24 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-display text-display-lg text-primary mb-8">
                Tell us about your dream trip
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">
                      Dream Destination
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Bali, Japan, Iceland"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">
                      Number of Travelers
                    </label>
                    <select
                      value={formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary focus:outline-none focus:border-secondary transition-colors cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="1">Solo traveler</option>
                      <option value="2">Couple</option>
                      <option value="3-4">Small group (3-4)</option>
                      <option value="5+">Larger group (5+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">
                      Preferred Dates
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., March 2025, flexible"
                      value={formData.dates}
                      onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">
                    Tell us about your ideal trip
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="What kind of experiences are you looking for? Any specific interests, requirements, or dreams?"
                    className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary transition-colors resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full md:w-auto">
                  <span>Send Inquiry</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:pl-12">
              <div className="bg-primary text-cream p-10 md:p-12 mb-8">
                <h3 className="font-display text-2xl mb-8">
                  Prefer to speak directly?
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-caption uppercase tracking-widest text-cream/50 mb-1">Email</p>
                      <a href="mailto:hello@wanderlust.com" className="text-lg hover:text-accent transition-colors">
                        hello@wanderlust.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-caption uppercase tracking-widest text-cream/50 mb-1">Phone</p>
                      <a href="tel:+1234567890" className="text-lg hover:text-accent transition-colors">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-caption uppercase tracking-widest text-cream/50 mb-1">Hours</p>
                      <p className="text-lg">Mon - Fri: 9am - 6pm EST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-caption uppercase tracking-widest text-cream/50 mb-1">Office</p>
                      <p className="text-lg">123 Travel Street<br />New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-cream-dark p-10 md:p-12">
                <h3 className="font-display text-2xl text-primary mb-4">
                  What happens next?
                </h3>
                <ul className="space-y-4 text-primary/70">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary text-cream text-sm flex items-center justify-center shrink-0">1</span>
                    <span>We&apos;ll review your inquiry within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary text-cream text-sm flex items-center justify-center shrink-0">2</span>
                    <span>A travel expert will schedule a call to discuss your vision</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary text-cream text-sm flex items-center justify-center shrink-0">3</span>
                    <span>We&apos;ll craft a personalized itinerary just for you</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}