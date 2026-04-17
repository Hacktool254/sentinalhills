'use client';

import { useLeadForm } from '@/hooks/useLeadForm';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Send } from 'lucide-react';

const SERVICE_OPTIONS = [
  { id: 'lead-generation', label: 'Lead Generation System', desc: 'Stop losing prospects and start closing more deals.' },
  { id: 'website', label: 'Intelligent Website', desc: 'A premium, high-converting digital presence.' },
  { id: 'app', label: 'Mobile / Web App', desc: 'Custom software to power your business.' },
  { id: 'saas', label: 'SaaS Product', desc: 'Build and launch your software startup.' },
  { id: 'unsure', label: 'I\'m not sure yet', desc: 'Let\'s discuss your challenges.' },
];

const INDUSTRIES = [
  'Technology', 'Real Estate', 'Healthcare', 'E-commerce', 'Finance', 'Education', 'Agency/Consulting', 'Other',
];

const BUDGETS = [
  'Under KES 50,000', 'KES 50,000 - 150,000', 'KES 150,000 - 500,000', 'Over KES 500,000', "I don't know yet",
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export function LeadForm() {
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isSuccess,
    updateFormData,
    nextStep,
    prevStep,
    submitForm,
  } = useLeadForm();

  // Used to track slide direction
  const direction = 1; // Simplified for this implementation

  if (isSuccess) {
    const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}?text=Hi%20SentinalHills,%20I%20just%20submitted%20a%20project%20inquiry%20from%20your%20website.`;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto bg-white dark:bg-[#111118] p-8 md:p-12 rounded-[16px] border border-[#E5E5F0] dark:border-[#2A2A3A] text-center shadow-xl"
      >
        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-syne font-bold text-[#1A1A2E] dark:text-[#F0F0FF] mb-4">
          Request Received!
        </h2>
        <p className="text-[#6B7280] dark:text-[#9999BB] text-lg mb-8">
          Thank you, {formData.fullName}. We&apos;ve received your project details and will be in touch within 4 hours.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-4 rounded-[8px] font-medium transition-colors"
        >
          Message us on WhatsApp now
        </a>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-[#111118] border border-[#E5E5F0] dark:border-[#2A2A3A] rounded-[16px] shadow-xl overflow-hidden font-inter">
      {/* Progress Bar */}
      <div className="bg-[#F8F8FC] dark:bg-[#0A0A0F] px-8 py-6 border-b border-[#E5E5F0] dark:border-[#2A2A3A]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#6B7280] dark:text-[#9999BB]">
            Step {currentStep} of 4
          </span>
          <span className="text-sm font-medium text-[#6C63FF]">
            {Math.round((currentStep / 4) * 100)}%
          </span>
        </div>
        <div className="w-full bg-[#E5E5F0] dark:bg-[#2A2A3A] h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#6C63FF] rounded-full"
            initial={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 relative min-h-[400px] overflow-hidden">
        {errors.root && (
          <div role="alert" className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-[8px] flex gap-3 text-sm">
            <AlertCircle className="shrink-0" size={18} />
            <p>{errors.root}</p>
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="w-full space-y-6"
          >
            {/* STEP 1: Service Type */}
            {currentStep === 1 && (
              <fieldset>
                <legend className="text-2xl font-syne font-bold text-[#1A1A2E] dark:text-[#F0F0FF] mb-6">
                  What are you looking to build?
                </legend>
                <div className="space-y-3">
                  {SERVICE_OPTIONS.map((option) => {
                    const isSelected = formData.serviceType === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`block cursor-pointer p-5 rounded-[12px] border-2 transition-all ${
                          isSelected
                            ? 'border-[#6C63FF] bg-[#6C63FF]/5 shadow-sm'
                            : 'border-[#E5E5F0] dark:border-[#2A2A3A] hover:border-[#6C63FF]/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'border-[#6C63FF]' : 'border-[#9999BB]'
                            }`}
                          >
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#6C63FF]" />}
                          </div>
                          <div>
                            <input
                              type="radio"
                              name="serviceType"
                              value={option.id}
                              checked={isSelected}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onChange={(e) => updateFormData({ serviceType: e.target.value as any })}
                              className="sr-only"
                            />
                            <div className="font-semibold text-[#1A1A2E] dark:text-[#F0F0FF]">{option.label}</div>
                            <div className="text-[#6B7280] dark:text-[#9999BB] text-sm mt-0.5">{option.desc}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.serviceType && (
                  <p role="alert" className="text-red-500 text-sm mt-3 flex items-center gap-1.5 border border-red-500 bg-red-100 px-3 py-1.5 rounded-[5px]">
                    <AlertCircle size={14} /> {errors.serviceType}
                  </p>
                )}
              </fieldset>
            )}

            {/* STEP 2: Business details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-syne font-bold text-[#1A1A2E] dark:text-[#F0F0FF]">
                  Tell us about your business
                </h2>

                <div className="space-y-2">
                  <label htmlFor="businessName" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={formData.businessName || ''}
                    onChange={(e) => updateFormData({ businessName: e.target.value })}
                    maxLength={200}
                    aria-describedby="businessName-error"
                    className={`w-full bg-[#F8F8FC] dark:bg-[#0A0A0F] border ${
                      errors.businessName ? 'border-red-500' : 'border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF]'
                    } rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20`}
                    placeholder="Acme Corp"
                  />
                  {errors.businessName && (
                    <p id="businessName-error" role="alert" className="text-red-500 text-sm">{errors.businessName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="industry" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">
                    Industry
                  </label>
                  <select
                    id="industry"
                    value={formData.industry || ''}
                    onChange={(e) => updateFormData({ industry: e.target.value })}
                    aria-describedby="industry-error"
                    className={`w-full bg-[#F8F8FC] dark:bg-[#0A0A0F] border ${
                      errors.industry ? 'border-red-500' : 'border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF]'
                    } rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20`}
                  >
                    <option value="" disabled>Select your industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p id="industry-error" role="alert" className="text-red-500 text-sm">{errors.industry}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="website" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">
                    Website URL (Optional)
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => updateFormData({ website: e.target.value })}
                    aria-describedby="website-error"
                    className={`w-full bg-[#F8F8FC] dark:bg-[#0A0A0F] border ${
                      errors.website ? 'border-red-500' : 'border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF]'
                    } rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20`}
                    placeholder="https://example.com"
                  />
                  {errors.website && (
                    <p id="website-error" role="alert" className="text-red-500 text-sm">{errors.website}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Project description */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-syne font-bold text-[#1A1A2E] dark:text-[#F0F0FF]">
                  Project details
                </h2>

                <div className="space-y-2 relative">
                  <label htmlFor="description" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">
                    What are your main goals and challenges?
                  </label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    maxLength={2000}
                    rows={5}
                    aria-describedby="description-error"
                    className={`w-full resize-none bg-[#F8F8FC] dark:bg-[#0A0A0F] border ${
                      errors.description ? 'border-red-500' : 'border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF]'
                    } rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20`}
                    placeholder="I need..."
                  />
                  <div className="text-right text-xs text-[#6B7280] dark:text-[#9999BB]">
                    {formData.description?.length || 0} / 2000
                  </div>
                  {errors.description && (
                    <p id="description-error" role="alert" className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="budgetRange" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">
                    Estimated Budget
                  </label>
                  <select
                    id="budgetRange"
                    value={formData.budgetRange || ''}
                    onChange={(e) => updateFormData({ budgetRange: e.target.value })}
                    aria-describedby="budget-error"
                    className={`w-full bg-[#F8F8FC] dark:bg-[#0A0A0F] border ${
                      errors.budgetRange ? 'border-red-500' : 'border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF]'
                    } rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20`}
                  >
                    <option value="" disabled>Select your budget range</option>
                    {BUDGETS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  {errors.budgetRange && (
                    <p id="budget-error" role="alert" className="text-red-500 text-sm mt-1">{errors.budgetRange}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Contact details */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-syne font-bold text-[#1A1A2E] dark:text-[#F0F0FF]">
                  How should we reach you?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">Full Name</label>
                    <input
                      id="fullName"
                      value={formData.fullName || ''}
                      onChange={(e) => updateFormData({ fullName: e.target.value })}
                      maxLength={100}
                      className={`w-full bg-[#F8F8FC] dark:bg-[#0A0A0F] border ${errors.fullName ? 'border-red-500' : 'border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF]'} rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none`}
                    />
                    {errors.fullName && <p role="alert" className="text-red-500 text-xs">{errors.fullName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => updateFormData({ email: e.target.value })}
                      className={`w-full bg-[#F8F8FC] dark:bg-[#0A0A0F] border ${errors.email ? 'border-red-500' : 'border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF]'} rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none`}
                    />
                    {errors.email && <p role="alert" className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">WhatsApp Number</label>
                    <input
                      id="whatsappNumber"
                      type="tel"
                      value={formData.whatsappNumber || ''}
                      onChange={(e) => updateFormData({ whatsappNumber: e.target.value })}
                      placeholder="+254700000000"
                      className={`w-full bg-[#F8F8FC] dark:bg-[#0A0A0F] border ${errors.whatsappNumber ? 'border-red-500' : 'border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF]'} rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none`}
                    />
                    {errors.whatsappNumber && <p role="alert" className="text-red-500 text-xs">{errors.whatsappNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferredContact" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">Preferred Contact Method</label>
                    <select
                      id="preferredContact"
                      value={formData.preferredContact || ''}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(e) => updateFormData({ preferredContact: e.target.value as any })}
                      className={`w-full bg-[#F8F8FC] dark:bg-[#0A0A0F] border ${errors.preferredContact ? 'border-red-500' : 'border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF]'} rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none`}
                    >
                      <option value="" disabled>Select...</option>
                      <option value="whatsapp">WhatsApp (Fastest)</option>
                      <option value="email">Email</option>
                      <option value="call">Phone Call</option>
                    </select>
                    {errors.preferredContact && <p role="alert" className="text-red-500 text-xs">{errors.preferredContact}</p>}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label htmlFor="referralSource" className="block text-sm font-medium text-[#374151] dark:text-[#D0D0E0]">How did you hear about us? (Optional)</label>
                  <input
                    id="referralSource"
                    value={formData.referralSource || ''}
                    onChange={(e) => updateFormData({ referralSource: e.target.value })}
                    className="w-full bg-[#F8F8FC] dark:bg-[#0A0A0F] border border-[#E5E5F0] dark:border-[#2A2A3A] focus:border-[#6C63FF] rounded-[8px] px-4 py-3 text-[#1A1A2E] dark:text-[#F0F0FF] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Form Controls / Footer */}
      <div className="bg-[#F8F8FC] dark:bg-[#0A0A0F] px-8 py-5 border-t border-[#E5E5F0] dark:border-[#2A2A3A] flex justify-between items-center sm:flex-row flex-col gap-4 sm:gap-0">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-[8px] font-medium transition-colors ${
            currentStep === 1
              ? 'text-transparent cursor-default'
              : 'text-[#6B7280] dark:text-[#9999BB] hover:bg-[#E5E5F0] dark:hover:bg-[#2A2A3A]'
          }`}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#1A1A2E] dark:bg-white text-white dark:text-[#1A1A2E] px-8 py-3 rounded-[8px] font-medium hover:bg-[#6C63FF] dark:hover:bg-[#6C63FF] dark:hover:text-white transition-all shadow-md hover:shadow-lg"
          >
            Continue <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submitForm}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#6C63FF] text-white px-8 py-3 rounded-[8px] font-medium hover:bg-[#5A52D5] transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <>Submit Project <Send size={18} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
