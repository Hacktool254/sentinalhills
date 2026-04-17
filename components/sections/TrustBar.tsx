import { TRUST_STATS } from '@/lib/constants';

export function TrustBar() {
  return (
    <section className="border-t border-b border-[#2A2A3A] py-6 overflow-x-auto">
      <div className="container mx-auto px-6">
        <ul className="flex items-center justify-between gap-8 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center md:justify-between">
          {TRUST_STATS.map((stat) => (
            <li key={stat.label} className="flex flex-col items-center gap-1 text-center shrink-0">
              <span className="text-2xl font-syne font-bold text-[#6C63FF]">{stat.value}</span>
              <span className="text-sm text-[#9999BB] whitespace-nowrap">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
