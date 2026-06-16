// @ts-nocheck
'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Cabana } from '../types';
import { INITIAL_CABANAS } from '../data';
import { 
  Sun, 
  Wind, 
  Droplet, 
  Volume2, 
  Search, 
  Users, 
  Activity, 
  MapPin, 
  Clock, 
  Sparkles, 
  Compass, 
  Sliders, 
  Layers, 
  CheckCircle, 
  AlertCircle, 
  ZoomIn, 
  ZoomOut, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  Heart,
  Calendar,
  Waves
} from 'lucide-react';

interface PoolDashboardProps {
  theme?: 'light' | 'dark';
}

interface SpaRoom {
  id: string;
  name: string;
  status: 'Treatment' | 'Refreshing' | 'Ready';
  therapist: string;
  service: string;
  remaining: number; // in seconds
  maxTime: number; // in seconds
  ambientSound: string;
}

interface Specialist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  status: 'In Session' | 'Available' | 'On Break';
  nextTime: string;
  avatar: string;
  utilization: number;
  phone: string;
}

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  unit: string;
  status: 'Optimal' | 'Low' | 'Critical';
}

export default function PoolDashboard({ theme = 'dark' }: PoolDashboardProps) {
  // Navigation for Luxury Spa subtabs
  const [activeSubTab, setActiveSubTab] = useState<'spa' | 'pool' | 'therapists' | 'inventory'>('spa');
  
  // Real pool map states (carried over for ultimate utility)
  const [cabanas, setCabanas] = useState<Cabana[]>(INITIAL_CABANAS);
  const [selectedCabana, setSelectedCabana] = useState<Cabana | null>(INITIAL_CABANAS[3]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [smartControls, setSmartControls] = useState({
    irrigation: false,
    lighting: true,
    staffing: true
  });

  // Unique Spa states
  const [soundChoice, setSoundChoice] = useState('Soft Nature');
  const [soundLevel, setSoundLevel] = useState(45);
  const [humidity, setHumidity] = useState(55);
  const [specialistSearch, setSpecialistSearch] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  // Spa rooms data state with interactive countdowns
  const [spaRooms, setSpaRooms] = useState<SpaRoom[]>([
    { id: '1', name: 'Serenity Suite', status: 'Treatment', therapist: 'Sarah Chen', service: 'Aromatherapy Massage', remaining: 2120, maxTime: 3600, ambientSound: 'Ocean Waves' },
    { id: '2', name: 'Harmony Haven', status: 'Refreshing', therapist: 'James Wilson', service: 'Standing by', remaining: 615, maxTime: 900, ambientSound: 'Zen Flute' },
    { id: '3', name: 'Zen Garden', status: 'Treatment', therapist: 'Maria Rodriguez', service: 'Hot Stone Therapy', remaining: 3005, maxTime: 3600, ambientSound: 'Forest Choir' },
    { id: '4', name: 'Vitality Vibe', status: 'Refreshing', therapist: 'Kenji Sato', service: 'Standing by', remaining: 330, maxTime: 600, ambientSound: 'Rainforest' }
  ]);

  // Specialists/Therapists list
  const [specialists, setSpecialists] = useState<Specialist[]>([
    { id: 't1', name: 'Sarah Chen', role: 'Aromatherapy Expert', specialty: 'Swedish & Aromatherapy', status: 'In Session', nextTime: '15:00', avatar: 'https://i.pravatar.cc/100?img=1', utilization: 85, phone: '+33 6 45 23 89' },
    { id: 't2', name: 'James Wilson', role: 'Thermal Therapist', specialty: 'Hot Stone & Reflexology', status: 'Available', nextTime: '13:45', avatar: 'https://i.pravatar.cc/100?img=2', utilization: 75, phone: '+33 6 88 12 40' },
    { id: 't3', name: 'Maria Rodriguez', role: 'Stone Reflexologist', specialty: 'Deep Tissue & Shiatsu', status: 'In Session', nextTime: '15:30', avatar: 'https://i.pravatar.cc/100?img=3', utilization: 90, phone: '+33 7 12 99 34' },
    { id: 't4', name: 'Kenji Sato', role: 'Shiatsu Specialist', specialty: 'Acupressure & Thai Yoga', status: 'Available', nextTime: '14:15', avatar: 'https://i.pravatar.cc/100?img=4', utilization: 60, phone: '+33 6 34 56 78' },
    { id: 't5', name: 'Amandine Petit', role: 'Facialist Expert', specialty: 'Hydrafacial & Anti-Aging', status: 'On Break', nextTime: '16:00', avatar: 'https://i.pravatar.cc/100?img=5', utilization: 45, phone: '+33 7 88 56 12' }
  ]);

  // Spa Luxury Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'i1', name: 'Organic Lavender massage oil', stock: 14, minStock: 5, unit: 'Liters', status: 'Optimal' },
    { id: 'i2', name: 'Himalayan Pink Stones', stock: 85, minStock: 20, unit: 'Units', status: 'Optimal' },
    { id: 'i3', name: 'White Bamboo Egyptian Towels', stock: 120, minStock: 150, unit: 'Units', status: 'Low' },
    { id: 'i4', name: 'Eucalyptus Ambiance Spray', stock: 2, minStock: 6, unit: 'Liters', status: 'Critical' },
    { id: 'i5', name: 'Mineral Rehydration Serum', stock: 45, minStock: 15, unit: 'Vials', status: 'Optimal' }
  ]);

  // Ticker timer for active spa room treatment durations
  useEffect(() => {
    const timer = setInterval(() => {
      setSpaRooms(prevRooms => 
        prevRooms.map(room => {
          if (room.status === 'Treatment' || room.status === 'Refreshing') {
            const nextRemaining = Math.max(room.remaining - 1, 0);
            const statusChanged = nextRemaining === 0 ? 'Ready' : room.status;
            return {
              ...room,
              remaining: nextRemaining,
              status: statusChanged as 'Treatment' | 'Refreshing' | 'Ready'
            };
          }
          return room;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format second countdown to MM:SS string
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleToggleSmart = (key: 'irrigation' | 'lighting' | 'staffing') => {
    setSmartControls(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCabanaClick = (cb: Cabana) => {
    setSelectedCabana(cb);
  };

  const triggerRoomUpdate = (id: string, action: 'reset' | 'ready' | 'toggle') => {
    setSpaRooms(prev => prev.map(r => {
      if (r.id === id) {
        if (action === 'reset') {
          return { ...r, status: 'Treatment', remaining: 3600 };
        } else if (action === 'ready') {
          return { ...r, status: 'Ready', remaining: 0, service: 'Standing by' };
        } else {
          const isTreatment = r.status === 'Treatment';
          return {
            ...r,
            status: isTreatment ? 'Refreshing' : 'Treatment',
            remaining: isTreatment ? 600 : 3600,
            service: isTreatment ? 'Ménage de rafraîchissement' : 'Aromatherapy Massage'
          };
        }
      }
      return r;
    }));
  };

  const activeSpecialists = specialists.filter(spec => 
    spec.name.toLowerCase().includes(specialistSearch.toLowerCase()) ||
    spec.specialty.toLowerCase().includes(specialistSearch.toLowerCase())
  );

  // Active/Busy states
  const busyCount = specialists.filter(t => t.status === 'In Session').length;
  const availableCount = specialists.filter(t => t.status === 'Available').length;

  return (
    <div className="space-y-8 select-none transition-all duration-300">
      
      {/* HEADER SECTION WITH GLASSMORPHIC SUBNAV */}
      <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 shadow-xl ${
        theme === 'dark' 
          ? 'bg-slate-900/60 border-slate-850/80 backdrop-blur' 
          : 'bg-white/80 border-slate-100 backdrop-blur shadow-indigo-100/10'
      }`}>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full bg-indigo-500 animate-ping`}></span>
              <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                Boutique Wellness Command &bull; Live
              </span>
            </div>
            <h1 className={`text-2xl md:text-3.5xl font-serif tracking-tight font-semibold ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
              Luxury Spa & Wellness <span className="font-light italic">Command</span>
            </h1>
            <p className={`text-xs md:text-sm font-light mt-1 max-w-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              High-end sensory environmental telemetry, specialist dispatching, treatments monitor, and premium pool side analytics.
            </p>
          </div>

          {/* Environmental Pills (Ambient Metrics) */}
          <div className="flex flex-wrap gap-4">
            {/* Ambient Sound metric */}
            <div className={`rounded-2xl p-4 flex items-center gap-4 min-w-[190px] border transition-all ${
              theme === 'dark' 
                ? 'bg-slate-950/80 border-slate-850 text-white' 
                : 'bg-slate-50/90 border-slate-200/60 shadow-inner text-slate-800'
            }`}>
              <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-500 shrink-0">
                <Volume2 className="h-5 w-5 animate-pulse" />
              </div>
              <div className="text-left font-sans">
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Sound Ambiance</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <select 
                    value={soundChoice}
                    onChange={(e) => setSoundChoice(e.target.value)}
                    className="bg-transparent border-none text-xs font-semibold focus:ring-0 p-0 text-slate-700 dark:text-slate-250 cursor-pointer"
                  >
                    <option value="Soft Nature">Soft Nature</option>
                    <option value="Zen Flute">Zen Flute</option>
                    <option value="Ocean Waves">Ocean Waves</option>
                    <option value="Rainforest">Rainforest</option>
                  </select>
                  <span className="text-[10px] font-mono text-indigo-500 font-bold bg-indigo-500/10 px-1 py-0.5 rounded leading-none shrink-0">{soundLevel}dB</span>
                </div>
              </div>
            </div>

            {/* Humidity metric */}
            <div className={`rounded-2xl p-4 flex items-center gap-4 min-w-[190px] border transition-all ${
              theme === 'dark' 
                ? 'bg-slate-950/80 border-slate-850 text-white' 
                : 'bg-slate-50/90 border-slate-200/60 shadow-inner text-slate-800'
            }`}>
              <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-500 shrink-0">
                <Droplet className="h-5 w-5" />
              </div>
              <div className="text-left font-sans">
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Moisture/Humidity</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold">Optimal Range</span>
                  <span className="text-[10px] font-mono text-indigo-500 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded leading-none">{humidity}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Boutique Subtab Navigation */}
        <nav className="flex flex-wrap gap-2 md:gap-6 mt-8 border-b border-slate-200/40 dark:border-slate-800/60">
          <button 
            onClick={() => setActiveSubTab('spa')}
            className={`pb-3 text-xs md:text-sm font-medium tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === 'spa' 
                ? 'border-indigo-500 text-indigo-500 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 dark:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Spa & Rooms Management
          </button>
          
          <button 
            onClick={() => setActiveSubTab('pool')}
            className={`pb-3 text-xs md:text-sm font-medium tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === 'pool' 
                ? 'border-indigo-500 text-indigo-500 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 dark:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" /> Pool & Cabanas Map
          </button>

          <button 
            onClick={() => setActiveSubTab('therapists')}
            className={`pb-3 text-xs md:text-sm font-medium tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === 'therapists' 
                ? 'border-indigo-500 text-indigo-500 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 dark:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Specialist Staff Roster
          </button>

          <button 
            onClick={() => setActiveSubTab('inventory')}
            className={`pb-3 text-xs md:text-sm font-medium tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer border-b-2 ${
              activeSubTab === 'inventory' 
                ? 'border-indigo-500 text-indigo-500 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 dark:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Luxury Resource Stock
          </button>
        </nav>
      </div>

      {/* SUBTAB 1: SPA & WELLNESS ROOMS */}
      {activeSubTab === 'spa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Spa Area (Left block - 8 columns on PC) */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Therapeutic Rooms Operating Board
            </h3>

            {/* Room cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spaRooms.map((room) => {
                const percentage = Math.round((room.remaining / room.maxTime) * 100);
                const isPulse = room.status === 'Treatment';
                const isRefreshing = room.status === 'Refreshing';

                return (
                  <div 
                    key={room.id}
                    className={`rounded-3xl p-6 border relative overflow-hidden group transition-all duration-300 hover:translate-y-[-4px] ${
                      theme === 'dark' 
                        ? 'bg-slate-900/60 border-slate-850/80 hover:bg-slate-900' 
                        : 'bg-white border-slate-200/80 shadow-sm hover:shadow-lg shadow-indigo-100/5'
                    } ${isPulse ? 'border-l-4 border-l-indigo-500' : 'border-l-4 border-l-slate-300'}`}
                  >
                    {/* Status pulse beacon ring top right corner */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                      {isPulse && (
                        <span className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-ping opacity-60"></span>
                      )}
                      <span className={`w-2 h-2 rounded-full ${
                        isPulse ? 'bg-indigo-500' : isRefreshing ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></span>
                    </div>

                    {/* Room Info */}
                    <h4 className={`text-lg font-bold font-serif mb-4 group-hover:text-indigo-500 transition-colors uppercase ${
                      theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'
                    }`}>
                      {room.name}
                    </h4>

                    {/* Quick progress visual line */}
                    {room.remaining > 0 && (
                      <div className="w-full h-1 bg-slate-200/40 dark:bg-slate-800 rounded-full overflow-hidden mb-5">
                        <div 
                          className={`h-full transition-all duration-1000 ${isPulse ? 'bg-indigo-500' : 'bg-amber-500'}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    )}

                    <div className="space-y-3.5 text-xs font-sans">
                      <div className="flex justify-between border-b border-slate-100/10 pb-2">
                        <span className="text-slate-400 font-light lowercase">Status</span>
                        <span className={`font-semibold uppercase text-[10px] tracking-wider ${
                          isPulse ? 'text-indigo-500' : isRefreshing ? 'text-amber-500' : 'text-emerald-500'
                        }`}>{room.status}</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-slate-100/10 pb-2">
                        <span className="text-slate-400 font-light lowercase">Specialist</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{room.therapist}</span>
                      </div>

                      <div className="flex justify-between border-b border-slate-100/10 pb-2">
                        <span className="text-slate-400 font-light lowercase">Remaining</span>
                        <span className={`font-mono font-bold text-sm ${isPulse ? 'text-indigo-500' : 'text-slate-500'}`}>
                          {room.remaining > 0 ? formatTime(room.remaining) : '00:00'}
                        </span>
                      </div>

                      <div className="pt-3">
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">Prescribed Service</p>
                        <p className="font-medium text-slate-600 dark:text-slate-200 italic">{room.service}</p>
                      </div>
                    </div>

                    {/* Interactive room stimulation triggers */}
                    <div className="mt-6 pt-4 border-t border-slate-100/15 flex items-center justify-between gap-2.5">
                      <button 
                        onClick={() => triggerRoomUpdate(room.id, 'toggle')}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border cursor-pointer select-none transition-all w-full text-center ${
                          theme === 'dark' 
                            ? 'border-slate-800 bg-slate-950/60 hover:bg-slate-850 text-slate-400 hover:text-white' 
                            : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isPulse ? 'Set Clean Refresh' : 'Assign Treatment'}
                      </button>

                      <button 
                        onClick={() => triggerRoomUpdate(room.id, 'ready')}
                        className={`p-1.5 rounded-xl border cursor-pointer shrink-0 transition-all text-emerald-505 hover:bg-emerald-500/10 ${
                          theme === 'dark' ? 'border-slate-800' : 'border-slate-300'
                        }`}
                        title="Force ready standing by status"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick action dispatch terminal widget */}
            <div className={`p-6 rounded-3xl border ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h4 className={`text-sm font-serif font-semibold mb-4 uppercase ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
                Instant Specialist Room Dispatch Controller
              </h4>
              <p className="text-slate-400 text-xs font-light mb-5">
                Dispatch an available therapist specialist to any suite needing thermal correction, replenishing towels, or customized guest massage routines.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select className={`w-full p-3 rounded-xl border text-xs bg-transparent dark:bg-slate-950 font-sans outline-none`}>
                  <option value="">Select Target Suite...</option>
                  {spaRooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>

                <select className={`w-full p-3 rounded-xl border text-xs bg-transparent dark:bg-slate-950 font-sans outline-none`}>
                  <option value="">Choose Specialist Staff...</option>
                  {specialists.filter(s => s.status === 'Available').map(s => <option key={s.id} value={s.name}>{s.name} ({s.role})</option>)}
                </select>

                <button 
                  onClick={() => alert('Specialist liaison successfully dispatched. Radio telemetry active.')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow hover:shadow-indigo-950/30"
                >
                  Confirm Dispatch
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Specialists Roster list (4 columns on PC) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Therapist On duty Roster
            </h3>

            {/* Custom high-end Specialist widget */}
            <div className={`rounded-[2.5rem] p-6 border flex flex-col ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-850 backdrop-blur' : 'bg-white border-slate-200 shadow-lg shadow-indigo-100/10'
            }`}>
              
              {/* Search specialty input fields */}
              <div className="relative mb-6">
                <input 
                  type="text"
                  placeholder="Search specialists, skill..."
                  value={specialistSearch}
                  onChange={(e) => setSpecialistSearch(e.target.value)}
                  className={`w-full bg-slate-100/50 dark:bg-slate-950/40 border-none rounded-2xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                />
                <Search className="w-4 h-4 text-slate-450 absolute left-3.5 top-3" />
              </div>

              {/* Scrolling List */}
              <div className="space-y-5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1 select-none">
                {activeSpecialists.map((spec) => {
                  const isBusy = spec.status === 'In Session';
                  const isBreak = spec.status === 'On Break';

                  return (
                    <div 
                      key={spec.id}
                      onClick={() => setSelectedSpecialist(spec)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-500/5 cursor-pointer transition-all border border-transparent ${
                        selectedSpecialist?.id === spec.id ? 'bg-indigo-500/5 border-indigo-500/15' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={spec.avatar} 
                            alt={spec.name} 
                            className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow" 
                          />
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                            isBusy ? 'bg-indigo-500 animate-pulse' : isBreak ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}></span>
                        </div>
                        <div className="text-left leading-normal">
                          <p className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-800'}`}>
                            {spec.name}
                          </p>
                          <p className="text-[10px] text-slate-400 italic">
                            {spec.role} &bull; Next {spec.nextTime}
                          </p>
                        </div>
                      </div>

                      {/* Specialist Utilization Gauge or Status Tag */}
                      <div className="relative w-9 h-9 shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <circle className="text-slate-200/50 dark:text-slate-800" cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2.5"></circle>
                          <circle 
                            className="text-indigo-500" 
                            cx="18" cy="18" r="16" 
                            fill="none" stroke="currentColor" strokeWidth="2.5" 
                            strokeDasharray={`${spec.utilization}, 100`} 
                            strokeLinecap="round"
                          ></circle>
                          <text className="text-[9px] font-bold fill-indigo-500" textAnchor="middle" x="18" y="21">{spec.utilization}%</text>
                        </svg>
                      </div>
                    </div>
                  );
                })}

                {activeSpecialists.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs italic font-sans">
                    No specialists matching query.
                  </div>
                )}
              </div>

              {/* Selected specialist expanded bio detail */}
              {selectedSpecialist && (
                <div className={`mt-6 p-4 rounded-2xl text-left bg-indigo-500/5 border border-indigo-500/10 space-y-2.5 animate-fade-in`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-bold text-indigo-500`}>{selectedSpecialist.name}</p>
                      <p className="text-[9px] font-mono text-slate-500">{selectedSpecialist.phone}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded ${
                      selectedSpecialist.status === 'Available' ? 'text-emerald-500 bg-emerald-500/10' : 'text-indigo-500'
                    }`}>
                      {selectedSpecialist.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    <span className="font-semibold text-slate-600 dark:text-slate-350">Specialty Certification:</span> {selectedSpecialist.specialty}.
                  </p>
                </div>
              )}

              {/* Capacity overview metrics */}
              <div className="mt-8 pt-6 border-t border-slate-100/10">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4 text-center">
                  Duty Staff Allocation Capacity
                </p>
                <div className="grid grid-cols-2 gap-4 uppercase font-mono">
                  <div className={`p-3.5 rounded-2xl text-center border ${
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-850' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <p className="text-[9px] text-slate-400">Available</p>
                    <p className="text-xl font-black text-emerald-500 mt-1 leading-none">{availableCount}</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl text-center border ${
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-850' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <p className="text-[9px] text-slate-400">In Session</p>
                    <p className="text-xl font-black text-indigo-500 mt-1 leading-none">{busyCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: POOL CLUB & CABANAS MAP (Interactive Heatmap matching previous codebase) */}
      {activeSubTab === 'pool' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Deck Occupancy Heatmap Area (7 columns on XL) */}
          <div className="xl:col-span-7 space-y-6">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Virtual Real-Time Deck & Lounge Map
            </h3>

            <div className={`relative h-[480px] rounded-3xl border p-6 shadow-2xl flex flex-col justify-between overflow-hidden transition-colors ${
              theme === 'dark' 
                ? 'bg-slate-900/60 border-slate-850/80' 
                : 'bg-white border-slate-200/80 shadow-indigo-100/5'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none"></div>

              <div className="flex justify-between items-start z-10 mb-4">
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
                    Active Deck Heatmap Sensor
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click map pinpoint nodes to inspect individual cabana capacities or manage bookings.</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded font-mono text-[9px] font-bold tracking-wider uppercase border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  DECK_PLAN: REPLICA_SYS5
                </span>
              </div>

              {/* Main SVG Vector plan container */}
              <div className="flex-1 rounded-2xl bg-slate-950/60 border border-slate-800/60 relative overflow-hidden p-4 flex items-center justify-center">
                
                {/* Scale buttons */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
                    className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                    className="w-8 h-8 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scaled Deck Plan graphics */}
                <div 
                  className="w-full h-full max-w-[500px] max-h-[290px] relative transition-transform duration-300"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  {/* Backdrop outlines */}
                  <svg className="absolute inset-0 w-full h-full stroke-indigo-900/40 fill-none" viewBox="0 0 500 280">
                    <path d="M 380 0 L 500 0 L 500 280 L 380 280 Q 360 140 380 0" fill="rgba(254, 243, 199, 0.04)" stroke="rgba(254, 243, 199, 0.1)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <rect x="180" y="80" width="160" height="90" rx="15" fill="rgba(99, 102, 241, 0.08)" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" />
                    <rect x="220" y="190" width="100" height="60" rx="10" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" />
                  </svg>

                  <div className="absolute top-[38%] left-[46%] text-[8px] font-bold text-indigo-400 select-none uppercase tracking-widest opacity-60 font-mono">Main Resort Pool</div>
                  <div className="absolute bottom-[20%] left-[51%] text-[8px] font-bold text-emerald-400 select-none uppercase tracking-widest opacity-60 font-mono">Thermal Oasis</div>

                  {/* Heat bloom indicators */}
                  <div className="absolute top-[40%] left-[45%] w-20 h-20 rounded-full bg-indigo-500/10 blur-xl animate-pulse"></div>
                  <div className="absolute bottom-[20%] left-[52%] w-14 h-14 rounded-full bg-emerald-500/10 blur-xl animate-pulse" style={{ animationDelay: '1.2s' }}></div>

                  {/* Loop elements Cabanas */}
                  {cabanas.map(cb => (
                    <button
                      key={cb.id}
                      onClick={() => handleCabanaClick(cb)}
                      className="absolute group border-0 p-0 bg-transparent flex flex-col items-center cursor-pointer z-10"
                      style={{ top: `${cb.y}%`, left: `${cb.x}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      {cb.status === 'Occupied' && (
                        <div className="absolute -inset-1.5 rounded-full bg-indigo-500/25 animate-ping opacity-75"></div>
                      )}
                      
                      <div className={`w-6 h-6 rounded flex items-center justify-center border text-[9px] font-bold transition-all shadow ${
                        selectedCabana?.id === cb.id
                          ? 'bg-indigo-600 border-white text-white scale-125'
                          : cb.status === 'Occupied'
                          ? 'bg-slate-900 border-indigo-500/80 text-indigo-400'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="absolute -bottom-4 text-[7px] text-slate-400 font-mono px-1 bg-slate-950 border border-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        C-{cb.id.slice(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cabana parameters summary sheet under map */}
              {selectedCabana && (
                <div className="absolute top-24 right-8 w-56 p-4 rounded-2xl bg-slate-950/95 border border-indigo-500/40 text-left shadow-2xl z-20 animate-fade-in">
                  <p className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider mb-1">Interactive Node Info</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-serif">{selectedCabana.name}</p>
                  
                  <div className="mt-3.5 space-y-2 text-xs font-mono text-slate-350">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={selectedCabana.status === 'Occupied' ? 'text-indigo-400 font-bold' : 'text-slate-500 font-bold'}>
                        {selectedCabana.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Headcount:</span>
                      <span className="text-slate-900 dark:text-white font-bold">{selectedCabana.occupants} Guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity limit:</span>
                      <span>{selectedCabana.capacity} max</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-1 text-center">
                    <button
                      onClick={() => {
                        const updated = cabanas.map(c => {
                          if (c.id === selectedCabana.id) {
                            const isVacant = c.status === 'Vacant';
                            return {
                              ...c,
                              status: isVacant ? 'Occupied' : 'Vacant',
                              occupants: isVacant ? 3 : 0
                            } as Cabana;
                          }
                          return c;
                        });
                        setCabanas(updated);
                        setSelectedCabana(prev => prev ? {
                          ...prev,
                          status: prev.status === 'Vacant' ? 'Occupied' : 'Vacant',
                          occupants: prev.status === 'Vacant' ? 3 : 0
                        } : null);
                      }}
                      className="w-full text-[9px] font-bold text-white uppercase tracking-widest py-2 rounded bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer border-none"
                    >
                      {selectedCabana.status === 'Occupied' ? 'Mark Vacant' : 'Set Guest Check-in'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Smart Controllers and parameter panels (5 columns on XL) */}
          <div className="xl:col-span-5 space-y-6">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Sensors & Environmental Compliance
            </h3>

            {/* Smart systems togglers */}
            <div className={`p-6 rounded-3xl border text-left flex flex-col justify-between ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-850/80 backdrop-blur' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-widest text-slate-500 mb-5`}>
                  IoT Resort Systems Automation
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-500/5 border border-slate-200/10">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-350 flex items-center gap-2">
                      🍃 Automatic Deck Irrigation
                    </span>
                    <button 
                      onClick={() => handleToggleSmart('irrigation')}
                      className="p-0 border-0 bg-transparent text-indigo-500 cursor-pointer"
                    >
                      {smartControls.irrigation ? <ToggleRight className="w-10 h-6" /> : <ToggleLeft className="w-10 h-6 text-slate-600 dark:text-slate-700" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-500/5 border border-slate-200/10">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-350 flex items-center gap-2">
                      🌙 Mood Lighting Array (Sunset Blue)
                    </span>
                    <button 
                      onClick={() => handleToggleSmart('lighting')}
                      className="p-0 border-0 bg-transparent text-indigo-500 cursor-pointer"
                    >
                      {smartControls.lighting ? <ToggleRight className="w-10 h-6" /> : <ToggleLeft className="w-10 h-6 text-slate-600 dark:text-slate-700" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-500/5 border border-slate-200/10">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-350 flex items-center gap-2">
                      👥 Intelligent Staff Dispatching
                    </span>
                    <button 
                      onClick={() => handleToggleSmart('staffing')}
                      className="p-0 border-0 bg-transparent text-indigo-500 cursor-pointer"
                    >
                      {smartControls.staffing ? <ToggleRight className="w-10 h-6" /> : <ToggleLeft className="w-10 h-6 text-slate-600 dark:text-slate-700" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Microgrid climate alerts */}
            <div className={`p-6 rounded-3xl border text-left space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-850/80' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Sun className="w-4 h-4 text-indigo-500" /> UV & Climate Exposure Status
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light lowercase">
                Direct solar index registered at level 8 (high). Automatic SPF nebulizer active. Shade covers deployed automatically over occupied cabanas.
              </p>
              
              <div className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-2xl text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Localized gale warning: sudden winds up to 14 knots expected at 18:30. Outdoor canvas locked.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: COMPREHENSIVE SPECIALISTS ROSTER LIST */}
      {activeSubTab === 'therapists' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className={`text-lg font-serif font-semibold uppercase ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
                Resort Spa Certified Specialists Roster
              </h3>
              <p className="text-xs text-slate-450 mt-1">Unified directory tracking certifications, status codes, and active patient occupancy.</p>
            </div>
            
            <div className="relative max-w-sm w-full">
              <input 
                type="text"
                placeholder="Search staff and specialization certificates..."
                value={specialistSearch}
                onChange={(e) => setSpecialistSearch(e.target.value)}
                className={`w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-xs font-sans outline-none focus:ring-1 focus:ring-indigo-500`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-[15px]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSpecialists.map((spec) => {
              const isSession = spec.status === 'In Session';
              const isBreak = spec.status === 'On Break';

              return (
                <div 
                  key={spec.id}
                  className={`rounded-3xl p-6 border transition-all hover:shadow-md ${
                    theme === 'dark' ? 'bg-slate-900/60 border-slate-850/80' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={spec.avatar} 
                        alt={spec.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/20" 
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase leading-normal">{spec.name}</h4>
                        <p className="text-indigo-500 font-mono text-[10px] uppercase font-bold tracking-wider">{spec.role}</p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      isSession ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/25' : isBreak ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                    }`}>
                      {spec.status}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-xs border-t border-slate-100/10 pt-4 flex flex-col gap-1 font-sans">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Therapy Expertise:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 lowercase italic">{spec.specialty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Direct Radio No:</span>
                      <span className="font-mono text-slate-600 dark:text-slate-300">{spec.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Shift Availability:</span>
                      <span className="font-semibold">Next guest at {spec.nextTime}</span>
                    </div>
                  </div>

                  {/* Specialist details action buttons */}
                  <div className="mt-6 flex justify-between gap-3">
                    <button 
                      onClick={() => alert(`Contacting ${spec.name} through executive suite channel...`)}
                      className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white w-full text-center transition-all"
                    >
                      Ring Internal Radio
                    </button>
                    <button 
                      onClick={() => {
                        const updated = specialists.map(s => {
                          if (s.id === spec.id) {
                            return { ...s, status: s.status === 'Available' ? 'In Session' : 'Available' } as Specialist;
                          }
                          return s;
                        });
                        setSpecialists(updated);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-350 dark:border-slate-805 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase hover:bg-slate-500/10"
                    >
                      Toggle Duty
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: SPA RESOURCE & INVENTORY STOCK LOGISTICS */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-6 text-left">
          <div>
            <h3 className={`text-lg font-serif font-semibold uppercase ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
              Elite Spa Stock & Replenishment Monitor
            </h3>
            <p className="text-xs text-slate-450 mt-1">Live tracking of high-end essential oils, stone therapies, and Egyptian cotton sheets.</p>
          </div>

          <div className={`p-6 rounded-3xl border ${
            theme === 'dark' ? 'bg-slate-900/60 border-slate-850/80 backdrop-blur' : 'bg-white border-slate-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase font-semibold">
                    <th className="py-4 px-3">Item Classification</th>
                    <th className="py-4 px-3 text-center">Remaining Quantity</th>
                    <th className="py-4 px-3 text-center">Security Level</th>
                    <th className="py-4 px-3">Restock Status</th>
                    <th className="py-4 px-3 text-right">Instant Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-105/5">
                  {inventory.map((item) => {
                    const isCritical = item.stock < item.minStock && item.stock <= 5;
                    const isLow = item.stock < item.minStock && item.stock > 5;

                    return (
                      <tr key={item.id} className="hover:bg-slate-500/5 transition-colors font-sans">
                        <td className="py-4 px-3 font-semibold text-slate-800 dark:text-white uppercase tracking-wider">{item.name}</td>
                        <td className="py-4 px-3 text-center font-mono font-bold text-sm text-indigo-500">{item.stock} {item.unit}</td>
                        <td className="py-4 px-3 text-center font-mono text-slate-400">Min. req: {item.minStock}</td>
                        <td className="py-4 px-3">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCritical ? 'bg-red-500/10 text-red-500 border border-red-500/20' : isLow ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          }`}>
                            {isCritical ? 'Critical Deficiency' : isLow ? 'Low Stock Warning' : 'Optimal Inventory'}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button 
                            onClick={() => {
                              const updated = inventory.map(i => {
                                if (i.id === item.id) {
                                  return { ...i, stock: i.stock + 20, status: 'Optimal' } as InventoryItem;
                                }
                                return i;
                              });
                              setInventory(updated);
                              alert(`Liaison Dispatch: Dispatched emergency order of 20 units of ${item.name}.`);
                            }}
                            className="p-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg border-none"
                          >
                            +20 Units Emergency
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Styled animation rule inserts inside HTML */}
      <style>{`
        .status-pulse {
          animation: pulse-soft 2s infinite;
        }
        @keyframes pulse-soft {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
      `}</style>
    </div>
  );
}
