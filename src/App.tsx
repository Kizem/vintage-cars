import { EnquiryProvider } from './context/EnquiryContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VehicleCollection } from './components/VehicleCollection';
import { Experiences } from './components/Experiences';
import { BrandStory } from './components/BrandStory';
import { EnquiryForm } from './components/EnquiryForm';
import { Footer } from './components/Footer';
import { LegalDialog } from './components/LegalDialog';

export default function App() {
  return (
    <EnquiryProvider>
      <Header />
      <main id="main">
        <Hero />
        <VehicleCollection />
        <Experiences />
        <BrandStory />
        <EnquiryForm />
      </main>
      <Footer />
      <LegalDialog />
    </EnquiryProvider>
  );
}
