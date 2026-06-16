'use client';

import { useState } from 'react';
import { Zap, Moon, Sun, Monitor, Thermometer } from 'lucide-react';

export default function EnvironmentalPage() {
  const [temp, setTemp] = useState(22);
  const [opacity, setOpacity] = useState(65);

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto px-4 py-4 text-slate-800 font-sans">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center relative">
          <svg viewBox="0 0 40 40" className="w-8 h-8">
            <text x="6" y="28" fontFamily="Outfit" fontWeight="700" fontSize="22" fill="#475569">Z</text>
            <text x="20" y="34" fontFamily="Outfit" fontWeight="500" fontSize="6" fill="#94a3b8">afir</text>
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 leading-none">Zafir Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Pôle Tech - Intelligent Building Control</p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <section className="lg:col-span-4 rounded-3xl p-6 lg:p-8 space-y-8" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.06)' }}>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Environmental Controls
          </h2>

          {/* Lighting */}
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-3">Lighting Scenes</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 text-sm font-semibold text-slate-800 relative overflow-hidden shadow-[0_4px_12px_rgba(217,119,6,0.2)]">
                <div className="absolute inset-0 bg-amber-100/30"></div>
                <span className="relative flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-500"/> Ambient</span>
              </button>
              <button className="px-4 py-2 rounded-xl bg-white/80 border border-white/70 text-sm font-medium text-slate-600 hover:text-slate-800">Bright</button>
              <button className="px-4 py-2 rounded-xl bg-white/80 border border-white/70 text-sm font-medium text-slate-600 hover:text-slate-800">Relax</button>
              <button className="px-3 py-2 rounded-xl bg-white/80 border border-white/70 text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-2">
                <Moon className="w-4 h-4"/> Night Mode
                <svg viewBox="0 0 40 24" className="w-10 h-6 rounded">
                  <defs>
                    <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e293b"/>
                      <stop offset="100%" stopColor="#0f172a"/>
                    </linearGradient>
                  </defs>
                  <rect width="40" height="24" fill="url(#nightSky)" rx="3"/>
                  <circle cx="10" cy="8" r="1" fill="#fef3c7"/>
                  <circle cx="30" cy="6" r="0.8" fill="#fef3c7"/>
                  <circle cx="22" cy="14" r="0.6" fill="#fef3c7"/>
                  <path d="M0,18 L40,18 L40,24 L0,24 Z" fill="#020617"/>
                </svg>
              </button>
            </div>
          </div>

          <hr className="border-slate-200/60"/>

          {/* Temperature */}
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-4 flex items-center gap-2">
              <Thermometer className="w-4 h-4" /> Room Temperatures
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative shrink-0">
                <svg viewBox="0 0 180 180" className="w-44 h-44 cursor-pointer" onClick={() => setTemp(t => t < 30 ? t + 1 : 16)}>
                  <defs>
                    <linearGradient id="dialGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffffff"/>
                      <stop offset="100%" stopColor="#e2e8f0"/>
                    </linearGradient>
                    <linearGradient id="dialProgress" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#67e8f9"/>
                      <stop offset="100%" stopColor="#22d3ee"/>
                    </linearGradient>
                  </defs>
                  <circle cx="90" cy="90" r="78" fill="url(#dialGrad)" stroke="#cbd5e1" strokeWidth="1"/>
                  <circle cx="90" cy="90" r="62" fill="none" stroke="#e2e8f0" strokeWidth="14"/>
                  {/* Progress arc roughly mapped to temp */}
                  <circle cx="90" cy="90" r="62" fill="none" stroke="url(#dialProgress)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${((temp-10)/20)*389} 389`} transform="rotate(-90 90 90)" style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.4))', transition: 'stroke-dasharray 0.3s ease' }} />
                  <circle cx="90" cy="90" r="46" fill="white" stroke="#f1f5f9" strokeWidth="1"/>
                  {/* Simple knob indicator positioned statically for layout simplicity */}
                  <circle cx="143" cy="56" r="9" fill="white" stroke="#cbd5e1" strokeWidth="1.5"/>
                  <circle cx="143" cy="56" r="4" fill="#67e8f9"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-4xl font-semibold text-slate-800">{temp}°C</span>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <p className="text-sm font-medium">Zone 1: Lobby</p>
                <div className="flex items-baseline gap-3">
                  <div>
                    <p className="text-2xl font-semibold leading-none">{temp}°C</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Current</p>
                  </div>
                  <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  <div>
                    <p className="text-2xl font-semibold text-slate-400 leading-none">23°C</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Target</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white/80 border border-white/70 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 w-full sm:w-auto transition-colors">Set Schedule</button>
              </div>
            </div>
          </div>

          <hr className="border-slate-200/60"/>

          {/* Smart glass */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-sm font-medium text-slate-800 flex items-center gap-2"><Monitor className="w-4 h-4"/> Smart Glass Opacity</h3>
              <span className="text-sm font-semibold">{opacity}% Opacity</span>
            </div>
            <input 
              type="range" min="0" max="100" value={opacity} 
              onChange={e => setOpacity(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(90deg, #67e8f9 0%, #cffafe ${opacity}%, #e2e8f0 ${opacity}%, #e2e8f0 100%)` }}
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-medium">
              <span>Transparent</span>
              <span>Opaque</span>
            </div>
          </div>
        </section>

        {/* Floor plan */}
        <section className="lg:col-span-8 rounded-3xl p-6 lg:p-8 flex flex-col min-h-[600px]" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.06)' }}>
          <h2 className="text-xl font-semibold mb-6">Floor Plan: Level 02 - Executive Suites</h2>
          <div className="flex-1 bg-white/80 border border-white/70 rounded-2xl p-4 flex items-center justify-center shadow-sm">
            
            <svg viewBox="0 0 800 500" className="w-full h-auto max-w-4xl">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
                <linearGradient id="roomFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff"/>
                  <stop offset="100%" stopColor="#f8fafc"/>
                </linearGradient>
                <linearGradient id="corridorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef3c7"/>
                  <stop offset="100%" stopColor="#fde68a"/>
                </linearGradient>
                <radialGradient id="cyanGlow">
                  <stop offset="0%" stopColor="#cffafe" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#cffafe" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="goldGlow">
                  <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
                </radialGradient>
                <style>{`
                  @keyframes pulse-cyan { 0%,100% { opacity: 0.5; r: 14; } 50% { opacity: 0.9; r: 18; } }
                  @keyframes pulse-gold { 0%,100% { opacity: 0.6; r: 14; } 50% { opacity: 1; r: 18; } }
                  .hotspot-cyan { animation: pulse-cyan 3s ease-in-out infinite; transform-origin: center; }
                  .hotspot-gold { animation: pulse-gold 3s ease-in-out infinite; transform-origin: center; }
                `}</style>
              </defs>
              <rect width="800" height="500" fill="url(#grid)" opacity="0.8" />
              
              {/* Outer Walls */}
              <rect x="50" y="50" width="700" height="400" fill="none" stroke="#94a3b8" strokeWidth="4" />
              
              {/* Corridor */}
              <rect x="250" y="50" width="100" height="400" fill="url(#corridorFill)" opacity="0.3" />
              
              {/* Rooms Left */}
              <rect x="50" y="50" width="200" height="130" fill="url(#roomFill)" stroke="#94a3b8" strokeWidth="2" />
              <rect x="50" y="180" width="200" height="140" fill="url(#roomFill)" stroke="#94a3b8" strokeWidth="2" />
              <rect x="50" y="320" width="200" height="130" fill="url(#roomFill)" stroke="#94a3b8" strokeWidth="2" />
              
              {/* Rooms Right */}
              <rect x="350" y="50" width="400" height="200" fill="url(#roomFill)" stroke="#94a3b8" strokeWidth="2" />
              <rect x="350" y="250" width="400" height="200" fill="url(#roomFill)" stroke="#94a3b8" strokeWidth="2" />

              {/* Text Labels */}
              <text x="150" y="120" fontSize="18" fontWeight="600" fill="#475569" textAnchor="middle">201</text>
              <text x="150" y="255" fontSize="18" fontWeight="600" fill="#475569" textAnchor="middle">202</text>
              <text x="150" y="390" fontSize="18" fontWeight="600" fill="#475569" textAnchor="middle">203</text>
              
              <text x="550" y="140" fontSize="22" fontWeight="700" fill="#334155" textAnchor="middle">Presidential Suite A</text>
              <text x="550" y="360" fontSize="22" fontWeight="700" fill="#334155" textAnchor="middle">Presidential Suite B</text>

              {/* Hotspots */}
              <g transform="translate(150, 100)">
                <circle cx="0" cy="0" r="30" fill="url(#cyanGlow)" />
                <circle cx="0" cy="0" r="14" fill="#06b6d4" className="hotspot-cyan" />
                <circle cx="0" cy="0" r="6" fill="white" />
              </g>

              <g transform="translate(550, 180)">
                <circle cx="0" cy="0" r="30" fill="url(#goldGlow)" />
                <circle cx="0" cy="0" r="14" fill="#d97706" className="hotspot-gold" />
                <circle cx="0" cy="0" r="6" fill="white" />
              </g>
              
              <g transform="translate(550, 400)">
                <circle cx="0" cy="0" r="30" fill="url(#cyanGlow)" />
                <circle cx="0" cy="0" r="14" fill="#06b6d4" className="hotspot-cyan" />
                <circle cx="0" cy="0" r="6" fill="white" />
              </g>

            </svg>
          </div>
        </section>
      </main>

      <style jsx global>{`
        body {
          background:
            radial-gradient(ellipse at 20% 30%, #fdfbfb 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, #f1f5f9 0%, transparent 60%),
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
      `}</style>
    </div>
  );
}
