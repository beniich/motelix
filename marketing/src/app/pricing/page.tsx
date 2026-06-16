import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarifs — Sapphire PMS | Plans pour hôtels de luxe',
  description: 'Découvrez nos offres Starter, Growth et Enterprise. PMS tout-en-un avec channel manager, BI prédictive et support dédié. Essai gratuit 30 jours.',
};

export default function PricingPage() {
  return (
    <main className="bg-midnight-900 text-midnight-50 min-h-screen">
      <Header />
      <div className="pt-24">
        <div className="text-center mb-12 px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Des tarifs clairs,{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              sans surprises
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choisissez le plan qui correspond à la taille de votre établissement.
            Changez d'offre à tout moment. Sans engagement.
          </p>
        </div>
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
