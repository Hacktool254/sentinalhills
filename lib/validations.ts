import { z } from 'zod';

export const step1Schema = z.object({
  serviceType: z.enum(['lead-generation', 'website', 'app', 'saas', 'unsure'])
});

export const step2Schema = z.object({
  businessName: z.string().min(2, 'Business name is required (min 2 characters)').max(200, 'Business name is too long').trim(),
  industry: z.string().min(1, 'Please select your industry'),
  website: z.string().url('Please enter a valid URL (starting with http/https)').optional().or(z.literal(''))
});

export const step3Schema = z.object({
  description: z.string().min(20, 'Please describe your project in at least 20 characters').max(2000, 'Description is too long').trim(),
  budgetRange: z.string().min(1, 'Please select a budget range')
});

export const step4Schema = z.object({
  fullName: z.string().min(2, 'Name is required').max(100, 'Name is too long').trim(),
  email: z.string().email('Please enter a valid email address').trim(),
  whatsappNumber: z.string().regex(/^\+?[\d\s\-]{10,15}$/, 'Please enter a valid WhatsApp number (e.g. +254712345678)'),
  preferredContact: z.enum(['whatsapp', 'email', 'call']),
  referralSource: z.string().optional()
});

export const fullLeadSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);
export type LeadFormData = z.infer<typeof fullLeadSchema>;
