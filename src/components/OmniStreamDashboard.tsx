/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Workflow, 
  Video, 
  Gauge, 
  Terminal, 
  Sliders, 
  Play, 
  Square, 
  RefreshCw, 
  AlertTriangle, 
  Signal, 
  Cpu, 
  Eye, 
  Compass, 
  Power,
  Zap,
  CheckCircle,
  PlusCircle,
  ShieldAlert,
  HelpCircle,
  Send
} from 'lucide-react';

// Interfaces for our Robotics units
interface RobotUnit {
  id: string;
  name: string;
  model: string;
  category: 'Rover' | 'Butler' | 'Trolley' | 'Drone';
  status: 'Idle' | 'En Route' | 'Delivering' | 'Charging' | 'Calibrating';
  battery: number;
  joints: {
    yaw: number;     // -180 to 180 deg
    pitch: number;   // -90 to 90 deg
    roll: number;    // -180 to 180 deg
    extension: number; // 0 to 100 cm
  };
  destination: string;
  streamUrl: string; // Feed descriptor
  speed: number;    // m/s
  latency: number;  // ms
  lastSignalTime: string;
}

interface RoboticTask {
  id: string;
  robotName: string;
  targetRoom: string;
  payload: string;
  priority: 'Routine' | 'VIP' | 'CRITICAL';
  progress: number; // 0 to 100
}

