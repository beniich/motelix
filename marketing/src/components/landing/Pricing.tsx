'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { GradientButton } from '../ui/GradientButton';
import { clsx } from 'clsx';

type Plan = {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaLink: string;
};

const PLANS: Plan[] = [
  {
    name: 'Starter',
    price: { monthly: 99, yearly: 79 },
    description: 'Idéal pour un boutique-hôtel indépendant',
    features: [
      'Jusqu\'à 15 chambres',
      'PMS complet (rooms, tasks, audit)',
      'Réservations + check-in/out',
      'Facturation PDF',
      '1 utilisateur admin',
      'Support email',
    ],
    cta: 'Démarrer',
    ctaLink: '/signup?plan=starter',
  },
  {
    name: 'Pro',
    price: { monthly: 249, yearly: 199 },
    description: 'Pour les hôtels en croissance',
    features: [
      'Chambres illimitées',
      'Tout Starter inclus',
      'Channel Manager (Booking, Expedia, Airbnb)',
      'BI avancée (RevPAR, ADR, segments)',
      'Pricing dynamique IA',
      'App mobile native (iOS + Android)',
      '5 utilisateurs inclus',
      'Support prioritaire',
    ],
    highlighted: true,
    cta: 'Démarrer l\'essai gratuit',
    ctaLink: '/signup?plan=pro',
  },
  {
    name: 'Enterprise',
    price: { monthly: 799, yearly: 649 },
    description: 'Pour les chaînes hôtelières',
    features: [
      'Hôtels illimités (multi-property)',
      'Tout Pro inclus',
      'Dashboard consolidé groupe',
      'Forecast IA',
      'Rapports hebdo automatisés',
      'SSO + audit avancé',
      'Account manager dédié',
      'API publique + webhooks',
      'SLA 99.9% + support 24/7',
    ],
    cta: 'Nous contacter',
    ctaLink: '/contact?plan=enterprise',
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  
  return (
    <section className="py-24 px-6 bg-midnight-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-midnight-50">
            Tarification transparente
          </h2>
          <p className="mt-4 text-lg text-midnight-200">
            Pas de frais cachés. Pas de commission sur les résas. Annulable à tout moment.
          </p>
          
          {/* Toggle mensuel/annuel */}
          <div className="mt-8 inline-flex items-center glass rounded-xl p-1">
            <button
              onClick={() => setYearly(false)}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                !yearly ? 'bg-gradient-a text-white' : 'text-midnight-200 hover:text-white'
              )}
            >
              Mensuel
            </button>
            <button
              onClick={() => setYearly(true)}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2',
                yearly ? 'bg-gradient-a text-white' : 'text-midnight-200 hover:text-white'
              )}
            >
              Annuel
              <span className="px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-300 text-xs">-20%</span>
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={clsx(
                'rounded-2xl p-8 relative transition-transform hover:-translate-y-1',
                plan.highlighted 
                  ? 'glass-strong border-2 border-gold-400/50 shadow-glow-gold' 
                  : 'glass'
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-gold text-midnight-900 text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Le plus populaire
                </div>
              )}
              
              <h3 className="text-2xl font-display font-bold text-midnight-50">{plan.name}</h3>
              <p className="mt-2 text-sm text-midnight-200">{plan.description}</p>
              
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-display font-bold text-midnight-50">
                  {yearly ? plan.price.yearly : plan.price.monthly}€
                </span>
                <span className="text-sm text-midnight-300">/mois HT</span>
              </div>
              {yearly && (
                <p className="mt-1 text-xs text-emerald-400">
                  Économisez {(plan.price.monthly - plan.price.yearly) * 12}€/an
                </p>
              )}
              
              <Link href={plan.ctaLink} className="block mt-6">
                <GradientButton 
                  variant={plan.highlighted ? 'gold' : 'secondary'}
                  size="lg" 
                  className="w-full"
                >
                  {plan.cta}
                </GradientButton>
              </Link>
              
              <ul className="mt-8 space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-midnight-100">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center mt-12 text-sm text-midnight-300">
          💬 Besoin d'un plan sur-mesure ?{' '}
          <Link href="/contact" className="text-gold-400 hover:text-gold-300 underline">
            Parlons-en
          </Link>
        </p>
      </div>
    </section>
  );
}
