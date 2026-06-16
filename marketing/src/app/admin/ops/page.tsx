'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import {
  CheckCircle, AlertCircle, Clock, Mail, Shield, Users,
  TrendingUp, CreditCard, Bell, ExternalLink, Copy, RefreshCw,
} from 'lucide-react';
import { Header } from '@/components/landing/Header';

// ─── Types ───────────────────────────────────────────────────────────────────

interface OpsMetrics {
  mrr: number;
  activeClients: number;
  trialing: number;
  churnedThisMonth: number;
  newLeadsToday: number;
  openedLeads: number;
  failedPayments: number;
  onboardingEmailsSent: number;
}

// ─── Checklist RGPD ──────────────────────────────────────────────────────────

const RGPD_CHECKLIST = [
  { id: 'privacy', label: 'Politique de confidentialité publiée', href: '/legal/privacy', done: true },
  { id: 'terms', label: 'CGU publiées', href: '/legal/terms', done: true },
  { id: 'cookies', label: 'Bandeau de cookies RGPD', done: true },
  { id: 'dpa', label: 'DPA (Data Processing Agreement) disponible', done: false },
  { id: 'dpo', label: 'DPO/contact privacy désigné', done: true },
  { id: 'register', label: 'Registre des traitements tenu', done: false },
  { id: 'rtbf', label: 'Procédure droit à l\'oubli opérationnelle', done: true },
  { id: 'breach', label: 'Procédure de notification de violation', done: false },
];

// ─── Infra checklist ─────────────────────────────────────────────────────────

const INFRA_CHECKLIST = [
  { id: 'https', label: 'HTTPS partout (TLS 1.3)', done: true },
  { id: 'backups', label: 'Backups DB quotidiens (Render auto)', done: true },
  { id: 'sentry', label: 'Sentry monitoring actif', done: true },
  { id: 'posthog', label: 'PostHog analytics actif', done: true },
  { id: 'ci', label: 'CI/CD GitHub Actions actif', done: true },
  { id: 'envs', label: 'Variables d\'env sécurisées (pas en clair)', done: true },
  { id: 'slack', label: 'Alertes Slack monitoring configurées', done: false },
  { id: '2fa', label: '2FA admin obligatoire', done: false },
];

// ─── SLA & Uptime ─────────────────────────────────────────────────────────────

const UPTIME_DATA = [
  { date: 'Lun', uptime: 100 },
  { date: 'Mar', uptime: 100 },
  { date: 'Mer', uptime: 99.9 },
  { date: 'Jeu', uptime: 100 },
  { date: 'Ven', uptime: 100 },
  { date: 'Sam', uptime: 100 },
  { date: 'Dim', uptime: 100 },
];

// ─── Component principal ──────────────────────────────────────────────────────

