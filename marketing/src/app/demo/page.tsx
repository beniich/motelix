'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { GlassInput } from '@/components/ui/GlassInput';
import { Select } from '@/components/ui/Select';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { trackEventClient } from '@/lib/track';

export default function DemoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', company: '', hotels: '1-3', role: 'Owner',
  });
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'demo_request' }),
      });
      if (res.ok) {
        trackEventClient('demo_requested', { email: form.email });
        router.push('/demo/thanks');
      } else {
        alert('Erreur, réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main>
      <Header />
      <div className="min-h-screen pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sapphire-400/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-midnight-50 text-center">
            Réservez une démo
          </h1>
          <p className="mt-3 text-center text-midnight-200">
            30 minutes avec un expert produit. On vous montre Sapphire sur vos cas d'usage.
          </p>
          
          <GlassCard variant="strong" className="mt-12">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Nom complet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <GlassInput label="Email pro" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <GlassInput label="Nom de l'hôtel / groupe" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Nombre d'hôtels"
                  value={form.hotels}
                  onChange={(e) => setForm({ ...form, hotels: e.target.value })}
                  options={[
                    { value: '1', label: '1 hôtel' },
                    { value: '2-3', label: '2-3 hôtels' },
                    { value: '4-10', label: '4-10 hôtels' },
                    { value: '10+', label: '10+ hôtels' },
                  ]}
                />
                <Select
                  label="Votre rôle"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  options={[
                    { value: 'Owner', label: 'Propriétaire' },
                    { value: 'Director', label: 'Directeur' },
                    { value: 'Revenue', label: 'Revenue Manager' },
                    { value: 'IT', label: 'Responsable IT' },
                    { value: 'Other', label: 'Autre' },
                  ]}
                />
              </div>
              <GradientButton type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                Réserver ma démo
              </GradientButton>
              <p className="text-xs text-center text-midnight-300">
                Pas d'engagement. Réponse sous 24h ouvrées.
              </p>
            </form>
          </GlassCard>
        </div>
      </div>
      <Footer />
    </main>
  );
}
