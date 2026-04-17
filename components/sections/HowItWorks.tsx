import { HOW_IT_WORKS_STEPS } from '@/lib/constants';

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[#0D0D14]">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#6C63FF] text-sm font-medium tracking-widest uppercase mb-3">The Process</p>
          <h2 className="text-4xl md:text-5xl font-syne font-bold text-[#F0F0FF]">
            From conversation to live system
          </h2>
        </div>

        {/* Desktop: horizontal with dashed connector */}
        <div className="hidden md:grid md:grid-cols-3 gap-0 relative">
          {/* Dashed connector line */}
          <div className="absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] border-t-2 border-dashed border-[#2A2A3A]" />

          {HOW_IT_WORKS_STEPS.map((step) => (
            <div key={step.step} className="flex flex-col items-center text-center px-8 relative">
              <div className="w-20 h-20 rounded-full bg-[#6C63FF]/10 border-2 border-[#6C63FF]/30 flex items-center justify-center mb-6 relative z-10 bg-[#0D0D14]">
                <span className="text-3xl font-syne font-bold text-[#6C63FF]">{step.step}</span>
              </div>
              <h3 className="text-xl font-syne font-semibold text-[#F0F0FF] mb-3">{step.title}</h3>
              <p className="text-[#9999BB] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile: vertical stack */}
        <div className="flex flex-col gap-0 md:hidden">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.step} className="flex gap-5 relative">
              {/* Vertical line connector */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#6C63FF]/10 border-2 border-[#6C63FF]/30 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-syne font-bold text-[#6C63FF]">{step.step}</span>
                </div>
                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="flex-1 w-px border-l-2 border-dashed border-[#2A2A3A] my-2" />
                )}
              </div>
              <div className="pb-10 pt-2">
                <h3 className="text-lg font-syne font-semibold text-[#F0F0FF] mb-2">{step.title}</h3>
                <p className="text-[#9999BB] text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
