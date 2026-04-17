import { generatePageMetadata } from '@/lib/metadata';
import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { Services } from '@/components/sections/Services';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTASection } from '@/components/sections/CTASection';

export const metadata = generatePageMetadata({
  title: 'Home',
  description: 'SentinalHills builds lead generation systems, intelligent websites, apps and SaaS products powered by AI — built for Kenyan and African businesses.',
  path: '/',
});

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