export default function OmniStreamDashboard() {
  // --- STATE ---
  const [robots, setRobots] = useState<RobotUnit[]>([
    {
      id: 'rob-01',
      name: 'Rover-Alpha 1',
      model: 'LuxeAethelred Rover v4.2',
      category: 'Rover',
      status: 'En Route',
      battery: 81,
      joints: { yaw: 45, pitch: 15, roll: 0, extension: 40 },
      destination: 'Villa Room 1204',
      streamUrl: 'Thermal Cam AET-01',
      speed: 1.8,
      latency: 14,
      lastSignalTime: 'Just now'
    },
    {
      id: 'rob-02',
      name: 'Butler-Bot X5',
      model: 'Imperial Concierge Mech v2',
      category: 'Butler',
      status: 'Delivering',
      battery: 62,
      joints: { yaw: -90, pitch: 45, roll: 10, extension: 75 },
      destination: 'Dining Suite 10',
      streamUrl: 'RGB Optical Feed BBX5',
      speed: 1.2,
      latency: 28,
      lastSignalTime: '5s ago'
    },
    {
      id: 'rob-03',
      name: 'Sommelier Trolley M3',
      model: 'Aethelred Vintage Roll-C',
      category: 'Trolley',
      status: 'Calibrating',
      battery: 95,
      joints: { yaw: 0, pitch: 0, roll: 0, extension: 10 },
      destination: 'Aethelred Wine Cellar',
      streamUrl: 'LiDAR Mesh Unit M3',
      speed: 0.0,
      latency: 8,
      lastSignalTime: 'Just now'
    },
    {
      id: 'rob-04',
      name: 'Cargo-Drone R9',
      model: 'AeroGate Heavy-Lift V4',
      category: 'Drone',
      status: 'Charging',
      battery: 15,
      joints: { yaw: 120, pitch: -30, roll: -15, extension: 0 },
      destination: 'Rooftop Helidock B',
      streamUrl: 'Depth Profiler AERO9',
      speed: 0.0,
      latency: 42,
      lastSignalTime: '12s ago'
    }
  ]);

  const [selectedRobotId, setSelectedRobotId] = useState<string>('rob-01');
  const [cameraMode, setCameraMode] = useState<'rgb' | 'lidar' | 'thermal' | 'depth'>('thermal');
  const [isFeedStreaming, setIsFeedStreaming] = useState<boolean>(true);
  const [frameRate, setFrameRate] = useState<number>(30);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  
  // Custom tasks stream state
  const [tasks, setTasks] = useState<RoboticTask[]>([
    { id: 'tsk-201', robotName: 'Rover-Alpha 1', targetRoom: 'Villa 1204', payload: 'Ossetra Caviar Case', priority: 'VIP', progress: 42 },
    { id: 'tsk-202', robotName: 'Butler-Bot X5', targetRoom: 'Suite 10', payload: 'Silver Dining Presentation', priority: 'Routine', progress: 78 }
  ]);

  // Command panel inputs
  const [cmdTargetRoom, setCmdTargetRoom] = useState<string>('');
  const [cmdPayload, setCmdPayload] = useState<string>('Prestige Wine Vintage');
  const [cmdRobotId, setCmdRobotId] = useState<string>('rob-01');
  const [cmdPriority, setCmdPriority] = useState<'Routine' | 'VIP' | 'CRITICAL'>('VIP');

  // Terminal log console streams
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'OMNI_STREAM: Central Host initialized connection to Aetheon Robotics microgrid.',
    'SECURE SHIELD: Encryption keys synchronized over TLS 1.3.',
    'CALIBRATION STATUS: Rover-Alpha 1 joint values synced inside tolerances.'
  ]);

  // Audio / simulation static noise filter
  const [simNoise, setSimNoise] = useState<boolean>(false);
  const [sweepCoordinates, setSweepCoordinates] = useState<{x: number, y: number}>({ x: 300, y: 150 });

  // Get active selected robot
  const selectedRobot = robots.find(r => r.id === selectedRobotId) || robots[0];

  // Radar sweep animation coordinate adjustments
  useEffect(() => {
    const sweepInterval = setInterval(() => {
      setSweepCoordinates({
        x: Math.floor(Math.random() * 200) + 140,
        y: Math.floor(Math.random() * 100) + 90
      });
    }, 3200);
    return () => clearInterval(sweepInterval);
  }, []);

  // Autonomous background telemetry stream simulation
  useEffect(() => {
    if (!isFeedStreaming) return;

    const streamInterval = setInterval(() => {
      // 1. Simulates battery drains, subtle joint fluctuations, speed modifications
      setRobots(prevRobots => 
        prevRobots.map(bot => {
          if (bot.status === 'Charging') {
            const nextBat = Math.min(bot.battery + 2, 100);
            return {
              ...bot,
              battery: nextBat,
              status: nextBat === 100 ? 'Idle' : 'Charging',
              lastSignalTime: 'Just now'
            };
          }
          if (bot.status === 'Calibrating') {
            return { ...bot, lastSignalTime: 'Just now' };
          }

          // Fluctuating values for active robots
          const batteryDrain = Math.random() * 0.25;
          const nextBat = Math.max(bot.battery - batteryDrain, 1);
          const nextSpeed = bot.speed > 0 
            ? Math.max(0.5, parseFloat((bot.speed + (Math.random() * 0.4 - 0.2)).toFixed(2))) 
            : 0;
          const nextLatency = Math.max(4, Math.floor(bot.latency + (Math.random() * 6 - 3)));

          // Slight drift in telemetry joints
          return {
            ...bot,
            battery: parseFloat(nextBat.toFixed(1)),
            speed: nextSpeed,
            latency: nextLatency,
            joints: {
              ...bot.joints,
              yaw: parseFloat(Math.min(180, Math.max(-180, bot.joints.yaw + (Math.random() * 2 - 1))).toFixed(1)),
              pitch: parseFloat(Math.min(90, Math.max(-90, bot.joints.pitch + (Math.random() * 1 - 0.5))).toFixed(1)),
              roll: parseFloat(Math.min(180, Math.max(-180, bot.joints.roll + (Math.random() * 1 - 0.5))).toFixed(1)),
              extension: parseFloat(Math.min(100, Math.max(0, bot.joints.extension + (Math.random() * 0.4 - 0.2))).toFixed(1))
            },
            lastSignalTime: 'Just now'
          };
        })
      );

      // 2. Increments tasks progress
      setTasks(prevTasks => 
        prevTasks.map(tsk => {
          if (tsk.progress >= 100) {
            // Re-trigger alert or complete log
            return { ...tsk, progress: 100 };
          }
          const addition = Math.floor(Math.random() * 4) + 1;
          const nextProg = Math.min(tsk.progress + addition, 100);
          
          if (nextProg === 100) {
            addTerminalLog(`TASK COMPLETE: Robot '${tsk.robotName}' reached room '${tsk.targetRoom}' - Delivered cargo payload: ${tsk.payload}.`);
          }
          return { ...tsk, progress: nextProg };
        })
      );
    }, 4500);

    return () => clearInterval(streamInterval);
  }, [isFeedStreaming]);

  // Add line helper to custom operator logs
  const addTerminalLog = (msg: string) => {
    setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // Adjust joint values in state from inputs
  const handleJointAdjustPoint = (jointKey: 'yaw' | 'pitch' | 'roll' | 'extension', value: number) => {
    setRobots(prev => prev.map(r => {
      if (r.id === selectedRobotId) {
        return {
          ...r,
          joints: {
            ...r.joints,
            [jointKey]: value
          }
        };
      }
      return r;
    }));
  };

  // Dispatch brand new task
  const handleDispatchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdTargetRoom.trim() || !cmdPayload.trim()) return;

    const assignedBot = robots.find(r => r.id === cmdRobotId);
    if (!assignedBot) return;

    const freshTask: RoboticTask = {
      id: `tsk-${Date.now().toString().slice(-3)}`,
      robotName: assignedBot.name,
      targetRoom: cmdTargetRoom.trim(),
      payload: cmdPayload.trim(),
      priority: cmdPriority,
      progress: 0
    };

    setTasks(prev => [freshTask, ...prev]);

    // Force bot status to 'En Route'
    setRobots(prev => prev.map(r => {
      if (r.id === cmdRobotId) {
        return {
          ...r,
          status: 'En Route',
          destination: `Room ${cmdTargetRoom}`,
          speed: 1.5
        };
      }
      return r;
    }));

    addTerminalLog(`DISPATCH DISK: Assigned ${assignedBot.name} to deliver "${cmdPayload}" to ${cmdTargetRoom} [Priority: ${cmdPriority}].`);
    setCmdTargetRoom('');
  };

  // Load Preset configurations into the selected joints
  const applyPresetConfig = (preset: 'inspection' | 'handoff' | 'dock' | 'maximum') => {
    let targetJoints = { yaw: 0, pitch: 0, roll: 0, extension: 20 };
    switch (preset) {
      case 'inspection':
        targetJoints = { yaw: 90, pitch: 60, roll: -45, extension: 90 };
        break;
      case 'handoff':
        targetJoints = { yaw: 0, pitch: 30, roll: 0, extension: 80 };
        break;
      case 'dock':
        targetJoints = { yaw: -180, pitch: -15, roll: 180, extension: 5 };
        break;
      case 'maximum':
        targetJoints = { yaw: 180, pitch: 90, roll: -180, extension: 100 };
        break;
    }

    setRobots(prev => prev.map(r => {
      if (r.id === selectedRobotId) {
        return {
          ...r,
          joints: targetJoints,
          status: r.status === 'Idle' ? 'Calibrating' : r.status
        };
      }
      return r;
    }));

    addTerminalLog(`PRESET LOADED: Integrated structural kinetic profile [${preset.toUpperCase()}] bounds on ${selectedRobot.name}.`);
  };

  // Calibrate joints routine simulator trigger
  const runKinematicCalibration = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    addTerminalLog(`INIT CALIBRATION: Initialized heuristic zero-angle calibration sweep on ${selectedRobot.name}.`);

    setTimeout(() => {
      setRobots(prev => prev.map(r => {
        if (r.id === selectedRobotId) {
          return {
            ...r,
            joints: { yaw: 0, pitch: 0, roll: 0, extension: 15 },
            status: 'Idle',
            speed: 0
          };
        }
        return r;
      }));
      setIsCalibrating(false);
      addTerminalLog(`CALIBRATION SUCCESS: Angular sensors & magnetometers locked. Offset drift coefficients zeroed.`);
    }, 3000);
  };

  const cameraModeColors = {
    rgb: 'border-slate-400 text-slate-800',
    lidar: 'border-cyan-500 text-cyan-400',
    thermal: 'border-amber-500 text-amber-500',
    depth: 'border-violet-500 text-violet-400'
  };

  return (
    <div id="omni-stream-root" className="space-y-6 text-left">
      
      {/* GLOBAL SYSTEM BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-550/10 font-mono text-[10px] uppercase tracking-wider text-slate-400 select-none">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>OMNI INTEGRAL LEVEL: <b className="text-emerald-500">ACTIVE</b></span>
          <span>ROBOTICS AGENT: <b className="text-[#6dfe9c]">LUXE-INTEL V4.1</b></span>
          <span>LATENCY: <b className="text-indigo-400">{selectedRobot.latency}ms</b></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[9px] text-[#6dfe9c]">
            <span className="w-1.5 h-1.5 bg-[#6dfe9c] rounded-full animate-ping"></span>
            STREAM SYNCED
          </span>
          <span className="text-slate-500">REALTIME POLLED DATA GAUGE</span>
        </div>
      </div>

      {/* DASHBOARD HEADER TITLE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase font-mono">
            <Workflow className="w-3.5 h-3.5" />
            <span>VIP SERVICE AUTOMATION CORE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-slate-800 dark:text-white tracking-tight mt-1">
            Omni-Stream <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Robotics Control Terminal</span>
          </h1>
          <p className="text-slate-505 dark:text-slate-400 text-sm mt-1.5">
            Volumetric LiDAR mappings, micro-axis joint kinematic calibrations, and telemetry delivery dispatches for autonomous luxury service carts.
          </p>
        </div>

        {/* Global status tags */}
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>Units Online: {robots.length}</span>
          </div>
        </div>
      </div>

      {/* THREE COLUMN BENTO DASHBOARD ENVIRONMENT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 leading-relaxed">
        
        {/* ROW 1 COLUMN A: ROBOTICS FLEET DECK MODULE (xl:col-span-3) */}
        <div className="xl:col-span-3 bg-slate-950/40 backdrop-blur-md rounded-2xl border border-slate-850 p-5 shadow-2xl flex flex-col justify-between min-h-[500px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Active Fleet Hub</span>
              <span className="px-2 py-0.5 rounded bg-indigo-505/15 text-[8px] font-mono text-indigo-400 font-bold uppercase">GPS BOUND</span>
            </div>

            {/* List of robotics units inside the fleet */}
            <div className="space-y-3.5">
              {robots.map((bot) => {
                const isSelected = bot.id === selectedRobotId;
                const fillPct = bot.battery;
                return (
                  <div 
                    key={bot.id}
                    onClick={() => setSelectedRobotId(bot.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden select-none ${
                      isSelected 
                        ? 'border-indigo-500/50 bg-indigo-550/10 shadow-lg' 
                        : 'border-slate-850 bg-slate-950/25 hover:border-slate-700 hover:bg-slate-950/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">{bot.name}</h4>
                        <p className="text-[9px] text-slate-400 font-mono italic mt-0.5">{bot.model}</p>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                        bot.status === 'En Route' 
                          ? 'bg-blue-600/10 text-blue-450 border-blue-500/20' 
                          : bot.status === 'Delivering'
                          ? 'bg-emerald-600/10 text-emerald-405 border-emerald-500/20'
                          : bot.status === 'Calibrating'
                          ? 'bg-purple-600/10 text-purple-400 border-purple-500/20 animate-pulse'
                          : bot.status === 'Charging'
                          ? 'bg-amber-600/10 text-amber-500 border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-600/20'
                      }`}>
                        {bot.status}
                      </span>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-slate-850/60">
                      <div>DEST: <b className="text-slate-900 dark:text-white">{bot.destination || 'STANDBY'}</b></div>
                      <div className="text-right">LAT: <b className="text-indigo-400">{bot.latency}ms</b></div>
                    </div>

                    {/* Battery indicator line */}
                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between text-[8px] font-mono text-slate-450">
                        <span>Li-Ion Core Power</span>
                        <span className={bot.battery <= 20 ? 'text-red-500 font-bold' : 'text-slate-300'}>{bot.battery}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            bot.battery <= 20 
                              ? 'bg-red-500' 
                              : bot.battery <= 50 
                              ? 'bg-amber-500' 
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${bot.battery}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-850">
            <button 
              type="button"
              onClick={() => {
                const nextId = `rob-0${robots.length + 1}`;
                const newBot: RobotUnit = {
                  id: nextId,
                  name: `Concierge Bot X${robots.length + 2}`,
                  model: 'Imperial Concierge Mech v2',
                  category: 'Butler',
                  status: 'Idle',
                  battery: 100,
                  joints: { yaw: 0, pitch: 0, roll: 0, extension: 0 },
                  destination: 'Lobby Station A',
                  streamUrl: 'RGB Lens BBX' + (robots.length + 2),
                  speed: 0,
                  latency: 12,
                  lastSignalTime: 'Registered just now'
                };
                setRobots(prev => [...prev, newBot]);
                addTerminalLog(`REGISTER UNIT: Activated secondary butler concierge instance ${newBot.name} successfully.`);
              }}
              className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-300 font-bold text-[10px] uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Register Concierge Unit</span>
            </button>
          </div>
        </div>

        {/* ROW 1 COLUMN B: LI-DAR RADAR & LIVE TELEMETRY CAMERA BLOCK (xl:col-span-6) */}
        <div className="xl:col-span-6 bg-slate-950/40 backdrop-blur-md rounded-2xl border border-slate-850 p-5 shadow-2xl flex flex-col justify-between min-h-[500px]">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-450 uppercase tracking-widest font-mono block">Video &amp; Volumetric Spatial Plot</span>
                <span className="text-[10px] text-slate-400">Stream Source: <b className="text-slate-900 dark:text-white uppercase">{selectedRobot.streamUrl}</b></span>
              </div>

              {/* Camera selection filters */}
              <div className="flex gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
                {(['rgb', 'lidar', 'thermal', 'depth'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      setCameraMode(mode);
                      addTerminalLog(`STREAM MODE: Configured optical camera matrix decoder to [${mode.toUpperCase()}].`);
                    }}
                    className={`px-2 py-1 text-[9px] font-mono uppercase font-bold rounded tracking-tight transition-all cursor-pointer ${
                      cameraMode === mode 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE CAMERA VIEWER FEED WITH STATIC EFFECT */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-850 flex flex-col items-center justify-center p-4">
              
              {/* Mesh visual dots overlay */}
              <div className="absolute inset-0 pattern-grid pointer-events-none opacity-[0.05]" style={{
                backgroundImage: 'radial-gradient(ellipse at 50% 50%, currentColor 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}></div>

              {/* Radar sweep lines */}
              {isFeedStreaming && (
                <div className="absolute inset-x-0 h-0.5 bg-indigo-500/10 pointer-events-none transition-transform animate-[bounce_8s_infinite] z-10"></div>
              )}

              {/* SIMULATED THERMAL / LiDAR RENDERING CANVAS BACKGROUND */}
              {isFeedStreaming ? (
                <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-4 bg-radial-pattern">
                  
                  {/* Interactive visual canvas graphic illustrating active coordinate trace */}
                  <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 500 300">
                    <defs>
                      <radialGradient id="targetGlow">
                        <stop offset="0%" stopColor={cameraMode === 'thermal' ? '#f59e0b' : '#06b6d4'} stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#020617" stopOpacity="0"/>
                      </radialGradient>
                    </defs>

                    {/* Sensor sweeping grids */}
                    <circle cx="250" cy="150" r="130" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="250" cy="150" r="80" fill="none" stroke="rgba(99,102,241,0.06)" strokeWidth="1" />
                    
                    {/* Linear vectors */}
                    <line x1="50" y1="150" x2="450" y2="150" stroke="rgba(99,102,241,0.05)" strokeWidth="1" />
                    <line x1="250" y1="30" x2="250" y2="270" stroke="rgba(99,102,241,0.05)" strokeWidth="1" />

                    {/* Radar tracer path */}
                    <path 
                      d="M 120 180 Q 210 90, 310 180 T 400 120" 
                      fill="none" 
                      stroke={cameraMode === 'thermal' ? 'rgba(245,158,11,0.45)' : cameraMode === 'lidar' ? 'rgba(6,182,212,0.45)' : 'rgba(99,102,241,0.3)'} 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeDasharray="5 5"
                    />

                    {/* Active simulated sweeping node */}
                    <g transform={`translate(${sweepCoordinates.x}, ${sweepCoordinates.y})`}>
                      <circle cx="0" cy="0" r="18" fill="url(#targetGlow)" className="animate-pulse" />
                      <circle cx="0" cy="0" r="4.5" fill={cameraMode === 'thermal' ? '#f59e0b' : cameraMode === 'lidar' ? '#06b6d4' : '#6366f1'} stroke="#ffffff" strokeWidth="1.5" />
                    </g>
                  </svg>

                  {/* Top status indicator HUD overlay */}
                  <div className="flex justify-between items-start font-mono text-[9px] uppercase tracking-wider relative z-10 select-none">
                    <div className="p-1 px-2.5 bg-slate-950/80 border border-slate-850 text-slate-300 rounded flex items-center gap-1.5 shadow">
                      <span className="w-1.5 h-1.5 bg-[#6dfe9c] rounded-full animate-ping"></span>
                      <span>FPS: {frameRate}Hz</span>
                    </div>
                    
                    <div className="text-right flex flex-col items-end gap-1 font-semibold">
                      <span className="text-slate-400">DEC: <b className="text-slate-900 dark:text-white">{selectedRobot.category} PROFILE</b></span>
                      <span className="text-[8px] text-slate-500 font-normal">LAT: {selectedRobot.latency}ms</span>
                    </div>
                  </div>

                  {/* Thermal Camera style colors simulation overlays over screen */}
                  {cameraMode === 'thermal' && (
                    <div className="absolute inset-0 bg-yellow-500/5 mix-blend-color-burn pointer-events-none"></div>
                  )}
                  {cameraMode === 'lidar' && (
                    <div className="absolute inset-0 bg-cyan-500/[0.03] mix-blend-overlay pointer-events-none"></div>
                  )}
                  {cameraMode === 'depth' && (
                    <div className="absolute inset-0 bg-purple-500/[0.04] mix-blend-color pointer-events-none"></div>
                  )}

                  {/* HUD target box around center coordinates */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-slate-500/20 rounded relative z-10 pointer-events-none select-none flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-indigo-500/50"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-indigo-500/50"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-indigo-500/50"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-indigo-500/50"></div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest bg-slate-950 px-1 font-bold">LENS LOCK</span>
                  </div>

                  {/* Bottom metrics HUD overlay */}
                  <div className="flex justify-between items-end font-mono text-[9px] uppercase tracking-wider relative z-10 select-none">
                    <div className="text-left font-semibold">
                      <span className="block text-slate-400">YAW: <b className="text-[#6dfe9c]">{selectedRobot.joints.yaw}°</b></span>
                      <span className="block text-slate-400 mt-0.5">PIT: <b className="text-[#6dfe9c]">{selectedRobot.joints.pitch}°</b></span>
                    </div>
                    
                    <div className="p-1 px-2.5 bg-slate-950/80 border border-slate-850 text-slate-350 rounded">
                      <span>RADAR SWEEP ACTIVE</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center space-y-3 relative z-10 select-none">
                  <Video className="w-12 h-12 text-slate-600 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Stream Muted</p>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-xs leading-relaxed mx-auto">
                      Optical link with transmitter device offline. Push the "Resume Link" trigger below to reconnect.
                    </p>
                  </div>
                </div>
              )}

              {/* Distortive noise lines */}
              {simNoise && (
                <div className="absolute inset-0 bg-opacity-[0.14] pointer-events-none z-20" style={{
                  backgroundImage: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
                  backgroundSize: '100% 100%'
                }} />
              )}
            </div>

            {/* Video feed controls buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2.5 border-t border-slate-850/60 font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsFeedStreaming(!isFeedStreaming);
                    addTerminalLog(`TRANSMITTERS: Set stream satellite link to [${!isFeedStreaming ? 'CONNECTED' : 'MUTED'}].`);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                    isFeedStreaming 
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20' 
                      : 'bg-emerald-500/10 text-[#6dfe9c] border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {isFeedStreaming ? (
                    <>
                      <Square className="w-3 h-3" />
                      Mute Video Link
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-[#6dfe9c]" />
                      Resume Link
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setSimNoise(!simNoise);
                    addTerminalLog(`Holographic static noise filter ${!simNoise ? 'engaged' : 'released'}.`);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Noise overlay
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Rate:</span>
                <input 
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={frameRate}
                  onChange={(e) => setFrameRate(Number(e.target.value))}
                  className="accent-indigo-505 dark:accent-indigo-400 bg-slate-800 h-1.5 rounded-lg outline-none cursor-ew-resize w-20"
                />
                <span className="text-slate-900 dark:text-white font-bold w-6 text-right">{frameRate}Hz</span>
              </div>
            </div>
          </div>

          {/* Unified active tasks grid (Lower segment of central) */}
          <div className="pt-5 border-t border-slate-850/80 space-y-3.5 text-left">
            <span className="text-xs font-bold text-slate-450 uppercase tracking-widest font-mono block">Autonomous Missions Progression</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map(task => (
                <div key={task.id} className="p-3.5 rounded-xl border border-slate-850 bg-slate-950/30 flex flex-col justify-between space-y-2">
                  <div className="flex justify-between items-start text-[10px] font-mono">
                    <div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white">{task.robotName}</h5>
                      <p className="text-slate-505 mt-0.5">Payload: {task.payload}</p>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                      task.priority === 'CRITICAL' 
                        ? 'bg-rose-500/10 text-rose-500' 
                        : task.priority === 'VIP'
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'bg-emerald-500/10 text-emerald-405'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Range bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-mono text-slate-500">
                      <span>Refill Routing Progress</span>
                      <span className="text-[#6dfe9c] font-bold">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 1 COLUMN C: MULTI-AXIS KINEMATIC INTEGRATION MODULE (xl:col-span-3) */}
        <div className="xl:col-span-3 bg-slate-950/40 backdrop-blur-md rounded-2xl border border-slate-850 p-5 shadow-2xl flex flex-col justify-between min-h-[500px]">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Axis Kinematics</span>
              <span className="text-[9px] font-mono text-[#6dfe9c] font-bold bg-[#6dfe9c]/10 px-2 py-0.5 rounded">LOCK-SECURE</span>
            </div>

            <div className="p-3 bg-indigo-550/5 border border-indigo-550/10 rounded-xl space-y-1.5 font-mono text-[10px] text-left">
              <span className="text-slate-400 uppercase font-black block text-[9px]">Loaded Mechanical Model</span>
              <div className="flex justify-between text-slate-900 dark:text-white font-extrabold text-xs">
                <span>{selectedRobot.name}</span>
                <span className="text-indigo-400 font-normal">{selectedRobot.category} Category</span>
              </div>
            </div>

            {/* Simulated adjustable joint sliders */}
            <div className="space-y-4 pt-1">
              {/* Yaw Controller Slider */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <span className="text-slate-400 flex items-center gap-1 uppercase font-mono">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" /> Joint Yaw Rotation
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white text-xs">{selectedRobot.joints.yaw}°</span>
                </div>
                <input 
                  type="range"
                  min="-180"
                  max="180"
                  step="0.5"
                  value={selectedRobot.joints.yaw}
                  disabled={isCalibrating}
                  onChange={(e) => handleJointAdjustPoint('yaw', Number(e.target.value))}
                  className="w-full accent-indigo-505 dark:accent-indigo-400 bg-slate-900 h-2 rounded outline-none cursor-ew-resize"
                />
                <span className="text-[8px] font-mono text-slate-505 uppercase tracking-wider block text-right">Min: -180&deg; / Max: 180&deg;</span>
              </div>

              {/* Pitch Controller Slider */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <span className="text-slate-400 flex items-center gap-1 uppercase font-mono">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Joint Pitch Elevation
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white text-xs">{selectedRobot.joints.pitch}°</span>
                </div>
                <input 
                  type="range"
                  min="-90"
                  max="90"
                  step="0.5"
                  value={selectedRobot.joints.pitch}
                  disabled={isCalibrating}
                  onChange={(e) => handleJointAdjustPoint('pitch', Number(e.target.value))}
                  className="w-full accent-indigo-505 dark:accent-indigo-400 bg-slate-900 h-2 rounded outline-none cursor-ew-resize"
                />
                <span className="text-[8px] font-mono text-slate-550 uppercase tracking-wider block text-right">Min: -90&deg; / Max: 90&deg;</span>
              </div>

              {/* Roll Axis Slider */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <span className="text-slate-400 flex items-center gap-1 uppercase font-mono">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Arm Roll Kinematics
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white text-xs">{selectedRobot.joints.roll}°</span>
                </div>
                <input 
                  type="range"
                  min="-180"
                  max="180"
                  step="0.5"
                  value={selectedRobot.joints.roll}
                  disabled={isCalibrating}
                  onChange={(e) => handleJointAdjustPoint('roll', Number(e.target.value))}
                  className="w-full accent-indigo-505 dark:accent-indigo-400 bg-slate-900 h-2 rounded outline-none cursor-ew-resize"
                />
                <span className="text-[8px] font-mono text-slate-550 uppercase tracking-wider block text-right">Min: -180&deg; / Max: 180&deg;</span>
              </div>

              {/* Extension Range Slider */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <span className="text-slate-400 flex items-center gap-1 uppercase font-mono">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" /> Joint Extension Scope
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white text-xs">{selectedRobot.joints.extension}cm</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={selectedRobot.joints.extension}
                  disabled={isCalibrating}
                  onChange={(e) => handleJointAdjustPoint('extension', Number(e.target.value))}
                  className="w-full accent-indigo-505 dark:accent-indigo-400 bg-slate-900 h-2 rounded outline-none cursor-ew-resize"
                />
                <span className="text-[8px] font-mono text-slate-550 uppercase tracking-wider block text-right">Extends scope to 100cm max</span>
              </div>
            </div>

            {/* Kinetic Presets grid */}
            <div className="pt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-black block mb-2.5">Joint Movement Presets</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyPresetConfig('inspection')}
                  className="py-1.5 px-2 bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white rounded text-[9px] uppercase font-mono font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Inspection
                </button>
                <button
                  onClick={() => applyPresetConfig('handoff')}
                  className="py-1.5 px-2 bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white rounded text-[9px] uppercase font-mono font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Room Deliver
                </button>
                <button
                  onClick={() => applyPresetConfig('dock')}
                  className="py-1.5 px-2 bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white rounded text-[9px] uppercase font-mono font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Dock State
                </button>
                <button
                  onClick={() => applyPresetConfig('maximum')}
                  className="py-1.5 px-2 bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white rounded text-[9px] uppercase font-mono font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Max Extension
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-850">
            <button
              onClick={runKinematicCalibration}
              disabled={isCalibrating}
              className={`w-full py-3.5 rounded-xl font-bold font-mono uppercase text-[10px] tracking-wider transition-all duration-300 shadow-lg ${
                isCalibrating
                  ? 'bg-purple-600 shadow-purple-900/30 text-white animate-pulse cursor-not-allowed'
                  : 'bg-indigo-650 hover:bg-indigo-600 text-white shadow-indigo-950/20 cursor-pointer'
              }`}
            >
              {isCalibrating ? 'Recalibrating offsets...' : 'Perform Multi-Axis Calibration'}
            </button>
          </div>
        </div>

      </div>

      {/* LOWER SECTION: OPERATOR DISPATCH FORM & LOGS INTEGRAL BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed select-none">
        
        {/* OPERATOR COMMAND LOADS SATELLITE DISPATCH (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2 mb-4 text-xs font-bold uppercase tracking-widest font-mono text-slate-450">
              <Send className="w-4 h-4 text-indigo-400" />
              <span>Launch Tactical Mission Command</span>
            </div>

            <form onSubmit={handleDispatchFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1.5">Assigned Payload Bot</label>
                  <select
                    value={cmdRobotId}
                    onChange={(e) => setCmdRobotId(e.target.value)}
                    className="w-full text-[11px] font-mono leading-tight p-2.5 rounded bg-slate-950 border border-slate-850 text-white outline-none"
                  >
                    {robots.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1.5">Priority Flag</label>
                  <select
                    value={cmdPriority}
                    onChange={(e) => setCmdPriority(e.target.value as any)}
                    className="w-full text-[11px] font-mono leading-tight p-2.5 rounded bg-slate-950 border border-slate-850 text-white outline-none"
                  >
                    <option value="Routine">Regular Sync</option>
                    <option value="VIP">VIP Express</option>
                    <option value="CRITICAL">Critical Override</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1.5">Target Destination Suite / Room</label>
                <input 
                  type="text"
                  required
                  placeholder="E.g. Penthouse 12B, Villa 12, Suite 61"
                  value={cmdTargetRoom}
                  onChange={(e) => setCmdTargetRoom(e.target.value)}
                  className="w-full p-2.5 rounded bg-slate-950 border border-slate-850 text-xs text-white placeholder-slate-600 outline-none uppercase font-bold tracking-wide"
                />
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1.5">Cargo Payload Specification</label>
                <input 
                  type="text"
                  required
                  placeholder="E.g. Towel Roll Packs, sommelier crystal Glasses"
                  value={cmdPayload}
                  onChange={(e) => setCmdPayload(e.target.value)}
                  className="w-full p-2.5 rounded bg-slate-950 border border-slate-850 text-xs text-white placeholder-slate-600 outline-none uppercase font-bold tracking-wide"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-[#4de082] text-[#410006] hover:bg-emerald-400 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all shadow hover:shadow-emerald-950/20 cursor-pointer"
              >
                Log sync &amp; Execute Dispatch
              </button>
            </form>
          </div>
        </div>

        {/* CONTROLLER EVENT LOGGER & TELEMETRY STREAM LOGS (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest font-mono text-slate-450 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              High-Frequency Robotics System logs
            </span>
            <button
              onClick={() => {
                setTerminalLogs(['OMNI_STREAM: Diagnostics cache wiped.', `[${new Date().toLocaleTimeString()}] Telemetry loop polling normal.`]);
              }}
              className="text-[9px] font-mono text-indigo-400 hover:underline uppercase font-bold cursor-pointer"
            >
              Clear Buffer
            </button>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-900 font-mono text-xs text-slate-450 h-[210px] overflow-y-auto custom-scrollbar space-y-2">
            {terminalLogs.map((log, index) => {
              const isEventCrit = log.includes('CRITICAL') || log.includes('COMPLETE') || log.includes('SUCCESS');
              const isEventWarn = log.includes('DISPATCH') || log.includes('INIT');

              return (
                <div key={index} className="flex gap-2.5 leading-relaxed p-1 hover:bg-slate-900/60 transition rounded">
                  <span className="text-slate-550 shrink-0 select-none">&bull;</span>
                  <p className={
                    isEventCrit 
                      ? 'text-[#6dfe9c]' 
                      : isEventWarn 
                      ? 'text-indigo-400' 
                      : 'text-slate-300'
                  }>
                    {log}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
