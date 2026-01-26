'use client';

import { useState } from 'react';
import { ArrowUpRight, Send, Loader2, CheckCircle, AlertCircle, Compass } from 'lucide-react';
import { api } from '@/lib/api';

export type ScopeFilter = 'All' | 'Domestic' | 'International';

interface EmptyStateCustomPlanProps {
  scopeFilter: ScopeFilter;
  activeRegion: string;
  onViewAll: () => void;
}

export default function EmptyStateCustomPlan({ scopeFilter, activeRegion, onViewAll }: EmptyStateCustomPlanProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', where: '', travelers: '', dates: '', details: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    const prefix = `[CUSTOM PLAN${scopeFilter !== 'All' ? ` - ${scopeFilter.toUpperCase()} destinations` : ''}${activeRegion !== 'All Regions' ? ` | Region: ${activeRegion}` : ''}]\n\n`;
    const message = prefix + (form.details || 'No additional details.');
    try {
      const res = await api.submitContactInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        destination: form.where || undefined,
        travelers: form.travelers || undefined,
        preferredDates: form.dates || undefined,
        message,
      });
      const data = res.data as { success?: boolean; message?: string; error?: string };
      if (data.success) {
        setStatus('success');
        setStatusMsg(data.message || "We've received your request. We'll design a custom plan and email you within 24 hours.");
        setForm({ name: '', email: '', phone: '', where: '', travelers: '', dates: '', details: '' });
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err: unknown) {
      setStatus('error');
      const ax = err as { response?: { data?: { error?: string } } };
      setStatusMsg(ax.response?.data?.error || 'Failed to submit. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <div className="max-w-xl mx-auto text-center pt-4 pb-8">
        <div className="inline-flex justify-center mb-8" style={{ animation: 'bounce-soft 2.5s ease-in-out infinite' }} role="img" aria-hidden>
          <span className="text-7xl md:text-8xl select-none">🧭</span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-primary mb-4">Ooh, you wanna go far!</h2>
        <p className="text-primary/70 text-lg mb-2">Tell us where—we&apos;ll plan it for you. No really.</p>
        <p className="text-primary/50 text-sm mb-8">Custom itinerary, zero stress. We&apos;ll slide into your inbox within 24 hours. ✨</p>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary mb-6">
          <span>Yeah, plan my trip</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
        <button type="button" onClick={onViewAll} className="block mx-auto text-caption text-secondary hover:underline">
          View all destinations
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto" style={{ animation: 'fade-up 0.5s ease-out forwards' }}>
      <button type="button" onClick={() => setShowForm(false)} className="flex items-center gap-2 text-caption text-primary/60 hover:text-primary mb-6">
        ← Back
      </button>
      <div className="bg-cream border border-primary/10 p-8 md:p-10 rounded-sm shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Compass className="w-6 h-6 text-secondary" style={{ animation: 'wave 2s ease-in-out infinite' }} />
          <h3 className="font-display text-2xl text-primary">Alright, let&apos;s plan your trip</h3>
        </div>
        <p className="text-primary/60 text-sm mb-6">
          Drop your details below—we&apos;ll craft a custom itinerary and get back to you within 24 hours. We&apos;re already excited. 🗺️
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary" placeholder="+91 ..." />
          </div>
          <div>
            <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Where do you want to go? *</label>
            <input required value={form.where} onChange={e => setForm(f => ({ ...f, where: e.target.value }))} className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary" placeholder="e.g. Ladakh, Spiti, Kerala or Dubai, Singapore" />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Travelers</label>
              <select value={form.travelers} onChange={e => setForm(f => ({ ...f, travelers: e.target.value }))} className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary">
                <option value="">Select</option>
                <option value="1">Solo</option>
                <option value="2">Couple</option>
                <option value="3-4">3–4</option>
                <option value="5+">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Preferred dates</label>
              <input value={form.dates} onChange={e => setForm(f => ({ ...f, dates: e.target.value }))} className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary" placeholder="e.g. March 2025, flexible" />
            </div>
          </div>
          <div>
            <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Tell us more</label>
            <textarea rows={3} value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary resize-none" placeholder="Interests, budget, duration, or any special requests" />
          </div>
          {status === 'success' && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{statusMsg}</p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{statusMsg}</p>
            </div>
          )}
          <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><span>Request custom plan</span><Send className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
