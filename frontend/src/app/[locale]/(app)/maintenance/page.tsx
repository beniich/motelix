'use client';

import { Settings, Droplet, Snowflake, Zap, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

function WireframeSVG() {
  return (
    <div className="w-full h-[400px] flex items-center justify-center relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-white/50 border border-blue-100/50">
      <svg viewBox="0 0 800 400" className="w-full h-full opacity-60" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="pipe-blue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        {/* Background Grid */}
        <rect width="800" height="400" fill="url(#grid)" />
        
        <g stroke="#64748b" strokeWidth="1" fill="none">
          {/* Main structure isometric lines */}
          <path d="M 100,200 L 400,50 L 700,200 L 400,350 Z" />
          <path d="M 100,200 L 100,300 L 400,450 L 700,300 L 700,200" />
          <path d="M 400,350 L 400,450" />

          {/* Internal walls */}
          <path d="M 250,125 L 250,225 M 550,125 L 550,225 M 400,200 L 400,300" strokeDasharray="4 4" />
          <path d="M 250,125 L 400,200 L 550,125" strokeDasharray="4 4" />
        </g>

        {/* HVAC Ducts (thick lines) */}
        <g stroke="#3b82f6" strokeWidth="6" fill="none" opacity="0.7">
          <path d="M 150,180 L 300,105 L 350,130 L 450,80 L 600,155" />
          <path d="M 300,105 L 300,150 L 200,200" />
          <path d="M 450,80 L 450,120 L 550,170" />
        </g>

        {/* Plumbing lines (medium lines) */}
        <g stroke="#0ea5e9" strokeWidth="3" fill="none" opacity="0.6">
          <path d="M 180,250 L 350,165 L 350,220 L 450,270 L 450,180 L 650,80" />
        </g>

        {/* Electrical lines (thin dashed lines) */}
        <g stroke="#eab308" strokeWidth="1.5" fill="none" strokeDasharray="3 3">
          <path d="M 200,120 L 400,20 L 600,120" />
          <path d="M 400,20 L 400,150" />
        </g>

        {/* Mechanical Units */}
        <g stroke="#475569" strokeWidth="1.5" fill="#f8fafc">
          {/* Main HVAC Unit */}
          <rect x="330" y="110" width="40" height="30" transform="skewY(26.5)" />
          {/* Pump */}
          <circle cx="200" cy="220" r="15" />
          {/* Elevator shaft */}
          <rect x="500" y="180" width="40" height="100" />
          <line x1="520" y1="180" x2="520" y2="280" />
        </g>
      </svg>
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-4 text-[#1a1a1a] font-sans">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight flex items-center gap-3">
            Zafir 3D Maintenance
          </h1>
          <p className="text-[#5b6472] mt-1 text-sm">Zafir Command Center: Pôle Tech.</p>
        </div>
        <p className="text-sm font-medium text-gray-600">October 26, 2024, 10:30 AM</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Blueprint & Tasks) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* 3D Blueprint Container */}
          <section className="rounded-3xl p-4 md:p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
            <WireframeSVG />
          </section>

          {/* Industrial Task Lists */}
          <section className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Industrial Task Lists</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">HVAC Filter<br/>Replacement</p>
                    <p className="text-xs text-amber-600 font-medium mt-2">(Due: Today)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">Water Pump Check</p>
                    <p className="text-xs text-emerald-600 font-medium mt-2">(Completed)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">Elevator<br/>Maintenance</p>
                    <p className="text-xs text-blue-600 font-medium mt-2">(Scheduled: Tomorrow)</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Right Column (Status & Alerts) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* System Health Status */}
          <aside className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">System Health Status</h2>
            <div className="space-y-4">
              
              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-white/50 shadow-sm">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                  <Droplet className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-800 text-sm">Plumbing: Optimal</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-white/50 shadow-sm">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100">
                  <Snowflake className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-medium text-gray-800 text-sm">HVAC: 95% Efficiency</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-white/50 shadow-sm">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100">
                  <Zap className="w-4 h-4 text-amber-600" />
             </div>
                <span className="font-medium text-gray-800 text-sm">Electrical: Stable</span>
              </div>

            </div>
          </aside>

          {/* Critical Alerts */}
          <aside className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Critical Alerts</h2>
            <div className="space-y-3">
              
              <div className="p-3 bg-red-50/80 rounded-xl border border-red-100 shadow-sm flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span className="text-sm font-medium text-gray-800">Low Pressure in Water Zone 3</span>
              </div>

              <div className="p-3 bg-red-50/80 rounded-xl border border-red-100 shadow-sm flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span className="text-sm font-medium text-gray-800">HVAC Unit 4 Malfunction</span>
              </div>

            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
