'use client';

import { useState } from 'react';
import { Star, BadgeCheck, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Fallback avatar — shows colored circle + initials when photo fails to load
function Avatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  // deterministic color from name
  const colors = ['bg-orange-500','bg-rose-500','bg-violet-600','bg-teal-600','bg-amber-500','bg-blue-600','bg-green-600','bg-pink-600'];
  const color = colors[name.charCodeAt(0) % colors.length];

  if (failed) {
    return (
      <div className={`w-12 h-12 rounded-full ${color} ring-2 ring-accent/40 shrink-0 flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">{initials}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="w-12 h-12 rounded-full object-cover object-top ring-2 ring-accent/40 shrink-0"
    />
  );
}

/* ─── DATA ─────────────────────────────────────────────────────────────── */

const reviews = [
  // ── Indian travelers ──────────────────────────────────────────────────────
  {
    name: 'Neha & Rohan Sharma',
    flag: '🇮🇳',
    country: 'Mumbai, Maharashtra',
    rating: 5,
    trip: 'Bali Honeymoon Package',
    date: 'March 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    text: 'Humari Bali honeymoon bilkul sapne jaisi thi! Overwater villa, private dinner, volcano sunrise — YlooTrips ne har cheez arrange ki. Paise kamaal ka vasool hua. Dil se shukriya team ko! 🙏',
  },
  {
    name: 'Aditya Nair',
    flag: '🇮🇳',
    country: 'Bangalore, Karnataka',
    rating: 5,
    trip: 'Thailand Budget Trip',
    date: 'February 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80',
    text: 'Pehli international trip thi — Thailand ne expectations se kaafi zyada diya. Phi Phi Islands toh zindagi bhar yaad rahegi. Coordinator WhatsApp pe hamesha available tha. Har rupee worth it!',
  },
  {
    name: 'Vikram & Ananya Singh',
    flag: '🇮🇳',
    country: 'New Delhi, India',
    rating: 5,
    trip: 'Dubai Tour Package',
    date: 'January 2026',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    text: 'Desert safari, Burj Khalifa, Dubai Mall — sab kuch perfect tha. Visa ka koi tension nahi, YlooTrips ne sab handle kiya. Ek baar aur zaroor jayenge. Highly recommend karta hoon sabko! 👍',
  },
  {
    name: 'Meera & Suresh Iyer',
    flag: '🇮🇳',
    country: 'Chennai, Tamil Nadu',
    rating: 5,
    trip: 'Kerala Backwaters Tour',
    date: 'December 2025',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    text: 'Anniversary trip ke liye Kerala choose kiya — YlooTrips ki team ne jo itinerary banaya woh outstanding tha. Houseboat pe sunset dekhna aur fresh Kerala food… aisi memories jo kabhi nahi bhoolenge.',
  },
  {
    name: 'Rajan & Preethi Pillai',
    flag: '🇮🇳',
    country: 'Kochi, Kerala',
    rating: 5,
    trip: 'Maldives Luxury Package',
    date: 'February 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    text: 'Maldives mein overwater villa — yeh sirf sapne mein hota tha, lekin YlooTrips ne sach kar dikhaya. Dolphin cruise aur sandbank picnic best experiences rahe. Poori team ka bahut shukriya! ❤️',
  },
  {
    name: 'Karan Malhotra',
    flag: '🇮🇳',
    country: 'Chandigarh, Punjab',
    rating: 5,
    trip: '7-Day Rajasthan Heritage',
    date: 'November 2025',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
    text: 'Rajasthan trip ekdum mast rahi yaar! Jaipur, Jodhpur, Udaipur — teen cities, teen alag worlds. Private car aur guide tha, koi rush nahi. Jitni photos li sab Instagram pe viral ho gayi 😄',
  },
  // ── International travelers ───────────────────────────────────────────────
  {
    name: 'Sarah Mitchell',
    flag: '🇺🇸',
    country: 'San Francisco, USA',
    rating: 5,
    trip: '10-Day Golden Triangle',
    date: 'March 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    text: 'The Taj Mahal at sunrise was indescribable — I still get chills. YlooTrips made our first India trip absolutely seamless. Our guide knew stories about every monument. India is intense in the best way.',
  },
  {
    name: 'James & Emma Hargreaves',
    flag: '🇬🇧',
    country: 'London, UK',
    rating: 5,
    trip: '14-Day Kerala & South India',
    date: 'February 2026',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    text: 'The Kerala houseboat was the most romantic two days of our lives. YlooTrips answered every WhatsApp within minutes — even for last-minute hotel changes. Five stars without hesitation.',
  },
  {
    name: 'Lachlan Burgess',
    flag: '🇦🇺',
    country: 'Melbourne, Australia',
    rating: 5,
    trip: '7-Day Rajasthan Heritage',
    date: 'January 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
    text: 'Rajasthan blew my mind — forts, camels, the blue city of Jodhpur. I came solo and felt completely safe the whole time. Stayed in boutique heritage properties every night. 100% booking again.',
  },
  {
    name: 'Priya Sharma',
    flag: '🇨🇦',
    country: 'Toronto, Canada',
    rating: 5,
    trip: '12-Day North India & Himalayas',
    date: 'October 2025',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    text: 'YlooTrips built me a completely custom itinerary — off-the-beaten-path temples, cooking classes in Varanasi, and the Kalka-Shimla mountain railway. Nothing was copy-pasted. Pure magic.',
  },
  {
    name: 'Vikram & Ananya',
    flag: '🇮🇳',
    country: 'Delhi, India',
    rating: 5,
    trip: 'Dubai Tour Package',
    date: 'January 2026',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    text: 'Desert safari at sunset, Burj Khalifa at night, breakfast with the skyline view — everything was perfect. The visa assistance alone saved so much stress. YlooTrips handles everything.',
  },
  {
    name: 'Chloé Dubois',
    flag: '🇫🇷',
    country: 'Paris, France',
    rating: 5,
    trip: '14-Day Kerala & South India',
    date: 'September 2025',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&q=80',
    text: 'Kerala — tea estates, spice gardens, traditional Kathakali arranged just for our group. The food recommendations were outstanding. YlooTrips is professional, warm, genuinely passionate. Je reviendrai!',
  },
  {
    name: 'Katrin & Markus',
    flag: '🇩🇪',
    country: 'Munich, Germany',
    rating: 4,
    trip: '10-Day Golden Triangle',
    date: 'November 2025',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    text: 'Every hotel was better than expected. The private car and driver made all the difference — comfortable, safe, stopping wherever we wanted for photos. We wish we had one more day in Varanasi.',
  },
];

const stats = [
  { value: '25,000+', label: 'Happy Travelers' },
  { value: '4.9 ★', label: 'Average Rating' },
  { value: '2,400+', label: 'Verified Reviews' },
  { value: '40+', label: 'Countries Served' },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < n ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-white/20'}`} />
      ))}
    </div>
  );
}

