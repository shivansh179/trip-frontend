'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Destinations', href: '/destinations' },
    { name: 'Stays', href: '/hotels' },
    { name: 'About', href: '/about' },
    { name: 'Journal', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-[#F4F1EA]/90 backdrop-blur-md border-b border-black/5' : 'py-8 bg-transparent'}`}>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="z-50 relative">
          <span className="font-serif text-3xl font-bold tracking-tighter">LocalHi.</span>
        </Link>

        <div className="hidden md:flex gap-10 items-center">
          {links.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm uppercase tracking-widest font-medium hover-underline">
              {link.name}
            </Link>
          ))}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-50 relative p-2">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`fixed inset-0 bg-[#F4F1EA] z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="font-serif text-5xl text-primary hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}