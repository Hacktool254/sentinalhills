import { generatePageMetadata } from '@/lib/metadata';
import { LeadForm } from '@/components/forms/LeadForm';

export const metadata = generatePageMetadata({
  title: 'Start a project',
  description: 'Book a free automation audit with SentinalHills. Stop losing leads and start closing more deals today.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 bg-[#0A0A0F] relative overflow-hidden">
      {/* Background radial glow */}
      <div 
        aria-hidden
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(108,99,255,0.08)_0%,transparent_70%)] pointer-events-none"
      />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <p className="text-[#6C63FF] text-sm font-medium tracking-widest uppercase mb-3">Free Audit</p>
          <h1 className="text-4xl md:text-5xl font-syne font-bold text-[#F0F0FF] mb-4">
            Let&apos;s talk about your systems
          </h1>
          <p className="text-[#9999BB] text-lg max-w-2xl mx-auto">
            Fill out the form below. We&apos;ll review your current setup and jump on a quick call to show you exactly where AI can save you time and money.
          </p>
        </div>

        <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl shadow-xl p-6 md:p-10">
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
