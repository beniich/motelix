/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EnergyTrade } from '../types';
import { INITIAL_TRADES } from '../data';
import { Sun, Battery, Landmark, TrendingUp, Sparkles, DollarSign, Award, Leaf, Zap, HelpCircle } from 'lucide-react';

export default function EnergyDashboard() {
  const [trades, setTrades] = useState<EnergyTrade[]>(INITIAL_TRADES);
  const [profitTotal, setProfitTotal] = useState(45.2);
  const [selectedTrade, setSelectedTrade] = useState<EnergyTrade | null>(INITIAL_TRADES[0]);

  const handleSimulateTrade = () => {
    const freshKwh = +(20 + Math.random() * 60).toFixed(1);
    const freshRate = +(0.18 + Math.random() * 0.08).toFixed(2);
    const freshRev = +(freshKwh * freshRate).toFixed(2);

    const match: EnergyTrade = {
      id: `tr-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: freshKwh,
      rate: freshRate,
      revenue: freshRev,
      type: 'Sell'
    };

    setTrades(prev => [match, ...prev.slice(0, 7)]);
    setProfitTotal(prev => +(prev + freshKwh).toFixed(1));
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Target header description list */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 border border-slate-800 rounded-xl">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">REVENUE FROM ON-SITE MICROGRID</h2>
          <p className="text-xs text-slate-400 mt-0.5">Surplus solar power distributed natively into the smart municipal grid.</p>
        </div>
        <button
          onClick={handleSimulateTrade}
          className="px-4 py-2 font-mono text-[11px] font-bold text-cyber-green border border-cyber-green/30 rounded-lg hover:bg-cyber-green/5 transition-all uppercase"
        >
          ⚡ Simulate Energy Sale
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: SVG grid lines flow diagram resembling Image 9 */}
        <div className="xl:col-span-8 flex flex-col justify-between glass-panel-dark h-[480px] rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none"></div>

          <div className="flex justify-between items-start z-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Energy conduit flows</h3>
              <p className="text-[11px] text-slate-400 mt-1">Real-time solar micro-production feeds localized hotel storage arrays.</p>
            </div>
          </div>

          {/* SVG Vector Connections */}
          <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
            <svg className="w-full h-full stroke-slate-800/80 fill-none" viewBox="0 0 500 240">
              {/* Path 1: Solar to Hotel */}
              <path d="M 80 60 C 180 60, 150 120, 250 120" strokeWidth="12" strokeLinecap="round" />
              <path d="M 80 60 C 180 60, 150 120, 250 120" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 15" className="energy-path" />

              {/* Path 2: Battery vaults to Hotel */}
              <path d="M 80 180 C 180 180, 150 120, 250 120" strokeWidth="12" strokeLinecap="round" />
              <path d="M 80 180 C 180 180, 150 120, 250 120" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 15" className="energy-path" />

              {/* Path 3: Hotel to grid selling */}
              <path d="M 250 120 C 350 120, 320 60, 420 60" strokeWidth="12" strokeLinecap="round" />
              <path d="M 250 120 C 350 120, 320 60, 420 60" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 15" style={{ animationDirection: 'reverse' }} className="energy-path" />
            </svg>
          </div>

          {/* absolute positioned Node Cards */}
          {/* Node 1: Renewables Solar */}
          <div className="absolute left-[8%] top-[25%] -translate-y-1/2 flex items-center gap-3 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 z-10 shadow shadow-indigo-950">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sun className="w-5.5 h-5.5" />
            </div>
            <div className="text-xs uppercase font-mono leading-tight">
              <span className="text-slate-500 block font-bold text-[9px]">SOURCE_SOLAR</span>
              <span className="text-slate-900 dark:text-white font-bold block mt-0.5">850 kWh</span>
            </div>
          </div>

          {/* Node 2: Battery Vaults */}
          <div className="absolute left-[8%] bottom-[25%] translate-y-1/2 flex items-center gap-3 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 z-10 shadow shadow-indigo-950">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-cyber-green flex items-center justify-center">
              <Battery className="w-5.5 h-5.5" />
            </div>
            <div className="text-xs uppercase font-mono leading-tight">
              <span className="text-slate-500 block font-bold text-[9px]">BATTERY_VAULT</span>
              <span className="text-slate-900 dark:text-white font-bold block mt-0.5">95% STORAGE</span>
            </div>
          </div>

          {/* Node 3: Center Hotel */}
          <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
            <div className="w-16 h-16 rounded-full bg-indigo-600/10 border-indigo-500 border-2 font-bold text-indigo-400 flex items-center justify-center glow-violet shadow shadow-indigo-950 animate-pulse">
              <Zap className="w-7 h-7" />
            </div>
            <div className="text-center font-mono uppercase leading-tight select-none">
              <span className="text-[10px] text-slate-900 dark:text-white font-bold block">Hotel operations</span>
              <span className="text-[8px] text-slate-500 tracking-wider mt-1 block">grid_synced</span>
            </div>
          </div>

          {/* Node 4: National Grid */}
          <div className="absolute right-[8%] top-[25%] -translate-y-1/2 flex items-center gap-3 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 z-10 shadow shadow-indigo-950">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center animate-pulse">
              <Landmark className="w-5.5 h-5.5" />
            </div>
            <div className="text-xs uppercase font-mono leading-tight">
              <span className="text-slate-500 block font-bold text-[9px]">NAT_MUNICIP_GRID</span>
              <span className="text-slate-200 font-bold block mt-0.5">SELLING POWER</span>
            </div>
          </div>

          {/* Profit bouncing tag and tooltip matching Image 9 center overlay */}
          <div className="absolute top-[26%] right-[22%] z-20 animate-bounce select-none">
            <span className="bg-indigo-600 text-white font-bold rounded-full text-[9px] px-2.5 py-0.5 shadow-lg tracking-widest uppercase">PROFIT NODE</span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-850 shadow-md rounded-full mt-1.5 pr-2.5 bg-slate-950/90">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-[10px] font-mono text-slate-300 font-bold">+{profitTotal} kWh / ${(profitTotal * 0.22).toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[10px] uppercase font-mono text-slate-400 flex items-center justify-between">
            <span>GRID_ROUTE: SUB_VAULT_05</span>
            <span>ENCRYPTED AES_256 LIVE</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Carbon offset, revenue metrics resembling Image 9 right-column panels */}
        <div className="xl:col-span-4 glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col justify-between h-[480px]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800/85 pb-3">Financial & ESG Impact</h3>
          
          <div className="space-y-6 text-left my-auto">
            {/* Metric 1: Profits */}
            <div className="flex items-center gap-3.5 leading-relaxed bg-slate-950/30 p-4 border border-slate-850 rounded-xl hover:border-indigo-500/25 transition-colors">
              <div className="w-11 h-11 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
                <DollarSign className="w-5.5 h-5.5 font-bold" />
              </div>
              <div className="leading-tight font-mono">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Surplus Grid Revenue</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1.5 font-sans">${(profitTotal * 0.22 + 2450).toFixed(2)}</span>
                <span className="text-[9px] text-slate-400 block mt-1 lowercase font-light">(recalculated daily)</span>
              </div>
            </div>

            {/* Metric 2: Carbon offsets */}
            <div className="flex items-center gap-3.5 leading-relaxed bg-slate-950/30 p-4 border border-slate-850 rounded-xl hover:border-indigo-500/25 transition-colors">
              <div className="w-11 h-11 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
                <Leaf className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight font-mono">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Carbon Offset Total</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1.5 font-sans">1,200 kg CO2e</span>
                <span className="text-[9px] text-green-400 block mt-1 flex items-center gap-0.5">
                  &#8595; 14% Reduction metrics approved
                </span>
              </div>
            </div>

            {/* Metric 3: Renewable Usage */}
            <div className="flex items-center gap-3.5 leading-relaxed bg-slate-950/30 p-4 border border-slate-850 rounded-xl hover:border-indigo-500/25 transition-colors">
              <div className="w-11 h-11 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
                <Award className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight font-mono">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Renewable usage</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1.5 font-sans">78%</span>
                <span className="text-[9px] text-slate-400 block mt-1 lowercase font-light">of total compound consumption limits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: list of active energy trades / logs matching Image 9 bottom panel */}
      <div className="glass-panel-dark rounded-2xl border border-slate-800 p-6 shadow-2xl relative uppercase font-mono">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Active Trades & Grid Alerts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* List 1 */}
          <div className="space-y-3">
            {trades.slice(0, 2).map((t, k) => (
              <div key={k} className="p-3 bg-slate-950/50 border border-slate-850 rounded-lg flex justify-between items-center text-xs">
                <span className="text-slate-500">{t.time}</span>
                <span className="font-bold text-slate-350">Sold {t.amount} kWh @ ${t.rate}/kWh</span>
              </div>
            ))}
          </div>

          {/* List 2 */}
          <div className="space-y-3">
            {trades.slice(2, 4).map((t, k) => (
              <div key={k} className="p-3 bg-slate-950/50 border border-slate-850 rounded-lg flex justify-between items-center text-xs">
                <span className="text-slate-500">{t.time}</span>
                <span className="font-bold text-slate-350">Sold {t.amount} kWh @ ${t.rate}/kWh</span>
              </div>
            ))}
          </div>

          {/* List 3 */}
          <div className="space-y-3">
            <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-lg flex justify-between items-center text-xs">
              <span className="text-slate-400">10:30 AM</span>
              <span className="font-bold text-slate-350">Grid Demand High - Price Alert</span>
            </div>
            <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-lg flex justify-between items-center text-xs">
              <span className="text-slate-400">10:28 AM</span>
              <span className="font-bold text-slate-350">Battery Discharge Optimization</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
