'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wallet, Heart, Ticket, Gift, ArrowRight, Star,
  Shield, MapPin, TrendingUp, Clock, ChevronRight,
} from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPriceWithCurrency } from '@/lib/utils';

const STORAGE_KEY = 'ylootrips-wishlist';

export default function ProfilePage() {
  const { balance, transactions } = useWallet();
  const { currency } = useCurrency();
  const fp = (n: number) => formatPriceWithCurrency(n, currency);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setWishlistCount(JSON.parse(stored).length);
    } catch {}
  }, []);

  const totalEarned = transactions.filter((t) => t.type === 'cashback').reduce((s, t) => s + t.amount, 0);
  const totalUsed = transactions.filter((t) => t.type === 'used').reduce((s, t) => s + t.amount, 0);

  const quickLinks = [
    { icon: Ticket, label: 'My Bookings', sub: 'Track all your trips', href: '/my-booking', color: 'bg-blue-50 text-blue-600' },
    { icon: Heart, label: 'Saved Trips', sub: `${wishlistCount} trip${wishlistCount !== 1 ? 's' : ''} saved`, href: '/wishlist', color: 'bg-red-50 text-red-500' },
    { icon: Wallet, label: 'WanderLoot Wallet', sub: `Balance: ${fp(balance)}`, href: '/cashback', color: 'bg-green-50 text-green-600' },
    { icon: Gift, label: 'Share & Earn', sub: 'Refer friends, earn rewards', href: '/share-and-earn', color: 'bg-purple-50 text-purple-600' },
    { icon: MapPin, label: 'Destinations', sub: 'Browse all places', href: '/destinations', color: 'bg-orange-50 text-orange-500' },
    { icon: Shield, label: 'Travel Insurance', sub: 'Protect your trips', href: '/travel-insurance', color: 'bg-teal-50 text-teal-600' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="section-container max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">My Account</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Your Travel Hub</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your bookings, wallet, and saved trips</p>
        </div>

        {/* Wallet Card */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl p-7 text-white mb-6 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={16} className="text-white/60" />
              <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.15em]">WanderLoot Balance</p>
            </div>
            <p className="text-4xl font-black tracking-tight mb-4">{fp(balance)}</p>
            <div className="flex gap-6">
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-wider">Total Earned</p>
                <p className="text-white font-bold">{fp(totalEarned || 500)}</p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-wider">Used</p>
                <p className="text-white font-bold">{fp(totalUsed)}</p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-wider">Transactions</p>
                <p className="text-white font-bold">{transactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${link.color}`}>
                <link.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
                <p className="text-xs text-gray-500 truncate">{link.sub}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors shrink-0" />
            </Link>
          ))}
        </div>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-sm">Recent Transactions</h2>
              <Link href="/cashback" className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'cashback' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {tx.type === 'cashback' ? <TrendingUp size={13} /> : <Wallet size={13} />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-xs">{tx.description || (tx.type === 'cashback' ? 'Cashback earned' : 'Wallet used')}</p>
                      {tx.date && <p className="text-[10px] text-gray-400">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${tx.type === 'cashback' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'cashback' ? '+' : '-'}{fp(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust strip */}
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400" /> 4.9★ Google reviews</span>
          <span className="flex items-center gap-1"><Shield size={11} /> MSME certified</span>
          <span className="flex items-center gap-1"><Clock size={11} /> 25,000+ trips</span>
        </div>
      </div>
    </main>
  );
}
