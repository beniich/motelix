// @ts-nocheck
'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SystemLog } from '../types';
import {
  Wrench,
  Navigation,
  PackageCheck,
  Zap,
  Plus,
  Minus,
  Maximize2,
  Bell,
  ChevronUp,
  Activity,
  AlertTriangle,
  Cpu,
  Tv,
  Radio,
  Gamepad2,
  Sparkles,
  Plane,
  Heart,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface DroneDashboardProps {
  logs: SystemLog[];
  onAddLog: (log: SystemLog) => void;
}

export interface TacticalDrone {
  id: string;
  name: string;
  status: 'In-Flight' | 'Delivered' | 'Charging' | 'Maintenance';
  battery: number;
  payload: string;
  destination: string;
  speed: number; // km/h
  altitude: number; // meters
  signalStrength: number; // %
  lat: number;
  lng: number;
  routeProgress: number; // 0 to 100 percentage
  routeColor: string;
  pathCoordinates: { x: number; y: number }[];
}

interface FleetMaintenanceLog {
  id: string;
  droneName: string;
  component: string;
  status: 'OK' | 'REQ' | 'UPDT' | 'CRIT';
  time: string;
}

export default function DroneDashboard({ logs, onAddLog }: DroneDashboardProps) {
  // Navigation active tabs inside Drone dashboard if any (Overview is primary)
  const [internalView, setInternalView] = useState<'overview' | 'fleet' | 'missions'>('overview');

  // Interactive tactical control settings
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panState, setPanState] = useState({ x: 0, y: 0 });
  const [isLiveStream, setIsLiveStream] = useState<boolean>(true);
  const [selectedDroneId, setSelectedDroneId] = useState<string>('d-104');
  
  // Custom Dispatch Form controls
  const [dispatchTarget, setDispatchTarget] = useState<string>('Villa 14');
  const [dispatchPayload, setDispatchPayload] = useState<string>('Perrier-Jouët Champagne');
  const [dispatchDroneVal, setDispatchDroneVal] = useState<string>('D-505');

  // Live simulation drone nodes
  const [drones, setDrones] = useState<TacticalDrone[]>([
    {
      id: 'd-104',
      name: 'D-104',
      status: 'In-Flight',
      battery: 84,
      payload: 'Elite Caviar Pack & Ice',
      destination: 'Villa 12',
      speed: 48,
      altitude: 35,
      signalStrength: 98,
      lat: 50,
      lng: 40,
      routeProgress: 25,
      routeColor: '#6366F1',
      pathCoordinates: [
        { x: 200, y: 400 },
        { x: 380, y: 220 },
        { x: 620, y: 150 }
      ]
    },
    {
      id: 'd-202',
      name: 'D-202',
      status: 'Delivered',
      battery: 58,
      payload: 'Warm Silk Pillow & Towels',
      destination: 'Spa Sanctuary',
      speed: 0,
      altitude: 0,
      signalStrength: 90,
      lat: 65,
      lng: 70,
      routeProgress: 100,
      routeColor: '#10B981',
      pathCoordinates: [
        { x: 400, y: 150 },
        { x: 600, y: 300 },
        { x: 750, y: 380 }
      ]
    },
    {
      id: 'd-305',
      name: 'D-305',
      status: 'In-Flight',
      battery: 76,
      payload: 'Bespoke Prescription Pack',
      destination: 'Villa 5',
      speed: 52,
      altitude: 42,
      signalStrength: 95,
      lat: 38,
      lng: 62,
      routeProgress: 60,
      routeColor: '#818CF8',
      pathCoordinates: [
        { x: 800, y: 400 },
        { x: 600, y: 300 },
        { x: 500, y: 180 }
      ]
    },
    {
      id: 'd-112',
      name: 'D-112',
      status: 'Delivered',
      battery: 42,
      payload: 'Kids Mini-Amusement Kit',
      destination: 'Executive Lobby',
      speed: 0,
      altitude: 0,
      signalStrength: 88,
      lat: 80,
      lng: 35,
      routeProgress: 100,
      routeColor: '#F43F5E',
      pathCoordinates: [
        { x: 150, y: 200 },
        { x: 300, y: 320 },
        { x: 450, y: 400 }
      ]
    },
    {
      id: 'd-001',
      name: 'D-001 [ULTRA]',
      status: 'Charging',
      battery: 18,
      payload: 'None - Battery Cycle',
      destination: 'Dock Section B',
      speed: 0,
      altitude: 0,
      signalStrength: 100,
      lat: 25,
      lng: 80,
      routeProgress: 0,
      routeColor: '#EAB308',
      pathCoordinates: [
        { x: 250, y: 80 }
      ]
    },
    {
      id: 'd-409',
      name: 'D-409',
      status: 'In-Flight',
      battery: 92,
      payload: 'Gourmet Tapas & Pinot Noir',
      destination: 'Pool Cabana 4',
      speed: 45,
      altitude: 30,
      signalStrength: 97,
      lat: 74,
      lng: 52,
      routeProgress: 45,
      routeColor: '#2563EB',
      pathCoordinates: [
        { x: 100, y: 500 },
        { x: 420, y: 350 },
        { x: 740, y: 230 }
      ]
    }
  ]);

  // Fleet maintenance logs state
  const [maintenanceLogs, setMaintenanceLogs] = useState<FleetMaintenanceLog[]>([
    { id: 'm-1', droneName: 'D-201', component: 'Battery Calibrator', status: 'OK', time: '10:30 AM' },
    { id: 'm-2', droneName: 'D-305', component: 'Ultrasonic Sensors', status: 'REQ', time: '11:15 AM' },
    { id: 'm-3', droneName: 'D-112', component: 'Aviation Software', status: 'UPDT', time: '09:45 AM' },
    { id: 'm-4', droneName: 'D-409', component: 'Rotor Assembly C', status: 'OK', time: '08:15 AM' },
    { id: 'm-5', droneName: 'D-104', component: 'LiDAR Gyroscope', status: 'UPDT', time: '12:05 PM' }
  ]);

  // Simulated mission streams
  const [missionLogs, setMissionLogs] = useState([
    { id: 'ms-1', droneName: 'D-104', type: 'ACTIVE', desc: 'En route to Villa 12 with gourmet catering packages', est: '2 min' },
    { id: 'ms-2', droneName: 'D-202', type: 'DELIVERED', desc: 'Package #4821 verified securely received at Spa Sanctuary', est: '10:15 AM' },
    { id: 'ms-3', droneName: 'D-112', type: 'DELIVERED', desc: 'Package #4954 completed verification sequence at Front Lobby', est: '10:45 AM' }
  ]);

  // Real-time animation simulator update loop
  useEffect(() => {
    if (!isLiveStream) return;

    const interval = setInterval(() => {
      setDrones((prevDrones) =>
        prevDrones.map((drone) => {
          if (drone.status !== 'In-Flight') return drone;

          // Progress along custom route
          let nextProgress = drone.routeProgress + (Math.random() * 3 + 1);
          let nextStatus = drone.status;
          const nextBattery = Math.max(drone.battery - (Math.random() * 0.4), 1);
          let nextSpeed = drone.speed + Math.floor(Math.random() * 5 - 2);
          let nextAltitude = drone.altitude + Math.floor(Math.random() * 3 - 1);

          if (nextSpeed > 65) nextSpeed = 60;
          if (nextSpeed < 30) nextSpeed = 35;
          if (nextAltitude > 55) nextAltitude = 45;
          if (nextAltitude < 20) nextAltitude = 25;

          if (nextProgress >= 100) {
            nextProgress = 100;
            nextStatus = 'Delivered';
            nextSpeed = 0;
            nextAltitude = 0;

            // Log event safely back to core system logs
            onAddLog({
              id: `l-drone-deliv-${Date.now()}`,
              time: new Date().toLocaleTimeString(),
              module: 'DRONE_TAC',
              type: 'OK',
              message: `Tactical flight path successfully concluded for ${drone.name}. Payload safely routed to ${drone.destination}.`
            });

            // Update missions feed
            setMissionLogs(prev => [
              {
                id: `ms-${Date.now()}`,
                droneName: drone.name,
                type: 'DELIVERED',
                desc: `System confirm: "${drone.payload}" successfully delivered to ${drone.destination}`,
                est: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              },
              ...prev.slice(0, 4)
            ]);
          }

          return {
            ...drone,
            routeProgress: nextProgress,
            status: nextStatus as any,
            battery: parseFloat(nextBattery.toFixed(1)),
            speed: nextSpeed,
            altitude: nextAltitude
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStream, onAddLog]);

  // Dispatch standard preset mission triggers
  const handleTacticalDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchTarget || !dispatchPayload) return;

    const freshId = `d-${Math.floor(500 + Math.random() * 499)}`;
    const droneLabel = `${dispatchDroneVal || 'D-505'}`;
    const newPath = [
      { x: Math.floor(Math.random() * 300) + 100, y: Math.floor(Math.random() * 200) + 300 },
      { x: Math.floor(Math.random() * 400) + 200, y: Math.floor(Math.random() * 250) + 150 },
      { x: Math.floor(Math.random() * 350) + 500, y: Math.floor(Math.random() * 200) + 100 }
    ];

    const newDrone: TacticalDrone = {
      id: freshId,
      name: droneLabel,
      status: 'In-Flight',
      battery: 100,
      payload: dispatchPayload,
      destination: dispatchTarget,
      speed: 55,
      altitude: 40,
      signalStrength: 99,
      lat: 42,
      lng: 48,
      routeProgress: 0,
      routeColor: '#818CF8',
      pathCoordinates: newPath
    };

    setDrones((prev) => [newDrone, ...prev]);
    setSelectedDroneId(freshId);

    // Synchronize log actions to App console
    onAddLog({
      id: `l-drone-disp-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'DRONE_TAC',
      type: 'WARN',
      message: `TACTICAL DISPATCH: Unit ${droneLabel} cleared for takeoff. Route: Lobby Base -> ${dispatchTarget}. Payload: ${dispatchPayload}`
    });

    // Add to internal active missions list
    setMissionLogs((prev) => [
      {
        id: `ms-${Date.now()}`,
        droneName: droneLabel,
        type: 'ACTIVE',
        desc: `Autonomous drone departing base with "${dispatchPayload}" for ${dispatchTarget}`,
        est: '4 min'
      },
      ...prev.slice(0, 4)
    ]);

    // Add to maintenance stream as active calibration
    const freshMntLog: FleetMaintenanceLog = {
      id: `m-ind-${Date.now()}`,
      droneName: droneLabel,
      component: 'Propeller Assembly Lock',
      status: 'OK',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMaintenanceLogs(prev => [freshMntLog, ...prev.slice(0, 4)]);

    // Clear inputs beautifully
    setDispatchTarget('Villa ' + Math.floor(Math.random() * 20 + 1));
    setDispatchPayload('Warm Pastries Pack');
    alert(`Tactical Mission Authorized! Drone ${droneLabel} is carrying "${dispatchPayload}" and is airborne heading to ${dispatchTarget}.`);
  };

  const handleRecalibrateDrone = (drone: TacticalDrone) => {
    onAddLog({
      id: `l-drone-recal-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'DRONE_TAC',
      type: 'INFO',
      message: `Heuristic calibration sequence initialized for ${drone.name} sensors & compass locks.`
    });

    // Temp adjust battery status and signals as calibration feedback
    setDrones(prev => prev.map(d => {
      if (d.id === drone.id) {
        return {
          ...d,
          signalStrength: Math.min(d.signalStrength + 2, 100),
          battery: Math.min(d.battery + 1, 100)
        };
      }
      return d;
    }));
    alert(`Success: Initiated automatic sensor & spatial positioning calibration loop for ${drone.name}. Coordinates locked.`);
  };

  const activeDroneSelection = drones.find(d => d.id === selectedDroneId) || drones[0];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.7));
  const handleResetCoordinates = () => {
    setZoomLevel(1.0);
    setPanState({ x: 0, y: 0 });
    onAddLog({
      id: `l-drone-vreset-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'DRONE_TAC',
      type: 'INFO',
      message: 'Operator reset tactical Map tracking coordinates to zero references.'
    });
  };

  // Status-badge styles matching custom indicators
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'In-Flight':
        return 'bg-indigo-600 border-indigo-500/30 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] animate-pulse';
      case 'Delivered':
        return 'bg-emerald-600 border-emerald-500/30 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]';
      case 'Charging':
        return 'bg-amber-600 border-amber-500/30 text-white';
      default:
        return 'bg-slate-700 border-slate-600/30 text-white';
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* HEADER STRIP - Tactical Center Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/60 p-5 border border-slate-800 rounded-2xl select-none leading-relaxed">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
            <Plane className="w-5 h-5 text-indigo-400 rotate-45 animate-pulse" />
            Tactical Drone Intelligence & Logistics Command
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time coordinates telemetry, dynamic tracking vectors, and autonomous VIP suite payload routing.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 md:mt-0 font-mono text-[10px] bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold uppercase">GPS Signal:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span> STRONG LOCK
            </span>
          </div>
          <div className="w-px h-3.5 bg-slate-800 mx-1"></div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold uppercase">Compliance:</span>
            <span className="text-indigo-400 font-bold uppercase">Verified Tier 5</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID SYSTEM */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 leading-relaxed">
        
        {/* LEFT COLUMN: INTERACTIVE TACTICAL RADAR GRID (Col Span 8) */}
        <div className="xl:col-span-8 flex flex-col justify-between bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6 min-h-[560px] relative overflow-hidden shadow-2xl">
          
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          ></div>

          {/* Map Area Header */}
          <div className="flex justify-between items-center z-10 select-none">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Tactical Airspace Plot</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Vector lines represent live coordinate heading pathways.</p>
            </div>
            
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-slate-950 font-mono text-[10px] text-slate-400 border border-slate-800 rounded">
                SCALE: 1:4500
              </span>
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/20 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                GRID_ONLINE
              </span>
            </div>
          </div>

          {/* Map Graphics Area with Vector Flight Paths and Pulse Markers */}
          <div className="relative flex-grow flex items-center justify-center py-6 select-none overflow-hidden min-h-[360px]">
            <div 
              className="relative w-11/12 h-[340px] border border-slate-800/80 bg-slate-950/60 rounded-xl overflow-hidden transition-all duration-300"
              style={{
                transform: `scale(${zoomLevel}) translate(${panState.x}px, ${panState.y}px)`
              }}
            >
              {/* Outer map crosshairs/coordinates */}
              <div className="absolute top-2 left-3 text-[9px] font-mono text-slate-700">COORD: 34.0522 N / 118.2437 W</div>
              <div className="absolute top-2 right-3 text-[9px] font-mono text-slate-700">AZIMUTH: 184&deg; LOCK</div>
              <div className="absolute bottom-2 left-3 text-[9px] font-mono text-slate-700">RADAR FREQ: 9.4 GHz SECURE</div>
              <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-700">ALT REFERENCE: sea-level</div>

              {/* Grid center compass layout */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className="w-56 h-56 rounded-full border border-indigo-400 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border border-dashed border-indigo-400"></div>
                </div>
                {/* Horizontal & vertical layout line */}
                <div className="absolute w-full h-px border-t border-indigo-400/40"></div>
                <div className="absolute h-full w-px border-l border-indigo-400/40"></div>
              </div>

              {/* Dynamic Flight Routes (SVGs) */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-10" 
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Glowing shadow filters */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {drones.map((drone) => {
                  if (drone.pathCoordinates.length < 2) return null;
                  
                  // Construct SVG line instructions
                  const pathString = drone.pathCoordinates.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

                  // If selected, highlights it brightly
                  const isSelected = drone.id === selectedDroneId;

                  return (
                    <g key={`path-${drone.id}`}>
                      {/* Interactive visual flight path tracking */}
                      <path
                        d={pathString}
                        fill="none"
                        stroke={drone.routeColor}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                        strokeDasharray="8 6"
                        className="opacity-40"
                        style={{
                          strokeDasharray: '10',
                          animation: 'flow 20s linear infinite',
                          filter: isSelected ? 'url(#glow)' : ''
                        }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Drone Hotspot Nodes on Grid Canvas */}
              {drones.map((drone) => {
                const isSelected = drone.id === selectedDroneId;
                
                // Interpolate simple map positions for rendering representation
                // Note: coordinates depend on actual index to keep nodes beautifully separated across dimensions
                const coordinates = drone.pathCoordinates;
                let activeX = 0;
                let activeY = 0;

                if (coordinates.length === 0) {
                  activeX = 500;
                  activeY = 300;
                } else if (coordinates.length === 1) {
                  activeX = coordinates[0].x;
                  activeY = coordinates[0].y;
                } else if (drone.status === 'Delivered') {
                  // Concluded at the destination coordinates
                  activeX = coordinates[coordinates.length - 1].x;
                  activeY = coordinates[coordinates.length - 1].y;
                } else {
                  // Interpolated point based on route progress
                  const totalPercent = drone.routeProgress / 100;
                  const totalSegments = coordinates.length - 1;
                  const segmentProgress = totalPercent * totalSegments;
                  const segmentIndex = Math.floor(segmentProgress);
                  const segmentPart = segmentProgress - segmentIndex;

                  if (segmentIndex >= totalSegments) {
                    activeX = coordinates[coordinates.length - 1].x;
                    activeY = coordinates[coordinates.length - 1].y;
                  } else {
                    const startNode = coordinates[segmentIndex];
                    const endNode = coordinates[segmentIndex + 1];
                    activeX = startNode.x + (endNode.x - startNode.x) * segmentPart;
                    activeY = startNode.y + (endNode.y - startNode.y) * segmentPart;
                  }
                }

                // Calculate safe scale layout styles
                const transformPercentX = (activeX / 1000) * 100;
                const transformPercentY = (activeY / 600) * 100;

                return (
                  <div
                    key={drone.id}
                    className="absolute cursor-pointer flex items-center group z-20"
                    style={{ 
                      top: `${transformPercentY}%`, 
                      left: `${transformPercentX}%`,
                      transform: 'translate(-10px, -10px)',
                      transition: 'all 0.5s ease-out'
                    }}
                    onClick={() => setSelectedDroneId(drone.id)}
                  >
                    {/* Pulsing radar effects */}
                    {drone.status === 'In-Flight' && (
                      <div className="absolute -inset-4 rounded-full border border-indigo-500/40 animate-ping opacity-60 pointer-events-none"></div>
                    )}
                    
                    {/* Interactive Marker Node */}
                    <div className="relative">
                      <div className={`w-5 h-5 rounded-full border border-white/80 shadow-lg flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-indigo-500 scale-125 ring-4 ring-indigo-500/20' 
                          : 'bg-slate-900 group-hover:bg-slate-800'
                      }`}>
                        <Navigation 
                          className={`w-2.5 h-2.5 rotate-45 ${
                            isSelected ? 'text-slate-900 dark:text-white' : 'text-indigo-400'
                          }`} 
                        />
                      </div>
                    </div>

                    {/* Interactive connecting flag tag banner */}
                    <div className="ml-2 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[9px] font-bold font-mono whitespace-nowrap tracking-wider text-slate-300 shadow group-hover:border-indigo-500">
                      {drone.name} &bull; <span className={
                        drone.status === 'In-Flight' ? 'text-indigo-400' : drone.status === 'Delivered' ? 'text-emerald-400' : 'text-amber-500'
                      }>{drone.status}</span>
                    </div>
                  </div>
                );
              })}

              {/* Dynamic Map Labels representing luxury resort areas */}
              <div className="absolute top-1/4 left-1/5 text-[9px] font-mono text-slate-500 bg-slate-950/40 px-1.5 py-0.5 border border-slate-900/40 rounded uppercase">Villa Complex North</div>
              <div className="absolute bottom-1/3 left-1/3 text-[9px] font-mono text-slate-500 bg-slate-950/40 px-1.5 py-0.5 border border-slate-900/40 rounded uppercase font-bold text-indigo-400/80">Lounge Base Dock</div>
              <div className="absolute top-1/3 right-1/4 text-[9px] font-mono text-slate-500 bg-slate-950/40 px-1.5 py-0.5 border border-slate-900/40 rounded uppercase">Elite Spa Vaults</div>
              <div className="absolute bottom-1/4 right-1/3 text-[9px] font-mono text-slate-500 bg-slate-950/40 px-1.5 py-0.5 border border-slate-900/40 rounded uppercase">Presidential Suites</div>
            </div>
          </div>

          {/* Interactive Radar overlays / Zoom & Pan controllers */}
          <div className="absolute bottom-6 left-6 p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl z-20 flex flex-col gap-2 select-none font-mono text-[10px]">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Airspace view controls</span>
            <div className="grid grid-cols-2 gap-1.5 font-bold text-slate-300 uppercase">
              <button 
                onClick={handleZoomIn} 
                className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" /> ZOOM_IN
              </button>
              <button 
                onClick={handleZoomOut} 
                className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 text-indigo-400" /> ZOOM_OUT
              </button>
              <button 
                onClick={handleResetCoordinates} 
                className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 cursor-pointer col-span-2 justify-center"
              >
                <Maximize2 className="w-3.5 h-3.5 text-rose-450" /> RESET_PERSPECTIVE
              </button>
            </div>

            <div className="pt-2 mt-1 border-t border-slate-850 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-bold uppercase">LIVE FEED STREAMING:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isLiveStream}
                  onChange={() => setIsLiveStream(!isLiveStream)}
                  className="sr-only peer" 
                />
                <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Footer labels */}
          <div className="pt-3.5 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between select-none">
            <span>GRID-SET: INTEL_RADAR_SECURE</span>
            <span>ZOOM REFERENCE: {zoomLevel.toFixed(2)}X</span>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE TELEMETRY & TACTICAL DISPATCH PANEL (Col Span 4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Section 1: Selected Drone Diagnostics */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-indigo-500/10 pb-2 mb-4">
                Telemetry Diagnostics Model
              </h3>

              {/* Dynamic point-cloud lookalike image container */}
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex flex-col items-center justify-center relative h-40 overflow-hidden mb-4 select-none">
                <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-500">UNIT: {activeDroneSelection.name}</span>
                <span className="absolute top-2 right-2 text-[8px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> 
                  {activeDroneSelection.signalStrength}% LAT
                </span>

                {/* Vector radar scanner style layout */}
                <div className="relative w-28 h-28 border border-indigo-500/10 rounded-full flex items-center justify-center">
                  {/* Rotating radar line overlay */}
                  <div className="absolute w-1/2 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent left-1/2 top-1/2 origin-left animate-spin" style={{ animationDuration: '4s' }}></div>
                  
                  {/* Static target markers */}
                  <div className="absolute w-2 h-2 rounded-full bg-indigo-400/30 left-1/4 top-1/3"></div>
                  <div className="absolute w-2 h-2 rounded-full bg-emerald-400/50 right-1/3 bottom-1/4 animate-pulse"></div>
                  <div className="absolute w-2 h-2 rounded-full bg-indigo-400/40 center"></div>

                  {/* Icon indicator */}
                  <PlanetIcon status={activeDroneSelection.status} />
                </div>
                
                <span className="text-[10px] font-bold text-slate-300 mt-2 uppercase font-mono tracking-wider">
                  {activeDroneSelection.status} &bull; payload buffered
                </span>
              </div>

              {/* Specifications telemetry chart details grid */}
              <div className="grid grid-cols-2 gap-3 font-mono text-left select-none text-[10px]">
                <div className="p-2 border border-slate-850 bg-slate-950/40 rounded">
                  <p className="text-slate-500 font-bold uppercase">Battery Capacity</p>
                  <p className="text-slate-900 dark:text-white font-bold text-xs mt-1">{activeDroneSelection.battery}%</p>
                </div>
                <div className="p-2 border border-slate-850 bg-slate-950/40 rounded">
                  <p className="text-slate-500 font-bold uppercase">Payload Type</p>
                  <p className="text-slate-900 dark:text-white font-bold text-[11px] mt-1 text-ellipsis overflow-hidden whitespace-nowrap">{activeDroneSelection.payload}</p>
                </div>
                <div className="p-2 border border-slate-850 bg-slate-950/40 rounded">
                  <p className="text-slate-500 font-bold uppercase">Fly Altitude</p>
                  <p className="text-slate-900 dark:text-white font-bold text-xs mt-1">{activeDroneSelection.altitude}m</p>
                </div>
                <div className="p-2 border border-slate-850 bg-slate-950/40 rounded">
                  <p className="text-slate-500 font-bold uppercase">Current Speed</p>
                  <p className="text-slate-900 dark:text-white font-bold text-xs mt-1">{activeDroneSelection.speed} km/h</p>
                </div>
              </div>

              {/* Progress gauge progression */}
              <div className="space-y-1 select-none pt-4">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500 uppercase font-bold">Heuristic Waypoint Route Progress</span>
                  <span className="text-indigo-400 font-bold">
                    {Math.floor(activeDroneSelection.routeProgress)}%
                  </span>
                </div>
                <div className="h-1 bg-slate-950 rounded-full overflow-hidden w-full border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-300"
                    style={{ width: `${activeDroneSelection.routeProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleRecalibrateDrone(activeDroneSelection)}
              className="w-full mt-4 py-2.5 bg-slate-955 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2 font-mono"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> CALIBRATE DRONE COMPASS
            </button>
          </div>

          {/* Section 2: Tactical Dispatch Controller proposal */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-2xl flex-grow">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-indigo-500/10 pb-2 mb-4">
              Authorized Dispatch Center
            </h3>

            <form onSubmit={handleTacticalDispatch} className="space-y-4 font-mono text-[10px]">
              <div>
                <label className="block text-slate-500 font-bold uppercase mb-1.5">Takeoff Unit Selection</label>
                <select
                  value={dispatchDroneVal}
                  onChange={(e) => setDispatchDroneVal(e.target.value)}
                  className="w-full p-2.5 rounded bg-slate-950 border border-slate-850 text-white focus:border-indigo-550 text-xs outline-none"
                >
                  <option value="D-505">D-505 [Heavy Cargo Unit]</option>
                  <option value="D-109">D-109 [Stealth Sensor System]</option>
                  <option value="D-318">D-318 [Express Quadcopter]</option>
                  <option value="D-004">D-004 [Ultra-Fast Interceptor]</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold uppercase mb-1.5">Destination Room/Villa</label>
                  <input
                    type="text"
                    required
                    value={dispatchTarget}
                    onChange={(e) => setDispatchTarget(e.target.value)}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-850 text-white focus:border-indigo-550 text-xs outline-none"
                    placeholder="E.g. Villa 14"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold uppercase mb-1.5">Authorized Payload</label>
                  <input
                    type="text"
                    required
                    value={dispatchPayload}
                    onChange={(e) => setDispatchPayload(e.target.value)}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-850 text-white focus:border-indigo-550 text-xs outline-none"
                    placeholder="E.g. Red wine pack"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow cursor-pointer text-center flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4 text-slate-900 dark:text-white" /> DISPATCH DRONE MISSION
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* FOOTER SECTION ROW: MAINTENANCE LOGS & ACTIVE MISSION TIMERS GAP */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 leading-relaxed select-none">
        
        {/* Fleet Maintenance Status (Col Span 5) */}
        <div className="xl:col-span-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 opacity-60"></div>
          
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-indigo-500/10 pb-2 mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-400" />
            Active Fleet Maintenance Register
          </h3>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {maintenanceLogs.map((ml) => (
              <div 
                key={ml.id} 
                className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl hover:bg-slate-950 hover:border-indigo-500/30 transition-all flex items-center justify-between"
              >
                <div className="text-left leading-tight">
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase hover:text-indigo-400 transition-colors">
                    Drone {ml.droneName} &mdash; {ml.component}
                  </span>
                  <p className="text-[9px] text-slate-500 mt-1 font-mono">Verified calibrate stream &bull; {ml.time}</p>
                </div>
                
                <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded tracking-wider ${
                  ml.status === 'OK' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : ml.status === 'REQ' 
                    ? 'bg-amber-500/10 text-amber-500' 
                    : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  {ml.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Flight Streams & Mission Feeds (Col Span 7) */}
        <div className="xl:col-span-7 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-60"></div>

          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-indigo-500/10 pb-2 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-550 rounded-full animate-ping"></span>
              Airspace Missions Telemetry Feed
            </span>
            <span className="text-[8px] font-mono text-slate-500">REAL-TIME FEEDS</span>
          </h3>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 text-[11px] font-mono">
            {missionLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl hover:bg-slate-950/70 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    log.type === 'ACTIVE' ? 'bg-indigo-500' : 'bg-emerald-400'
                  }`}></span>
                  <div className="leading-tight">
                    <p className="text-slate-200 font-bold">Drone {log.droneName} &mdash; <span className="text-slate-400 font-light">{log.desc}</span></p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase">AUTONOMOUS DISPATCH LOCK</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-indigo-400 shrink-0 select-none">
                  {log.est}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes flow {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

// Subordinate drone schematic planet logo vector
function PlanetIcon({ status }: { status: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none select-none opacity-40">
      <Plane className="w-5 h-5 text-indigo-400 rotate-45 transform" />
    </div>
  );
}
