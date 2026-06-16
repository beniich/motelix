'use client';

import { useState } from 'react';
import { Lock, FileText, AlertTriangle, Download, Eye, Clock, MapPin, Activity, ShieldCheck, Database, RefreshCw } from 'lucide-react';

// ── World Map SVG with animated connections ───────────────────────────────────
function WorldMap() {
  return (
    <div className="w-full h-32 mt-2">
      <svg viewBox="0 0 400 200" className="w-full h-full opacity-80">
        <defs>
          <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <style>{`
            .dash-flow { stroke-dasharray: 4 4; animation: dashFlow 1.5s linear infinite; }
            @keyframes dashFlow { to { stroke-dashoffset: -30; } }
          `}</style>
        </defs>
        <rect width="400" height="200" fill="url(#ocean)" rx="8" />
        {/* Continents */}
        <g fill="#cbd5e1" opacity="0.6">
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
        {/* Nodes */}
        <circle cx="80"  cy="80"  r="5" fill="#D4AF37" stroke="#fff" strokeWidth="2" />
        <circle cx="220" cy="55"  r="6" fill="#D4AF37" stroke="#fff" strokeWidth="2" />
        <circle cx="320" cy="80"  r="5" fill="#D4AF37" stroke="#fff" strokeWidth="2" />
        <circle cx="330" cy="150" r="4" fill="#D4AF37" stroke="#fff" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default function VaultPage() {
  const [decryptingId, setDecryptingId] = useState<string | null>(null);

  const handleDecrypt = (id: string) => {
    setDecryptingId(id);
    setTimeout(() => setDecryptingId(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-4 text-[#1a1a1a] font-sans">
      <header>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight flex items-center gap-3">
          Zafir Secure Vault
        </h1>
        <p className="text-[#5b6472] mt-1 text-sm">October 26, 2024, 10:30 AM</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content: Left Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Secure Document Vault */}
          <section className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Secure Document Vault</h2>
            <div className="space-y-4">
              
              {/* Doc 1 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-white border border-amber-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100/50">
                    <Lock className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-medium text-gray-800">Contract_Acquisition_2024.pdf <span className="text-gray-500 font-normal">(Encrypted)</span></span>
                </div>
                <div className="flex items-center gap-4">
                  <SparklesIcon />
                  <button onClick={() => handleDecrypt('1')} className="px-5 py-2 rounded-lg font-medium text-sm text-gray-800 shadow-sm border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-200 hover:from-white hover:to-gray-100 transition-all">
                    {decryptingId === '1' ? 'Decrypting...' : 'Decrypt'}
                  </button>
                </div>
              </div>

              {/* Doc 2 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-200/50">
                    <Lock className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-800">Merger_Agreement_X89.docx <span className="text-gray-500 font-normal">(Encrypted)</span></span>
                </div>
                <div className="flex items-center gap-4">
                  <LockIconGold />
                  <button onClick={() => handleDecrypt('2')} className="px-5 py-2 rounded-lg font-medium text-sm text-gray-800 shadow-sm border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-200 hover:from-white hover:to-gray-100 transition-all">
                    {decryptingId === '2' ? 'Decrypting...' : 'Decrypt'}
                  </button>
                </div>
              </div>

              {/* Doc 3 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-white border border-amber-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100/50">
                    <Lock className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-medium text-gray-800">Financial_Report_Q3_Secure.xlsx <span className="text-gray-500 font-normal">(Encrypted)</span></span>
                </div>
                <div className="flex items-center gap-4">
                  <RefreshCw className="w-5 h-5 text-gray-400" />
                  <button onClick={() => handleDecrypt('3')} className="px-5 py-2 rounded-lg font-medium text-sm text-amber-900 shadow-sm border border-amber-200 bg-gradient-to-b from-amber-100 to-amber-300 hover:from-amber-50 hover:to-amber-200 transition-all">
                    {decryptingId === '3' ? 'Decrypting...' : 'Decrypt'}
                  </button>
                </div>
              </div>

            </div>
            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-6">
              <div className="w-6 h-1.5 rounded-full bg-blue-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            </div>
          </section>

          {/* Decryption Queue & Activity */}
          <section className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Decryption Queue & Activity</h2>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-sm text-gray-800">Contract_Acquisition_2024.pdf (Encrypted)</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Decrypting... 45%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-sm text-gray-800">Financial_Report_Q3_Secure.xlsx</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Access Request: VIP Level 2 (Pending)</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[10%]" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 rounded-3xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Security Status & Access Log</h2>
          
          <WorldMap />

          <div className="space-y-4 mt-6">
            <div className="p-3 bg-white/70 rounded-xl border border-white/50 shadow-sm">
              <p className="text-sm text-gray-800">Access Granted: Mr. Chen</p>
              <p className="text-xs text-gray-500">(10:28 AM)</p>
            </div>
            
            <div className="p-3 bg-white/70 rounded-xl border border-white/50 shadow-sm">
              <p className="text-sm text-gray-800">File Decryption: Contract_A</p>
              <p className="text-xs text-gray-500">(10:25 AM)</p>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-white/50 shadow-sm">
              <p className="text-sm text-gray-800">Login Attempt: Unknown IP</p>
              <p className="text-xs text-gray-500">(Blocked)</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function LockIconGold() {
  return (
    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.25 8.25v-3a3.25 3.25 0 10-6.5 0v3h6.5z" clipRule="evenodd" />
    </svg>
  );
}
