'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useScrolled } from '@/hooks/useScrolled';
import { SITE_CONFIG } from '@/lib/constants';

const LINKS = [
  { href: '/#services', label: 'Services' }, // Placeholder anchor if no direct page
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const scrolled = useScrolled(10);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const waLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
          scrolled ? 'bg-[#0A0A0F]/80 backdrop-blur-md border-b border-[#2A2A3A]' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50 relative">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#6C63FF] group-hover:bg-[#1D9E75] transition-colors" />
            <span className="font-syne font-bold text-xl tracking-tight text-[#F0F0FF]">SentinalHills</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#6C63FF] ${
                  pathname === link.href ? 'text-[#6C63FF]' : 'text-[#9999BB]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4 relative z-50">
            <Link
              href="/contact"
              className="hidden md:flex bg-white/5 hover:bg-white/10 text-white border border-[#2A2A3A] px-5 py-2.5 rounded-[8px] text-sm font-semibold transition-all"
            >
              Get a free audit
            </Link>

            <button
              className="md:hidden p-2 text-[#F0F0FF]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#0A0A0F] pt-[100px] px-6 flex flex-col md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <nav className="flex flex-col gap-6 flex-1">
              <Link
                href="/"
                className={`font-syne font-semibold text-2xl ${pathname === '/' ? 'text-[#6C63FF]' : 'text-[#F0F0FF]'}`}
              >
                Home
              </Link>
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-syne font-semibold text-2xl ${pathname === link.href ? 'text-[#6C63FF]' : 'text-[#F0F0FF]'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pb-12 pt-6 border-t border-[#2A2A3A] flex flex-col gap-4">
              <Link
                href="/contact"
                className="w-full bg-[#6C63FF] text-white text-center font-semibold py-4 rounded-[8px]"
              >
                Get a free audit
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white text-center font-semibold py-4 rounded-[8px] flex items-center justify-center gap-2"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
