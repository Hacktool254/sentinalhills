export function CaseStudy() {
  return (
    <section className="py-24 px-6 bg-[#111118]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-[#6C63FF] text-sm font-medium tracking-widest uppercase mb-4">Case Study</p>
            <h2 className="text-3xl md:text-4xl font-syne font-bold text-[#F0F0FF] mb-6">
              How we cut lead loss to zero for a Nairobi property agency
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#9999BB] uppercase tracking-wider mb-1">The Problem</p>
                <p className="text-[#F0F0FF]">
                  60% of property inquiries came in after hours through WhatsApp and were never followed up. 
                  Every missed lead was a lost commission.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9999BB] uppercase tracking-wider mb-1">The Solution</p>
                <p className="text-[#F0F0FF]">
                  We built an automated lead capture and qualification system that instantly responds to every inquiry, 
                  scores leads by readiness, and routes hot prospects directly to agents.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9999BB] uppercase tracking-wider mb-1">The Result</p>
                <p className="text-[#F0F0FF]">
                  100% of leads captured. 3× conversion rate. Agents now only talk to qualified prospects.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Metric card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-[16px] p-10 text-center max-w-sm w-full relative overflow-hidden">
              {/* Glow */}
              <div className="absolute inset-0 bg-radial from-[#6C63FF]/10 to-transparent" />
              <div className="relative z-10">
                <p className="text-8xl font-syne font-bold text-[#6C63FF] mb-3">0%</p>
                <p className="text-xl font-syne font-semibold text-[#F0F0FF] mb-2">Lead Loss Rate</p>
                <p className="text-[#9999BB] text-sm">After deploying the SentinalHills lead automation system</p>
                <div className="mt-8 pt-6 border-t border-[#2A2A3A] flex justify-around text-center">
                  <div>
                    <p className="text-2xl font-syne font-bold text-[#F0F0FF]">3×</p>
                    <p className="text-xs text-[#9999BB]">Conversion Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-syne font-bold text-[#F0F0FF]">24/7</p>
                    <p className="text-xs text-[#9999BB]">Response Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
