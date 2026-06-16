import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Footer } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';
import { Features } from '@/components/landing/Features';
import { ChannelManager } from '@/components/landing/ChannelManager';
import { 
  LogoCloud, Dashboard, Mobile, Testimonials, FAQ, CTA 
} from '@/components/landing/Placeholders';

export default function Home() {
  return (
    <main className="bg-midnight-900 text-midnight-50 min-h-screen">
      <Header />
      <Hero />
      <LogoCloud />
      <Features />
      <ChannelManager />
      <Dashboard />
      <Mobile />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
