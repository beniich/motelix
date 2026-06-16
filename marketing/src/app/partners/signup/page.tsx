'use client';

import { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { CheckCircle2, DollarSign, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AffiliateSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    payoutMethod: 'stripe_connect',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/affiliates/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-midnight-950 text-white font-sans pt-24">
        <Header />
        <div className="max-w-2xl mx-auto px-6 pt-20 text-center">
          <div className="w-16 h-16 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Candidature reçue !</h1>
          <p className="text-midnight-200 mb-8">
            Nous allons examiner votre demande de partenariat. Vous recevrez un email dès que votre compte sera activé.
          </p>
          <Link href="/">
            <GradientButton variant="secondary">Retour à l'accueil</GradientButton>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-midnight-950 text-white font-sans pt-24 pb-20">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white leading-tight">
            Devenez partenaire <span className="text-transparent bg-clip-text bg-gradient-gold">Sapphire</span>
          </h1>
          <p className="text-lg text-midnight-200 mb-8">
            Recommandez le PMS nouvelle génération aux hôtels de luxe et gagnez 20% de commission récurrente sur chaque abonnement.
          </p>
          
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="text-gold-400 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">20% de commission à vie</h3>
                <p className="text-sm text-midnight-200 mt-1">Tant que l'hôtel reste client, vous touchez votre commission tous les mois.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
                <Users className="text-emerald-400 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Cookie 90 jours</h3>
                <p className="text-sm text-midnight-200 mt-1">L'hôtel a 3 mois pour souscrire après avoir cliqué sur votre lien.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-sky-400/10 flex items-center justify-center flex-shrink-0">
                <Award className="text-sky-400 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Dashboard Partenaire</h3>
                <p className="text-sm text-midnight-200 mt-1">Suivez vos clics, conversions et paiements en temps réel.</p>
              </div>
            </li>
          </ul>
        </div>
        
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-6">Postuler au programme</h2>
          
          {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-1">Prénom</label>
                <input
                  type="text" required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                  value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-1">Nom</label>
                <input
                  type="text" required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                  value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-1">Email professionnel</label>
              <input
                type="email" required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-1">Entreprise / Agence</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-1">Mot de passe (pour le dashboard)</label>
              <input
                type="password" required minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-1">Méthode de paiement</label>
              <select
                className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-4 py-2.5 text-white"
                value={formData.payoutMethod} onChange={e => setFormData({...formData, payoutMethod: e.target.value})}
              >
                <option value="stripe_connect">Virement bancaire (Stripe Connect)</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            
            <div className="pt-4">
              <GradientButton variant="gold" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Envoi...' : 'Soumettre ma candidature'}
              </GradientButton>
            </div>
            
            <p className="text-center text-sm text-midnight-400 mt-4">
              Déjà partenaire ? <Link href="/partners/login" className="text-gold-400 hover:underline">Connexion</Link>
            </p>
          </form>
        </GlassCard>
      </div>
    </main>
  );
}
