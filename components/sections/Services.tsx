'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SERVICES } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ borderColor: '#6C63FF', boxShadow: '0 0 0 1px #6C63FF, 0 0 20px rgba(108,99,255,0.15)' }}
      className="bg-[#111118] border border-[#2A2A3A] rounded-[16px] p-7 flex flex-col gap-5 transition-all group"
    >
      <div className="w-12 h-12 rounded-[10px] bg-[#6C63FF]/10 flex items-center justify-center text-[#6C63FF]">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-syne font-semibold text-[#F0F0FF] mb-2">{service.title}</h3>
        <p className="text-[#9999BB] text-sm leading-relaxed">{service.description}</p>
      </div>
      <Link
        href={service.link}
        className="inline-flex items-center gap-1 text-sm text-[#6C63FF] font-medium group-hover:gap-2 transition-all"
      >
        Learn more <ArrowRight size={15} />
      </Link>
    </motion.div>
  );
}

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[#6C63FF] text-sm font-medium tracking-widest uppercase mb-3">What We Do</p>
          <h2 className="text-4xl md:text-5xl font-syne font-bold text-[#F0F0FF]">What we build for you</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
