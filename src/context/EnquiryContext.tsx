import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { experiences } from '../data/experiences';
import { getVehicle } from '../data/vehicles';
import type { ExperienceId } from '../data/types';
import { scrollToId } from '../lib/pageNav';

export interface EnquiryPrefill {
  experience?: ExperienceId;
  vehicle?: string;
  /** Changes on every request so the form re-applies identical prefills. */
  nonce: number;
}

interface EnquiryContextValue {
  prefill: EnquiryPrefill | null;
  /** Pre-select values in the enquiry form and go to the Enquire section. */
  startEnquiry: (p: Omit<EnquiryPrefill, 'nonce'>) => void;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<EnquiryPrefill | null>(null);

  const startEnquiry = useCallback((p: Omit<EnquiryPrefill, 'nonce'>) => {
    setPrefill({ ...p, nonce: Date.now() });
    scrollToId('ecrire', { focusHeading: true });
  }, []);

  /* Lien depuis une page du site (« Préparer votre mariage » → /fr/?experience=events&car=citroen-ds#ecrire) :
     le formulaire arrive pré-rempli, l'adresse est nettoyée. Seules les valeurs des listes sont reprises. */
  useEffect(() => {
    const url = new URL(window.location.href);
    const exp = url.searchParams.get('experience');
    const car = url.searchParams.get('car');
    if (exp === null && car === null) return;
    url.searchParams.delete('experience');
    url.searchParams.delete('car');
    window.history.replaceState(null, '', url);
    const experience = experiences.find((x) => x.id === exp)?.id;
    const vehicle = getVehicle(car)?.slug;
    if (experience || vehicle) setPrefill({ experience, vehicle, nonce: Date.now() });
  }, []);

  const value = useMemo(() => ({ prefill, startEnquiry }), [prefill, startEnquiry]);
  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used inside <EnquiryProvider>');
  return ctx;
}
