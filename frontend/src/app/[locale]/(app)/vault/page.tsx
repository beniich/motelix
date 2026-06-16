'use client';

import { useState } from 'react';
import {
  Lock, Shield, FileText, AlertTriangle,
  Download, Eye, Clock, MapPin, Activity,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';

// ── Types & Data ──────────────────────────────────────────────────────────────
type DocTier = 'GOLD' | 'PLATINUM' | 'STANDARD';
interface VaultDoc {
  id: string;
  name: string;
  hash: string;
  size: string;
  updatedAgo: string;
  tier: DocTier;
  encrypted: boolean;
}
interface QueueItem {
  id: string;
  name: string;
  progress: number;
  status: 'decrypting' | 'pending';
  label: string;
  tier: DocTier;
}
interface AccessLog {
  id: string;
  event: string;
  time: string;
  type: 'grant' | 'decrypt' | 'alert';
}

const DOCS: VaultDoc[] = [
  { id: '1', name: 'Contract_Acquisition_2024.pdf', hash: '4f82-99a1-z7c1', size: '2.4 MB', updatedAgo: '2h', tier: 'GOLD', encrypted: true },
  { id: '2', name: 'Merger_Agreement_X89.docx',     hash: '12bc-ff34-e9d2', size: '1.1 MB', updatedAgo: '5h', tier: 'PLATINUM', encrypted: true },
  { id: '3', name: 'Financial_Report_Q3_Secure.xlsx', hash: '99f1-a1b2-c3d4', size: '456 KB', updatedAgo: '3d', tier: 'GOLD', encrypted: true },
];
const QUEUE: QueueItem[] = [
  { id: '1', name: 'Contract_Acquisition_2024.pdf (Encrypted)', progress: 45, status: 'decrypting', label: 'Decrypting… 45%', tier: 'GOLD' },
  { id: '2', name: 'Financial_Report_Q3_Secure.xlsx', progress: 30, status: 'pending', label: 'Access Request: VIP Level 2 (Pending)', tier: 'PLATINUM' },
];
const ACCESS_LOG: AccessLog[] = [
  { id: '1', event: 'Access Granted: Mr. Chen',       time: '10:28 AM', type: 'grant'   },
  { id: '2', event: 'File Decryption: Contract_A',    time: '10:25 AM', type: 'decrypt' },
  { id: '3', event: 'Login Attempt: Unknown IP',       time: '10:18 AM (Blocked)', type: 'alert' },
];

// ── Tier badge ────────────────────────────────────────────────────────────────
const TIER_STYLE: Record<DocTier, { bg: string; text: string; label: string; border: string }> = {
  GOLD:     { bg: 'rgba(212,175,55,0.15)',  text: '#D4AF37', label: 'Gold',     border: 'rgba(212,175,55,0.3)'  },
  PLATINUM: { bg: 'rgba(192,192,192,0.15)', text: '#C0C0C0', label: 'Platinum', border: 'rgba(192,192,192,0.3)' },
  STANDARD: { bg: 'rgba(59,130,246,0.15)',  text: '#60A5FA', label: 'Standard', border: 'rgba(59,130,246,0.3)'  },
};

function TierBadge({ tier }: { tier: DocTier }) {
  const s = TIER_STYLE[tier];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      ✦ {s.label}
    </span>
  );
}

