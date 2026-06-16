// @ts-nocheck
'use client';

import React from 'react';
import { Activity, ShieldAlert, Cpu, Droplets, Zap, Wrench } from 'lucide-react';

export default function MaintenanceDashboard() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-y-auto font-sans blueprint-bg">
      <div className="relative z-10 p-8 flex flex-col h-full space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">3D Maintenance Hub</h1>
              <p className="text-slate-500 mt-1">Real-time facility diagnostics</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="glass-card rounded-2xl px-6 py-3 flex items-center gap-3">
               <Activity className="text-emerald-500" />
               <div className="text-right">
                 <div className="text-sm font-bold text-slate-700">Systems Normal</div>
                 <div className="text-xs text-slate-500">98.2% Uptime</div>
               </div>
             </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          
          {/* Left/Center: 3D Visualization */}
          <div className="lg:col-span-3 glass-panel rounded-3xl p-6 flex flex-col relative min-h-[500px]">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 absolute top-6 left-6 z-10">
              Facility Isometric View
            </h2>
            
            <div className="flex-1 w-full flex items-center justify-center rounded-2xl overflow-hidden relative">
              {/* Fallback 3D model placeholder */}
              <img 
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Facility 3D View" 
                className="w-full h-full object-cover opacity-90 mix-blend-multiply filter contrast-125 saturate-50"
              />
              
              {/* HUD Overlays */}
              <div className="absolute top-1/3 left-1/4">
                <div className="w-4 h-4 rounded-full bg-red-500 animate-ping absolute"></div>
                <div className="w-4 h-4 rounded-full bg-red-500 relative z-10 border-2 border-white shadow-lg"></div>
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 mt-2 shadow-xl whitespace-nowrap">
                  Zone 3: Water Pressure Drop
                </div>
              </div>

              <div className="absolute bottom-1/3 right-1/4">
                <div className="w-4 h-4 rounded-full bg-emerald-500 relative z-10 border-2 border-white shadow-lg"></div>
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 mt-2 shadow-xl whitespace-nowrap">
                  Zone 1: HVAC Optimal
                </div>
              </div>
            </div>
            
            {/* View Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 glass-card p-2 rounded-xl">
              <button className="px-4 py-2 bg-white/50 hover:bg-white border border-slate-200 rounded-lg text-sm font-semibold transition-colors text-slate-700">Top</button>
              <button className="px-4 py-2 bg-blue-600 text-white border border-blue-700 rounded-lg text-sm font-semibold shadow-md transition-colors">Iso</button>
              <button className="px-4 py-2 bg-white/50 hover:bg-white border border-slate-200 rounded-lg text-sm font-semibold transition-colors text-slate-700">Front</button>
            </div>
          </div>
          
          {/* Right Panel: Health & Alerts */}
          <div className="flex flex-col gap-6">
            
            <div className="glass-panel rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-5">System Health</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Electrical</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                    <span className="flex items-center gap-2"><Droplets className="w-4 h-4 text-emerald-500" /> Plumbing</span>
                    <span className="text-red-500">82%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-red-500 h-1.5 rounded-full animate-pulse" style={{ width: '82%' }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                    <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-amber-500" /> HVAC</span>
                    <span className="text-amber-500">91%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 flex-1 border-t-4 border-t-red-500">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" /> Critical Alerts
              </h3>
              
              <div className="space-y-3">
                <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                  <div>
                    <div className="text-sm font-bold text-red-900">Low Pressure in Water Zone 3</div>
                    <div className="text-xs text-red-700 mt-0.5">Detected 12 mins ago. Maintenance dispatched.</div>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                  <div>
                    <div className="text-sm font-bold text-amber-900">HVAC Unit 4 Filter Warning</div>
                    <div className="text-xs text-amber-700 mt-0.5">Efficiency dropped below 92%.</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
