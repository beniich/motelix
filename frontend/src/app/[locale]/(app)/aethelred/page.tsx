// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { 
  Wine, 
  Search, 
  Plus, 
  Check, 
  Sparkles, 
  Thermometer, 
  Sliders, 
  Grid, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  UserCheck, 
  Layers,
  Percent,
  Compass,
  FileText,
  Bookmark,
  Activity
} from 'lucide-react';

interface WineBottle {
  id: string;
  name: string;
  vintage: string;
  region: string;
  producer: string;
  category: 'Red' | 'White' | 'Champagne';
  status: 'In Stock' | 'Low Stock' | 'Allocated';
  price: number;
  blockchainId: string;
  stockCount: number;
  rackZone: 'Zone A' | 'Zone B' | 'Special Reserve';
  image: string;
}

interface DinnerTable {
  id: number;
  name: string;
  capacity: number;
  guests: number;
  time: string;
  status: 'Available' | 'Occupied' | 'VIP';
  sommelierRequested: boolean;
  assignedWine?: string;
  suggestedPairing?: string;
}

interface AethelredDashboardProps {
  logs: any[];
  onAddLog: (log: any) => void;
}

export default function AethelredDashboard({ logs, onAddLog }: AethelredDashboardProps) {
  // Rare Wine Collection State
  const [wines, setWines] = useState<WineBottle[]>([
    {
      id: 'wine-1',
      name: 'Château Pétrus',
      vintage: '1982',
      region: 'Pomerol, Bordeaux',
      producer: 'Château Pétrus',
      category: 'Red',
      status: 'In Stock',
      price: 12500,
      blockchainId: '0x82A1..3D9E',
      stockCount: 14,
      rackZone: 'Zone A',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'wine-2',
      name: 'Domaine de la Romanée-Conti',
      vintage: '1990',
      region: 'Vosne-Romanée, Burgundy',
      producer: 'DRC',
      category: 'Red',
      status: 'Low Stock',
      price: 18000,
      blockchainId: '0x99B4..2F5A',
      stockCount: 3,
      rackZone: 'Zone A',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'wine-3',
      name: 'Krug Clos d\'Ambonnay',
      vintage: '2000',
      region: 'Champagne',
      producer: 'Krug',
      category: 'Champagne',
      status: 'In Stock',
      price: 3600,
      blockchainId: '0x00C7..1B8C',
      stockCount: 8,
      rackZone: 'Zone B',
      image: 'https://images.unsplash.com/photo-1597290282695-edc43d0e7129?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'wine-4',
      name: 'Screaming Eagle Cabernet',
      vintage: '2012',
      region: 'Napa Valley, USA',
      producer: 'Screaming Eagle',
      category: 'Red',
      status: 'Allocated',
      price: 4900,
      blockchainId: '0xEA12..9A3F',
      stockCount: 2,
      rackZone: 'Special Reserve',
      image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'wine-5',
      name: 'Domaine Leflaive Montrachet',
      vintage: '2015',
      region: 'Côte de Beaune, Burgundy',
      producer: 'Domaine Leflaive',
      category: 'White',
      status: 'In Stock',
      price: 8400,
      blockchainId: '0xDF15..45EF',
      stockCount: 6,
      rackZone: 'Zone B',
      image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'wine-6',
      name: 'Sassicaia Tenuta San Guido',
      vintage: '2018',
      region: 'Bolgheri, Tuscany',
      producer: 'Sassicaia',
      category: 'Red',
      status: 'In Stock',
      price: 450,
      blockchainId: '0x88CC..47BD',
      stockCount: 28,
      rackZone: 'Zone B',
      image: 'https://images.unsplash.com/photo-1543418219-44e2bf8516e7?auto=format&fit=crop&w=150&q=80'
    }
  ]);

  // Seach & Filtering parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedVintage, setSelectedVintage] = useState('All');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<'All' | 'Zone A' | 'Zone B' | 'Special Reserve'>('All');

  // Michelin Restaurant Floor
  const [tables, setTables] = useState<DinnerTable[]>([
    { id: 1, name: 'Table Imperial 1', capacity: 2, guests: 2, time: '7:30 PM', status: 'Occupied', sommelierRequested: false, suggestedPairing: 'Roasted Woodcock & Black Truffle Tartlet' },
    { id: 2, name: 'Table Royal 2', capacity: 4, guests: 0, time: '--:--', status: 'Available', sommelierRequested: false },
    { id: 3, name: 'Table Ducal 3', capacity: 6, guests: 5, time: '8:00 PM', status: 'VIP', sommelierRequested: false, assignedWine: 'Château Pétrus', suggestedPairing: 'Dry-Aged Wagyu Filet with Bone Marrow reduction' },
    { id: 4, name: 'Table Baronial 4', capacity: 2, guests: 2, time: '7:15 PM', status: 'Occupied', sommelierRequested: false, suggestedPairing: 'Seared Wild Mallard Breast' },
    { id: 10, name: 'Table Sovereign 10', capacity: 4, guests: 3, time: '8:30 PM', status: 'Occupied', sommelierRequested: false, suggestedPairing: 'Crisp Sweetbreads and Morels' },
    { id: 11, name: 'Table Knightly 11', capacity: 2, guests: 0, time: '--:--', status: 'Available', sommelierRequested: false },
    { id: 12, name: 'Table Majestic 12', capacity: 4, guests: 4, time: '8:00 PM', status: 'VIP', sommelierRequested: true, suggestedPairing: 'Brittany Blue Lobster & Caviar Flight' },
    { id: 14, name: 'Table Dynasty 14', capacity: 8, guests: 6, time: '8:15 PM', status: 'VIP', sommelierRequested: false, assignedWine: 'Krug Clos d\'Ambonnay', suggestedPairing: 'White Alba Truffle Tagliolini' }
  ]);

  const [selectedTable, setSelectedTable] = useState<DinnerTable | null>(tables.find(t => t.id === 12) || null);

  // Climate readings
  const [zoneATemp, setZoneATemp] = useState(12.6);
  const [zoneBTemp, setZoneBTemp] = useState(13.9);
  const [zoneAHumidity, setZoneAHumidity] = useState(69);
  const [zoneBHumidity, setZoneBHumidity] = useState(71);
  const [showClimateControl, setShowClimateControl] = useState(false);

  // Modals & New Bottle
  const [showAddWineModal, setShowAddWineModal] = useState(false);
  const [newWine, setNewWine] = useState({
    name: '',
    vintage: '2016',
    region: 'Burgundy, France',
    producer: 'Domaine de la Romanée-Conti',
    category: 'Red' as 'Red' | 'White' | 'Champagne',
    price: 1450,
    stockCount: 6,
    rackZone: 'Zone A' as 'Zone A' | 'Zone B' | 'Special Reserve',
  });

  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [successVerifyId, setSuccessVerifyId] = useState<string | null>(null);

  // Dynamic filter lists
  const vintages = ['All', ...Array.from(new Set(wines.map(w => w.vintage)))].sort();

  // Highlight matches
  const filteredWines = wines.filter(wine => {
    const matchesSearch = wine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          wine.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wine.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || wine.category === selectedType;
    const matchesVintage = selectedVintage === 'All' || wine.vintage === selectedVintage;
    const matchesZone = selectedZoneFilter === 'All' || wine.rackZone === selectedZoneFilter;
    return matchesSearch && matchesType && matchesVintage && matchesZone;
  });

  const handleVerifyLedger = (bottleId: string, bottleName: string) => {
    setVerifyingId(bottleId);
    setTimeout(() => {
      setVerifyingId(null);
      setSuccessVerifyId(bottleId);
      onAddLog({
        id: `blockchain-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        module: 'AETHELRED_LEDGER',
        message: `RFID double-handshake secured for ${bottleName}. Origin hash and cellar ledger updated.`,
        type: 'OK'
      });
      setTimeout(() => setSuccessVerifyId(null), 3000);
    }, 1800);
  };

  const handleDispatchSommelier = (tableId: number) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { ...t, sommelierRequested: false };
      }
      return t;
    }));
    
    const table = tables.find(t => t.id === tableId);
    if (selectedTable?.id === tableId) {
      setSelectedTable(prev => prev ? { ...prev, sommelierRequested: false } : null);
    }

    onAddLog({
      id: `sommelier-dispatch-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'SOMMELIER_FLOOR',
      message: `Master Sommelier assigned with rare decanting flight to ${table?.name || `Table ${tableId}`}.`,
      type: 'OK'
    });
  };

  const handleTableStatusChange = (tableId: number, status: 'Available' | 'Occupied' | 'VIP') => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const guests = status === 'Available' ? 0 : t.guests === 0 ? t.capacity : t.guests;
        const time = status === 'Available' ? '--:--' : t.time === '--:--' ? '8:00 PM' : t.time;
        const updated = { ...t, status, guests, time };
        if (selectedTable?.id === tableId) {
          setSelectedTable(updated);
        }
        return updated;
      }
      return t;
    }));

    onAddLog({
      id: `table-status-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'DINING_FLOOR',
      message: `${tables.find(t => t.id === tableId)?.name} status shifted to ${status}.`,
      type: 'INFO'
    });
  };

  const handleServeWineCheck = (tableId: number, wineId: string, wineName: string) => {
    // Check stock
    setWines(prev => prev.map(w => {
      if (w.id === wineId && w.stockCount > 0) {
        const nextStockCount = w.stockCount - 1;
        return { 
          ...w, 
          stockCount: nextStockCount,
          status: nextStockCount === 0 ? 'Allocated' : nextStockCount <= 3 ? 'Low Stock' : 'In Stock'
        };
      }
      return w;
    }));

    // Update seating status
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const updated = { ...t, assignedWine: wineName, status: 'VIP' as const };
        if (selectedTable?.id === tableId) {
          setSelectedTable(updated);
        }
        return updated;
      }
      return t;
    }));

    onAddLog({
      id: `wine-serve-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'ROYAL_CELLARS',
      message: `1 Bottle of ${wineName} poured at ${tables.find(t => t.id === tableId)?.name}. Cellar inventory debited.`,
      type: 'OK'
    });
  };

  const handleAddNewWine = (e: React.FormEvent) => {
    e.preventDefault();
    const randomizedHex = '0x' + Array.from({length: 4}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase() + '..' + Array.from({length: 4}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
    
    const newEntry: WineBottle = {
      id: `wine-${Date.now()}`,
      name: newWine.name,
      vintage: newWine.vintage,
      region: newWine.region,
      producer: newWine.producer || 'Royal Estates',
      category: newWine.category,
      status: newWine.stockCount === 0 ? 'Allocated' : newWine.stockCount <= 3 ? 'Low Stock' : 'In Stock',
      price: newWine.price,
      blockchainId: randomizedHex,
      stockCount: newWine.stockCount,
      rackZone: newWine.rackZone,
      image: newWine.category === 'Red' 
        ? 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=150&q=80'
        : newWine.category === 'White'
        ? 'https://images.unsplash.com/photo-1569919650476-f54aea2000d7?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1594462106202-204599de9029?auto=format&fit=crop&w=150&q=80'
    };

    setWines(prev => [newEntry, ...prev]);
    setShowAddWineModal(false);
    
    onAddLog({
      id: `wine-add-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'AETHELRED_LEDGER',
      message: `Registered rare asset: ${newEntry.vintage} ${newEntry.name} with Blockchain ID ${newEntry.blockchainId}.`,
      type: 'OK'
    });

    // Reset Form
    setNewWine({
      name: '',
      vintage: '2018',
      region: 'Champagne, France',
      producer: 'Dom Pérignon',
      category: 'Champagne',
      price: 850,
      stockCount: 12,
      rackZone: 'Zone A',
    });
  };

  return (
    <div className="space-y-8 pb-12 text-slate-900 dark:text-white">
      
      {/* 1. ROYAL AETHRED HEADER & CONSOLE CONTROLS */}
      <header className="grande-case rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#125f24] text-xs font-mono font-bold uppercase tracking-widest text-[#f9fbe4] rounded-full">
              LEVEL 4 SECURE CONSOLE
            </span>
            <div className="flex items-center gap-1.5 text-[#f9fbe4]">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider font-sans">Aethelred Royal Cellars Initiated</span>
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-black uppercase text-[#f9fbe4] tracking-tight">
            Aethelred Grand Cellars
          </h1>
          <p className="text-sm max-w-2xl text-slate-100/90 leading-relaxed font-sans font-light">
            Luxury multi-tenant RFID registry, climate-locked vaults & Michelin dining floor live controller interface. Synchronized on secure local chain nodes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => setShowClimateControl(true)}
            id="btn-climate-lock"
            className="petite-case px-5 py-3 hover:opacity-90 transition-all font-mono font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2"
          >
            <Thermometer className="w-4 h-4 text-[#f9fbe4]" />
            Cavity Seals: <span className="font-mono text-slate-900 dark:text-white">{(zoneATemp).toFixed(1)}°C</span>
          </button>
          
          <button
            onClick={() => setShowAddWineModal(true)}
            id="btn-register-vintage"
            className="petite-case px-5 py-3 hover:opacity-90 transition-all font-mono font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5 text-[#f9fbe4]" />
            Register Vintage
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* 2. LEFT: SCHEMATIC CAVE ENVIRONMENT & MICRO-WEATHER SENSORS */}
        <section className="col-span-12 xl:col-span-5 flex flex-col gap-6">
          <div className="grande-case rounded-3xl p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-lg text-[#f9fbe4] tracking-tight font-serif uppercase">
                    Interactive Cellar Vault
                  </h3>
                  <span className="text-[10px] text-slate-200 uppercase tracking-widest font-mono font-bold">
                    Atmospheric Cavity Sensors
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#125f24]/80 border border-white/20 rounded-full text-[10px] font-mono font-bold uppercase text-[#f9fbe4]">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping shrink-0" />
                  ATMOSPHERE SECURE
                </div>
              </div>

              {/* Climate Sensors */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="petite-case rounded-2xl p-4 border border-white/10 text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-90 block">
                    Zone A (Grand Cru)
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-mono font-black text-slate-900 dark:text-white">{(zoneATemp).toFixed(1)}°C</span>
                    <span className="text-xs font-mono font-bold text-slate-100">{zoneAHumidity}% HR</span>
                  </div>
                  <div className="w-full bg-[#3a5b3a]/60 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#125f24] h-full" style={{ width: `${zoneAHumidity}%` }}></div>
                  </div>
                </div>

                <div className="petite-case rounded-2xl p-4 border border-white/10 text-left">
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-90 block">
                    Zone B (Lesser Racks)
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-mono font-black text-slate-900 dark:text-white">{(zoneBTemp).toFixed(1)}°C</span>
                    <span className="text-xs font-mono font-bold text-slate-100">{zoneBHumidity}% HR</span>
                  </div>
                  <div className="w-full bg-[#3a5b3a]/60 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#125f24] h-full" style={{ width: `${zoneBHumidity}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Interactive map zone selectors */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {(['All', 'Zone A', 'Zone B', 'Special Reserve'] as const).map((z) => (
                  <button
                    key={z}
                    onClick={() => setSelectedZoneFilter(z)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all border ${
                      selectedZoneFilter === z
                        ? 'bg-[#125f24] border-[#f9fbe4] text-[#f9fbe4] shadow-md'
                        : 'bg-black/20 border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {z === 'Special Reserve' ? 'Vault' : z}
                  </button>
                ))}
              </div>

              {/* Architectural CAD schematic */}
              <div className="relative flex-grow flex flex-col items-center justify-center bg-black/20 rounded-3xl border border-dashed border-white/15 p-6 overflow-hidden">
                <span className="absolute top-3 left-3 text-[9px] font-mono font-extrabold uppercase text-[#f9fbe4]/70">
                  CELLAR LAYOUT SCHEMATIC
                </span>
                
                <div className="relative w-full max-w-sm aspect-[4/3] flex items-center justify-center p-2">
                  <svg className="w-full h-auto" viewBox="0 0 400 300">
                    <g transform="translate(0, 10)">
                      {/* Boundary mapping */}
                      <path 
                        d="M 30 260 L 30 60 A 170 170 0 0 1 370 60 L 370 260 Z" 
                        fill="none" 
                        stroke="rgba(249, 251, 228, 0.2)" 
                        strokeWidth="1.5" 
                        strokeDasharray="5 5" 
                      />
                      
                      {/* Inner arch - Zone A */}
                      <path 
                        onClick={() => setSelectedZoneFilter('Zone A')}
                        className={`cursor-pointer transition-all ${
                          selectedZoneFilter === 'Zone A' 
                            ? 'stroke-[#125f24] opacity-100 stroke-[40px]' 
                            : 'stroke-[#125f24]/30 hover:stroke-[#125f24]/60 stroke-[32px]'
                        }`} 
                        d="M 70 240 A 130 130 0 0 1 330 240" 
                        fill="none" 
                      />
                      
                      {/* Outer arch - Zone B */}
                      <path 
                        onClick={() => setSelectedZoneFilter('Zone B')}
                        className={`cursor-pointer transition-all ${
                          selectedZoneFilter === 'Zone B' 
                            ? 'stroke-emerald-950 opacity-100 stroke-[40px]' 
                            : 'stroke-emerald-950/30 hover:stroke-emerald-950/60 stroke-[32px]'
                        }`} 
                        d="M 120 240 A 80 80 0 0 1 280 240" 
                        fill="none" 
                      />

                      {/* Structural lines and core focus indicator */}
                      <path d="M 30 240 L 15 240 M 370 240 L 385 240" stroke="rgba(249, 251, 228, 0.4)" strokeWidth="2" />
                      <circle cx="200" cy="240" r="14" fill="#3a5b3a" stroke="#f9fbe4" strokeWidth="1.5" strokeDasharray="3 3" />
                    </g>
                  </svg>

                  {/* Interacting Map Pin Overlays */}
                  <div 
                    onClick={() => setSelectedZoneFilter('Zone A')}
                    className="absolute top-[28%] left-[22%] bg-[#125f24] px-2.5 py-1.5 rounded-xl border border-[#f9fbe4]/30 text-left cursor-pointer hover:scale-105 transition-transform shadow-lg"
                  >
                    <p className="text-[10px] font-mono font-bold text-[#f9fbe4]">Zone A Cru</p>
                    <p className="text-[9px] text-slate-900 dark:text-white opacity-90 font-mono">17 Bottles</p>
                  </div>

                  <div 
                    onClick={() => setSelectedZoneFilter('Zone B')}
                    className="absolute top-[52%] right-[12%] bg-[#125f24] px-2.5 py-1.5 rounded-xl border border-[#f9fbe4]/30 text-left cursor-pointer hover:scale-105 transition-transform shadow-lg"
                  >
                    <p className="text-[10px] font-mono font-bold text-[#f9fbe4]">Zone B Base</p>
                    <p className="text-[9px] text-slate-900 dark:text-white opacity-90 font-mono">34 Bottles</p>
                  </div>

                  <div 
                    onClick={() => setSelectedZoneFilter('Special Reserve')}
                    className="absolute bottom-[28%] left-1/2 -translate-x-1/2 bg-[#125f24] px-3.5 py-2 rounded-xl border-2 border-yellow-500/60 text-center cursor-pointer hover:scale-105 transition-transform shadow-xl"
                  >
                    <p className="text-[10px] font-mono font-black text-[#f9fbe4] uppercase tracking-wider">Royal Vault</p>
                    <span className="text-[9px] text-yellow-300 font-bold font-mono">SECURE</span>
                  </div>
                </div>

                {selectedZoneFilter !== 'All' && (
                  <button 
                    onClick={() => setSelectedZoneFilter('All')}
                    className="mt-2 text-[11px] font-mono font-bold text-[#f9fbe4] hover:underline uppercase tracking-widest cursor-pointer"
                  >
                    &times; Clear schematic filter
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowClimateControl(true)}
                className="w-full petite-case py-3.5 hover:opacity-90 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Sliders className="w-4.5 h-4.5 text-[#f9fbe4]" />
                Re-Calibrate Cryptic Fans & Alarms
              </button>
            </div>
          </div>
        </section>

        {/* 3. RIGHT: DETAILED RARE LEDGER & MICHELIN SEATING MAP */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-8">
          
          {/* LEDGER RARE COI COLLECTION */}
          <section className="grande-case rounded-3xl p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-xl text-[#f9fbe4] font-serif uppercase flex items-center gap-2.5">
                    <Wine className="w-5.5 h-5.5 text-yellow-400" />
                    Rare Bottles Wine Ledger
                  </h3>
                  <p className="text-[10px] text-slate-100/80 uppercase tracking-wider font-mono">
                    Dynamic Cryptographic Provenance Track
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#125f24] text-white border border-white/20 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-white"
                  >
                    <option value="All">All Types</option>
                    <option value="Red">Red / Rouge</option>
                    <option value="White">White / Blanc</option>
                    <option value="Champagne">Champagne</option>
                  </select>

                  <select
                    value={selectedVintage}
                    onChange={(e) => setSelectedVintage(e.target.value)}
                    className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#125f24] text-white border border-white/20 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-white"
                  >
                    <option value="All">All Vintages</option>
                    {vintages.filter(v => v !== 'All').map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filtering Registry Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-mono bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#f9fbe4] text-white placeholder-slate-300"
                  placeholder="Query vintage name, champagne cuvée, region description..."
                />
                <Search className="h-4.5 w-4.5 absolute left-3.5 top-3.5 text-slate-200" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-lg text-slate-400 hover:text-slate-900 dark:text-white"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* Live Catalog Table */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-700 dark:text-[#f9fbe4] font-mono tracking-wider uppercase text-[10px] py-2">
                      <th className="py-3 px-2">Bottle Descriptor</th>
                      <th className="py-3 px-2">Region / Producer</th>
                      <th className="py-3 px-2">Atmosphere Zone</th>
                      <th className="py-3 px-2 text-right">Market Price</th>
                      <th className="py-3 px-2 text-center">RFID Stock</th>
                      <th className="py-3 px-2 text-right">Blockchain Handshake</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredWines.map((wine) => (
                      <tr key={wine.id} className="hover:bg-white/5 transition-colors">
                        {/* Descriptor */}
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-11 bg-black/30 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                              <img src={wine.image} alt={wine.name} className="h-9 w-auto object-contain" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block text-sm">{wine.name}</span>
                              <span className="text-[10px] text-yellow-400 font-mono font-black uppercase">
                                {wine.vintage} &mdash; {wine.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Region */}
                        <td className="py-4 px-2 text-slate-100">
                          <p className="font-semibold text-xs">{wine.region}</p>
                          <p className="text-[9.5px] italic text-slate-500 dark:text-[#f9fbe4]/80 font-serif">{wine.producer}</p>
                        </td>

                        {/* Zone Location */}
                        <td className="py-4 px-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase bg-black/25 border ${
                            wine.rackZone === 'Zone A' 
                              ? 'border-[#f9fbe4] text-[#f9fbe4]' 
                              : wine.rackZone === 'Zone B'
                              ? 'border-indigo-400 text-indigo-200'
                              : 'border-yellow-400 text-yellow-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              wine.rackZone === 'Zone A' ? 'bg-[#f9fbe4]' : wine.rackZone === 'Zone B' ? 'bg-indigo-400' : 'bg-yellow-400'
                            }`} />
                            {wine.rackZone === 'Special Reserve' ? 'Vault' : wine.rackZone}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-2 text-right font-mono font-black text-slate-800 dark:text-[#f9fbe4] text-sm">
                          €{wine.price.toLocaleString()}
                        </td>

                        {/* Quantitative Stock */}
                        <td className="py-4 px-2 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-mono font-black text-slate-900 dark:text-white text-sm">{wine.stockCount}</span>
                            <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded mt-1 border ${
                              wine.stockCount === 0 
                                ? 'bg-red-950 text-red-400 border-red-800' 
                                : wine.stockCount <= 3 
                                ? 'bg-yellow-950 text-yellow-400 border-yellow-800 animate-pulse' 
                                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            }`}>
                              {wine.status}
                            </span>
                          </div>
                        </td>

                        {/* Serve Table / Ledger Verification */}
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {wine.stockCount > 0 && selectedTable && selectedTable.status !== 'Available' && (
                              <button
                                onClick={() => handleServeWineCheck(selectedTable.id, wine.id, wine.name)}
                                className="px-3 py-1 bg-[#125f24] hover:opacity-90 border border-[#f9fbe4]/30 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-white transition-opacity"
                                title={`Serve to ${selectedTable.name}`}
                              >
                                Decant {selectedTable.id}
                              </button>
                            )}

                            {verifyingId === wine.id ? (
                              <div className="text-[9px] font-mono font-bold text-yellow-300 flex items-center gap-1 bg-yellow-950/40 px-2 py-1 rounded-lg">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                SCANNING
                              </div>
                            ) : successVerifyId === wine.id ? (
                              <div className="text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/20 animate-bounce">
                                <ShieldCheck className="w-3 h-3" />
                                SECURED
                              </div>
                            ) : (
                              <button
                                onClick={() => handleVerifyLedger(wine.id, wine.name)}
                                className="px-3 py-1 bg-[#125f24] hover:opacity-90 rounded-full font-mono font-bold uppercase text-[9px] tracking-widest text-[#f9fbe4] border border-[#f9fbe4]/30 transition-all shadow-sm"
                                title="Authenticate RFID blockchain proof of seal."
                              >
                                {wine.blockchainId}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-200">
              <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-yellow-400" /> LEDGER STANDARD: ROYAL-CHAIN-SECURE v24</span>
              <span>SIGNATURE DOUBLE LOCK CRYPTO COI</span>
            </div>
          </section>

          {/* MICHELIN DINING LIVE PLAN FLOOR "LE DIAMANT NOIR" */}
          <section className="grande-case rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-bold text-xl text-[#f9fbe4] font-serif uppercase flex items-center gap-2.5">
                  <Grid className="w-5.5 h-5.5 text-yellow-400" />
                  Live Dining Floor Plan: "Le Diamant Noir"
                </h3>
                <p className="text-[10px] text-slate-100/85 uppercase tracking-wider font-mono">
                  Seating Grid Controllers, Sommelier Alerts & Live VIP Flights
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono font-bold uppercase">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#125f24] text-[#f9fbe4]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#125f24] text-[#f9fbe4]">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> Occupied
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#125f24] text-[#f9fbe4]">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span> VIP Status
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Table Seating Schematic Map */}
              <div className="lg:col-span-7 bg-black/20 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between min-h-[300px]">
                <span className="absolute top-2.5 left-2.5 text-[8.5px] font-mono text-slate-200 font-extrabold uppercase tracking-widest">
                  Live Placement Controller Map
                </span>
                
                <div className="grid grid-cols-4 gap-6 justify-items-center items-center my-auto py-8">
                  {tables.map((table) => {
                    let bgStyle = 'bg-[#3a5b3a] border-[#f9fbe4]/30';
                    let coreLight = 'bg-emerald-400';
                    
                    if (table.status === 'Occupied') {
                      bgStyle = 'bg-indigo-950 border-indigo-400/50';
                      coreLight = 'bg-indigo-400';
                    } else if (table.status === 'VIP' || table.sommelierRequested) {
                      bgStyle = 'bg-[#125f24] border-yellow-400';
                      coreLight = 'bg-yellow-400';
                    }

                    const isSelected = selectedTable?.id === table.id;

                    return (
                      <div key={table.id} className="relative flex flex-col items-center">
                        <button
                          onClick={() => setSelectedTable(table)}
                          className={`w-14 h-14 rounded-full ${bgStyle} border-2 shadow-xl cursor-pointer hover:scale-110 transition-all flex flex-col items-center justify-center relative ${
                            isSelected ? 'ring-4 ring-yellow-400/80 scale-105' : ''
                          }`}
                        >
                          <span className="text-[12px] font-mono font-black text-slate-900 dark:text-white">T-{table.id}</span>
                          <span className={`w-2 h-2 rounded-full ${coreLight} mt-0.5`} />
                          
                          {/* Sommelier Alert Ping */}
                          {table.sommelierRequested && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-650 border border-white rounded-full flex items-center justify-center text-[9px] font-black font-mono text-white animate-bounce">
                              !
                            </span>
                          )}
                        </button>

                        <span className="text-[8.5px] font-mono font-bold text-[#f9fbe4] text-center max-w-[65px] truncate mt-1.5 block">
                          {table.name.split(' ')[1]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {tables.some(t => t.sommelierRequested) && (
                  <div className="bg-red-950/40 border border-red-800/60 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between text-xs font-mono font-bold gap-3">
                    <span className="flex items-center gap-2 text-red-300">
                      <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
                      Dispatch Sommelier Pending on Table 12!
                    </span>
                    <button
                      onClick={() => handleDispatchSommelier(12)}
                      className="px-3.5 py-1.5 bg-[#125f24] hover:opacity-90 text-white font-mono font-bold uppercase rounded-lg text-[9px] tracking-wider border border-[#f9fbe4]/30"
                    >
                      Dispatch Sommelier Laurent
                    </button>
                  </div>
                )}
              </div>

              {/* Seating controls parameters */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                {selectedTable ? (
                  <div className="petite-case rounded-2xl p-5 border border-white/10 space-y-4 text-left">
                    <div className="flex items-start justify-between pb-3 border-b border-white/10">
                      <div>
                        <h4 className="font-serif font-bold text-[#f9fbe4] text-sm uppercase">
                          {selectedTable.name}
                        </h4>
                        <p className="text-[10px] text-slate-100 font-mono mt-0.5">
                          CAPACITY: {selectedTable.guests}/{selectedTable.capacity} SEATS
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase ${
                        selectedTable.status === 'Available' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        selectedTable.status === 'Occupied' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                        'bg-yellow-950 text-yellow-300 border border-yellow-600'
                      }`}>
                        {selectedTable.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-slate-100">
                      <div className="flex justify-between items-center bg-black/10 p-2 rounded">
                        <span>Check-In Time:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedTable.time}</span>
                      </div>
                      
                      <div className="flex justify-between items-start bg-black/10 p-2 rounded">
                        <span>Assigned Rare Flight:</span>
                        <span className="font-bold text-yellow-350 text-right">
                          {selectedTable.assignedWine || 'Awaiting Selection'}
                        </span>
                      </div>

                      {selectedTable.suggestedPairing && (
                        <div className="bg-[#125f24]/30 border border-white/10 p-3 rounded-lg flex items-start gap-2 mt-2">
                          <Bookmark className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="text-[9.5px] uppercase font-bold text-[#f9fbe4] tracking-wider block">Gourmet Pairing Guide</span>
                            <p className="text-[11px] font-serif text-slate-900 dark:text-white italic leading-snug">
                              "{selectedTable.suggestedPairing}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Operational controls */}
                    <div className="space-y-2.5 pt-2">
                      <p className="text-[10px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold">
                        Assign Occupancy status
                      </p>
                      
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => handleTableStatusChange(selectedTable.id, 'Available')}
                          className={`py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all border ${
                            selectedTable.status === 'Available' 
                              ? 'bg-[#125f24] border-[#f9fbe4] text-[#f9fbe4]' 
                              : 'bg-black/20 border-white/10 text-white hover:text-[#f9fbe4]'
                          }`}
                        >
                          Vacant
                        </button>
                        <button
                          onClick={() => handleTableStatusChange(selectedTable.id, 'Occupied')}
                          className={`py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all border ${
                            selectedTable.status === 'Occupied' 
                              ? 'bg-indigo-950 border-indigo-400 text-indigo-200' 
                              : 'bg-black/20 border-white/10 text-white hover:text-[#f9fbe4]'
                          }`}
                        >
                          Seated
                        </button>
                        <button
                          onClick={() => handleTableStatusChange(selectedTable.id, 'VIP')}
                          className={`py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all border ${
                            selectedTable.status === 'VIP' 
                              ? 'bg-[#125f24] border-yellow-400 text-yellow-300' 
                              : 'bg-black/20 border-white/10 text-white hover:text-[#f9fbe4]'
                          }`}
                        >
                          VIP
                        </button>
                      </div>
                    </div>

                    {/* Dispatch Services */}
                    <div className="pt-2">
                      {selectedTable.sommelierRequested ? (
                        <button
                          onClick={() => handleDispatchSommelier(selectedTable.id)}
                          className="w-full py-3 bg-red-700 hover:bg-opacity-95 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow animate-pulse"
                        >
                          <UserCheck className="w-4.5 h-4.5 text-yellow-300" />
                          ALARM ACTIVE: SEND SOMMELIER
                        </button>
                      ) : (
                        <div className="p-3 bg-black/10 rounded-xl border border-white/5 flex items-center gap-2 text-[10px] text-[#f9fbe4] font-mono font-bold justify-center">
                          <Check className="w-4 h-4 text-emerald-400" />
                          SOMMELIER CHANNELS ONLINE
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-black/20 border border-white/10 flex flex-col items-center justify-center text-center text-slate-100 min-h-[160px]">
                    <Wine className="w-8 h-8 text-[#f9fbe4] opacity-50 mb-2 animate-bounce" />
                    <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#f9fbe4]/90">
                      No Table Selector Highlighted
                    </p>
                    <p className="text-[10px] text-slate-200 mt-1 max-w-[200px] leading-relaxed">
                      Select any active seating suite on the Michelin floor controller schematic to assign premium poured bottles.
                    </p>
                  </div>
                )}

                {/* Day covers */}
                <div className="petite-case grid grid-cols-2 gap-4 p-5 rounded-2xl border border-white/10 text-left">
                  <div>
                    <span className="text-[9.5px] uppercase tracking-wider text-[#f9fbe4] font-mono font-bold block">
                      Michelin Covers Today
                    </span>
                    <span className="text-2xl font-serif font-black text-slate-900 dark:text-white mt-1 block">45 COVERS</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase tracking-wider text-[#f9fbe4] font-mono font-bold block">
                      VIP Royal Suites Seated
                    </span>
                    <span className="text-2xl font-serif text-yellow-300 font-black mt-1 block">8 SUITES</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>

      {/* CLIMATE BARRIER RE-REGULATOR CONTROL SLIDES */}
      {showClimateControl && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#3a5b3a] text-white rounded-[2rem] border-2 border-[#f9fbe4]/30 shadow-2xl overflow-hidden relative p-8 text-left">
            <button
              onClick={() => setShowClimateControl(false)}
              className="absolute top-5 right-5 text-2xl text-[#f9fbe4] hover:text-slate-900 dark:text-white transition-colors"
            >
              &times;
            </button>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <Thermometer className="w-7 h-7 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#f9fbe4] uppercase">Precise Climate Chamber</h3>
                  <p className="text-[10px] text-slate-100 font-mono font-semibold uppercase tracking-wider">Aethelred Core Settings</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Zone A slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-slate-100">Zone A temperature (Grand Cru)</span>
                    <span className="text-yellow-300 font-black">{(zoneATemp).toFixed(1)}°C</span>
                  </div>
                  <input
                    type="range"
                    min="10.0"
                    max="16.0"
                    step="0.1"
                    value={zoneATemp}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setZoneATemp(val);
                      if (val > 15) {
                        onAddLog({
                          id: `climate-warn-${Date.now()}`,
                          time: new Date().toLocaleTimeString(),
                          module: 'CELLAR_IOT_ALARM',
                          message: `Zone A climate readings elevated! Ambient tempering system adapting power.`,
                          type: 'WARN'
                        });
                      }
                    }}
                    className="w-full accent-[#f9fbe4] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#f9fbe4] font-mono">
                    <span>Low (10°C)</span>
                    <span>High (16°C)</span>
                  </div>
                </div>

                {/* Zone B Temp */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-slate-100">Zone B temperature (Lesser Racks)</span>
                    <span className="text-[#f9fbe4] font-black">{(zoneBTemp).toFixed(1)}°C</span>
                  </div>
                  <input
                    type="range"
                    min="12.0"
                    max="18.0"
                    step="0.1"
                    value={zoneBTemp}
                    onChange={(e) => setZoneBTemp(parseFloat(e.target.value))}
                    className="w-full accent-[#125f24] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-900 dark:text-white/70 font-mono">
                    <span>Low (12°C)</span>
                    <span>High (18°C)</span>
                  </div>
                </div>

                {/* Relative micro Hr humidity numbers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <label className="block text-[10px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold">Zone A Hr %</label>
                    <input
                      type="number"
                      value={zoneAHumidity}
                      onChange={(e) => setZoneAHumidity(parseInt(e.target.value) || 60)}
                      className="w-full p-2.5 rounded-xl border border-[#f9fbe4]/30 bg-black/20 text-white text-xs font-mono focus:ring-1 focus:ring-[#f9fbe4]"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="block text-[10px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold">Zone B Hr %</label>
                    <input
                      type="number"
                      value={zoneBHumidity}
                      onChange={(e) => setZoneBHumidity(parseInt(e.target.value) || 60)}
                      className="w-full p-2.5 rounded-xl border border-[#f9fbe4]/30 bg-black/20 text-white text-xs font-mono focus:ring-1 focus:ring-[#f9fbe4]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowClimateControl(false)}
                  className="px-5 py-2.5 bg-[#125f24] hover:opacity-90 border border-[#f9fbe4]/30 text-white text-xs font-mono font-black uppercase tracking-widest rounded-xl transition-all shadow"
                >
                  Apply Chamber Seals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RARE BOTTLE SIGNATURE REGISTER FORM BLOCK MODAL */}
      {showAddWineModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#3a5b3a] text-white rounded-[2rem] border-2 border-[#f9fbe4]/30 shadow-2xl overflow-hidden relative p-8 text-left">
            <button
              onClick={() => setShowAddWineModal(false)}
              className="absolute top-5 right-5 text-2xl text-[#f9fbe4] hover:text-slate-900 dark:text-white transition-colors"
            >
              &times;
            </button>
            
            <form onSubmit={handleAddNewWine} className="space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <Wine className="w-7 h-7 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-serif font-extrabold uppercase text-[#f9fbe4]">Register Royal Vintage</h3>
                  <p className="text-[10px] text-slate-100 font-mono uppercase tracking-wider">Blockchain RFID Tagging Integration</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="lg:text-[10.5px] text-[9.5px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold mb-1.5 block">
                    Wine Bottle Name / Cuvée Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={newWine.name}
                    onChange={(e) => setNewWine({ ...newWine, name: e.target.value })}
                    className="w-full p-3 font-sans rounded-xl border border-white/15 bg-black/20 text-white text-xs focus:ring-1 focus:ring-[#f9fbe4]"
                    placeholder="e.g. Château Mouton Rothschild"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9.5px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold mb-1.5 block">
                      Vintage Year
                    </label>
                    <input
                      type="text"
                      required
                      value={newWine.vintage}
                      onChange={(e) => setNewWine({ ...newWine, vintage: e.target.value })}
                      className="w-full p-3 rounded-xl border border-white/15 bg-black/20 text-white text-xs font-mono focus:ring-1 focus:ring-[#f9fbe4]"
                      placeholder="e.g. 1995"
                    />
                  </div>
                  <div>
                    <label className="text-[9.5px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold mb-1.5 block">
                      Producer Castle / Domain
                    </label>
                    <input
                      type="text"
                      required
                      value={newWine.producer}
                      onChange={(e) => setNewWine({ ...newWine, producer: e.target.value })}
                      className="w-full p-3 rounded-xl border border-white/15 bg-black/20 text-white text-xs focus:ring-1 focus:ring-[#f9fbe4]"
                      placeholder="e.g. Rothschild Vineyards"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9.5px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold mb-1.5 block">
                    Origin Region & Appellation Map Coordinates
                  </label>
                  <input
                    type="text"
                    required
                    value={newWine.region}
                    onChange={(e) => setNewWine({ ...newWine, region: e.target.value })}
                    className="w-full p-3 rounded-xl border border-white/15 bg-black/20 text-white text-xs focus:ring-1 focus:ring-[#f9fbe4]"
                    placeholder="e.g. Pauillac, Bordeaux"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9.5px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold mb-1.5 block">
                      Category Type
                    </label>
                    <select
                      value={newWine.category}
                      onChange={(e) => setNewWine({ ...newWine, category: e.target.value as any })}
                      className="w-full p-3 rounded-xl border border-white/15 bg-[#125f24] text-white text-xs font-mono focus:ring-1 focus:ring-[#f9fbe4]"
                    >
                      <option value="Red">Red / Rouge</option>
                      <option value="White">White / Blanc</option>
                      <option value="Champagne">Champagne</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9.5px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold mb-1.5 block">
                      Market Value (€)
                    </label>
                    <input
                      type="number"
                      required
                      value={newWine.price}
                      onChange={(e) => setNewWine({ ...newWine, price: parseInt(e.target.value) || 1 })}
                      className="w-full p-3 rounded-xl border border-white/15 bg-black/20 text-white text-xs font-mono focus:ring-1 focus:ring-[#f9fbe4]"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold mb-1.5 block">
                      Initial Qty Stock
                    </label>
                    <input
                      type="number"
                      required
                      value={newWine.stockCount}
                      onChange={(e) => setNewWine({ ...newWine, stockCount: parseInt(e.target.value) || 1 })}
                      className="w-full p-3 rounded-xl border border-white/15 bg-black/20 text-white text-xs font-mono focus:ring-1 focus:ring-[#f9fbe4]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9.5px] text-[#f9fbe4] uppercase tracking-widest font-mono font-bold mb-1.5 block">
                      Target Air Zone
                    </label>
                    <select
                      value={newWine.rackZone}
                      onChange={(e) => setNewWine({ ...newWine, rackZone: e.target.value as any })}
                      className="w-full p-3 rounded-xl border border-white/15 bg-[#125f24] text-white text-xs font-mono focus:ring-1 focus:ring-[#f9fbe4]"
                    >
                      <option value="Zone A">Zone A (Grand Cru)</option>
                      <option value="Zone B">Zone B (Mid-Racks)</option>
                      <option value="Special Reserve">Special Royal Vault</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <span className="text-[10px] text-yellow-300 font-mono font-bold block uppercase bg-black/20 p-2.5 rounded-xl border border-[#f9fbe4]/20">
                      🔐 Token-handshake active
                    </span>
                  </div>
                </div>

              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddWineModal(false)}
                  className="px-5 py-2.5 bg-black/25 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-black/40 transition-all border border-white/10"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#125f24] hover:opacity-95 text-[#f9fbe4] text-xs font-mono font-black uppercase tracking-widest rounded-xl transition-all border border-[#f9fbe4]/40"
                >
                  Write & Lock Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
