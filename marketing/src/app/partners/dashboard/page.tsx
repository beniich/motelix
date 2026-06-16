'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/landing/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Copy, DollarSign, Users, Link as LinkIcon, LogOut } from 'lucide-react';

export default function AffiliateDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('sapphire_affiliate_token');
    if (t) {
      setToken(t);
      fetchDashboard(t);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboard = async (t: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/affiliates/dashboard`, {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      if (res.ok) {
        setData(await res.json());
      } else {
        localStorage.removeItem('sapphire_affiliate_token');
        setToken(null);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const copyLink = () => {
    if (data?.affiliate?.code) {
      navigator.clipboard.writeText(`https://sapphire.luxury?ref=${data.affiliate.code}`);
      alert('Lien copié !');
    }
  };

  const logout = () => {
    localStorage.removeItem('sapphire_affiliate_token');
    window.location.href = '/partners/login';
  };

  if (loading) return <div className="pt-32 text-center text-white">Chargement...</div>;

  if (!token || !data) {
    return (
      <main className="min-h-screen bg-midnight-950 text-white font-sans pt-24 text-center">
        <Header />
        <div className="pt-20">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p className="mb-6">Veuillez vous connecter pour accéder au dashboard partenaire.</p>
          <a href="/partners/login"><GradientButton variant="primary">Connexion</GradientButton></a>
        </div>
      </main>
    );
  }

  const { affiliate, stats, recentReferrals, recentPayouts } = data;

  return (
    <main className="min-h-screen bg-midnight-950 text-white font-sans pt-24 pb-20">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Dashboard Partenaire
            </h1>
            <p className="text-midnight-200">
              Bienvenue, {affiliate.firstName} {affiliate.lastName} ({affiliate.company || 'Indépendant'})
            </p>
          </div>
          <button onClick={logout} className="text-midnight-300 hover:text-white flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
        
        {/* Lien d'affiliation */}
        <GlassCard className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-gold-400/10 to-transparent border-gold-400/20">
          <div>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wide mb-1">Votre lien unique</h3>
            <p className="text-lg font-mono text-white">https://sapphire.luxury?ref={affiliate.code}</p>
          </div>
          <button onClick={copyLink} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Copy className="w-5 h-5 text-white" />
          </button>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <p className="text-sm text-midnight-300">Gains totaux</p>
                <p className="text-3xl font-bold text-white">{(stats.totalEarned / 100).toFixed(2)} €</p>
              </div>
            </div>
            {stats.pendingPayout > 0 && (
              <p className="text-xs text-amber-400 mt-4">
                {(stats.pendingPayout / 100).toFixed(2)} € en attente de paiement
              </p>
            )}
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-midnight-300">Clients actifs</p>
                <p className="text-3xl font-bold text-white">{stats.activeReferrals}</p>
              </div>
            </div>
            <p className="text-xs text-emerald-400 mt-4">
              Vous rapportent {Math.round(affiliate.commission * 100)}% de leur abonnement.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-400/10 flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-sm text-midnight-300">Leads générés</p>
                <p className="text-3xl font-bold text-white">{stats.totalReferrals}</p>
              </div>
            </div>
            <p className="text-xs text-sky-400 mt-4">
              Total historique des hôtels référés.
            </p>
          </GlassCard>
        </div>

        {/* Historique */}
        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard>
            <h2 className="text-xl font-bold mb-4">Hôtels référés</h2>
            {recentReferrals.length === 0 ? (
              <p className="text-sm text-midnight-400 italic">Aucun hôtel référé pour le moment.</p>
            ) : (
              <ul className="space-y-4">
                {recentReferrals.map((r: any) => (
                  <li key={r.id} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0">
                    <div>
                      <p className="font-semibold text-white">Hôtel #{r.referredHotelId.substring(0, 8)}</p>
                      <p className="text-xs text-midnight-300">Inscrit via {r.source}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'ACTIVE' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400'}`}>
                        {r.status}
                      </span>
                      <p className="text-xs text-gold-400 mt-1">{(r.totalCommissionCents / 100).toFixed(2)}€ générés</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-bold mb-4">Derniers paiements</h2>
            {recentPayouts.length === 0 ? (
              <p className="text-sm text-midnight-400 italic">Aucun paiement pour le moment.</p>
            ) : (
              <ul className="space-y-4">
                {recentPayouts.map((p: any) => (
                  <li key={p.id} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0">
                    <div>
                      <p className="font-semibold text-white">{(p.amountCents / 100).toFixed(2)} €</p>
                      <p className="text-xs text-midnight-300">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'PAID' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400'}`}>
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
