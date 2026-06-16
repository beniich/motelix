'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const CHANNELS = [
  { name: 'Booking.com', color: 'bg-blue-500' },
  { name: 'Expedia', color: 'bg-yellow-500' },
  { name: 'Airbnb', color: 'bg-rose-500' },
  { name: 'Agoda', color: 'bg-purple-500' },
];

export function ChannelManager() {
  return (
    <section className="py-24 px-6 bg-midnight-950">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-midnight-50">
            Synchronisation en temps réel
          </h2>
          <p className="mt-4 text-lg text-midnight-200">
            Fini le surbooking. Connectez vos OTA en quelques clics et laissez Sapphire gérer les disponibilités sur tous vos canaux.
          </p>
          
          <ul className="mt-8 space-y-4">
            {[
              'Mise à jour des prix et disponibilités en < 2 secondes',
              'Règles de restriction (minimum stay, closed to arrival)',
              'Import automatique des réservations, modifications et annulations',
              'Cartographie intelligente des chambres et plans tarifaires'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-midnight-100">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <GlassCard variant="strong" className="relative z-10 p-8 shadow-2xl border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold text-midnight-50">Statut des connexions</h3>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">Tout est sync</span>
            </div>
            
            <div className="space-y-4">
              {CHANNELS.map((channel, i) => (
                <div key={channel.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${channel.color} flex items-center justify-center text-white font-bold`}>
                      {channel.name[0]}
                    </div>
                    <span className="font-medium text-midnight-100">{channel.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-midnight-300">Sync il y a 2s</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          
          {/* Decorative elements behind the card */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sapphire-500/20 to-gold-500/20 blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
