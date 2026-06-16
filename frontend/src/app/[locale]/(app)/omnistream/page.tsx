'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Radio, Mail, MessageSquare, Instagram, Star } from 'lucide-react';

export default function OmniStreamPage() {
  const commChartRef = useRef<HTMLCanvasElement>(null);
  const sentimentChartRef = useRef<HTMLCanvasElement>(null);
  const actionsChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let commChart: Chart, sentimentChart: Chart, actionsChart: Chart;

    if (commChartRef.current) {
      commChart = new Chart(commChartRef.current, {
        type: 'bar',
        data: {
          labels: ['M','T','W','T','F','S','S'],
          datasets: [{
            data: [120,145,132,160,148,180,152],
            backgroundColor: 'rgba(10,102,194,0.6)',
            borderRadius: 4,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
    }

    if (sentimentChartRef.current) {
      sentimentChart = new Chart(sentimentChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Positive','Neutral','Negative'],
          datasets: [{
            data: [85, 10, 5],
            backgroundColor: ['#2e7d32','#94a3b8','#c62828'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          cutout: '70%',
          plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
      });
    }

    if (actionsChartRef.current) {
      actionsChart = new Chart(actionsChartRef.current, {
        type: 'line',
        data: {
          labels: [1,2,3,4,5,6,7],
          datasets: [{
            data: [3,2,5,4,3,2,4],
            borderColor: '#d4a14a',
            backgroundColor: 'rgba(212,161,74,0.2)',
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
    }

    return () => {
      if (commChart) commChart.destroy();
      if (sentimentChart) sentimentChart.destroy();
      if (actionsChart) actionsChart.destroy();
    };
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-4 text-[#1a1a1a] font-sans">
      <header>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight flex items-center gap-3">
          <Radio className="w-10 h-10 text-[#0a66c2]" />
          Zafir Omni Stream
        </h1>
        <p className="text-[#5b6472] mt-1 text-sm">Zafir Command Center: Pôle Tech</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center timeline */}
        <section className="lg:col-span-8 rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
          <h2 className="text-xl font-semibold mb-4">Ultra-fluid Timeline of unified communications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Instagram card */}
            <article className="rounded-2xl p-4 flex flex-col gap-2 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-sm">Instagram</span>
                </div>
                <span className="text-[10px] font-bold bg-[#e0f2e9] text-[#2e7d32] px-2 py-0.5 rounded">AIS</span>
              </div>
              <p className="font-semibold text-sm">Happy Guest</p>
              <p className="text-sm text-[#5b6472]">Amazing stay at Zafir! The service is impeccable. <span className="text-blue-500">#luxury #hotel</span></p>
              <svg viewBox="0 0 300 130" className="w-full h-24 rounded-xl mt-1" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="window1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef3c7"/>
                    <stop offset="60%" stopColor="#fed7aa"/>
                    <stop offset="100%" stopColor="#fb923c"/>
                  </linearGradient>
                </defs>
                <rect width="300" height="130" fill="#fefce8"/>
                <rect x="180" y="20" width="100" height="80" fill="url(#window1)" rx="2"/>
                <rect x="180" y="20" width="100" height="80" fill="none" stroke="#a8a29e" strokeWidth="2" rx="2"/>
                <line x1="230" y1="20" x2="230" y2="100" stroke="#a8a29e" strokeWidth="1.5"/>
                <line x1="180" y1="60" x2="280" y2="60" stroke="#a8a29e" strokeWidth="1.5"/>
                <rect x="20" y="70" width="160" height="40" fill="#fff" rx="3"/>
                <rect x="20" y="60" width="160" height="15" fill="#f5f5f4" rx="3"/>
                <rect x="30" y="50" width="40" height="20" fill="#fcd34d" rx="3"/>
                <rect x="80" y="50" width="40" height="20" fill="#fcd34d" rx="3"/>
                <rect x="20" y="100" width="20" height="20" fill="#a8a29e" rx="2"/>
                <circle cx="30" cy="98" r="3" fill="#fbbf24"/>
              </svg>
              <p className="text-xs text-[#5b6472] mt-auto">2 min ago</p>
            </article>

            {/* Email card */}
            <article className="rounded-2xl p-4 flex flex-col gap-2 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-gray-500" />
                  <span className="font-medium text-sm">Email</span>
                </div>
                <span className="text-[10px] font-bold bg-[#fce4e4] text-[#c62828] px-2 py-0.5 rounded">AIS</span>
              </div>
              <p className="font-semibold text-sm">Unhappy Guest</p>
              <p className="text-sm font-semibold">Subject: Room Service Issue</p>
              <p className="text-sm text-[#5b6472]">The dinner was cold and late. Very disappointing.</p>
              <p className="text-xs text-[#5b6472] mt-auto">10 min ago</p>
            </article>

            {/* Review card */}
            <article className="rounded-2xl p-4 flex flex-col gap-2 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-amber-500" />
                  <span className="font-medium text-sm">Review</span>
                </div>
                <span className="text-[10px] font-bold bg-[#e0f2e9] text-[#2e7d32] px-2 py-0.5 rounded">AIS</span>
              </div>
              <p className="font-semibold text-sm">Happy Guest</p>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sm text-[#5b6472]">A dream vacation! Everything was perfect, from the suite to the spa.</p>
              <p className="text-xs text-[#5b6472] mt-auto">35 min ago</p>
            </article>
          </div>
        </section>

        {/* Live feed */}
        <aside className="lg:col-span-4 rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            <article className="rounded-2xl p-4 text-sm bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
              <p className="text-[#5b6472] text-xs">1 hour ago</p>
            </article>
            
            <article className="rounded-2xl p-4 space-y-1 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-sm">Neutral Guest</p>
                <span className="text-[10px] font-bold bg-[#fce4e4] text-[#c62828] px-2 py-0.5 rounded">AIS</span>
              </div>
              <p className="text-sm text-[#5b6472]">Everything was perfect, from the suite to the spa.</p>
              <p className="text-xs text-[#5b6472]">35 min ago</p>
            </article>

            <article className="rounded-2xl p-4 space-y-2 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center">
                  <Instagram className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-medium text-sm">Instagram</span>
                <span className="ml-auto text-[10px] font-bold bg-[#e0f2e9] text-[#2e7d32] px-2 py-0.5 rounded">AIS</span>
              </div>
              <p className="text-sm">Sunset view from the balcony!</p>
              
              <div className="relative">
                <svg viewBox="0 0 300 100" className="w-full h-20 rounded-lg" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="sunset1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a8a"/>
                      <stop offset="30%" stopColor="#7c2d12"/>
                      <stop offset="60%" stopColor="#f59e0b"/>
                      <stop offset="100%" stopColor="#fbbf24"/>
                    </linearGradient>
                    <radialGradient id="sun1">
                      <stop offset="0%" stopColor="#fef3c7"/>
                      <stop offset="100%" stopColor="#fbbf24"/>
                    </radialGradient>
                  </defs>
                  <rect width="300" height="100" fill="url(#sunset1)"/>
                  <circle cx="150" cy="60" r="18" fill="url(#sun1)"/>
                  <path d="M0,80 L20,80 L20,65 L35,65 L35,75 L50,75 L50,55 L70,55 L70,72 L90,72 L90,68 L110,68 L110,75 L130,75 L130,60 L155,60 L155,75 L180,75 L180,65 L210,65 L210,72 L235,72 L235,55 L255,55 L255,75 L280,75 L280,68 L300,68 L300,100 L0,100 Z" fill="#0c0a09" opacity={0.85}/>
                  <rect x="0" y="88" width="300" height="12" fill="#1c1917" opacity={0.7}/>
                  <line x1="0" y1="88" x2="300" y2="88" stroke="#44403c" strokeWidth="1"/>
                  {[20,80,140,200,260].map(x => <line key={x} x1={x} y1="88" x2={x} y2="100" stroke="#44403c" />)}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"/></svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#5b6472]">1 hour ago</p>
            </article>

            <article className="rounded-2xl p-4 space-y-1 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-sm">Email</span>
                <span className="ml-auto text-[10px] font-bold bg-[#e3f2fd] text-[#1565c0] px-2 py-0.5 rounded">AIS</span>
              </div>
              <p className="font-semibold text-sm">Neutral Guest</p>
              <p className="text-sm text-[#5b6472]">Subject: Invoice Question</p>
              <p className="text-sm text-[#5b6472]">Could you clarify the charges on...</p>
            </article>
          </div>
        </aside>
      </div>

      {/* Bottom metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
          <p className="text-sm text-[#5b6472]">Total Communications:</p>
          <p className="text-4xl font-light mt-2">152</p>
          <div className="mt-3 h-12 w-full">
            <canvas ref={commChartRef} />
          </div>
        </div>
        
        <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm flex items-center gap-4">
          <div className="w-24 h-24 shrink-0 relative">
            <canvas ref={sentimentChartRef} />
          </div>
          <div>
            <p className="text-sm text-[#5b6472]">AI Sentiment:</p>
            <p className="text-3xl font-light">85% Positive</p>
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm">
          <p className="text-sm text-[#5b6472]">Pending Actions:</p>
          <p className="text-4xl font-light mt-2">4</p>
          <div className="mt-3 h-12 w-full">
            <canvas ref={actionsChartRef} />
          </div>
        </div>
      </section>

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
