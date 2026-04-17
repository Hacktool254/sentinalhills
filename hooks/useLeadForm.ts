import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  LeadFormData,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  fullLeadSchema,
} from '@/lib/validations';

type InitialFormState = Partial<LeadFormData>;

export function useLeadForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InitialFormState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitLeadMutation = useMutation(api.leads.submitLead);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const updateFormData = (data: Partial<LeadFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear errors for fields being updated
    Object.keys(data).forEach((key) => clearError(key));
  };

  const validateStep = (step: number, dataToValidate: Partial<LeadFormData>): boolean => {
    let schema;
    switch (step) {
      case 1:
        schema = step1Schema;
        break;
      case 2:
        schema = step2Schema;
        break;
      case 3:
        schema = step3Schema;
        break;
      case 4:
        schema = step4Schema;
        break;
      default:
        return false;
    }

    const parsed = schema.safeParse(dataToValidate);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const issues = (parsed.error as any).errors || (parsed.error as any).issues;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      issues.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      return false;
    }

    setErrors({});
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep, formData)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const submitForm = async () => {
    if (!validateStep(4, formData)) {
      return;
    }

    // Final full validation
    const parsed = fullLeadSchema.safeParse(formData);
    if (!parsed.success) {
      // Re-map full schema errors just in case
      const fieldErrors: Record<string, string> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const issues = (parsed.error as any).errors || (parsed.error as any).issues;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      issues.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await submitLeadMutation({
        serviceType: parsed.data.serviceType,
        businessName: parsed.data.businessName,
        industry: parsed.data.industry,
        website: parsed.data.website,
        description: parsed.data.description,
        budgetRange: parsed.data.budgetRange,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        whatsappNumber: parsed.data.whatsappNumber,
        preferredContact: parsed.data.preferredContact,
        referralSource: parsed.data.referralSource,
      });
      
      setIsSuccess(true);
    } catch (error: unknown) {
      // User-friendly error mapping
      const errorMsg = error instanceof Error ? error.message : String(error);
      let friendlyMessage = "Something went wrong. Please try again or contact us on WhatsApp.";
      
      if (errorMsg.includes("Too many submissions")) {
        friendlyMessage = "You've submitted too many requests. Please wait an hour and try again.";
      }
      
      setErrors({ root: friendlyMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({});
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
  };

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isSuccess,
    updateFormData,
    nextStep,
    prevStep,
    submitForm,
    resetForm,
  };
}
