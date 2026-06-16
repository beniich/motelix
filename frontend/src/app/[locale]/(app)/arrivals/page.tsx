'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { PlaneLanding, Navigation, Users, Clock, ShieldAlert, Activity } from 'lucide-react';

export default function ArrivalsPage() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM'],
        datasets: [{
          data: [98, 99, 97, 99, 98, 100],
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46,125,50,0.15)',
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });

    return () => chart.destroy();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-4 text-[#1a1a1a] font-sans">
      <header>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a] flex items-center gap-3">
          <PlaneLanding className="w-10 h-10 text-[#0a66c2]" />
          Zafir Arrivals Dashboard
        </h1>
        <p className="text-[#5b6472] mt-1 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline & metrics */}
        <div className="lg:col-span-9 space-y-6">
          <section className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
            <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0a66c2]" />
              Guest Arrival Timeline
            </h2>
            <div className="relative grid grid-cols-3 gap-4">
              <div className="absolute left-0 right-0 top-6 h-[2px]" style={{ background: 'linear-gradient(90deg, #cbd5e1 0%, #94a3b8 100%)' }} />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="mt-3 font-medium text-sm">En route</div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
                  <PlaneLanding className="w-5 h-5" />
                </div>
                <div className="mt-3 font-medium text-sm">Landed</div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="mt-3 font-medium text-sm">In-flight</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-2xl p-4 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Mr. Chen & Family</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">VIP</span>
                </div>
                <p className="text-sm text-[#5b6472]">Limo Pickup in 20m</p>
                <p className="text-xs text-[#5b6472] font-mono mt-1">Flight BA245, LHR-JFK</p>
              </div>
              <div className="rounded-2xl p-4 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Ms. Al-Fayed</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">VIP</span>
                </div>
                <p className="text-sm text-[#5b6472]">Arrived at Terminal 4</p>
                <p className="text-xs text-[#5b6472] font-mono mt-1">Chauffeur en route</p>
              </div>
              <div className="rounded-2xl p-4 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Dr. Rossi</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">VIP</span>
                </div>
                <p className="text-sm text-[#5b6472]">Estimated arrival: 2h 15m</p>
                <p className="text-xs text-[#5b6472] font-mono mt-1">Flight AF112, CDG-JFK</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
              <p className="text-sm text-[#5b6472]">Total Arrivals Today:</p>
              <p className="text-5xl font-light mt-2 text-[#0a66c2]">45</p>
              <p className="text-sm text-[#5b6472] mt-1 font-medium">(VIP: 12)</p>
            </div>
            <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
              <p className="text-sm text-[#5b6472]">Flights in Progress:</p>
              <p className="text-5xl font-light mt-2 text-[#d4a14a]">8</p>
              <p className="text-sm text-[#5b6472] mt-1 font-medium">(Delayed: 1)</p>
            </div>
            <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-sm text-[#5b6472]">Operations Status:</p>
                <p className="text-2xl font-light mt-1 text-[#2e7d32]">All Systems Normal</p>
              </div>
              <div className="mt-3 h-12 w-full">
                <canvas ref={chartRef} />
              </div>
            </div>
          </section>
        </div>

        {/* Flight tracking map */}
        <section className="lg:col-span-3 rounded-3xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0a66c2]" />
            Flight Tracking
          </h2>
          <div className="rounded-2xl p-2 mb-4 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
            <svg viewBox="0 0 400 200" className="w-full h-auto rounded-xl">
              <defs>
                <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dbeafe"/>
                  <stop offset="100%" stopColor="#bfdbfe"/>
                </linearGradient>
                <style>{`
                  @keyframes dashmoveArrivals { to { stroke-dashoffset: -200; } }
                  .flight-path { stroke-dasharray: 4 4; animation: dashmoveArrivals 20s linear infinite; }
                  @keyframes pulse-plane { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
                  .plane { animation: pulse-plane 2.5s ease-in-out infinite; }
                `}</style>
              </defs>
              <rect width="400" height="200" fill="url(#oceanGrad)"/>
              <g fill="#94a3b8" opacity="0.55">
                <path d="M30,50 Q40,35 60,40 L90,45 L100,70 L80,90 L60,100 L40,90 L25,75 Z"/>
                <path d="M85,110 Q95,105 105,115 L110,140 L100,170 L85,180 L75,160 L78,130 Z"/>
                <path d="M180,40 Q190,30 210,35 L225,50 L215,65 L195,60 L180,50 Z"/>
                <path d="M195,75 Q210,70 225,80 L230,120 L215,155 L200,150 L188,120 L190,95 Z"/>
                <path d="M230,40 Q260,30 300,40 L340,55 L350,80 L320,90 L280,80 L250,70 L235,55 Z"/>
                <path d="M310,135 Q330,130 350,140 L355,160 L335,170 L315,160 Z"/>
              </g>
              <path d="M70,70 Q150,30 220,55" stroke="#0a66c2" strokeWidth="1.8" fill="none" className="flight-path"/>
              <path d="M70,70 Q180,80 220,55" stroke="#d4a14a" strokeWidth="1.8" fill="none" strokeDasharray="3 4" className="flight-path"/>
              <path d="M205,55 Q280,40 330,70" stroke="#0a66c2" strokeWidth="1.8" fill="none" strokeDasharray="3 4" className="flight-path"/>
              <path d="M205,55 Q260,90 340,150" stroke="#d4a14a" strokeWidth="1.8" fill="none" className="flight-path"/>
              
              <g className="plane" transform="translate(150,42) rotate(-30)">
                <path d="M-6,0 L6,0 L4,2 L6,4 L2,4 L0,6 L-2,4 L-6,4 L-4,2 Z" fill="#0a66c2"/>
              </g>
              <g className="plane" transform="translate(280,45) rotate(20)">
                <path d="M-6,0 L6,0 L4,2 L6,4 L2,4 L0,6 L-2,4 L-6,4 L-4,2 Z" fill="#0a66c2"/>
              </g>
              <g className="plane" transform="translate(280,90) rotate(45)">
                <path d="M-6,0 L6,0 L4,2 L6,4 L2,4 L0,6 L-2,4 L-6,4 L-4,2 Z" fill="#d4a14a"/>
              </g>
              
              <g fill="#0a66c2">
                <circle cx="70" cy="70" r="3"/>
                <circle cx="220" cy="55" r="3"/>
                <circle cx="330" cy="70" r="3"/>
              </g>
              <g fill="#d4a14a">
                <circle cx="205" cy="55" r="3"/>
                <circle cx="340" cy="150" r="3"/>
              </g>
            </svg>
          </div>
          
          <div className="space-y-3 text-sm flex-1">
            <div className="border-b border-slate-200/50 pb-2">
              <p><span className="font-semibold">Flight BA245</span> <span className="text-[#2e7d32] font-medium">(On Time)</span></p>
              <p className="text-[#5b6472] text-xs">Estimated: 11:15 AM</p>
            </div>
            <div className="border-b border-slate-200/50 pb-2">
              <p><span className="font-semibold">Flight AF112</span> <span className="text-[#c62828] font-medium">(Delayed 15m)</span></p>
              <p className="text-[#5b6472] text-xs">Estimated: 12:45 PM</p>
            </div>
            <div>
              <p><span className="font-semibold">Flight JL407</span> <span className="text-[#2e7d32] font-medium">(Landed)</span></p>
              <p className="text-[#5b6472] text-xs">Arrived: 09:50 AM</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        body {
          background:
            radial-gradient(ellipse at 20% 20%, #efe7d8 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, #e6dcc7 0%, transparent 60%),
            linear-gradient(135deg, #f4ede0 0%, #e8dfcb 100%);
        }
      `}</style>
    </div>
  );
}
