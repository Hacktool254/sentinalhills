'use client';

import { TESTIMONIALS } from '@/lib/constants';
import { Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#6C63FF] text-sm font-medium tracking-widest uppercase mb-3">Client Stories</p>
          <h2 className="text-4xl md:text-5xl font-syne font-bold text-[#F0F0FF]">Trusted by Kenyan businesses</h2>
        </div>

        {/* Desktop: 3-column grid / Mobile: CSS scroll-snap */}
        <ul
          className="
            flex gap-6
            overflow-x-auto snap-x snap-mandatory pb-4
            scrollbar-none
            md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:pb-0
          "
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {TESTIMONIALS.map((t) => (
            <li
              key={t.id}
              className="
                snap-center shrink-0 w-[85vw]
                md:w-auto md:shrink-unset
                bg-[#111118] border border-[#2A2A3A] rounded-[16px] p-7 flex flex-col gap-5
              "
            >
              <Quote size={28} className="text-[#6C63FF] opacity-60" />
              <p className="text-[#D0D0E0] leading-relaxed flex-1 text-sm">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#2A2A3A]">
                <div className="w-10 h-10 rounded-full bg-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF] font-syne font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#F0F0FF] font-semibold text-sm">{t.name}</p>
                  <p className="text-[#9999BB] text-xs">{t.role}, {t.company}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
