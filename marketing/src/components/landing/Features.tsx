'use client';

import { motion } from 'framer-motion';
import { BedDouble, Globe, BarChart3, Sparkles, Smartphone, FileText, Users, Shield } from 'lucide-react';

const FEATURES = [
  { icon: BedDouble, title: 'PMS complet', description: 'Rooms, tâches, utilisateurs, audit log. Tout ce qu\'il faut pour gérer vos opérations.' },
  { icon: Globe, title: 'Channel Manager', description: 'Booking.com, Expedia, Airbnb en sync temps réel. Anti-surbooking automatique.' },
  { icon: BarChart3, title: 'BI avancée', description: 'RevPAR, ADR, taux d\'occupation. Forecast IA + pricing dynamique.' },
  { icon: Sparkles, title: 'Pricing dynamique', description: 'Suggestions de prix basées sur l\'occupation prévue et la saison.' },
  { icon: Smartphone, title: 'App mobile native', description: 'iOS + Android. Biométrie, push notifications, mode offline.' },
  { icon: FileText, title: 'Facturation + Stripe', description: 'PDF automatiques, paiements en ligne, acomptes, historique comptable.' },
  { icon: Users, title: 'Multi-hôtel', description: 'Gérez une chaîne entière depuis une seule interface. Super-admin inclus.' },
  { icon: Shield, title: 'Sécurité enterprise', description: 'JWT, cookies httpOnly, audit log complet, RGPD compliant.' },
];

export function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-midnight-50">
            Une plateforme, tout inclus
          </h2>
          <p className="mt-4 text-lg text-midnight-200 max-w-2xl mx-auto">
            Remplacez Mews + SiteMinder + une app mobile + Excel + votre comptable.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-a flex items-center justify-center mb-4 shadow-glow-sapphire group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-display font-semibold text-midnight-50">{f.title}</h3>
              <p className="mt-2 text-sm text-midnight-300">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
