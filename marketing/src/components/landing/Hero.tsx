'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { GradientButton } from '../ui/GradientButton';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-6">
      {/* Background gradients animés */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sapphire-400/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm mb-6"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="text-midnight-100">Nouveau : Pricing dynamique IA</span>
          <span className="px-2 py-0.5 rounded-full bg-gradient-gold text-midnight-900 text-xs font-semibold">BÊTA</span>
        </motion.div>
        
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold leading-[1.1] text-midnight-50"
        >
          L'OS tout-en-un pour{' '}
          <span className="gradient-text-gold">hôtels de luxe</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-xl text-midnight-200 max-w-3xl mx-auto leading-relaxed"
        >
          PMS + Channel Manager + BI prédictive + App mobile native.
          <br />
          Remplacez 5 logiciels par une seule plateforme moderne.
        </motion.p>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/signup">
            <GradientButton size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Démarrer l'essai gratuit
            </GradientButton>
          </Link>
          <Link href="/demo">
            <GradientButton size="lg" variant="secondary">
              Réserver une démo
            </GradientButton>
          </Link>
        </motion.div>
        
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-midnight-300"
        >
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Sans carte bancaire</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Setup en 30 min</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Migration data offerte</span>
        </motion.div>
      </div>
      
      {/* Product screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-20 max-w-6xl mx-auto"
      >
        <div className="relative rounded-2xl overflow-hidden glass-strong shadow-2xl border border-white/10">
          <div className="aspect-[16/10] bg-midnight-950 flex items-center justify-center p-6">
            {/* Mockup dashboard */}
            <div className="w-full h-full p-4 grid grid-cols-4 gap-4">
              <div className="glass rounded-xl p-4 flex flex-col justify-center">
                <p className="text-sm text-midnight-200">Occupation</p>
                <p className="text-3xl font-bold text-gold-400 mt-1">87%</p>
              </div>
              <div className="glass rounded-xl p-4 flex flex-col justify-center">
                <p className="text-sm text-midnight-200">ADR</p>
                <p className="text-3xl font-bold text-midnight-50 mt-1">€420</p>
              </div>
              <div className="glass rounded-xl p-4 flex flex-col justify-center">
                <p className="text-sm text-midnight-200">RevPAR</p>
                <p className="text-3xl font-bold text-sapphire-400 mt-1">€365</p>
              </div>
              <div className="glass rounded-xl p-4 flex flex-col justify-center">
                <p className="text-sm text-midnight-200">Revenu mois</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">€184k</p>
              </div>
              <div className="col-span-4 glass rounded-xl p-6 flex-1 flex flex-col">
                <p className="text-sm font-medium text-midnight-200 mb-4">RevPAR & occupation (30j)</p>
                <div className="flex-1 flex items-end gap-1">
                  {[40, 55, 60, 70, 65, 75, 85, 90, 88, 92, 87, 95, 90, 88, 85, 92, 95, 98, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 50, 60].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-gold rounded-t opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
