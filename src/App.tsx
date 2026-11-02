import { I18nProvider } from './i18n/I18nContext';
import { EnquiryProvider } from './context/EnquiryContext';
import { Header } from './components/Header';
import { HeroShowroom } from './components/HeroShowroom';
import { Experiences } from './components/Experiences';
import { BrandStory } from './components/BrandStory';
import { PracticalInfo } from './components/PracticalInfo';
import { EnquiryForm } from './components/EnquiryForm';
import { Footer } from './components/Footer';
import { LegalDialog } from './components/LegalDialog';

export default function App() {
  return (
    <I18nProvider>
      <EnquiryProvider>
        <Header />
        <main id="main">
          <HeroShowroom />
          <Experiences />
          <BrandStory />
          <PracticalInfo />
          <EnquiryForm />
        </main>
        <Footer />
        <LegalDialog />
      </EnquiryProvider>
    </I18nProvider>
  );
}
