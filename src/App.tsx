import { useState } from 'react';
import { I18nProvider } from './i18n/I18nContext';
import { EnquiryProvider } from './context/EnquiryContext';
import { experiences } from './data/experiences';
import { usePageNavigation } from './lib/pageNav';
import { TopNav } from './components/TopNav';
import { Parking } from './components/garage/Parking';
import { About, Chapter, GoodToKnow, Write } from './components/Sections';
import { LegalDialog } from './components/LegalDialog';
import type { Locale } from './i18n/locales';

/**
 * Le Garage : sept sections plein écran, un geste par section.
 * garage, sortie-1, sortie-2, sortie-3, savoir, apropos, ecrire.
 */
function Page() {
  /* Pendant le focus voiture, la page ne défile plus et le reste sort de l'ordre de tabulation */
  const [focusOpen, setFocusOpen] = useState(false);
  usePageNavigation();
  return (
    <div className="em-page">
      <TopNav />
      <main id="main" className={`em-scroll${focusOpen ? ' is-locked' : ''}`}>
        <section id="garage" data-tone="dark">
          <Parking open={focusOpen} onOpenChange={setFocusOpen} />
        </section>
        {experiences.map((x, i) => (
          <Chapter key={x.id} experience={x} n={i + 1} inert={focusOpen} />
        ))}
        <GoodToKnow inert={focusOpen} />
        <About inert={focusOpen} />
        <Write inert={focusOpen} />
      </main>
    </div>
  );
}

/** `locale`: language of a page rendered ahead of time (pre-rendering). In the browser, the address decides. */
export default function App({ locale }: { locale?: Locale }) {
  return (
    <I18nProvider initial={locale}>
      <EnquiryProvider>
        <Page />
        <LegalDialog />
      </EnquiryProvider>
    </I18nProvider>
  );
}
