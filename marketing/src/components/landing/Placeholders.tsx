import React from 'react';

export function LogoCloud() {
  return (
    <div className="py-12 border-y border-white/5 bg-midnight-950/50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm text-midnight-300 font-medium mb-8">Déjà adopté par les meilleurs établissements</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholders pour logos */}
          <div className="text-xl font-display font-bold text-midnight-100">Le Bristol</div>
          <div className="text-xl font-display font-bold text-midnight-100">Ritz Paris</div>
          <div className="text-xl font-display font-bold text-midnight-100">Cheval Blanc</div>
          <div className="text-xl font-display font-bold text-midnight-100">Four Seasons</div>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-midnight-50">Tout ce dont vous avez besoin</h2>
        <p className="mt-4 text-midnight-200">Une suite complète d'outils pour gérer votre hôtel.</p>
      </div>
    </section>
  );
}

export function ChannelManager() {
  return <section className="py-24 px-6 bg-midnight-950"><div className="max-w-7xl mx-auto text-center"><h2 className="text-3xl md:text-4xl font-display font-bold text-midnight-50">Channel Manager</h2></div></section>;
}

export function Dashboard() {
  return <section className="py-24 px-6"><div className="max-w-7xl mx-auto text-center"><h2 className="text-3xl md:text-4xl font-display font-bold text-midnight-50">BI & Dashboard</h2></div></section>;
}

export function Mobile() {
  return <section className="py-24 px-6 bg-midnight-950"><div className="max-w-7xl mx-auto text-center"><h2 className="text-3xl md:text-4xl font-display font-bold text-midnight-50">App Mobile Native</h2></div></section>;
}

export function Testimonials() {
  return <section className="py-24 px-6"><div className="max-w-7xl mx-auto text-center"><h2 className="text-3xl md:text-4xl font-display font-bold text-midnight-50">Ce qu'ils en disent</h2></div></section>;
}

export function FAQ() {
  return <section className="py-24 px-6 bg-midnight-950"><div className="max-w-7xl mx-auto text-center"><h2 className="text-3xl md:text-4xl font-display font-bold text-midnight-50">Questions Fréquentes</h2></div></section>;
}

export function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center glass-strong p-12 rounded-3xl border border-gold-400/20">
        <h2 className="text-4xl font-display font-bold text-midnight-50">Prêt à augmenter votre RevPAR ?</h2>
        <p className="mt-4 mb-8 text-midnight-200">Rejoignez les hôtels qui réinventent leur gestion opérationnelle.</p>
        <a href="/signup" className="inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg bg-gradient-a text-white shadow-glow-sapphire hover:shadow-lg text-base px-6 py-3 gap-2.5">
          Démarrer l'essai gratuit
        </a>
      </div>
    </section>
  );
}
