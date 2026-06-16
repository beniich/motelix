'use client';

import { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { TrendingUp, Euro, Key } from 'lucide-react';
import Link from 'next/link';

export default function RevPARCalculator() {
  const [rooms, setRooms] = useState(20);
  const [adr, setAdr] = useState(150);
  const [occupancy, setOccupancy] = useState(65);
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const revpar = adr * (occupancy / 100);
  const monthlyRevenue = revpar * rooms * 30;
  
  // Scénarios d'optimisation
  const optAdr = adr * 1.12; // +12% avec dynamic pricing
  const optOcc = Math.min(100, occupancy + 8); // +8% avec channel manager
  const optRevpar = optAdr * (optOcc / 100);
  const optMonthlyRevenue = optRevpar * rooms * 30;
  
  const revenueIncrease = optMonthlyRevenue - monthlyRevenue;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'RevPAR Calc User',
          email,
          source: 'roi_calc',
          metadata: { rooms, adr, occupancy, currentRevpar: revpar },
        }),
      });
    } catch (e) {
      console.error(e);
    }
    
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-midnight-950 text-white font-sans pt-24 pb-20">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
            Calculateur de <span className="text-transparent bg-clip-text bg-gradient-gold">RevPAR</span>
          </h1>
          <p className="text-lg text-midnight-200">
            Découvrez combien de revenus vous laissez sur la table chaque mois sans un PMS moderne.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulaire de saisie */}
          <GlassCard>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Key className="text-gold-400" />
              Vos données actuelles
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  Nombre de chambres
                </label>
                <input
                  type="range"
                  min="5" max="200" step="1"
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="w-full accent-gold-400"
                />
                <div className="text-right mt-1 font-bold">{rooms} chambres</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  Prix moyen (ADR)
                </label>
                <input
                  type="range"
                  min="50" max="1000" step="10"
                  value={adr}
                  onChange={(e) => setAdr(Number(e.target.value))}
                  className="w-full accent-gold-400"
                />
                <div className="text-right mt-1 font-bold">{adr} €</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  Taux d'occupation
                </label>
                <input
                  type="range"
                  min="10" max="100" step="1"
                  value={occupancy}
                  onChange={(e) => setOccupancy(Number(e.target.value))}
                  className="w-full accent-gold-400"
                />
                <div className="text-right mt-1 font-bold">{occupancy} %</div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-midnight-300">Votre RevPAR actuel :</p>
              <p className="text-3xl font-display font-bold text-white mt-1">
                {revpar.toFixed(2)} €
              </p>
            </div>
          </GlassCard>
          
          {/* Résultats */}
          <GlassCard className="relative overflow-hidden">
            {!submitted ? (
              <div className="absolute inset-0 z-10 backdrop-blur-md bg-midnight-950/80 flex items-center justify-center p-8 text-center">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gold-400">Débloquez l'analyse</h3>
                  <p className="text-sm text-midnight-200 mb-6">
                    Entrez votre email pour découvrir de combien vous pourriez augmenter vos revenus avec Sapphire.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-midnight-400 focus:outline-none focus:border-gold-400"
                    />
                    <GradientButton variant="gold" size="lg" className="w-full" type="submit">
                      Voir mes résultats
                    </GradientButton>
                  </form>
                </div>
              </div>
            ) : null}
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-emerald-400" />
              Avec Sapphire PMS
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-midnight-300">RevPAR Projeté <span className="text-emerald-400 text-xs ml-2">+ Channel Manager & IA</span></p>
                <p className="text-3xl font-display font-bold text-emerald-400 mt-1">
                  {optRevpar.toFixed(2)} €
                </p>
              </div>
              
              <div className="pt-6 border-t border-white/10">
                <p className="text-sm text-midnight-300 mb-2">Manque à gagner mensuel estimé :</p>
                <p className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-gold">
                  {revenueIncrease.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} € / mois
                </p>
              </div>
              
              <ul className="text-sm text-midnight-200 space-y-3 pt-4">
                <li className="flex items-start gap-2">
                  <span className="text-gold-400">•</span>
                  <b>+{Math.round(optAdr - adr)}€ sur l'ADR</b> grâce au pricing dynamique IA
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-400">•</span>
                  <b>+{Math.round(optOcc - occupancy)}% d'occupation</b> via notre Channel Manager natif
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-400">•</span>
                  <b>0 surréservation</b> grâce à la synchro instantanée
                </li>
              </ul>
              
              {submitted && (
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <Link href="/demo">
                    <GradientButton variant="primary" className="w-full">
                      Réserver une démo
                    </GradientButton>
                  </Link>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
