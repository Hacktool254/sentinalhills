import { Zap, Globe, Smartphone, Layers } from 'lucide-react';

export const SITE_CONFIG = {
  name: 'SentinalHills',
  tagline: 'We automate the work that\'s costing your business money',
  description: 'Lead generation systems, intelligent websites, apps and SaaS — built with AI and delivered fast.',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '14193229820',
  whatsappMessage: 'Hi SentinalHills, I found your website and I\'m interested in your services.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://sentinalhills.com',
  email: 'hello@sentinalhills.com',
  location: 'Nairobi, Kenya',
  responseTime: '4 hours',
  social: {
    linkedin: 'https://linkedin.com/company/sentinalhills',
    twitter: 'https://twitter.com/sentinalhills',
    github: 'https://github.com/Hacktool254',
  },
};

export type ServiceItem = {
  id: string;
  icon: typeof Zap;
  title: string;
  description: string;
  link: string;
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'lead-generation',
    icon: Zap,
    title: 'Lead Generation Systems',
    description: 'Automated pipelines that capture, qualify, and nurture prospects around the clock so you never miss a sale.',
    link: '/services/lead-generation',
  },
  {
    id: 'website',
    icon: Globe,
    title: 'Intelligent Websites',
    description: 'High-converting, AI-powered digital presences built to rank, engage, and convert visitors into paying customers.',
    link: '/services/website',
  },
  {
    id: 'app',
    icon: Smartphone,
    title: 'Mobile & Web Apps',
    description: 'Custom software engineered to solve your unique operational challenges and scale with your business.',
    link: '/services/apps',
  },
  {
    id: 'saas',
    icon: Layers,
    title: 'SaaS Products',
    description: 'Full-stack SaaS development — from MVP to production-ready platform, built with AI efficiency.',
    link: '/services/saas',
  },
];

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  company: string;
  role: string;
};

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    quote: 'SentinalHills built us a lead capture system that completely transformed how we handle inquiries. We went from losing 60% of our leads to closing 3× more deals in the first month.',
    name: 'Amina Kariuki',
    company: 'PropertiesKE',
    role: 'Head of Sales',
  },
  {
    id: '2',
    quote: 'I was skeptical about AI automation, but the team delivered a website and WhatsApp bot combo that now handles 80% of our customer queries automatically. The ROI was immediate.',
    name: 'Brian Odhiambo',
    company: 'SwiftLogistics',
    role: 'Founder & CEO',
  },
  {
    id: '3',
    quote: 'Professional, fast, and incredibly knowledgeable about the Kenyan market. They integrated M-Pesa payments and built our entire admin dashboard in under 2 weeks.',
    name: 'Wanjiru Muthoni',
    company: 'TechHive Africa',
    role: 'CTO',
  },
];

export const TRUST_STATS = [
  { label: '10+ Automations Built', value: '10+' },
  { label: 'KES 2M+ Saved for Clients', value: 'KES 2M+' },
  { label: '24hr Turnaround', value: '24hr' },
  { label: 'M-Pesa Integrated', value: '🇰🇪' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Free Audit Call',
    description: 'We dig into your current workflow, identify the biggest revenue leaks, and map out exactly how automation can fix them.',
  },
  {
    step: 2,
    title: 'We Build It',
    description: 'Our team designs, builds, and tests your solution end-to-end — no shortcuts, no vague timelines.',
  },
  {
    step: 3,
    title: 'You Grow',
    description: 'Systems go live, leads stop leaking, your team focuses on what matters, and the revenue follows.',
  },
];
