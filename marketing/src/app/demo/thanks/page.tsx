import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { CheckCircle2 } from 'lucide-react';
import { GradientButton } from '@/components/ui/GradientButton';

export default function ThanksPage() {
  return (
    <main>
      <Header />
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h1 className="mt-6 text-3xl font-display font-bold text-midnight-50">
            Merci !
          </h1>
          <p className="mt-3 text-midnight-200">
            Votre demande a bien été reçue. Notre équipe vous recontacte sous 24h ouvrées.
          </p>
          <p className="mt-6 text-sm text-midnight-300">
            En attendant, pourquoi ne pas calculer votre ROI potentiel ?
          </p>
          <Link href="/tools/roi-calculator" className="mt-6 inline-block">
            <GradientButton variant="primary">Calculer mon ROI</GradientButton>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