// ── World Map SVG with animated connections ───────────────────────────────────
function WorldMap() {
  return (
    <div
      className="rounded-2xl p-2 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <svg viewBox="0 0 400 200" className="w-full h-auto">
        <defs>
          <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(30,41,60,0.8)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0.9)" />
          </linearGradient>
          <style>{`
            .dash-flow { stroke-dasharray: 4 4; animation: dashFlow 1.5s linear infinite; }
            @keyframes dashFlow { to { stroke-dashoffset: -30; } }
          `}</style>
        </defs>
        <rect width="400" height="200" fill="url(#ocean)" rx="8" />
        {/* Continents */}
        <g fill="#334155" opacity="0.6">
          <path d="M30,50 Q40,35 60,40 L90,45 L100,70 L80,90 L60,100 L40,90 L25,75 Z" />
          <path d="M85,110 Q95,105 105,115 L110,140 L100,170 L85,180 L75,160 L78,130 Z" />
          <path d="M180,40 Q190,30 210,35 L225,50 L215,65 L195,60 L180,50 Z" />
          <path d="M195,75 Q210,70 225,80 L230,120 L215,155 L200,150 L188,120 L190,95 Z" />
          <path d="M230,40 Q260,30 300,40 L340,55 L350,80 L320,90 L280,80 L250,70 L235,55 Z" />
          <path d="M310,135 Q330,130 350,140 L355,160 L335,170 L315,160 Z" />
        </g>
        {/* Connection lines */}
        <g fill="none" stroke="#D4AF37" strokeWidth="1.5" className="dash-flow">
          <path d="M80,80 Q180,40 220,55" />
          <path d="M220,55 Q280,40 320,80" />
          <path d="M220,55 Q270,90 330,150" />
          <path d="M80,80 Q150,130 220,55" />
        </g>
        <g fill="none" stroke="#3b82f6" strokeWidth="1.2" className="dash-flow">
          <path d="M320,80 Q360,50 380,70" />
          <path d="M220,55 Q180,80 200,140" />
        </g>
        {/* Nodes */}
        <circle cx="80"  cy="80"  r="5" fill="#D4AF37" stroke="#fff" strokeWidth="1.5" />
        <circle cx="220" cy="55"  r="6" fill="#D4AF37" stroke="#fff" strokeWidth="1.5" />
        <circle cx="320" cy="80"  r="5" fill="#D4AF37" stroke="#fff" strokeWidth="1.5" />
        <circle cx="330" cy="150" r="4" fill="#D4AF37" stroke="#fff" strokeWidth="1.5" />
        <circle cx="200" cy="140" r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
        <circle cx="380" cy="70"  r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}60` }} />
    </div>
  );
}

// ── Access log item ───────────────────────────────────────────────────────────
function AccessLogItem({ log }: { log: AccessLog }) {
  const borderColor = { grant: '#3b82f6', decrypt: '#D4AF37', alert: '#ef4444' }[log.type];
  const textColor   = { grant: 'text-[#C2C7DC]', decrypt: 'text-[#D4AF37]', alert: 'text-red-400' }[log.type];
  return (
    <div className="border-l-2 pl-3" style={{ borderColor }}>
      <p className={`text-sm font-medium ${textColor}`}>{log.event}</p>
      <p className="text-xs text-[#8E96BD] mt-0.5">{log.time}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function VaultPage() {
  const [decryptingId, setDecryptingId] = useState<string | null>(null);

  const handleDecrypt = (id: string) => {
    setDecryptingId(id);
    setTimeout(() => setDecryptingId(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4">
      {/* Header */}
      <header>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white flex items-center gap-3">
          <Lock className="w-10 h-10 text-[#D4AF37]" />
          Zafir Secure Vault
        </h1>
        <p className="text-sm text-[#8E96BD] mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left & center */}
        <div className="lg:col-span-2 space-y-6">

          {/* Secure Document Vault */}
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              Secure Document Vault
            </h2>
            <div className="space-y-3">
              {DOCS.map((doc) => (
                <div key={doc.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-white/[0.04] transition-all duration-200 border border-white/[0.06]"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: TIER_STYLE[doc.tier].bg, border: `1px solid ${TIER_STYLE[doc.tier].border}` }}>
                      <FileText className="w-5 h-5" style={{ color: TIER_STYLE[doc.tier].text }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-white truncate text-sm">{doc.name}</h4>
                        <span className="text-[#8E96BD] text-xs">(Encrypted)</span>
                        <TierBadge tier={doc.tier} />
                      </div>
                      <p className="text-xs text-[#8E96BD] mt-1 font-mono">
                        HASH: {doc.hash} · {doc.size} · Mis à jour il y a {doc.updatedAgo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-[#8E96BD] hover:text-white transition-colors" title="Prévisualiser">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-[#8E96BD] hover:text-white transition-colors" title="Télécharger">
                      <Download className="w-4 h-4" />
                    </button>
                    <GradientButton
                      variant={doc.tier === 'GOLD' ? 'secondary' : 'primary'}
                      className="text-xs px-4 py-2"
                      isLoading={decryptingId === doc.id}
                      onClick={() => handleDecrypt(doc.id)}
                    >
                      Decrypt
                    </GradientButton>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination dots */}
            <div className="flex justify-center gap-1.5 mt-6">
              <div className="w-6 h-1.5 rounded-full bg-[#D4AF37]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          </GlassCard>

          {/* Decryption Queue */}
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Decryption Queue &amp; Activity
            </h2>
            <div className="space-y-4">
              {QUEUE.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: TIER_STYLE[item.tier].bg }}>
                      <Lock className="w-4 h-4" style={{ color: TIER_STYLE[item.tier].text }} />
                    </div>
                    <span className="font-medium text-sm text-white flex-1 truncate">{item.name}</span>
                    <span className={`text-sm font-semibold ${item.status === 'decrypting' ? 'text-blue-400' : 'text-[#D4AF37]'}`}>
                      {item.label}
                    </span>
                  </div>
                  <ProgressBar
                    value={item.progress}
                    color={item.status === 'decrypting' ? '#3b82f6' : '#f59e0b'}
                  />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex-1">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Security Status &amp; Access Log
            </h2>

            {/* World map */}
            <WorldMap />

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p className="text-2xl font-semibold text-emerald-400">3</p>
                <p className="text-[10px] text-[#8E96BD] mt-0.5">Actifs</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <p className="text-2xl font-semibold text-red-400">1</p>
                <p className="text-[10px] text-[#8E96BD] mt-0.5">Bloqué</p>
              </div>
            </div>

            {/* Access log */}
            <div className="space-y-3 mt-5">
              {ACCESS_LOG.map((log) => (
                <AccessLogItem key={log.id} log={log} />
              ))}
            </div>
          </GlassCard>

          {/* Quick actions */}
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Actions rapides</h3>
            <div className="space-y-2">
              <GradientButton variant="ghost" leftIcon={<Lock className="w-4 h-4" />} className="w-full text-left justify-start text-sm">
                Déposer un document
              </GradientButton>
              <GradientButton variant="ghost" leftIcon={<MapPin className="w-4 h-4" />} className="w-full text-left justify-start text-sm">
                Voir les accès IP
              </GradientButton>
              <GradientButton variant="ghost" leftIcon={<Clock className="w-4 h-4" />} className="w-full text-left justify-start text-sm">
                Audit complet
              </GradientButton>
            </div>
          </GlassCard>

          {/* Alert */}
          <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Alerte sécurité</p>
              <p className="text-xs text-[#8E96BD] mt-1">Tentative de connexion depuis une IP inconnue détectée et bloquée.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
