/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CarNode, SystemLog } from '../types';
import { INITIAL_CARS } from '../data';
import { 
  Shield, 
  Eye, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  Layers, 
  Cpu, 
  Car, 
  Bell, 
  User, 
  LayoutGrid, 
  BarChart3, 
  Settings, 
  Activity,
  Plus,
  Minus
} from 'lucide-react';

interface ValetDashboardProps {
  logs: SystemLog[];
  onAddLog: (log: SystemLog) => void;
}

export default function ValetDashboard({ logs, onAddLog }: ValetDashboardProps) {
  const [cars, setCars] = useState<CarNode[]>(INITIAL_CARS);
  const [selectedFloor, setSelectedFloor] = useState<1 | 2 | 3>(1);
  const [selectedCar, setSelectedCar] = useState<CarNode | null>(INITIAL_CARS[0]);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleOutputs, setConsoleOutputs] = useState<string[]>([
    'System established at gate LPR terminal.',
    'Light Mode Enterprise Luxury Theme activated.',
    'Type "HELP" or "RETRIEVE [Plate]" in the console.'
  ]);
  const [retrievingCars, setRetrievingCars] = useState<Record<string, number>>({});
  
  // Custom camera zoom/rotate interactive states
  const [garageRotation, setGarageRotation] = useState<number>(-35);
  const [garagePitch, setGaragePitch] = useState<number>(55);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // LPR Feeds matching Image layout format (Unsplash cars)
  const lprFeeds = [
    { plate: 'ABC 1234', model: 'BMW i7 Sedan', owner: 'Guest 1105', status: 'Inbound', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=200&q=80' },
    { plate: 'B894 DXG', model: 'Tesla Model S', owner: 'Guest 1204', status: 'Parked', img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=200&q=80' },
    { plate: 'P901 LHB', model: 'Porsche Taycan', owner: 'Guest 809', status: 'Retrieving', img: 'https://images.unsplash.com/photo-1611245147563-31f01dc8ccce?auto=format&fit=crop&w=200&q=80' },
    { plate: 'EQS 512M', model: 'Mercedes EQS SUV', owner: 'Guest 512', status: 'Verifying', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=200&q=80' }
  ];

  // System real-time load simulation points
  const [loadPoints, setLoadPoints] = useState<number[]>([35, 62, 44, 78, 52, 68]);

  // Periodic simulated load fluctuations
  useEffect(() => {
    const handle = setInterval(() => {
      setLoadPoints(prev => {
        const next = [...prev.slice(1), Math.floor(40 + Math.random() * 45)];
        return next;
      });
    }, 4500);
    return () => clearInterval(handle);
  }, []);

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const cmd = consoleInput.toUpperCase().trim();
    const parts = cmd.split(' ');
    let output = '';

    if (cmd === 'HELP') {
      output = 'ALIVE COMMANDS: RETRIEVE [Label], CHARGE [Label], STATUS, RESET_PERSPECTIVE';
    } else if (parts[0] === 'RETRIEVE') {
      const label = parts[1];
      const targetCar = cars.find(c => c.label.toUpperCase() === label);
      if (targetCar) {
        startRetrieval(targetCar.id);
        output = `Initiating automated retrieval on Floor ${targetCar.floor} for plate label [${targetCar.label}].`;
      } else {
        output = `Error: Plate label [${label}] not found.`;
      }
    } else if (parts[0] === 'CHARGE') {
      const label = parts[1];
      const targetCarIndex = cars.findIndex(c => c.label.toUpperCase() === label);
      if (targetCarIndex !== -1) {
        const updated = [...cars];
        updated[targetCarIndex] = { ...updated[targetCarIndex], battery: 100 };
        setCars(updated);
        output = `Induction charge initiated for ${updated[targetCarIndex].model}. Battery: 100%`;
      } else {
        output = `Error: Vehicle [${label}] not located.`;
      }
    } else if (cmd === 'STATUS') {
      const parkedCount = cars.filter(c => c.status === 'Parked').length;
      const retrievingCount = cars.filter(c => c.status !== 'Parked').length;
      output = `VALET_STATUS: ${parkedCount} Parked, ${retrievingCount} Active requests. Spots filled: ${cars.length}/100.`;
    } else if (cmd === 'RESET_PERSPECTIVE') {
      setGarageRotation(-35);
      setGaragePitch(55);
      setZoomLevel(1.0);
      output = 'Isometric physical perspective coordinates reset.';
    } else {
      output = `Command schema not recognized: "${cmd}". Type HELP for guidance.`;
    }

    setConsoleOutputs(prev => [...prev.slice(-8), `> ${consoleInput}`, output]);
    setConsoleInput('');

    onAddLog({
      id: `l-valet-console-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'VALET_MGR',
      type: 'INFO',
      message: `Console: ${output}`
    });
  };

  const startRetrieval = (id: string) => {
    if (retrievingCars[id] !== undefined) return;
    
    setRetrievingCars(prev => ({ ...prev, [id]: 0 }));
    setCars(prev => prev.map(c => c.id === id ? { ...c, status: 'Retrieving' } : c));

    onAddLog({
      id: `l-valet-starts-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'VALET_MGR',
      type: 'WARN',
      message: `Automatic retrieval sequence initialized for vehicle ID: ${id}.`
    });

    const checkInterval = setInterval(() => {
      setRetrievingCars(prev => {
        const current = prev[id];
        if (current === undefined) {
          clearInterval(checkInterval);
          return prev;
        }
        if (current >= 100) {
          clearInterval(checkInterval);
          setCars(carsPrev => carsPrev.map(c => c.id === id ? { ...c, status: 'Ready' } : c));
          onAddLog({
            id: `l-valet-done-${Date.now()}`,
            time: new Date().toLocaleTimeString(),
            module: 'VALET_MGR',
            type: 'OK',
            message: `Vehicle successfully delivered to VIP Lobby exit gate.`
          });
          return { ...prev, [id]: 100 };
        }
        return { ...prev, [id]: current + 20 };
      });
    }, 1200);
  };

  const handleSpotClick = (car: CarNode) => {
    setSelectedCar(car);
  };

  const handleRescueStop = () => {
    setRetrievingCars({});
    setCars(prev => prev.map(c => c.status === 'Retrieving' ? { ...c, status: 'Parked' } : c));
    onAddLog({
      id: `l-valet-emerg-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'VALET_SYS',
      type: 'ERROR',
      message: 'EMERGENCY SHUTDOWN TRIGGERED. Core parking grids locked down!'
    });
    alert('Emergency Stop Activated: All vehicle physical movement patterns frozen.');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 rounded-3xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-xl overflow-hidden text-left space-y-6 shadow-glow-purple">
      
      {/* HEADER SECTION (Enterprise Status & Logo Banner) */}
      <div className="bg-white dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800/80 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm select-none gap-4">
        <div>
          <div className="flex items-center gap-3">
            {/* Majestic Aurum Vector Shield Logo */}
            <svg className="w-8 h-8 text-[#C5A059]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2z"></path>
              <path d="M12 2v20"></path>
              <path d="M7 12h10"></path>
            </svg>
            <div className="flex items-baseline space-x-2">
              <span className="text-gradient-gold text-2xl font-black tracking-wider font-serif">AURUM</span>
              <span className="text-slate-800 dark:text-[#F8F9FA] text-base font-bold uppercase tracking-wider font-mono">VALET & PARKING CTRL</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active multi-level spatial mapping, localized induction charging grids, and automated digital retrieval queues.
          </p>
        </div>

        {/* Live operational badges and counters (Image style) */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono font-medium text-slate-500">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 rounded-full animate-pulse shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 
            Operational: <b className="font-bold">Online</b>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 dark:bg-indigo-500/10 text-[#7B61FF] dark:text-indigo-400 border border-violet-100 dark:border-indigo-505/20 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#7B61FF] rounded-full"></span> 
            Compliance: <b className="font-bold">Secure</b>
          </span>
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300">
            Active Requests: <b className="font-bold text-slate-900 dark:text-white">{Object.keys(retrievingCars).length}</b>
          </span>
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300">
            Available Spots: <b className="font-bold text-slate-900 dark:text-white">{100 - cars.length}</b>
          </span>
        </div>
      </div>

      {/* CORE 3D INTERACTIVE AREA & RIGHT-SIDE PLATE DETECTOR FEED (Cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COMPONENT: 3D Isometric View floor plans (Col Span 8) */}
        <div className="xl:col-span-8 flex flex-col justify-between bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm min-h-[480px] relative shadow-glow-purple">
          
          <div className="flex justify-between items-start z-10 select-none">
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest font-mono">
                Grid Floor Telemetry (Isometric Scene)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1">
                Interact with custom coordinate vectors to inspect physical induction batteries.
              </p>
            </div>
 
            {/* Premium Floor tab selections */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200/50 dark:border-slate-800/80 rounded-lg">
              {([1, 2, 3] as const).map(fl => (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`px-3 py-1 rounded text-[10px] tracking-wider uppercase font-bold transition-all cursor-pointer ${
                    selectedFloor === fl 
                      ? 'bg-gradient-gold text-white font-bold shadow-md scale-102 shadow-glow-gold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Floor {fl}
                </button>
              ))}
            </div>
          </div>

          {/* Isometric canvas containing 3D level representations */}
          <div className="flex-1 flex items-center justify-center relative py-8 select-none overflow-hidden min-h-[320px]">
            {/* Soft gradient background style */}
            <div className="absolute inset-0 bg-radial-gradient from-blue-50/40 via-transparent to-transparent pointer-events-none"></div>

            {/* Perspective transform space */}
            <div 
              className="relative w-full max-w-[500px] aspect-[16/10] border border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-br from-white dark:from-slate-950 to-slate-50 dark:to-slate-900 rounded-2xl shadow-xl p-4 transition-all duration-700"
              style={{
                transform: `rotateX(${garagePitch}deg) rotateZ(${garageRotation}deg) scale(${zoomLevel})`,
                transformStyle: 'preserve-3d',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08)'
              }}
            >
              {/* Parking slots dashed lane borders */}
              <div className="absolute inset-x-0 top-1/2 h-px border-t border-dashed border-slate-250 dark:border-slate-800"></div>
              <div className="absolute inset-y-0 left-1/2 w-px border-l border-dashed border-slate-250 dark:border-slate-800"></div>
 
              {/* Mapped custom structural layout labels */}
              <div 
                className="absolute top-2 left-3 font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold"
                style={{ transform: 'translateZ(10px)' }}
              >
                Entrance Ramp A
              </div>
              <div 
                className="absolute bottom-2 right-3 font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold"
                style={{ transform: 'translateZ(10px)' }}
              >
                Charging Bay L2
              </div>

              {/* Floating cars markers inside 3D floor layout */}
              {cars
                .filter(car => car.floor === selectedFloor)
                .map(car => {
                  const isSelected = selectedCar?.id === car.id;
                  const isRetrieving = car.status === 'Retrieving';
                  const isReady = car.status === 'Ready';

                  return (
                    <button
                      key={car.id}
                      onClick={() => handleSpotClick(car)}
                      className="absolute p-0 border-0 focus:outline-none cursor-pointer group/node"
                      style={{
                        top: `${car.top}%`,
                        left: `${car.left}%`,
                        transform: 'translate3d(-50%, -50%, 0)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Beautiful glowing radar background layout */}
                      <div className={`absolute -inset-4 rounded-full transition-transform ${
                        isSelected 
                          ? 'bg-blue-500/10 scale-125' 
                          : isRetrieving 
                          ? 'bg-amber-500/20 animate-pulse' 
                          : isReady 
                          ? 'bg-emerald-500/20' 
                          : 'bg-slate-500/5 group-hover/node:scale-110'
                      }`}></div>

                      {/* 3D Model capsule container block */}
                      <div
                        className={`w-11 h-6 rounded border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#C5A059] border-[#d3b474] text-white shadow-lg shadow-[#C5A059]/40'
                            : isRetrieving
                            ? 'bg-amber-500 border-amber-400 text-white shadow-md shadow-glow-gold'
                            : isReady
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-md'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-305 hover:border-[#C5A059] dark:hover:border-[#C5A059] shadow-sm'
                        }`}
                        style={{
                          transform: 'translateZ(16px)',
                        }}
                      >
                        <Car className="w-3.5 h-3.5" />
 
                        {/* Floated car plate indicators */}
                        <div
                          className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded shadow-sm text-[8px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider select-none whitespace-nowrap"
                          style={{
                            transform: 'rotateZ(35deg) rotateX(-55deg) translateZ(8px)',
                          }}
                        >
                          {car.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Interactive view controls sidebar */}
          <div className="absolute bottom-6 left-6 p-2 bg-white/95 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800/80 rounded-xl z-25 flex flex-col gap-1.5 shadow-sm font-mono text-[9px] select-none text-left shadow-glow-purple">
            <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider px-1">PERSPECTIVE COMMANDS</span>
            <div className="grid grid-cols-2 gap-1 text-slate-700 dark:text-slate-300 font-bold uppercase">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.4))}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded hover:border-[#C5A059] dark:hover:border-[#C5A059] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3 text-[#C5A059]" /> ZOOM_IN
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.7))}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded hover:border-[#C5A059] dark:hover:border-[#C5A059] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Minus className="w-3 h-3 text-[#C5A059]" /> ZOOM_OUT
              </button>
              <button 
                onClick={() => setGarageRotation(prev => prev + 15)}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded hover:border-[#C5A059] dark:hover:border-[#C5A059] flex items-center justify-center cursor-pointer col-span-2 transition-colors"
              >
                ROTATE SHIFT &rarr;
              </button>
            </div>
          </div>

          {/* Bottom scale coordinate indicators */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-450 select-none">
            <span>ACTIVE SYSTEM LAYER: FLOOR_0{selectedFloor}</span>
            <span>GRID SCALE: 1:1 DUPLICATOR</span>
          </div>
        </div>

        {/* RIGHT COMPONENT: LPR Feeds (Col Span 4) */}
        <div className="xl:col-span-4 flex flex-col justify-between bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm min-h-[480px] shadow-glow-purple">
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
              <Eye className="w-4 h-4 text-[#C5A059]" />
              License Plate Scanners (LPR)
            </h3>
 
            {/* Scanned Image grid representing active LPR inputs */}
            <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[350px] pr-1">
              {lprFeeds.map((feed, index) => (
                <div 
                  key={index} 
                  className="relative rounded-xl overflow-hidden border border-slate-250 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group shadow-sm transition-shadow hover:shadow-md"
                >
                  <img 
                    src={feed.img} 
                    alt={feed.plate} 
                    className="w-full h-24 object-cover opacity-90 group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-2 text-left">
                    <span className="bg-[#C5A059] text-white text-[8px] font-bold font-mono px-1.5 py-0.5 rounded tracking-wide uppercase inline-block mb-1 shadow-sm border border-[#d3b474]">
                      {feed.plate}
                    </span>
                    <p className="text-[9px] text-slate-900 dark:text-white font-semibold leading-tight">{feed.model}</p>
                    <p className="text-[8px] text-slate-350 font-mono tracking-wider">{feed.owner}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4 text-left">
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase mb-1">Gate scanner link status:</span>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Optical optical sensors aligned & stream nominal.
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER PANELS: TELEMETRY ANALYSIS, ACTIVE QUEUE, PORTAL TERMINAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch select-none">
        
        {/* ROW 1: HEATMAP & LOAD CHART (Col Span 5) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between text-left gap-4 shadow-glow-purple">
          
          <div className="flex gap-4 flex-1 items-stretch">
            {/* Visual Heatmap representing occupancy */}
            <div className="w-2.5/5 flex flex-col">
              <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 font-mono">Occupancy</h4>
              <div 
                className="flex-1 rounded-xl relative overflow-hidden flex items-end justify-center p-2.5 shadow-inner border border-slate-100 dark:border-slate-800/60"
                style={{
                  background: 'radial-gradient(circle at 35% 45%, #f87171 0%, #fbbf24 35%, #60a5fa 65%, #cbd5e1 100%)'
                }}
              >
                <div className="bg-white/95 dark:bg-slate-900 px-2 py-1 rounded shadow text-[9px] font-bold text-slate-800 dark:text-slate-200 font-mono tracking-wide uppercase leading-none border border-slate-200 dark:border-slate-800">
                  Zonal Load: High
                </div>
              </div>
            </div>
 
            {/* System Load Chart rendered as scalable crisp vector line (Image 5 Style) */}
            <div className="flex-1 flex flex-col justify-between">
              <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 font-mono">System Workload</h4>
              <div className="flex-grow flex items-end justify-center h-24 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-xl relative p-3">
                
                {/* Visual SVG chart coordinate graph */}
                <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path
                    d={`M 0 ${50 - (loadPoints[0] || 20) / 2} 
                        L 20 ${50 - (loadPoints[1] || 30) / 2} 
                        L 40 ${50 - (loadPoints[2] || 25) / 2} 
                        L 60 ${50 - (loadPoints[3] || 40) / 2} 
                        L 80 ${50 - (loadPoints[4] || 35) / 2} 
                        L 100 ${50 - (loadPoints[5] || 45) / 2}`}
                    fill="none"
                    stroke="#C5A059"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Fills color below line pathway */}
                  <path
                    d={`M 0 ${50 - (loadPoints[0] || 20) / 2} 
                        L 20 ${50 - (loadPoints[1] || 30) / 2} 
                        L 40 ${50 - (loadPoints[2] || 25) / 2} 
                        L 60 ${50 - (loadPoints[3] || 40) / 2} 
                        L 80 ${50 - (loadPoints[4] || 35) / 2} 
                        L 100 ${50 - (loadPoints[5] || 45) / 2}
                        L 100 50 L 0 50 Z`}
                    fill="url(#lightGrad)"
                    opacity="0.12"
                  />
                  <defs>
                    <linearGradient id="lightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C5A059" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
 
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 font-mono text-[8px] font-bold rounded">
                  {loadPoints[loadPoints.length - 1] || 65}% LOAD
                </div>
              </div>
            </div>
          </div>
 
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-450 border-t border-slate-100 dark:border-slate-800/60 pt-2 flex justify-between">
            <span>FLUX CHANNELS ANALYTICS</span>
            <span>SECURE SYSTEM STREAM</span>
          </div>
        </div>

        {/* ROW 2: CONTROL GAUGE AND ACTIVE SPECIFICS (Col Span 4) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between text-left shadow-glow-purple">
          <div>
            <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 font-mono">
              Selected Vehicle Telemetry
            </h4>
 
            {selectedCar ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#C5A059]">
                    <Car className="w-5 h-5" />
                  </div>
                  <div className="leading-none text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedCar.model}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 uppercase tracking-wider">
                      Owner: {selectedCar.owner} &bull; {selectedCar.label}
                    </p>
                  </div>
                </div>
 
                <div className="grid grid-cols-2 gap-3">
                  <div className="py-2 px-2.5 bg-slate-50 dark:bg-slate-905/40 border border-slate-250 dark:border-slate-800 rounded-lg">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider">induction lock</span>
                    <span className={`text-xs font-bold block mt-0.5 ${selectedCar.battery < 50 ? 'text-amber-500 animate-pulse' : 'text-emerald-505 dark:text-emerald-400'}`}>
                      {selectedCar.battery}% Battery ⚡
                    </span>
                  </div>
                  <div className="py-2 px-2.5 bg-slate-50 dark:bg-slate-905/40 border border-slate-250 dark:border-slate-800 rounded-lg">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider">arrival log</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-0.5">{selectedCar.checkInTime}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center text-slate-400 dark:text-slate-550 text-xs text-center italic">
                Choose coordinate layout blocks above to hook up live stats.
              </div>
            )}
          </div>
 
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
            <button
              disabled={!selectedCar || selectedCar.status === 'Retrieving'}
              onClick={() => selectedCar && startRetrieval(selectedCar.id)}
              className="py-2 px-3 bg-gradient-gold hover:opacity-90 border border-[#b89038] text-white font-bold text-xs uppercase rounded-lg shadow-md hover:shadow-glow-gold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-center flex items-center justify-center gap-1.5"
            >
              Retrieve Plate
            </button>
            <button
              disabled={!selectedCar}
              onClick={() => {
                if (!selectedCar) return;
                const updated = cars.map(c => c.id === selectedCar.id ? { ...c, battery: 100 } : c);
                setCars(updated);
                setSelectedCar(prev => prev ? { ...prev, battery: 100 } : null);
              }}
              className="py-2 px-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase rounded-lg cursor-pointer transition-all"
            >
              Force Charge
            </button>
          </div>
        </div>

        {/* ROW 3: ACTIVE SYSTEM RETRIEVAL QUEUES (Col Span 4) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between text-left shadow-glow-purple">
          <div>
            <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 font-mono">
              Request Queue & System Commands
            </h4>

            <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
              {cars.filter(c => c.status !== 'Parked').map(car => (
                <div key={car.id} className="p-2 border border-slate-250 rounded bg-slate-50 flex items-center justify-between text-[11px] font-mono leading-none">
                  <div className="text-left">
                    <span className="font-bold text-slate-700 block">{car.owner}</span>
                    <span className="text-[9px] text-slate-400 block mt-1">{car.model}</span>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      car.status === 'Ready' ? 'text-emerald-600' : 'text-amber-500 animate-pulse'
                    }`}>
                      {car.status === 'Ready' ? 'Lobby Ready' : 'Retrieving'}
                    </span>
                    {car.status === 'Retrieving' && (
                      <div className="w-16 h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-1000"
                          style={{ width: `${retrievingCars[car.id] || 35}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {cars.filter(c => c.status !== 'Parked').length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  Retrieval request queue is empty.
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 justify-end">
            <button
              onClick={handleRescueStop}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-750 hover:from-red-500 hover:to-red-650 text-white font-bold text-xs uppercase rounded-lg shadow-lg hover:shadow-red-500/35 border border-red-500/30 cursor-pointer flex items-center gap-1.5 transition-all duration-300"
            >
              <AlertTriangle className="w-4 h-4 text-slate-900 dark:text-white" />
              Emergency Stop
            </button>
          </div>
        </div>

      </div>      {/* HORIZONTAL CONSOLE TERMINAL INPUT STYLES (Plate entry controller) */}
      <form onSubmit={handleConsoleSubmit} className="bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-stretch select-none text-left shadow-glow-purple">
        <div className="flex-1 space-y-2">
          <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
            Gate Terminal Console Link
          </label>
          <div className="w-full h-24 bg-slate-900 border border-slate-950/80 p-2.5 rounded-xl font-mono text-[10px] text-slate-300 overflow-y-auto space-y-1">
            {consoleOutputs.map((line, idx) => (
              <p key={idx} className={
                line.startsWith('>') 
                  ? 'text-[#C5A059]' 
                  : line.startsWith('Error') 
                  ? 'text-red-400' 
                  : idx === consoleOutputs.length - 1 
                  ? 'text-slate-100 font-bold' 
                  : 'text-slate-400'
              }>
                {line}
              </p>
            ))}
          </div>
        </div>
 
        <div className="min-w-[200px] flex flex-col justify-between">
          <div className="relative">
            <input
              type="text"
              value={consoleInput}
              onChange={(e) => setConsoleInput(e.target.value)}
              placeholder="e.g. retrieve B894, HELP..."
              className="w-full p-2.5 pr-10 rounded border border-slate-250 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:border-[#C5A059] dark:focus:border-[#C5A059] outline-none text-xs font-mono uppercase bg-slate-50 dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-600"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-2.5 text-[#C5A059] hover:text-[#d3b474] cursor-pointer"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
 
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-serif leading-none border-t border-slate-100 dark:border-slate-800/60 pt-3 flex items-center justify-between">
            <span>TLSv12 ENCRYPTED SECURE</span>
            <span className="text-[9px] font-mono text-[#C5A059]">ONLINE</span>
          </div>
        </div>
      </form>

    </div>
  );
}
