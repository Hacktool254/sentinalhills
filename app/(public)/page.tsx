import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { Services } from '@/components/sections/Services';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | AI Automation Agency Nairobi, Kenya`,
  description:
    'SentinalHills builds lead generation systems, intelligent websites, apps and SaaS products powered by AI — built for Kenyan and African businesses.',
  openGraph: {
    title: `${SITE_CONFIG.name} | AI Automation Agency Nairobi`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.name,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} | AI Automation Agency`,
    description: SITE_CONFIG.description,
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_CONFIG.siteUrl },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <Services />
      <HowItWorks />
      <CaseStudy />
      <Testimonials />
      <CTASection />
    </main>
  );
}
