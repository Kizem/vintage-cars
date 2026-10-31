import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ExperienceId } from '../data/types';

export interface EnquiryPrefill {
  experience?: ExperienceId;
  vehicle?: string;
  /** Changes on every request so the form re-applies identical prefills. */
  nonce: number;
}

interface EnquiryContextValue {
  prefill: EnquiryPrefill | null;
  /** Pre-select values in the enquiry form and scroll to it. */
  startEnquiry: (p: Omit<EnquiryPrefill, 'nonce'>) => void;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<EnquiryPrefill | null>(null);

  const startEnquiry = useCallback((p: Omit<EnquiryPrefill, 'nonce'>) => {
    setPrefill({ ...p, nonce: Date.now() });
    requestAnimationFrame(() => {
      const target = document.getElementById('contact');
      target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      window.setTimeout(() => document.getElementById('enquiry-fullName')?.focus({ preventScroll: true }), 700);
    });
  }, []);

  const value = useMemo(() => ({ prefill, startEnquiry }), [prefill, startEnquiry]);
  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used inside <EnquiryProvider>');
  return ctx;
}
