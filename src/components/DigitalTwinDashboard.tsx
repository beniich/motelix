/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Activity, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Eye,
  Key,
  UtensilsCrossed,
  Users
} from 'lucide-react';

interface DigitalTwinDashboardProps {
  theme?: 'light' | 'dark';
}

export default function DigitalTwinDashboard({ theme = 'dark' }: DigitalTwinDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'journeys' | 'analytics' | 'compliance' | 'settings'>('journeys');
  const [selectedNode, setSelectedNode] = useState<string>('room-controls');
  const [simulationPulse, setSimulationPulse] = useState(true);

  // Nodes matching the Digital Journey Topology from Screen 1
  const topologyNodes = [
    { 
      id: 'spa-booking', 
      title: 'Spa Booking', 
      engagement: '85% Eng.', 
      cx: 150, 
      cy: 160, 
      desc: 'High interaction rate for customized massage rituals and thermal suites.',
      status: 'Active Optimum'
    },
    { 
      id: 'room-controls', 
      title: 'Room Controls', 
      engagement: '92% Eng.', 
      cx: 300, 
      cy: 120, 
      desc: 'Continuous ambiance controls, automated shades adjustments and pre-set lighting scenes.',
      status: 'Intense Use'
    },
    { 
      id: 'concierge-chat', 
      title: 'Concierge Chat', 
      engagement: '70% Eng.', 
      cx: 450, 
      cy: 200, 
      desc: 'Real-time butler dispatches, custom dining requests, and secure local transfers inquiries.',
      status: 'Moderate Volume'
    }
  ];

  // Sentiment Heatmap grid data matching Screen 1 (Mon-Sun rows)
  const heatmapRows = [
    { code: 'Sen', label: 'Sentiment', values: [3, 2, 4, 3, 5, 2, 1] },
    { code: 'Avg', label: 'Average', values: [2, 5, 3, 2, 4, 2, 2] },
    { code: 'Kø', label: 'Queues', values: [1, 4, 6, 4, 3, 3, 1] },
    { code: 'Dep', label: 'Departures', values: [3, 2, 1, 2, 4, 2, 1] },
    { code: 'Tsy', label: 'Telemetry', values: [2, 3, 4, 5, 3, 2, 2] }
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getIntensityColor = (val: number) => {
    // Elegant purple shades representing Screen 1 heatmap intensities
    if (val >= 5) return 'bg-indigo-600 border-indigo-750 text-white';
    if (val === 4) return 'bg-indigo-505/70 border-indigo-500/40 text-slate-100';
    if (val === 3) return 'bg-indigo-500/40 border-indigo-500/20 text-slate-200';
    if (val === 2) return 'bg-indigo-500/20 border-indigo-500/10 text-slate-300';
    return 'bg-indigo-500/5 border-slate-200/5 dark:border-slate-800 text-slate-400';
  };

  const handleRefresh = () => {
    setSimulationPulse(false);
    setTimeout(() => setSimulationPulse(true), 300);
  };

  return (
    <div className={`space-y-6 text-left selection:bg-indigo-500 selection:text-white ${theme === 'dark' ? 'dark' : ''}`}>
      
      {/* HEADER BAR FOR SECURE SYSTEM STREAMS */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-550/5 border border-indigo-550/10 font-mono text-[10px] uppercase tracking-wider text-slate-450 select-none">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>SYS_STATUS: <b className="text-emerald-500">ONLINE</b></span>
          <span>NODE: <b className="text-slate-900 dark:text-white">LX-OP-CMD-01</b></span>
          <span>IP: <b className="text-slate-900 dark:text-white">192.168.10.45</b></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[9px] text-indigo-400 font-bold">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            DATA_STREAM: ACTIVE 
          </span>
          <span className="text-slate-500">{new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</span>
        </div>
      </div>

      {/* GUEST TWIN MONITOR CARD CONTAINER */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/60 shadow-xl overflow-hidden backdrop-blur">
        
        {/* PREMIUM CARD TITLE HEADER */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-inner shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Guest Digital Twin Interaction Monitor
                </h1>
                <span className="px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-[9px] font-mono font-bold text-indigo-400 uppercase">PRO</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-[9px] font-mono font-bold text-purple-400 uppercase">ED.</span>
              </div>
              <p className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest mt-1.5">
                Luxury Hotel Operational Command Center
              </p>
            </div>
          </div>

          {/* INNER TAB REPLICATOR FOR COMPLIANCE FLOWS */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 border border-slate-250 dark:border-slate-850 rounded-xl max-w-full overflow-x-auto">
            {(['overview', 'journeys', 'analytics', 'compliance', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] font-semibold font-mono tracking-wider transition-all uppercase cursor-pointer whitespace-nowrap ${
                  activeSubTab === tab 
                    ? 'bg-indigo-650 dark:bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab === 'journeys' ? 'Live Journeys' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* INTERACTIVE WORKSPACE MAP & PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-100 dark:border-slate-850">
          
          {/* DIGITAL JOURNEY TOPOLOGY CURVE DIAGRAM (Col Span 7) */}
          <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between border-r border-slate-150 dark:border-slate-850 min-h-[460px]">
            <div className="flex justify-between items-center select-none">
              <div className="text-left">
                <p className="text-[10px] font-mono font-bold text-indigo-500 tracking-wider flex items-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-500 animate-pulse" /> SYSTEM GRAPH ACTIVE
                </p>
                <h2 className="text-base font-serif font-extrabold text-slate-800 dark:text-white uppercase tracking-tight mt-1">
                  &apos;Digital Journey&apos; Topology
                </h2>
              </div>
              
              <button 
                onClick={handleRefresh}
                className="p-1 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg text-[9px] font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${!simulationPulse ? 'animate-spin' : ''}`} /> RELOAD TELEMETRY
              </button>
            </div>

            {/* STAGE TIMELINE CONNECTERS OVERLAY */}
            <div className="flex justify-between items-center max-w-xl mx-auto w-full my-6 select-none font-mono text-[9px] font-bold text-slate-400 dark:text-slate-500 relative">
              {['Pre-Arrival', 'Check-In', 'Stay', 'Check-Out', 'Post-Stay'].map((stage, sIdx) => {
                const isActive = stage === 'Stay';
                return (
                  <div key={stage} className="flex items-center gap-1 relative z-10">
                    <span className={`px-3.5 py-1.5 border rounded-lg uppercase tracking-wider transition-all duration-300 ${
                      isActive 
                        ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400 font-extrabold shadow shadow-indigo-900/10' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-400'
                    }`}>
                      {stage}
                    </span>
                    {sIdx < 4 && <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-800 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* THE GLOWING PATHWAY VECTOR GRAPH */}
            <div className="relative w-full flex-1 flex items-center justify-center min-h-[220px] dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850/50 rounded-2xl p-4 overflow-hidden">
              
              {/* Mesh visual dots overlay */}
              <div className="absolute inset-0 pattern-grid pointer-events-none opacity-[0.03] dark:opacity-[0.08]" style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>

              <svg 
                className="w-full max-w-lg h-56 overflow-visible" 
                viewBox="0 0 600 240"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Glowing Pipeline Gradients corresponding block-by-block with Screen 1 */}
                  <linearGradient id="cyberPipe" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.5" />
                  </linearGradient>
                  
                  {/* Subtle lower track pipe */}
                  <linearGradient id="lowerTrack" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.2" />
                  </linearGradient>

                  <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Left/Right Horizontal entrance cables */}
                <line x1="0" y1="120" x2="140" y2="120" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="3 3" className="opacity-40" />
                <line x1="460" y1="120" x2="600" y2="120" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="3 3" className="opacity-40" />

                {/* Curved pipeline flow connection */}
                <path 
                  d="M 120 120 C 180 120, 180 80, 240 80 C 300 80, 280 100, 340 100 C 400 100, 420 125, 460 120" 
                  fill="none" 
                  stroke="url(#cyberPipe)" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  filter={simulationPulse ? "url(#vectorGlow)" : undefined}
                />

                {/* Lower alternative track representing Screen 1 lower dip */}
                <path 
                  d="M 210 120 C 240 160, 260 200, 310 200 C 360 200, 380 145, 440 120" 
                  fill="none" 
                  stroke="url(#lowerTrack)" 
                  strokeWidth="5.5" 
                  strokeLinecap="round" 
                  className="opacity-70"
                />

                {/* Pulsing visual packets traveling along the grid */}
                {simulationPulse && (
                  <circle r="4" fill="#FFFFFF" filter="url(#vectorGlow)">
                    <animateMotion 
                      path="M 120 120 C 180 120, 180 80, 240 80 C 300 80, 280 100, 340 100 C 400 100, 420 125, 460 120" 
                      dur="5s" 
                      repeatCount="indefinite" 
                    />
                  </circle>
                )}

                {/* Render nodes onto SVG coordinates */}
                {topologyNodes.map((node) => {
                  const isCurSelected = selectedNode === node.id;
                  return (
                    <g 
                      key={node.id} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedNode(node.id)}
                    >
                      {/* Interactive click targets */}
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r="12" 
                        fill="rgba(99, 102, 241, 0.15)"
                        className="group-hover:scale-125 transition-transform" 
                      />

                      {/* Inner purple point core */}
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r="6" 
                        fill="#818CF8" 
                        stroke="#FFFFFF" 
                        strokeWidth="1.8"
                        filter={isCurSelected ? "url(#vectorGlow)" : undefined}
                      />

                      {/* Hover glowing bounds indicating interactive telemetry */}
                      {isCurSelected && (
                        <circle 
                          cx={node.cx} 
                          cy={node.cy} 
                          r="10" 
                          fill="none" 
                          stroke="#A78BFA" 
                          strokeWidth="1.5"
                          className="animate-ping"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* RENDER HTML ABSOLUTE BADGES OVER THE TOPOLOGY IN ALIGNMENT WITH SCREEN 1 */}
              <div className="absolute inset-0 pointer-events-none select-none">
                {/* Spa Booking label node */}
                <div 
                  className="absolute p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg"
                  style={{ top: '78%', left: '16%' }}
                >
                  <p className="text-[10px] font-bold text-slate-800 dark:text-white leading-none">Spa Booking</p>
                  <p className="text-[8px] font-mono text-purple-400 font-bold uppercase mt-1 leading-none">85% Eng.</p>
                </div>

                {/* Room Controls label node */}
                <div 
                  className="absolute p-2.5 bg-white dark:bg-slate-955 border border-indigo-500/20 rounded-lg shadow-lg"
                  style={{ top: '16%', right: '40%' }}
                >
                  <p className="text-[10px] font-bold text-slate-800 dark:text-white leading-none">Room Controls</p>
                  <p className="text-[8px] font-mono text-emerald-400 font-extrabold uppercase mt-1.5 leading-none">92% Eng.</p>
                </div>

                {/* Concierge Chat label node */}
                <div 
                  className="absolute p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg"
                  style={{ top: '65%', right: '23%' }}
                >
                  <p className="text-[10px] font-bold text-slate-800 dark:text-white leading-none">Concierge Chat</p>
                  <p className="text-[8px] font-mono text-amber-500 font-bold uppercase mt-1 leading-none">70% Eng.</p>
                </div>
              </div>
            </div>

            {/* EXPANDED LIVE NODE STATS DETAIL POPUP FOOTER */}
            {selectedNode && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 bg-slate-500/5 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="text-left leading-tight">
                  <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase">SELECTED TELEMETRY ELEMENT:</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight mt-1">
                    {topologyNodes.find(n => n.id === selectedNode)?.title} &bull; <span className="text-indigo-400 font-mono text-xs">{topologyNodes.find(n => n.id === selectedNode)?.engagement}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-sans normal-case">
                    {topologyNodes.find(n => n.id === selectedNode)?.desc}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-505/20 text-[9px] font-mono font-bold text-indigo-400 uppercase">
                    {topologyNodes.find(n => n.id === selectedNode)?.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* UX ANALYSIS & DETAILS PANEL (Col Span 5) */}
          <div className="lg:col-span-4 p-6 md:p-8 flex flex-col gap-6 font-mono select-none">
            
            {/* UX Analysis & Insights Top Header wrapper */}
            <div className="text-left border-b border-slate-100 dark:border-slate-850 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex justify-between items-center">
                <span>UX Analysis &amp; Insights</span>
                <span className="text-[9px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded">DATACENTER_SYNC</span>
              </h3>
            </div>

            {/* Feature Adoption Rates Bar Chart */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span className="uppercase font-bold">Feature Adoption Rates</span>
                <span className="text-slate-500 font-mono shrink-0">YTD &apos;24</span>
              </div>
              
              {/* Graphical representation of the bars from Screen 1 */}
              <div className="h-28 flex items-end gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-2 pt-1">
                {[
                  { month: 'Jan', val: 45 },
                  { month: 'Feb', val: 78 },
                  { month: 'Mar', val: 50 },
                  { month: 'Apr', val: 72 },
                  { month: 'May', val: 89 },
                  { month: 'Jun', val: 95, highlight: true },
                  { month: 'Jul', val: 45 }
                ].map((item, mIdx) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div 
                      className={`w-full rounded-t-lg relative group transition-all duration-300`} 
                      style={{ 
                        height: `${item.val}%`,
                        background: item.highlight 
                          ? 'linear-gradient(to top, #6366f1, #c084fc)' 
                          : 'linear-gradient(to top, rgba(99,102,241,0.4), rgba(167,139,250,0.65))'
                      }}
                    >
                      {/* Floating tooltip on hover */}
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                        {item.val}%
                      </div>
                    </div>
                    <span className="text-[8px] text-slate-500 tracking-wider rotate-[-20deg] block origin-center">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Feedback Sentiment Heatmap Grid */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span className="uppercase font-bold">Guest Feedback Sentiment Heatmap</span>
                <button 
                  onClick={() => alert("Raw CSV feed generated: Q4_guest_sentiment_matrix.csv ready for transport secure.")}
                  className="text-indigo-400 font-bold hover:underline cursor-pointer uppercase text-[9px]"
                >
                  Export Data
                </button>
              </div>

              {/* Heatmap Grid Layout replicating Screen 1 */}
              <div className="space-y-1.5 font-mono">
                {/* Header days labels */}
                <div className="flex gap-1 pl-10 text-[7px] text-slate-500 uppercase tracking-widest justify-between text-center select-none">
                  {days.map((d) => (
                    <span key={d} className="w-6 block shrink-0">{d}</span>
                  ))}
                </div>

                {heatmapRows.map((row) => (
                  <div key={row.code} className="flex items-center gap-1">
                    {/* Row Left Label */}
                    <span className="w-10 text-left text-[8px] text-slate-500 uppercase font-black tracking-normal block leading-none">{row.code}</span>
                    
                    {/* Matrix Cells */}
                    <div className="flex-1 flex gap-1 justify-between select-none">
                      {row.values.map((v, vIdx) => (
                        <div 
                          key={vIdx} 
                          title={`${row.label} intensity on Day ${vIdx + 1}: Level ${v}`}
                          className={`flex-1 h-5 rounded-md border flex items-center justify-center text-[8px] font-black tracking-tighter ${getIntensityColor(v)} transition-all hover:scale-110 shrink-0 w-6 font-mono`}
                        >
                          {v}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithmic Recommendation card identical to Screen 1 */}
            <div className="rounded-xl border border-amber-500/20 dark:border-amber-505/15 bg-amber-500/5 p-4 space-y-3 text-left">
              <div className="flex items-center gap-2 text-amber-500">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Algorithmic Recommendation</span>
              </div>
              <ul className="space-y-2 text-[10px] text-slate-650 dark:text-slate-400 font-sans leading-relaxed list-disc pl-4">
                <li>
                  Enhance <b>Pre-Arrival Personalization</b> algorithms to capture guest profiles before transfer arrivals.
                </li>
                <li>
                  Detecting friction in <b>Check-Out Process</b> (Node: C-OUT-04). Recommend digital journey flow review.
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM REAL-TIME SERVICE VECTORS CARDS ROW (Identical metrics from Screen 1) */}
        <div className="p-6 md:p-8 bg-slate-50/40 dark:bg-slate-950/20 text-left space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 font-mono">Real-time Service Vectors</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 font-mono select-none">
            {/* Vector Card 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow shadow-indigo-900/5 text-left relative overflow-hidden flex items-center gap-4">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[8px] text-slate-500 uppercase font-bold">ID: APP_ACT &bull; APP ACTIVE USERS</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif font-black text-slate-800 dark:text-white leading-none">345</span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">&uarr; 12%</span>
                </div>
              </div>
            </div>

            {/* Vector Card 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow shadow-indigo-900/5 text-left relative overflow-hidden flex items-center gap-4">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[8px] text-slate-500 uppercase font-bold">ID: DIG_KEY &bull; DIGITAL KEY USAGE</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif font-black text-slate-800 dark:text-white leading-none">210</span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">&uarr; 5%</span>
                </div>
              </div>
            </div>

            {/* Vector Card 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow shadow-indigo-900/5 text-left relative overflow-hidden flex items-center gap-4">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-500"></div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50/5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[8px] text-slate-500 uppercase font-bold">ID: IR_DINE &bull; IN-ROOM DINING</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif font-black text-slate-800 dark:text-white leading-none">89</span>
                  <span className="text-[10px] font-bold text-red-400 uppercase font-mono">&darr; 3%</span>
                </div>
              </div>
            </div>

            {/* Vector Card 4 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow shadow-indigo-900/5 text-left relative overflow-hidden flex items-center gap-4">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-500"></div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50/5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[8px] text-slate-500 uppercase font-bold">ID: FB_SUB &bull; FEEDBACK SUBS</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif font-black text-slate-800 dark:text-white leading-none">45</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">&rarr; 0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
