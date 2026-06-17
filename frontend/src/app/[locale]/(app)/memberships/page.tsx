'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// ── Data ──────────────────────────────────────────────────────────────────────
const mrrData = [
  { v: 820 }, { v: 880 }, { v: 920 }, { v: 980 },
  { v: 1050 }, { v: 1100 }, { v: 1180 }, { v: 1250 },
];
const retentionData = [
  { v: 91 }, { v: 92 }, { v: 90 }, { v: 93 },
  { v: 92 }, { v: 94 }, { v: 93 }, { v: 94.5 },
];

const members = [
  {
    name: 'Mr. Arthur Dubois',
    tier: 'Platinum',
    joined: 'Nov 1, 2024',
    status: 'Normal',
    statusColor: 'text-emerald-600',
    badgeBg: 'linear-gradient(to right,#E5E4E2,#C0C0C0)',
    badgeText: '#1a365d',
    badgeBorder: 'rgba(255,255,255,0.6)',
  },
  {
    name: 'Ms. Elena Petrova',
    tier: 'Gold',
    joined: 'May 22, 2024',
    status: 'Gold',
    statusColor: 'text-amber-600',
    badgeBg: 'linear-gradient(to right,#D4AF37,#C59B27)',
    badgeText: '#713f12',
    badgeBorder: 'rgba(255,255,255,0.6)',
  },
  {
    name: 'Dr. Hassan Al-Fayed',
    tier: 'Black',
    joined: 'Jan 26, 2024',
    status: 'Normal',
    statusColor: 'text-emerald-600',
    badgeBg: 'linear-gradient(to right,#2C2C2C,#000)',
    badgeText: '#ffffff',
    badgeBorder: 'rgba(255,255,255,0.2)',
  },
];

// ── Metallic card backgrounds ─────────────────────────────────────────────────
function PlatinumCardBg() {
  return (
    <svg viewBox="0 0 500 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="platGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E5E4E2" />
          <stop offset="45%" stopColor="#C5C4C2" />
          <stop offset="50%" stopColor="#9e9d9a" />
          <stop offset="55%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
        <linearGradient id="brushed1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect width="500" height="300" fill="url(#platGrad)" />
      <g opacity="0.3">
        {[40, 80, 120, 180, 220, 260].map((y) => (
          <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#fff" strokeWidth="0.4" />
        ))}
      </g>
      <path d="M 0 200 L 500 0 L 500 80 L 0 280 Z" fill="url(#brushed1)" opacity="0.6" />
    </svg>
  );
}

function GoldCardBg() {
  return (
    <svg viewBox="0 0 500 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="45%" stopColor="#C29A2B" />
          <stop offset="50%" stopColor="#8a6510" />
          <stop offset="55%" stopColor="#E5E4E2" />
          <stop offset="100%" stopColor="#B0B0B0" />
        </linearGradient>
        <linearGradient id="brushed2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect width="500" height="300" fill="url(#goldGrad)" />
      <g opacity="0.3">
        {[40, 80, 120, 180, 220, 260].map((y) => (
          <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#fff" strokeWidth="0.4" />
        ))}
      </g>
      <path d="M 0 200 L 500 0 L 500 80 L 0 280 Z" fill="url(#brushed2)" opacity="0.6" />
    </svg>
  );
}

// ── Star icon ─────────────────────────────────────────────────────────────────
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MembershipsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-4">
      {/* Header */}
      <header>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
          Zafir Club Memberships
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR */}
        <div className="relative rounded-3xl shadow-2xl min-h-[280px] overflow-hidden border border-white/20">
          <PlatinumCardBg />
          {/* animated shimmer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 4s infinite linear',
              mixBlendMode: 'overlay',
            }}
          />
          <div className="relative p-8 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-base font-medium text-[#1a365d]/80 mb-4">Monthly Recurring Revenue (MRR)</h3>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-4xl md:text-5xl font-semibold text-[#1a365d]">$1,250,000</span>
                <span className="inline-flex items-center gap-1 bg-green-100/90 text-green-700 px-2.5 py-1 rounded-md text-sm font-semibold border border-green-200">
                  <ArrowUpIcon />
                  8.5%
                </span>
              </div>
            </div>
            <div className="h-24 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mrrData}>
                  <defs>
                    <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a365d" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1a365d" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#1a365d" strokeWidth={3} fill="url(#mrrGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Retention */}
        <div className="relative rounded-3xl shadow-2xl min-h-[280px] overflow-hidden border border-white/20">
          <GoldCardBg />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 4s infinite linear',
              mixBlendMode: 'overlay',
            }}
          />
          <div className="relative p-8 h-full flex flex-col justify-between text-right">
            <div className="ml-auto">
              <h3 className="text-base font-medium text-[#1a365d] mb-4">Member Retention Rate</h3>
              <div className="flex items-baseline justify-end gap-4 flex-wrap">
                <span className="text-4xl md:text-5xl font-semibold text-[#1a365d]">94.5%</span>
                <span className="inline-flex items-center gap-1 bg-green-100/90 text-green-700 px-2.5 py-1 rounded-md text-sm font-semibold border border-green-200">
                  <ArrowUpIcon />
                  1.2%
                </span>
              </div>
            </div>
            <div className="h-24 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionData}>
                  <defs>
                    <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a365d" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1a365d" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#1a365d" strokeWidth={3} fill="url(#retGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Member List */}
      <section
        className="rounded-3xl p-6 md:p-8"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
        }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Club Member List</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {members.map((m) => (
            <div
              key={m.name}
              className="p-4 rounded-2xl shadow-sm transition-transform hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 text-base">{m.name}</h4>
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow-inner"
                  style={{
                    background: m.badgeBg,
                    color: m.badgeText,
                    border: `1px solid ${m.badgeBorder}`,
                  }}
                >
                  <StarIcon className="w-3 h-3" />
                  {m.tier}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Joined {m.joined}</p>
              <p className="text-sm text-gray-600">
                Status: <span className={`font-medium ${m.statusColor}`}>{m.status}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
