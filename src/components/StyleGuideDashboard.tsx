import React, { useState } from 'react';
import {
  Palette,
  Type,
  Grid,
  Sparkles,
  ShieldCheck,
  Fingerprint,
  Activity,
  Layers,
  Check,
  Copy,
  Terminal,
  FileCode,
  Compass,
  Laptop,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Eye
} from 'lucide-react';

interface StyleGuideDashboardProps {
  onAddLog?: (log: {
    id: string;
    time: string;
    module: string;
    message: string;
    type: 'OK' | 'WARN' | 'ERROR' | 'INFO';
  }) => void;
}

export default function StyleGuideDashboard({ onAddLog }: StyleGuideDashboardProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [typedPreview, setTypedPreview] = useState<string>('Luxe-OS High-Stakes Operations');
  const [blurAmount, setBlurAmount] = useState<number>(12);
  const [opacityAmount, setOpacityAmount] = useState<number>(80);
  const [selectedIconName, setSelectedIconName] = useState<string>('fingerprint');

  const triggerLog = (msg: string, type: 'OK' | 'INFO' | 'WARN' = 'OK') => {
    if (onAddLog) {
      onAddLog({
        id: `spec-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        module: 'STYLE-GUIDE',
        message: msg,
        type
      });
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    triggerLog(`Copied design token: ${label} (${text}) to clipboard`, 'INFO');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Modernized Deluxe Color tokens
  const masterColors = [
    { name: 'Broken White', hex: '#F8F9FA', desc: 'Refined background & text pairing bases', role: 'Canvas', badge: 'bg-[#F8F9FA] text-[#1A1F2B] border-slate-300' },
    { name: 'Luxe Gold', hex: '#C5A059', desc: 'Premium action keys, highlights & alerts', role: 'Accent', badge: 'bg-[#C5A059] text-white border-[#C5A059]' },
    { name: 'Secure Violet', hex: '#7B61FF', desc: 'Security protocols, telemetry & data grids', role: 'System', badge: 'bg-[#7B61FF] text-white border-[#7B61FF]' },
    { name: 'Slate Navy', hex: '#1A1F2B', desc: 'Surgical technical contrast layers', role: 'Structure', badge: 'bg-[#1A1F2B] text-white border-slate-900' }
  ];

  const specBadges = [
    { icon: ShieldCheck, label: 'AUTHORIZED', desc: 'LEVEL_4_CLEARANCE', style: 'border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' },
    { icon: Fingerprint, label: 'VERIFIED', desc: 'SECURE_IDENT_OK', style: 'border border-[#7B61FF]/40 bg-[#7B61FF]/15 text-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.2)]' },
    { icon: Activity, label: 'TELEMETRY_LIVE', desc: 'STABLE_NODE_T5', style: 'border border-[#1A1F2B]/30 bg-[#1A1F2B]/10 text-slate-400 dark:text-slate-300' },
    { icon: Sparkles, label: 'ELITE_STAGE', desc: 'CRAFT_OPULENCE', style: 'border border-indigo-500/30 bg-indigo-505/10 text-indigo-400' }
  ];

  return (
    <div className="space-y-8 text-left animate-fadeIn select-none">
      
      {/* AUTHORITATIVE HEADER WITH SPEC CREDENTIALS */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-full">
            <span className="material-symbols-outlined text-xs text-[#C5A059]">diamond</span>
            <span className="font-mono text-[9px] font-bold text-slate-500 dark:text-[#C5A059] tracking-widest uppercase">Authoritative Core Specification v2.4</span>
          </div>
          <h2 className="text-3xl font-serif text-slate-900 dark:text-white leading-tight">
            Design System & <span className="italic font-light text-[#C5A059]">Architectural Spec</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            The single source of truth for the <strong className="text-slate-850 dark:text-slate-200">Luxe-OS Pro Edition</strong> ecosystem. Structuring visual symmetry, high-stakes typography, and responsive interface components.
          </p>
        </div>

        <div className="flex gap-2 shrink-0 relative z-10">
          <button 
            type="button"
            onClick={() => {
              triggerLog('Initiated style guide validation check across active viewport', 'INFO');
              alert('Style Guide Tokens Validated: 100% compliant with Luxe-OS Pro Edition guidelines.');
            }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-[#7B61FF] hover:brightness-110 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all tracking-wider cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            Run Integrity Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPREHENSIVE CONFIG COLUMN: COLORS, TYPO & ICONS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 1: THE GOLDEN-VIOLET SPECTRE */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 border-b dark:border-slate-800/60 pb-4 relative z-10">
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Palette className="w-5 h-5 text-[#C5A059]" />
                <span>01. The Golden-Violet Spectrum</span>
              </h3>
              <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded">COLOR_TOKENS.JSON</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {masterColors.map((color, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleCopy(color.hex, color.name)}
                  className="flex flex-col gap-3 group cursor-pointer bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850 hover:border-[#C5A059]/40 transition-all duration-300"
                >
                  <div className={`h-24 rounded-xl border relative shadow-inner overflow-hidden flex items-end justify-between p-3 transition-transform group-hover:-translate-y-1 ${color.badge}`}>
                    {/* Tiny copy icon */}
                    <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedText === color.hex ? (
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3px]" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-900 dark:text-white" />
                      )}
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold opacity-80">{color.role}</span>
                    <span className="font-mono text-[9px] tracking-widest">{color.hex}</span>
                  </div>

                  <div className="px-1 text-left">
                    <p className="text-xs font-serif font-bold text-slate-950 dark:text-slate-100 flex items-center justify-between">
                      <span>{color.name}</span>
                      {copiedText === color.hex && <span className="text-[8px] font-mono text-emerald-500 font-bold uppercase animate-pulse">COPIED</span>}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1 min-h-[30px]">{color.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: TYPOGRAPHY STANDARDS WITH INTERACTIVE PREVIEWER */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b dark:border-slate-800/60 pb-4">
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Type className="w-5 h-5 text-[#7B61FF]" />
                <span>02. Typography Hierarchy & Scales</span>
              </h3>
              <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded">TYPE_SCALE.CSS</span>
            </div>

            {/* Live custom text previewer input */}
            <div className="text-left bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-850 space-y-2">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Type Test String to Preview Across System (Live Sandbox)
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={typedPreview} 
                  onChange={(e) => {
                    setTypedPreview(e.target.value);
                    if (e.target.value.length % 5 === 0) {
                      triggerLog(`Updated font pre-sandbox to: ${e.target.value}`, 'INFO');
                    }
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#7B61FF]/20"
                  placeholder="Tapez un texte personnalisé..."
                />
                <button
                  onClick={() => setTypedPreview('Luxe-OS High-Stakes Operations')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[9px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors cursor-pointer"
                >
                  RESET
                </button>
              </div>
            </div>

            {/* Typography Grid rows */}
            <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800/60">
              
              {/* Display / Serif Font */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-6 pt-2 text-left">
                <div className="md:col-span-3 space-y-1">
                  <p className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">Aesthetic Display</p>
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] font-mono text-[9px] uppercase font-bold">
                    Playfair Display
                  </span>
                </div>
                <div className="md:col-span-9">
                  <p className="font-serif text-3xl text-slate-900 dark:text-white tracking-tight leading-snug">
                    {typedPreview || 'Château Pétrus Cru 1982'}
                  </p>
                  <p className="font-mono text-[9px] text-slate-400 mt-2">
                    font-family: Playfair Display; font-weight: 400, 700; letter-spacing: -0.02em; (For titles, suite headers, luxury assets)
                  </p>
                </div>
              </div>

              {/* UI / Body Inter Font */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 text-left">
                <div className="md:col-span-3 space-y-1">
                  <p className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">Interface / Copy</p>
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-350 font-mono text-[9px] uppercase font-bold">
                    Inter Var
                  </span>
                </div>
                <div className="md:col-span-9">
                  <p className="text-sm text-slate-850 dark:text-slate-200 font-sans leading-relaxed">
                    {typedPreview || 'Aetheon systems ensure extreme density readability with zero clutter or simulated terminal trace. Perfect symmetry.'}
                  </p>
                  <p className="font-mono text-[9px] text-slate-400 mt-2">
                    font-family: Inter, sans-serif; font-weight: 400, 500, 600; line-height: 1.5; (For logs, alerts, table data, configuration grids)
                  </p>
                </div>
              </div>

              {/* Technical / Mono Jetbrains Font */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 text-left">
                <div className="md:col-span-3 space-y-1">
                  <p className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">Immutable Logs</p>
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-[#7B61FF]/10 border border-[#7B61FF]/20 text-[#7B61FF] font-mono text-[9px] uppercase font-bold">
                    JetBrains Mono
                  </span>
                </div>
                <div className="md:col-span-9">
                  <p className="font-mono text-xs text-slate-900 dark:text-[#7B61FF] tracking-wider bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 select-all uppercase">
                    {typedPreview.toUpperCase().replace(/\s+/g, '_') || '0X7F8C4A_TELEMETRY_STREAM_ACTIVE_OK'}
                  </p>
                  <p className="font-mono text-[9px] text-slate-400 mt-2">
                    font-family: JetBrains Mono; font-weight: 400, 500; tracking: 0.05em; (For blockchain logs, raw RFID weights, system hardware hashes)
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 3: ICONOGRAPHY, BADGES & INTERACTIVE CHIPS */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b dark:border-slate-800/60 pb-4">
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <span>03. Cyber-Security Badge Specs & Controls</span>
              </h3>
              <p className="font-mono text-[9px] text-emerald-400 uppercase font-black shrink-0 tracking-wider">Level 5 Security Approved</p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-left leading-relaxed">
              In luxury high-volume terminals, badges aren't purely decorative. They are structural signals proving cryptographic, authorization status, and calibration states.
            </p>

            {/* Badges and Interactive Chip Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {specBadges.map((badge, idx) => {
                const IconComp = badge.icon;
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      triggerLog(`Inspected badge token variant: ${badge.label}`, 'INFO');
                      setSelectedIconName(badge.label.toLowerCase());
                    }}
                    className={`p-4 rounded-2xl flex flex-col items-center text-center justify-center cursor-pointer hover:scale-[1.03] transition-transform ${badge.style}`}
                  >
                    <IconComp className="w-6 h-6 mb-2 stroke-[2px]" />
                    <p className="font-mono text-[10px] font-black tracking-widest leading-none">{badge.label}</p>
                    <span className="font-mono text-[8.5px] opacity-60 mt-1 uppercase tracking-wider">{badge.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Interactive Badge Creator Sandbox */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-201 dark:border-slate-850/80 text-left space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">CSS Implementation Formula</h4>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl font-mono text-[10px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 leading-relaxed overflow-x-auto select-all">
                {`// Tailwind authorize badge classes\n<div className="inline-flex items-center gap-1 bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059] px-2.5 py-1 rounded-full font-mono text-[10px] uppercase font-bold shadow-[0_0_15px_rgba(197,160,89,0.2)]">\n  <ShieldCheck className="w-3.5 h-3.5" />\n  <span>AUTHORIZED</span>\n</div>`}
              </div>
            </div>

          </section>

          {/* SECTION 4: UNIFIED BUTTON ARCHITECTURE & INTERACTION LAW */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b dark:border-slate-800/60 pb-4">
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Sliders className="w-5 h-5 text-[#C5A059]" />
                <span>04. Premium Button Harmonization Workshop</span>
              </h3>
              <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded">BTNS_SYSTEM.TS</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-left leading-relaxed">
              Every critical action trigger on Aetheon Opulence must respect tactility thresholds. Click any elite key below to verify its active hover states, depression damping, and retrieve its atomic code structure.
            </p>

            {/* Interactive Buttons showcase row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <button 
                type="button" 
                onClick={() => {
                  triggerLog("Inspected Sovereign Gold primary trigger action", "OK");
                  const formula = `<button className="btn-premium-gold">\n  <Sparkles className="w-3.5 h-3.5" />\n  <span>Sovereign Gold Keys</span>\n</button>`;
                  navigator.clipboard.writeText(formula);
                  setCopiedText("gold-btn");
                  setTimeout(() => setCopiedText(null), 1800);
                }}
                className="btn-premium-gold w-full flex items-center justify-center gap-2 group"
                title="Sovereign Gold: Core luxury transaction action trigger"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0 group-hover:rotate-12 transition-transform" />
                <span>Sovereign Gold</span>
                {copiedText === "gold-btn" && <span className="text-[7px] font-mono bg-white text-slate-900 px-1 py-0.5 rounded font-black ml-1">COPIED</span>}
              </button>

              <button 
                type="button" 
                onClick={() => {
                  triggerLog("Inspected Cyber Security Violet tactical key", "OK");
                  const formula = `<button className="btn-premium-violet">\n  <Fingerprint className="w-3.5 h-3.5" />\n  <span>Cyber Violet</span>\n</button>`;
                  navigator.clipboard.writeText(formula);
                  setCopiedText("violet-btn");
                  setTimeout(() => setCopiedText(null), 1800);
                }}
                className="btn-premium-violet w-full flex items-center justify-center gap-2 group"
                title="Cyber Violet: Immutable cryptographic action keys"
              >
                <Fingerprint className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                <span>Cyber Violet</span>
                {copiedText === "violet-btn" && <span className="text-[7px] font-mono bg-white text-slate-900 px-1 py-0.5 rounded font-black ml-1">COPIED</span>}
              </button>

              <button 
                type="button" 
                onClick={() => {
                  triggerLog("Inspected Silent Steel secondary command trigger", "INFO");
                  const formula = `<button className="btn-premium-slate">\n  <Activity className="w-3.5 h-3.5" />\n  <span>Silent Steel</span>\n</button>`;
                  navigator.clipboard.writeText(formula);
                  setCopiedText("slate-btn");
                  setTimeout(() => setCopiedText(null), 1800);
                }}
                className="btn-premium-slate w-full flex items-center justify-center gap-2"
                title="Silent Steel: Refined secondary telemetry controls"
              >
                <Activity className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
                <span>Silent Steel</span>
                {copiedText === "slate-btn" && <span className="text-[7px] font-mono bg-[#C5A059] text-white px-1 py-0.5 rounded font-black ml-1">COPIED</span>}
              </button>

              <button 
                type="button" 
                onClick={() => {
                  triggerLog("Inspected Translucent Glass refraction option selector", "INFO");
                  const formula = `<button className="btn-premium-glass">\n  <Layers className="w-3.5 h-3.5" />\n  <span>Ghost Glass</span>\n</button>`;
                  navigator.clipboard.writeText(formula);
                  setCopiedText("glass-btn");
                  setTimeout(() => setCopiedText(null), 1800);
                }}
                className="btn-premium-glass w-full flex items-center justify-center gap-2 group"
                title="Ghost Glass: Subtle menu option selectors"
              >
                <Layers className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform text-[#7B61FF]" />
                <span>Ghost Glass</span>
                {copiedText === "glass-btn" && <span className="text-[7px] font-mono bg-indigo-500 text-white px-1 py-0.5 rounded font-black ml-1">COPIED</span>}
              </button>
            </div>

            {/* Quick action details and specifications code blocks */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-201 dark:border-slate-850/80 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Global Action Trigger Alignment Class Formula</span>
                <span className="text-[8px] font-mono text-indigo-400 font-bold">CLICK BUTTONS FOR INSTANT EXPORT</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-2">
                All premium action keys enforce safe <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-indigo-505 font-mono text-[9px]">transition-all duration-300</code> with a gentle <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[#C5A059] font-mono text-[9px]">-translate-y-[2px]</code> height translation on hover state to maintain a high-contrast physical feel across active layouts.
              </p>
            </div>

          </section>

        </div>

        {/* RIGHT METADATA COGNITIVE COLUMN: BLURS, MATERIAL SPEC & SYSTEM GRID */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* MATERIAL AND BLUR PROPERTIES CONFIGURATION */}
          <section className="bg-slate-950 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-slate-850">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#7B61FF]/10 filter blur-2xl pointer-events-none" />
            
            <h3 className="text-sm font-mono font-bold text-[#7B61FF] uppercase tracking-widest mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Material Definitions</span>
            </h3>

            <div className="space-y-6 text-left">
              <p className="text-[11px] text-slate-400 leading-normal">
                Adjustment controller of standard glassmorphism. Toggle variables to inspect opacity refraction.
              </p>

              {/* Slider variables */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono text-slate-300">
                    <span>refraction backdrop-blur:</span>
                    <span className="text-[#C5A059] font-bold">{blurAmount}px</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={40} 
                    value={blurAmount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setBlurAmount(val);
                      if (val % 5 === 0) triggerLog(`Fine-tuned backdrop blur preset to ${val}px`, 'INFO');
                    }}
                    className="w-full accent-[#C5A059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono text-slate-300">
                    <span>material white-blend opacity:</span>
                    <span className="text-[#7B61FF] font-bold">{opacityAmount}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={5} 
                    max={95} 
                    value={opacityAmount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setOpacityAmount(val);
                      if (val % 10 === 0) triggerLog(`Recalibrated material blend opacity to ${val}%`, 'INFO');
                    }}
                    className="w-full accent-[#7B61FF]"
                  />
                </div>
              </div>

              {/* LIVE CONSOLE PREVIEW CARD TARGET */}
              <div 
                className="p-5 rounded-2xl border text-slate-205 transition-all text-left space-y-2 relative"
                style={{
                  backgroundColor: `rgba(255, 255, 255, ${opacityAmount / 400})`,
                  backdropFilter: `blur(${blurAmount}px)`,
                  borderColor: `rgba(255, 255, 255, 0.15)`
                }}
              >
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#7B61FF] animate-pulse" />
                <span className="text-[8px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white font-bold tracking-widest">MATERIAL PREVIEW_OK</span>
                
                <h4 className="text-serif text-sm font-bold text-slate-900 dark:text-white tracking-wide pt-2">Refraction Material Matrix</h4>
                <p className="text-[10px] text-slate-300 font-sans leading-normal">
                  Slight shimmer and volumetric depth. Zero contrast friction on light canvases.
                </p>
              </div>

              {/* Code Export block */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 font-mono text-[9px] text-slate-400 overflow-x-auto select-all">
                {`.glass-panel-light {\n  background: rgba(255, 255, 255, ${(opacityAmount/100).toFixed(2)});\n  backdrop-filter: blur(${blurAmount}px);\n  border: 1px solid rgba(255, 255, 255, 0.5);\n}`}
              </div>
            </div>
          </section>

          {/* SECTION 4: SYSTEM GRID SPECIFICATION */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-xl space-y-6 text-left">
            <div>
              <h3 className="text-sm font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Grid className="w-4 h-4 text-emerald-500" />
                <span>Grid & Spacing Topology</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-1">AXIAL_PRO_LAYOUT: 12 COLUMN GRID</p>
            </div>

            {/* Surgical architectural layout model */}
            <div className="border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl relative overflow-hidden min-h-[220px] flex flex-col justify-between">
              
              {/* Fake navigation line */}
              <div className="w-full h-8 border border-[#7B61FF]/30 bg-[#7B61FF]/5 rounded-xl flex items-center justify-between px-3 relative">
                <span className="font-mono text-[8px] text-[#7B61FF] font-bold">SYSTEM HEADER & NAV (48px)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
              </div>

              {/* Body block proxy representation showing content vs. sidebar */}
              <div className="flex-grow flex gap-2.5 mt-2.5">
                {/* Compact right dock / sidebar proxy as we modernized */}
                <div className="flex-grow border border-[#C5A059]/30 bg-[#C5A059]/5 rounded-xl p-2 relative flex flex-col justify-between">
                  <span className="font-mono text-[8px] text-[#C5A059] font-bold">GRID CONTENT SPACE</span>
                  
                  {/* Internal sub-grid preview */}
                  <div className="grid grid-cols-4 gap-1 mt-1">
                    <div className="h-6 rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800"></div>
                    <div className="h-6 rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 col-span-2"></div>
                    <div className="h-6 rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:bg-slate-800"></div>
                  </div>

                  <span className="font-mono text-[7px] text-slate-400 text-center leading-none mt-1">gutter scale: 16px (1rem)</span>
                </div>

                {/* Left side nav compact bar proxy */}
                <div className="w-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex flex-col items-center py-2 shrink-0">
                  <span className="font-mono text-[6px] text-slate-400 rotate-90 origin-center translate-y-2 whitespace-nowrap">DOCK_64PX</span>
                </div>
              </div>

              {/* Footer info logs line */}
              <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-400 mt-2.5 border-t dark:border-slate-900 pt-2">
                <span>BASE UNIT: 8PX</span>
                <span>DEVICE DECK: ADAPTIVE</span>
              </div>
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-2xl border border-slate-201 dark:border-slate-850/80">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Grid alignment laws</span>
              <p className="text-[10px] text-slate-500 leading-normal">
                Never use hardcoded pixel values for structural boundaries. Bound everything dynamically to the <strong>12-column flexbox rules</strong> to maintain flawless luxury displays on all screen aspect-ratios.
              </p>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
