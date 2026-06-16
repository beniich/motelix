/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Sparkles, HelpCircle, ArrowRight, Play, Eye, Layers, Wifi, Star, Plane, Wine, Radar, Bot } from 'lucide-react';

interface OverviewLandingProps {
  onNavigate: (tab: string) => void;
}

export default function OverviewLanding({ onNavigate }: OverviewLandingProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    company: '',
    email: '',
    propertyType: 'Luxury Resort',
    portfolioSize: '1-5 Properties',
    cyberSecurity: true,
    operationalEfficiency: true,
    guestExperience: false,
    marketIntelligence: false
  });

  const nodes = [
    { id: 'n1', title: 'Booking engine', desc: 'Secure real-time occupancy synchronization with luxury calendars.', x: 65, y: 32, label: 'Room bookings' },
    { id: 'n2', title: 'Concierge services', desc: 'Hyper-personalized guest requirements & VIP arrangements.', x: 55, y: 48, label: 'Concierge terminal' },
    { id: 'n3', title: 'Climate & IoT control', desc: 'Automatic pre-cooling / ambiance lighting for high-end suites.', x: 74, y: 55, label: 'Smart room controller' },
    { id: 'n4', title: 'Valet integration', desc: 'Pre-charge battery and queue retrieval on customer checkout.', x: 50, y: 72, label: 'Valet system gateway' },
    { id: 'n5', title: 'Security shield', desc: 'Aurum Cryptographic Shield v5 guarding local data privacy.', x: 80, y: 68, label: 'Shield lock active' }
  ];

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSubmitted(false);
      setDemoForm({
        name: '',
        company: '',
        email: '',
        propertyType: 'Luxury Resort',
        portfolioSize: '1-5 Properties',
        cyberSecurity: true,
        operationalEfficiency: true,
        guestExperience: false,
        marketIntelligence: false
      });
    }, 2500);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Top Banner and Brand Pitch */}
      <div className="relative overflow-hidden rounded-3xl p-10 lg:p-14 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-royal-emerald/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Floating tech background elements */}
        <div className="absolute top-6 right-8 opacity-20 pointer-events-none font-mono text-[9px] text-indigo-400 space-y-1 leading-none text-right">
          <p>SYS_STATUS: CRYPTO_SAFE</p>
          <p>IP_VER: 10.45.2.x</p>
          <p>COMPLIANCE_LEVEL: TIER_4</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Introducing OPULENCE Platform v3.4
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              The Operating <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-200 to-luxury-gold">
                System for Elite
              </span>{' '}
              Hospitality
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
              Engineered for cyber-compliant luxury management, securing guest intelligence and driving operational excellence across every boutique division.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-royal-emerald to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              >
                Request Private Demo <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowVideoModal(true)}
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" /> Watch Operations Overview
              </button>
            </div>
          </div>

          {/* Right Wireframe Animation Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[420px] aspect-square rounded-2xl relative bg-slate-900/60 border border-slate-800/80 p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none"></div>

              {/* Wireframe Bed SVG Illustration */}
              <div className="w-full flex-1 flex items-center justify-center relative">
                <svg
                  className="w-full h-full max-h-[220px] stroke-indigo-500/35"
                  viewBox="0 0 200 150"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid base */}
                  <line x1="20" y1="120" x2="180" y2="120" strokeWidth="0.5" />
                  <line x1="40" y1="130" x2="160" y2="130" strokeWidth="0.5" strokeDasharray="2 2" />

                  {/* Bed silhouette */}
                  <rect x="50" y="80" width="100" height="40" rx="3" strokeWidth="1" stroke="rgba(99, 102, 241, 0.4)" />
                  <line x1="50" y1="95" x2="150" y2="95" strokeWidth="0.8" />
                  <rect x="60" y="65" width="35" height="15" rx="1" strokeWidth="0.8" />
                  <rect x="105" y="65" width="35" height="15" rx="1" strokeWidth="0.8" />

                  {/* Bed posts/side tables */}
                  <rect x="35" y="90" width="12" height="30" rx="1" strokeWidth="0.8" />
                  <rect x="153" y="90" width="12" height="30" rx="1" strokeWidth="0.8" />

                  {/* Connection cables/lights indicating cyber syncing */}
                  <path d="M 41 90 Q 70 50 95 65" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
                  <path d="M 159 90 Q 130 50 105 65" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
                </svg>

                {/* Hotspot triggers overlay */}
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="absolute cursor-pointer group"
                    style={{ top: `${node.y}%`, left: `${node.x}%` }}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                    onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                  >
                    {/* Glowing pulse ring */}
                    <div className="absolute -inset-2.5 rounded-full bg-indigo-500/20 group-hover:scale-125 transition-transform animate-ping"></div>
                    <div className="relative w-4 h-4 rounded-full bg-gradient-to-r from-blue-violet to-indigo-500 border border-white/85 shadow-lg flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>

                    {/* Action popover */}
                    {activeNode === node.id && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 p-3 rounded-lg bg-slate-950/95 border border-indigo-500/40 text-left shadow-2xl z-30 pointer-events-none">
                        <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Node Active</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{node.title}</p>
                        <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">{node.desc}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Status footer on widget */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">INTELLIGENT REPLICA</span>
                <span className="text-cyber-green flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse"></span> SYNCED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hospitality Solutions Grid (Bento style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigate('arrivals')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl"
        >
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-amber-505 font-bold">Luxe-OS Pro</div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-550 mb-6 group-hover:scale-110 transition-transform">
            <Radar className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">VIP Arrival corridor</h3>
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-4 text-xs">
            H.E. Al-Fayed Royal Delegation tracking. Live telemetry, corridor scanning laser arrays, active biometric matching, and suite temperature controls.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-500 font-bold group-hover:translate-x-1.5 transition-transform uppercase font-mono">
            Command Center &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('concierge')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl"
        >
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-emerald-400 font-bold">VVIP BRIEFING</div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#4de082] mb-6 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Concierge Briefing Center</h3>
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-4 text-xs">
            Lord Sebastian Thorne VVIP dossier assessment: live psychographic satisfied meters, task timelines, and Secure Comms streams.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#4de082] font-bold group-hover:translate-x-1.5 transition-transform uppercase">
            Access Dashboard <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('sommelier')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl"
        >
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-indigo-400 font-bold">PRESTIGE V5</div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
            <Wine className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aethelred Cellars</h3>
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-4 text-xs">
            Architectural schematic map, climate sensors, rare vintage blockchain seals & live table pairing.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-bold group-hover:translate-x-1.5 transition-transform uppercase">
            Access Dashboard <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('room-service')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 hover:border-indigo-505/40 transition-all shadow-xl"
        >
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-indigo-500 font-bold">MODULE V1</div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">IoT Mini-Bar Monitor</h3>
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-4 text-xs">
            Continuous pressure plate sensor monitoring, real-time volume estimation, and automated butler restocking routing.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-bold group-hover:translate-x-1.5 transition-transform uppercase">
            Access Dashboard <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('valet')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl"
        >
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-royal-emerald font-bold">MODULE V2</div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-royal-emerald mb-6 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Automated Valet Systems</h3>
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-4 text-xs">
            3D multi-level parking telemetry, LPR plate-scanning feeds, and smart guest retrieval queuing.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-royal-emerald font-bold group-hover:translate-x-1.5 transition-transform uppercase">
            Access Dashboard <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('retail')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl"
        >
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-luxury-gold font-bold">MODULE V3</div>
          <div className="w-12 h-12 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold mb-6 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Luxury Boutique Hub</h3>
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-4 text-xs">
            Live sales department thermal maps, premium item stock trackers, and replenishment logistics.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-luxury-gold font-bold group-hover:translate-x-1.5 transition-transform uppercase">
            Access Dashboard <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('drones')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl"
        >
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-indigo-400 font-bold">MODULE V4</div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
            <Plane className="w-6 h-6 rotate-45" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Drone command</h3>
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-4 text-xs">
            Tactical aerial mapping, vector tracking overlays, active drone telemetry streams, and VIP suite deliveries.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-bold group-hover:translate-x-1.5 transition-transform uppercase font-mono">
            Access Dashboard &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('omni-stream')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 hover:border-[#6dfe9c]/40 transition-all shadow-xl"
        >
          <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-[#6dfe9c] font-bold">LUXE-INTEL V4</div>
          <div className="w-12 h-12 rounded-xl bg-[#6dfe9c]/10 flex items-center justify-center text-[#6dfe9c] mb-6 group-hover:scale-110 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Omni-Stream Robotics</h3>
          <p className="text-slate-400 text-sm font-light leading-relaxed mb-4 text-xs">
            Micro-axis arm kinematics calibration, volumetric LiDAR plots, active load cell sensors and autonomous service dispatch terminals.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#6dfe9c] font-bold group-hover:translate-x-1.5 transition-transform uppercase font-mono">
            Access Dashboard &rarr;
          </span>
        </div>
      </div>

      {/* Private Demo Request Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl shadow-3xl relative overflow-hidden my-8">
            {/* Glowing blur orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:text-white text-xl cursor-pointer z-10"
              aria-label="Close Modal"
            >
              &times;
            </button>

            {/* Aurum Intelligence top branding banner */}
            <div className="bg-slate-950 border-b border-slate-850 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center font-serif text-xs font-bold text-white leading-none">A</div>
                <span className="text-[11px] tracking-[0.2em] font-bold text-slate-900 dark:text-white uppercase font-serif">AURUM INTELLIGENCE</span>
              </div>
              <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider">SECURE DIGITAL GATEWAY</span>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-left">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                  Schedule a Private Intelligence Demo
                </h2>
                <p className="text-indigo-300 font-mono text-[11px] font-bold uppercase tracking-wide">
                  Unlock Executive Insights for Elite Property Management
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Gain exclusive access to our Cyber-Compliance & Industrial Minimalist SaaS platform. Optimize operations, enhance guest security, and stay ahead with bespoke data analytics.
                </p>
              </div>

              {demoSubmitted ? (
                <div className="py-16 text-center space-y-5 select-none font-mono">
                  <div className="w-16 h-16 bg-emerald-500/10 text-cyber-green rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30 border border-emerald-500/20">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">Secure Proposal Locked</p>
                    <p className="text-[11px] text-slate-445 uppercase mt-2">Connecting with elite hospitality liaisons...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-5 font-sans">
                  
                  {/* Grid for core details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-2">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={demoForm.name}
                        onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-850 text-white focus:border-indigo-500 text-xs outline-none font-mono transition-shadow focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                        placeholder="E.g. Lord Alexander"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-2">Company / Portfolio</label>
                      <input
                        type="text"
                        required
                        value={demoForm.company}
                        onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-850 text-white focus:border-indigo-500 text-xs outline-none font-mono transition-shadow focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                        placeholder="E.g. Ritz Residence"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-2">Business Email</label>
                      <input
                        type="email"
                        required
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-850 text-white focus:border-indigo-500 text-xs outline-none font-mono transition-shadow focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                        placeholder="alexander@residence.luxury"
                      />
                    </div>
                  </div>

                  {/* Dropdowns row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-2">Property Type</label>
                      <select
                        value={demoForm.propertyType}
                        onChange={(e) => setDemoForm({ ...demoForm, propertyType: e.target.value })}
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-850 text-white focus:border-indigo-500 text-xs outline-none font-mono transition-shadow focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Luxury Resort">Luxury Resort</option>
                        <option value="Boutique Hotel">Boutique Hotel</option>
                        <option value="Urban High-Rise">Urban High-Rise</option>
                        <option value="Other">Other Private Estate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-2">Portfolio Size</label>
                      <select
                        value={demoForm.portfolioSize}
                        onChange={(e) => setDemoForm({ ...demoForm, portfolioSize: e.target.value })}
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-850 text-white focus:border-indigo-500 text-xs outline-none font-mono transition-shadow focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="1-5 Properties">1-5 Properties</option>
                        <option value="6-20 Properties">6-20 Properties</option>
                        <option value="21-50 Properties">21-50 Properties</option>
                        <option value="50+ Properties">50+ Premium Keys</option>
                      </select>
                    </div>
                  </div>

                  {/* Checkboxes grid layout */}
                  <div className="space-y-3 pt-1 text-left">
                    <label className="block text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Desired Intelligence Modules</label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 select-none">
                      <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-850 hover:border-indigo-550/20 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={demoForm.cyberSecurity}
                          onChange={(e) => setDemoForm({ ...demoForm, cyberSecurity: e.target.checked })}
                          className="w-4 h-4 bg-slate-900 border-slate-800 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-200">Cyber-Security Protocol</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-850 hover:border-indigo-550/20 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={demoForm.operationalEfficiency}
                          onChange={(e) => setDemoForm({ ...demoForm, operationalEfficiency: e.target.checked })}
                          className="w-4 h-4 bg-slate-900 border-slate-800 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-200">Operational Efficiency Metric</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-850 hover:border-indigo-550/20 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={demoForm.guestExperience}
                          onChange={(e) => setDemoForm({ ...demoForm, guestExperience: e.target.checked })}
                          className="w-4 h-4 bg-slate-900 border-slate-800 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-200">Guest Experience Management</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-850 hover:border-indigo-550/20 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={demoForm.marketIntelligence}
                          onChange={(e) => setDemoForm({ ...demoForm, marketIntelligence: e.target.checked })}
                          className="w-4 h-4 bg-slate-900 border-slate-800 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-200">Executive Market Intelligence</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 bg-indigo-600 hover:bg-indigo-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all font-mono select-none shadow hover:shadow-indigo-950/30 cursor-pointer"
                  >
                    Request Exclusive Access &rarr;
                  </button>
                </form>
              )}
            </div>
            
            {/* Fine print at bottom */}
            <div className="bg-slate-950/80 border-t border-slate-850 px-8 py-3.5 text-[10px] text-center font-mono text-slate-500 select-none uppercase">
              By submitting you request professional liaison routing. Protected by TLS-12.
            </div>
          </div>
        </div>
      )}

      {/* Intelligence Video Modal Simulation */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-serif text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-400" /> Executive Ambiance Simulator
            </h2>
            <p className="text-xs text-slate-400 mb-4">Operations flow for luxury resorts.</p>

            <div className="aspect-video bg-black rounded-lg relative overflow-hidden flex flex-col items-center justify-center border border-slate-800">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/20 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>LHO_OPERATIONS_SIM_V3</span>
                  <span className="text-red-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> RECORDING LIVE
                  </span>
                </div>

                {/* Animated waves or meters */}
                <div className="flex flex-col items-center space-y-2">
                  <Play className="w-12 h-12 text-slate-900 dark:text-white/40 group-hover:text-slate-900 dark:text-white transition-opacity shrink-0 animate-pulse" />
                  <span className="text-xs text-slate-500 font-mono select-none">BUFFERING SECURITY MATRIX...</span>
                  <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-indigo-500 animate-infinite-loading"></div>
                  </div>
                </div>

                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>RESOL: 4K HIGH DEPTH</span>
                  <span>ENCR: AES-512 ISO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
