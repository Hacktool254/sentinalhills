'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TerminalAnimation } from './TerminalAnimation';
import { SITE_CONFIG } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <section
      className="relative min-h-[calc(100vh-72px)] flex items-center py-20 px-6 overflow-hidden"
      aria-label="Hero"
    >
      {/* CSS radial gradient background — no image */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Column */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Label */}
            <div className="inline-flex items-center gap-2 bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-sm font-medium px-4 py-2 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse" />
              AI Automation Agency · Nairobi, Kenya
            </div>

            {/* Headline */}
            <h1
              className="font-syne font-bold text-[#F0F0FF] leading-[1.1]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            >
              We automate the work that&apos;s{' '}
              <span className="text-[#6C63FF]">costing your business</span> money
            </h1>

            {/* Subheadline */}
            <p className="text-[#9999BB] text-lg leading-relaxed max-w-xl">
              Lead generation systems, intelligent websites, apps and SaaS — built with AI and delivered fast.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#6C63FF] hover:bg-[#5A52D5] text-white font-semibold px-8 py-4 rounded-[8px] transition-all shadow-lg hover:shadow-[#6C63FF]/40 hover:-translate-y-0.5"
              >
                Get a free audit <ArrowRight size={18} />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#2A2A3A] hover:border-[#6C63FF]/50 text-[#F0F0FF] font-semibold px-8 py-4 rounded-[8px] transition-all"
              >
                See our work
              </Link>
            </div>

            {/* Trust line */}
            <p className="text-sm text-[#5A5A7A]">
              Response within {SITE_CONFIG.responseTime} · WhatsApp friendly · Remote-ready
            </p>
          </motion.div>

          {/* Right Column — Terminal Animation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <TerminalAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
