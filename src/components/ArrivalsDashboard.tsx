import React, { useState } from 'react';
import { Plane, Users, Clock, AlertCircle } from 'lucide-react';

export default function ArrivalsDashboard() {
  return (
    <div 
      className="relative w-full h-full min-h-screen overflow-y-auto font-sans"
      style={{ 
        backgroundImage: "url('https://lh3.googleusercontent.com/aida/AP1WRLtQ3kYzxCB82YSaUsWbNwHVtA7sfpDFUEzJR_MIUyMDMqdlVv_2lJe53AmtZNUh01Ud8Gwy3VstA_wx6ouY7K8WyFh9GGFPgCrNcwveHNurNnyPYwnezkryvoHgRVzZU86Vwtpvu1N4P0mlfaYV6lMB32s6N7DeRbnlEQh_QEnM1c219qxtOjU1w304pJWq_EjDIZ0A7LK_6bJCiBom0fkDkEn9cQr_ut37BAfBGSprhSerYdFuogWNYBU')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/40 z-0"></div>
      
      <div className="relative z-10 p-8 flex flex-col h-full space-y-6">
        
        {/* Header section with KPIs */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Zafir Arrivals Command</h1>
            <p className="text-slate-200 mt-1">Live Telemetry & Logistics orchestration</p>
          </div>
          
          <div className="flex gap-4">
             {/* Stats Cards */}
             <div className="glass-panel rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
               <span className="text-4xl font-bold text-white">12</span>
               <span className="text-xs text-slate-200 uppercase mt-1 tracking-wider">VIPs Today</span>
             </div>
             <div className="glass-panel rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
               <span className="text-4xl font-bold text-emerald-400">4</span>
               <span className="text-xs text-slate-200 uppercase mt-1 tracking-wider">Active Arrivals</span>
             </div>
             <div className="glass-panel rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
               <span className="text-4xl font-bold text-amber-400">8</span>
               <span className="text-xs text-slate-200 uppercase mt-1 tracking-wider">Pending Flights</span>
             </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Left/Center: Guest Arrival Timeline */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-6">Guest Arrival Timeline</h2>
            
            <div className="overflow-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/20 text-slate-200 text-sm">
                    <th className="pb-3 font-medium">Guest</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">ETA</th>
                    <th className="pb-3 font-medium">Suite</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-white text-sm">
                  <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src="https://ui-avatars.com/api/?name=Al+Fayed&background=C5A059&color=fff" className="w-10 h-10 rounded-full shadow-lg" alt="Al Fayed" />
                        <div>
                          <div className="font-semibold text-base">H.E. Al-Fayed</div>
                          <div className="text-xs text-amber-400 font-medium">Royal Delegation</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        In Transit
                      </span>
                    </td>
                    <td className="py-4 font-mono font-medium">14:48</td>
                    <td className="py-4 font-mono font-medium">PH-801</td>
                    <td className="py-4 text-right">
                      <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-xs font-medium transition-all shadow-sm">
                        Manage
                      </button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold shadow-lg">EM</div>
                        <div>
                          <div className="font-semibold text-base">Elena Morozova</div>
                          <div className="text-xs text-slate-300">Corporate</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Landed
                      </span>
                    </td>
                    <td className="py-4 font-mono font-medium">15:15</td>
                    <td className="py-4 font-mono font-medium">STE-402</td>
                    <td className="py-4 text-right">
                      <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-xs font-medium transition-all shadow-sm">
                        Manage
                      </button>
                    </td>
                  </tr>

                  <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold shadow-lg">JR</div>
                        <div>
                          <div className="font-semibold text-base">James Rothschild</div>
                          <div className="text-xs text-slate-300">VIP</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Airborne
                      </span>
                    </td>
                    <td className="py-4 font-mono font-medium">16:30</td>
                    <td className="py-4 font-mono font-medium">PH-802</td>
                    <td className="py-4 text-right">
                      <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-xs font-medium transition-all shadow-sm">
                        Manage
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
          
          {/* Right Panel: Flight Tracking */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-4">Flight Tracking L-01</h2>
            <div className="flex-1 rounded-2xl overflow-hidden relative min-h-[250px] border border-white/20 shadow-inner">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100940.17087610115!2d-122.5076402!3d37.7576793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1714000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 filter invert-[0.8] hue-rotate-180 opacity-70"
              ></iframe>
              {/* Overlay elements */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="glass-panel px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-2 shadow-md">
                  <Plane className="w-4 h-4" /> Heli L-01
                </div>
                <div className="glass-panel px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 flex items-center gap-2 shadow-md">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Tracking
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="glass-card p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-300 uppercase tracking-wider mb-1">Status</div>
                <div className="text-lg font-semibold text-emerald-400">In Transit - Sector 7</div>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-300 uppercase tracking-wider mb-1">Estimated Time of Arrival</div>
                <div className="text-lg font-semibold text-white font-mono">14:48 PST</div>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