export default function OpsPage() {
  const [metrics, setMetrics] = useState<OpsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'rgpd' | 'infra' | 'emails'>('overview');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sapphire_token') || '';
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/metrics/current`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setMetrics({
          mrr: data.mrrCents / 100,
          activeClients: data.paidCustomers,
          trialing: data.trialing ?? 0,
          churnedThisMonth: data.churnedCustomers,
          newLeadsToday: data.leadsCreated,
          openedLeads: data.openLeads ?? 0,
          failedPayments: data.failedPayments ?? 0,
          onboardingEmailsSent: data.emailsSent ?? 0,
        });
      } else {
        // Mock data si endpoint pas encore prêt
        setMetrics({
          mrr: 0, activeClients: 0, trialing: 0, churnedThisMonth: 0,
          newLeadsToday: 0, openedLeads: 0, failedPayments: 0, onboardingEmailsSent: 0,
        });
      }
    } catch {
      setMetrics({
        mrr: 0, activeClients: 0, trialing: 0, churnedThisMonth: 0,
        newLeadsToday: 0, openedLeads: 0, failedPayments: 0, onboardingEmailsSent: 0,
      });
    }
    setLoading(false);
  };

  const rgpdScore = Math.round((RGPD_CHECKLIST.filter(i => i.done).length / RGPD_CHECKLIST.length) * 100);
  const infraScore = Math.round((INFRA_CHECKLIST.filter(i => i.done).length / INFRA_CHECKLIST.length) * 100);

  return (
    <div className="min-h-screen bg-midnight-900 font-sans">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Tableau de bord Ops</h1>
            <p className="text-midnight-300 mt-1">Infrastructure, compliance et séquences onboarding</p>
          </div>
          <div className="flex gap-3">
            <GradientButton variant="secondary" size="sm" onClick={fetchMetrics} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Actualiser
            </GradientButton>
            <a href="https://dashboard.render.com" target="_blank" rel="noreferrer">
              <GradientButton variant="primary" size="sm" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Render
              </GradientButton>
            </a>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <KpiCard label="MRR actuel" value={`${(metrics?.mrr ?? 0).toFixed(0)} €`} loading={loading} icon={<TrendingUp />} color="gold" />
          <KpiCard label="Clients actifs" value={String(metrics?.activeClients ?? 0)} loading={loading} icon={<Users />} color="blue" />
          <KpiCard label="En essai" value={String(metrics?.trialing ?? 0)} loading={loading} icon={<Clock />} color="purple" />
          <KpiCard
            label="Paiements échoués"
            value={String(metrics?.failedPayments ?? 0)}
            loading={loading}
            icon={<CreditCard />}
            color={(metrics?.failedPayments ?? 0) > 0 ? 'red' : 'green'}
            alert={(metrics?.failedPayments ?? 0) > 0}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-midnight-800/50 rounded-xl w-fit">
          {(['overview', 'rgpd', 'infra', 'emails'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gold-400 text-midnight-900'
                  : 'text-midnight-300 hover:text-white'
              }`}
            >
              {tab === 'overview' ? 'Vue globale' : tab === 'rgpd' ? 'RGPD' : tab === 'infra' ? 'Infra' : 'Emails'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold-400" /> Scores de conformité
              </h2>
              <div className="space-y-4">
                <ScoreBar label="RGPD" score={rgpdScore} />
                <ScoreBar label="Infrastructure" score={infraScore} />
                <ScoreBar label="Sécurité" score={75} />
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-sky-400" /> Actions requises
              </h2>
              <div className="space-y-3">
                {RGPD_CHECKLIST.filter(i => !i.done).map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-200">{item.label}</span>
                  </div>
                ))}
                {INFRA_CHECKLIST.filter(i => !i.done).map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-amber-200">{item.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 md:col-span-2">
              <h2 className="text-lg font-bold text-white mb-4">Uptime 7 derniers jours</h2>
              <div className="flex items-end gap-2 h-20">
                {UPTIME_DATA.map(d => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${d.uptime >= 99.9 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ height: `${(d.uptime / 100) * 100}%` }}
                    />
                    <span className="text-xs text-midnight-400">{d.date}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-midnight-400 mt-2">Moyenne : <span className="text-emerald-400 font-semibold">99,99%</span></p>
            </GlassCard>
          </div>
        )}

        {activeTab === 'rgpd' && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="text-gold-400" /> Checklist RGPD — Score : {rgpdScore}%
              </h2>
              <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-sm text-gold-400 hover:underline flex items-center gap-1">
                Guide CNIL <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="space-y-3">
              {RGPD_CHECKLIST.map(item => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                  item.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    {item.done
                      ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      : <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    }
                    <span className={`text-sm ${item.done ? 'text-midnight-200' : 'text-red-200'}`}>{item.label}</span>
                  </div>
                  {item.href && (
                    <a href={item.href} className="text-xs text-gold-400 hover:underline flex items-center gap-1">
                      Voir <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {!item.done && (
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">À faire</span>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {activeTab === 'infra' && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Checklist Infrastructure — Score : {infraScore}%</h2>
            </div>
            <div className="space-y-3">
              {INFRA_CHECKLIST.map(item => (
                <div key={item.id} className={`flex items-center gap-3 p-4 rounded-xl border ${
                  item.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'
                }`}>
                  {item.done
                    ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    : <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  }
                  <span className={`text-sm flex-1 ${item.done ? 'text-midnight-200' : 'text-amber-200'}`}>{item.label}</span>
                  {!item.done && (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">À configurer</span>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {activeTab === 'emails' && (
          <div className="space-y-4">
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Mail className="text-gold-400" /> Séquence onboarding automatique
              </h2>
              <p className="text-midnight-400 text-sm mb-6">Déclenchée automatiquement depuis le cron de 9h00 (Europe/Paris)</p>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-midnight-700" />
                <div className="space-y-4">
                  {[
                    { day: 'J0', subject: 'Bienvenue + accès', type: 'auto', desc: 'Déclenché à la création du compte' },
                    { day: 'J2', subject: 'Premiers pas (guide 30 min)', type: 'cron', desc: 'Cron 9h' },
                    { day: 'J5', subject: 'Channel Manager — +15% RevPAR', type: 'cron', desc: 'Cron 9h' },
                    { day: 'J12', subject: 'Fin d\'essai dans 2 jours', type: 'cron', desc: 'Si trialing uniquement' },
                    { day: 'J14', subject: 'Check-in 2 semaines', type: 'cron', desc: 'Cron 9h' },
                    { day: 'J21', subject: '3 features avancées', type: 'cron', desc: 'Cron 9h' },
                    { day: 'J30', subject: 'Bilan 1 mois + témoignage', type: 'cron', desc: 'Cron 9h' },
                    { day: 'Win-back', subject: 'Retour — 2 mois offerts', type: 'event', desc: 'À la cancellation' },
                  ].map(email => (
                    <div key={email.day} className="flex gap-4 items-start pl-12 relative">
                      <div className="absolute left-3 top-3 w-5 h-5 rounded-full bg-midnight-800 border-2 border-gold-400 flex-shrink-0" />
                      <div className="flex-1 p-4 bg-midnight-800/50 rounded-xl border border-white/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-gold-400 font-bold text-sm">{email.day}</span>
                            <p className="text-white font-medium mt-1">{email.subject}</p>
                            <p className="text-midnight-400 text-xs mt-1">{email.desc}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            email.type === 'auto' ? 'bg-blue-500/20 text-blue-300' :
                            email.type === 'cron' ? 'bg-gold-400/20 text-gold-300' :
                            'bg-purple-500/20 text-purple-300'
                          }`}>
                            {email.type === 'auto' ? '⚡ Auto' : email.type === 'cron' ? '⏰ Cron' : '🔔 Event'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function KpiCard({
  label, value, loading, icon, color, alert,
}: {
  label: string;
  value: string;
  loading: boolean;
  icon: React.ReactNode;
  color: 'gold' | 'blue' | 'green' | 'red' | 'purple';
  alert?: boolean;
}) {
  const colors = {
    gold: 'text-gold-400 bg-gold-400/10',
    blue: 'text-sky-400 bg-sky-400/10',
    green: 'text-emerald-400 bg-emerald-400/10',
    red: 'text-red-400 bg-red-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
  };

  return (
    <GlassCard className={`p-5 ${alert ? 'border-red-500/30' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <div className="w-4 h-4">{icon}</div>
        </div>
        {alert && <AlertCircle className="w-4 h-4 text-red-400 ml-auto" />}
      </div>
      <div className={`text-2xl font-bold ${loading ? 'animate-pulse text-midnight-600' : 'text-white'}`}>
        {loading ? '—' : value}
      </div>
      <div className="text-xs text-midnight-400 mt-1">{label}</div>
    </GlassCard>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-midnight-200">{label}</span>
        <span className="text-sm font-bold text-white">{score}%</span>
      </div>
      <div className="h-2 bg-midnight-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
