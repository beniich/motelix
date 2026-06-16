'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Key, Globe, Plus, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ApiSettings() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sapphire_token') || '' : '';
    try {
      const [hooksRes] = await Promise.all([
        // Assuming we added listApiKeys endpoint (omitted here for brevity, usually in super/admin ctrl)
        // fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/api-keys`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/webhooks`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (hooksRes.ok) {
        const hooksData = await hooksRes.json();
        setWebhooks(hooksData.endpoints);
      }
      
      // Mock API keys for demo since we didn't build the listApiKeys endpoint yet in the controller
      setApiKeys([
        { id: '1', name: 'Zendesk Integration', prefix: 'sph_live_f89b', scopes: 'reservations:read,invoices:read', lastUsedAt: new Date().toISOString(), status: 'ACTIVE' },
        { id: '2', name: 'Custom Kiosk App', prefix: 'sph_live_22a1', scopes: '*', lastUsedAt: new Date(Date.now() - 86400000).toISOString(), status: 'ACTIVE' }
      ]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-white">Chargement...</div>;

  return (
    <div className="p-8 font-sans text-white max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Développeurs & API</h1>
        <p className="text-midnight-200 mt-2">Gérez vos clés d'API et vos webhooks pour intégrer Sapphire à votre écosystème.</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Section Clés d'API */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Key className="text-gold-400" />
              Clés d'API
            </h2>
            <GradientButton variant="primary" size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Créer une clé
            </GradientButton>
          </div>
          
          <GlassCard>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-midnight-300 text-sm">
                  <th className="pb-3 px-4 font-medium">Nom</th>
                  <th className="pb-3 px-4 font-medium">Clé (Prefix)</th>
                  <th className="pb-3 px-4 font-medium">Scopes</th>
                  <th className="pb-3 px-4 font-medium">Dernière utilisation</th>
                  <th className="pb-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {apiKeys.map(key => (
                  <tr key={key.id} className="border-b border-white/5 last:border-0">
                    <td className="py-4 px-4 font-medium">{key.name}</td>
                    <td className="py-4 px-4 font-mono text-midnight-200">{key.prefix}••••••••</td>
                    <td className="py-4 px-4">
                      {key.scopes === '*' ? (
                        <span className="bg-emerald-400/20 text-emerald-400 px-2 py-1 rounded text-xs">Accès complet</span>
                      ) : (
                        <span className="bg-white/10 text-midnight-200 px-2 py-1 rounded text-xs">{key.scopes}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-midnight-300">
                      {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Jamais'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </section>

        {/* Section Webhooks */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="text-sky-400" />
              Webhooks
            </h2>
            <GradientButton variant="primary" size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Ajouter un endpoint
            </GradientButton>
          </div>
          
          <GlassCard>
            {webhooks.length === 0 ? (
              <div className="text-center py-8 text-midnight-300">
                <Globe className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Aucun webhook configuré.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-midnight-300 text-sm">
                    <th className="pb-3 px-4 font-medium">URL</th>
                    <th className="pb-3 px-4 font-medium">Événements</th>
                    <th className="pb-3 px-4 font-medium">Statut</th>
                    <th className="pb-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {webhooks.map(hook => (
                    <tr key={hook.id} className="border-b border-white/5 last:border-0">
                      <td className="py-4 px-4 font-medium">{hook.url}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {hook.events.split(',').map((ev: string) => (
                            <span key={ev} className="bg-white/10 text-midnight-200 px-2 py-0.5 rounded text-xs">{ev}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle className="w-3 h-3" /> Actif
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-midnight-300 hover:text-white p-2"><Eye className="w-4 h-4" /></button>
                        <button className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
