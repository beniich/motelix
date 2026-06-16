'use client';

export default function MaintenancePage() {
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto px-4 py-4 text-slate-800 font-sans">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-semibold mb-1">Zafir 3D Maintenance</h1>
          <p className="text-lg text-slate-700">Zafir Command Center: Pôle Tech.</p>
        </div>
        <p className="font-mono text-sm text-slate-600 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-md border border-white/50 shadow-sm">October 26, 2024, 10:30 AM</p>
      </header>

      {/* 3D Wireframe Blueprint */}
      <section className="rounded-3xl overflow-hidden shadow-xl" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
        <div className="p-6 h-[420px] relative" style={{
          backgroundImage: 'linear-gradient(rgba(0,82,204,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,204,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundColor: 'rgba(248,250,252,0.6)'
        }}>
          <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="wireGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0052cc" stopOpacity="0.85"/>
                <stop offset="100%" stopColor="#0052cc" stopOpacity="0.55"/>
              </linearGradient>
            </defs>
            <g stroke="url(#wireGrad)" strokeWidth="1.2" fill="none">
              {/* Outer building box - floor & roof */}
              <path d="M 100 280 L 700 280 L 750 240 L 150 240 Z" strokeWidth="1.5"/>
              <path d="M 100 100 L 700 100 L 750 60 L 150 60 Z" strokeWidth="1.5"/>
              {/* Walls */}
              <line x1="100" y1="100" x2="100" y2="280"/>
              <line x1="700" y1="100" x2="700" y2="280"/>
              <line x1="150" y1="60" x2="150" y2="240"/>
              <line x1="750" y1="60" x2="750" y2="240"/>
              {/* Top edges */}
              <line x1="100" y1="100" x2="150" y2="60"/>
              <line x1="700" y1="100" x2="750" y2="60"/>
              <line x1="100" y1="280" x2="150" y2="240"/>
              <line x1="700" y1="280" x2="750" y2="240"/>
              {/* Internal walls */}
              <line x1="300" y1="100" x2="300" y2="280"/>
              <line x1="500" y1="100" x2="500" y2="280"/>
              <line x1="100" y1="190" x2="700" y2="190"/>
              {/* HVAC Pipes */}
              <g stroke="#0052cc" strokeWidth="2" strokeDasharray="3 2">
                <path d="M 120 130 L 120 200 L 280 200 L 280 270 L 480 270 L 480 150 L 680 150"/>
                <path d="M 150 80 L 150 180 L 320 180 L 320 250 L 520 250 L 520 120 L 720 120"/>
              </g>
              {/* Water tank pump A */}
              <ellipse cx="180" cy="220" rx="20" ry="6"/>
              <line x1="160" y1="220" x2="160" y2="200"/>
              <line x1="200" y1="220" x2="200" y2="200"/>
              <ellipse cx="180" cy="200" rx="20" ry="6"/>
              {/* Tank 01 */}
              <ellipse cx="380" cy="260" rx="25" ry="7"/>
              <line x1="355" y1="260" x2="355" y2="240"/>
              <line x1="405" y1="260" x2="405" y2="240"/>
              <ellipse cx="380" cy="240" rx="25" ry="7"/>
              {/* HVAC Units */}
              <rect x="220" y="92" width="50" height="20"/>
              <rect x="220" y="86" width="50" height="6"/>
              <line x1="240" y1="86" x2="240" y2="92"/>
              <line x1="250" y1="86" x2="250" y2="92"/>
              <rect x="420" y="92" width="50" height="20"/>
              <rect x="420" y="86" width="50" height="6"/>
              <rect x="580" y="92" width="60" height="20"/>
              <rect x="580" y="86" width="60" height="6"/>
              {/* Electrical lines */}
              <g stroke="#0052cc" strokeWidth="1" strokeDasharray="2 2" opacity="0.7">
                <path d="M 250 130 L 250 80 L 600 80 L 600 130"/>
                <path d="M 100 160 L 700 160" strokeDasharray="4 3"/>
              </g>
              {/* Elevator */}
              <rect x="600" y="200" width="40" height="80"/>
              <line x1="600" y1="220" x2="640" y2="220"/>
              <line x1="600" y1="240" x2="640" y2="240"/>
              <line x1="600" y1="260" x2="640" y2="260"/>
              {/* Doors */}
              <line x1="300" y1="160" x2="300" y2="180"/>
              <line x1="500" y1="220" x2="500" y2="240"/>
            </g>
            {/* Annotations */}
            <g fill="#0052cc" fontFamily="monospace" fontSize="8" opacity="0.7">
              <text x="200" y="55">HVAC-01</text>
              <text x="430" y="55">HVAC-02</text>
              <text x="595" y="55">HVAC-03</text>
              <text x="160" y="195">PUMP-A</text>
              <text x="360" y="235">TANK-01</text>
              <text x="610" y="195">ELEV</text>
            </g>
          </svg>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Lists */}
        <section className="lg:col-span-8 rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)' }}>
          <h3 className="text-xl font-medium mb-4">Industrial Task Lists</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl p-4 flex flex-col justify-between h-28" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 className="font-medium text-slate-800 leading-tight">HVAC Filter<br/>Replacement</h4>
              <span className="font-mono text-sm text-blue-600 mt-2 block">(Due: Today)</span>
            </div>
            <div className="rounded-2xl p-4 flex flex-col justify-between h-28 opacity-75" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 className="font-medium text-slate-800 leading-tight">Water Pump Check</h4>
              <span className="font-mono text-sm text-green-600 mt-2 block">(Completed)</span>
            </div>
            <div className="rounded-2xl p-4 flex flex-col justify-between h-28" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 className="font-medium text-slate-800 leading-tight">Elevator Maintenance</h4>
              <span className="font-mono text-sm text-slate-500 mt-2 block">(Scheduled: Tomorrow)</span>
            </div>
          </div>
        </section>

        {/* Right panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="rounded-3xl p-5 flex-1" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <h3 className="text-xl font-medium mb-5">System Health Status</h3>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)' }}>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                </div>
                <span className="font-mono text-sm font-medium">Plumbing: Optimal</span>
              </div>
              <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)' }}>
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </div>
                <span className="font-mono text-sm font-medium">HVAC: 95% Efficiency</span>
              </div>
              <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)' }}>
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <span className="font-mono text-sm font-medium">Electrical: Stable</span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <h3 className="text-xl font-medium mb-4">Critical Alerts</h3>
            <ul className="flex flex-col gap-3">
              <li className="font-mono text-sm bg-red-50/70 text-red-800 p-3 rounded-lg border border-red-100/60">Low Pressure in Water Zone 3</li>
              <li className="font-mono text-sm bg-amber-50/70 text-amber-800 p-3 rounded-lg border border-amber-100/60">HVAC Unit 4 Malfunction</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