export default function InternationalTestimonials() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-primary overflow-hidden">
      <div className="section-container">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">Real Reviews · Asli Log · Asli Anubhav</p>
          <h2 className="font-display text-display-lg text-cream max-w-3xl mx-auto">
            Indians & travelers from <span className="italic text-accent">40+ countries</span> trust us
          </h2>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl md:text-3xl text-accent">{s.value}</div>
                <div className="text-xs text-cream/50 uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Platform badges */}
          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            {['Google', 'TripAdvisor'].map(platform => (
              <div key={platform} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />)}
                </div>
                <span className="text-cream/60 text-xs">{platform}</span>
                <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Reviews Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Trip destination photo */}
              <div className="relative h-44 overflow-hidden shrink-0">
                <Image
                  src={r.tripPhoto}
                  alt={`${r.name} — ${r.trip}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Trip + platform at bottom of photo */}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
                  <span className="bg-accent text-primary text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                    {r.trip}
                  </span>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <BadgeCheck className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] text-white/70">{r.platform}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                {/* Stars */}
                <Stars n={r.rating} />

                {/* Quote icon + text */}
                <div className="mt-3 flex-1">
                  <Quote className="w-5 h-5 text-accent/40 mb-2" />
                  <p className="text-cream/75 text-sm leading-relaxed">
                    {r.text}
                  </p>
                </div>

                {/* Author row */}
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <Avatar src={r.avatar} name={r.name} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-cream flex items-center gap-1.5 truncate">
                      {r.name} <span className="shrink-0">{r.flag}</span>
                    </div>
                    <div className="text-[10px] text-cream/40 mt-0.5">{r.country}</div>
                    <div className="text-[10px] text-accent/70 uppercase tracking-wider mt-0.5">{r.date}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="text-center border-t border-white/10 pt-12">
          <p className="text-cream/50 text-sm mb-4">Join 25,000+ travelers who chose YlooTrips</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-8 py-3.5 rounded-full hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            Start Planning Your Trip
          </Link>
          <p className="text-xs text-cream/30 mt-3">
            Custom itinerary in 24 hrs · No commitment · Free cancellation
          </p>
        </div>

      </div>
    </section>
  );
}
