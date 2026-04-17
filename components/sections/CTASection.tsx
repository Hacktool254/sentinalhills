import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export function CTASection() {
  const waLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;

  return (
    <section className="py-28 px-6 relative overflow-hidden bg-[#0A0A0F]">
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(108,99,255,0.08)_0%,transparent_70%)]"
      />

      <div className="container mx-auto relative z-10 text-center max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-syne font-bold text-[#F0F0FF] mb-5 leading-tight">
          Ready to stop losing leads?
        </h2>
        <p className="text-[#9999BB] text-lg mb-10">
          Book a free 30-minute audit. No commitment, no pitch deck.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-10 py-4 bg-[#6C63FF] hover:bg-[#5A52D5] text-white font-semibold rounded-[8px] transition-all shadow-lg hover:shadow-[#6C63FF]/30 hover:-translate-y-0.5 text-center"
          >
            Get a free audit
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-4 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold rounded-[8px] transition-all text-center flex items-center justify-center gap-2"
          >
            {/* Inline WhatsApp SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
