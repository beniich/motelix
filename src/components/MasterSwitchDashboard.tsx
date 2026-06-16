import React, { useEffect, useState } from 'react';

export default function MasterSwitchDashboard({ onAddLog }: { onAddLog?: () => void }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-8 font-sans selection:bg-[#ff2a2a] selection:text-white overflow-x-hidden"
      style={{
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <style>{`
        .master-button {
          background: radial-gradient(circle, #ff2a2a 0%, #8b0000 100%);
          transition: all 0.1s ease;
        }
        .master-button:active {
          transform: scale(0.95);
          box-shadow: inset 0 10px 20px rgba(0,0,0,0.8);
        }
        .hazard-ring {
          background: repeating-linear-gradient(
            45deg,
            #ffd700,
            #ffd700 10px,
            #000000 10px,
            #000000 20px
          );
          animation: rotate-ring 60s linear infinite;
        }
        @keyframes rotate-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .blinking-light {
          animation: blink 1s infinite alternate;
        }
        @keyframes blink {
          0% { opacity: 0.5; box-shadow: 0 0 5px currentColor; }
          100% { opacity: 1; box-shadow: 0 0 20px currentColor; }
        }
        .hazard-stripes-red {
          background: repeating-linear-gradient(
            45deg,
            #ff2a2a,
            #ff2a2a 20px,
            #000000 20px,
            #000000 40px
          );
        }
      `}</style>

      {/* Header Section */}
      <header className="w-full max-w-5xl flex flex-col items-center justify-center mb-12 relative z-10">
        <div className="border-2 rounded-lg py-4 px-8 text-center backdrop-blur-sm" style={{ borderColor: '#ff2a2a', backgroundColor: 'rgba(19, 19, 19, 0.5)', boxShadow: '0 0 15px rgba(255, 42, 42, 0.8), inset 0 0 10px rgba(255, 42, 42, 0.4)' }}>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest uppercase mb-2 shadow-sm" style={{ color: '#ff8c00', filter: 'drop-shadow(0 0 10px rgba(255,140,0,0.8))' }}>
            Zafir Master Switch - Global Control
          </h1>
          <h2 className="text-xl font-bold tracking-wider uppercase" style={{ color: '#ff2a2a' }}>
            Zafir Command Center: <span className="text-gray-300">Luxury Hotel Management - Pôle Tech</span>
          </h2>
        </div>
      </header>

      {/* Main Control Area */}
      <main className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-16 relative flex-grow z-10">
        
        {/* Big Red Button */}
        <div className="relative flex items-center justify-center z-10">
          {/* Hazard Ring Background */}
          <div className="absolute w-[340px] h-[340px] rounded-full hazard-ring shadow-2xl"></div>
          
          {/* Inner Black Ring */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-black border-4 border-gray-800"></div>
          
          {/* The Button Itself */}
          <button 
            className="master-button w-[280px] h-[280px] rounded-full flex items-center justify-center border-4 relative overflow-hidden group"
            style={{ borderColor: '#8b0000', boxShadow: '0 10px 20px rgba(0,0,0,0.8), inset 0 -5px 15px rgba(0,0,0,0.5)' }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
            <span className="text-4xl font-extrabold text-white text-center leading-tight px-6 relative z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}>
              INITIATE<br/>MASTER<br/>SHUTDOWN
            </span>
          </button>
        </div>

        {/* Status Panel */}
        <aside 
          className="rounded-xl p-6 w-full max-w-md shadow-2xl lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
          style={{ 
            background: 'rgba(19, 19, 19, 0.8)', 
            backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(255, 42, 42, 0.5)' 
          }}
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
            <h3 className="text-2xl font-bold text-gray-300">STATUS: <span style={{ color: '#ff2a2a', filter: 'drop-shadow(0 0 8px rgba(255,42,42,0.8))' }}>CRITICAL ALERT</span></h3>
            <div className="flex space-x-3">
              <div className="w-5 h-5 rounded-full blinking-light" style={{ backgroundColor: '#ff2a2a', boxShadow: '0 0 15px rgba(255, 42, 42, 0.8)' }}></div>
              <div className="w-5 h-5 rounded-full blinking-light" style={{ backgroundColor: '#ff8c00', boxShadow: '0 0 15px rgba(255, 140, 0, 0.8)', animationDelay: '0.3s' }}></div>
              <div className="w-5 h-5 rounded-full blinking-light" style={{ backgroundColor: '#ff2a2a', boxShadow: '0 0 15px rgba(255, 42, 42, 0.8)', animationDelay: '0.6s' }}></div>
            </div>
          </div>
          <ul className="space-y-4 text-lg font-bold text-gray-200 tracking-wide">
            <li className="flex items-center space-x-2">
              <span style={{ color: '#ffd700' }}>►</span>
              <span>SYSTEM INSTABILITY DETECTED</span>
            </li>
            <li className="flex items-center space-x-2">
              <span style={{ color: '#ff8c00' }}>►</span>
              <span>EMERGENCY PROTOCOL ACTIVE</span>
            </li>
            <li className="flex items-center space-x-2">
              <span style={{ color: '#ff2a2a' }}>►</span>
              <span>PÔLE TECH - IMMEDIATE ACTION REQUIRED</span>
            </li>
          </ul>
        </aside>

      </main>

      {/* Protocol Steps Section */}
      <section className="w-full max-w-3xl flex flex-col gap-4 mt-12 mb-8 z-10">
        
        {/* Step 1 (Active) */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div 
            className="rounded-lg py-3 px-6 flex-1 text-center"
            style={{ 
              background: 'rgba(19, 19, 19, 0.8)', 
              backdropFilter: 'blur(10px)', 
              border: '1px solid #ffd700',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.8), inset 0 0 10px rgba(255, 215, 0, 0.4)'
            }}
          >
            <span className="text-xl font-bold" style={{ color: '#ffd700', filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.8))' }}>STEP 1: INSERT VIRTUAL KEY</span>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="rounded-lg p-2 flex items-center justify-center grid grid-cols-3 gap-1" style={{ background: 'rgba(19, 19, 19, 0.8)', border: '1px solid #3a3939' }}>
              {[1,2,3,4,5,6,7,8].map(n => (
                <div key={n} className="w-6 h-6 bg-gray-800 rounded text-[10px] flex items-center justify-center text-gray-400">{n}</div>
              ))}
              <div className="w-6 h-6 bg-green-900 rounded text-[10px] flex items-center justify-center text-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]">OK</div>
            </div>
            <div className="rounded-lg py-3 px-6 flex-1 text-center bg-gray-900/80 border border-gray-700">
              <span className="text-lg text-gray-400 animate-pulse" style={{ fontFamily: "'JetBrains Mono', monospace" }}>KEY AWAITING...</span>
            </div>
          </div>
        </div>

        {/* Step 2 (Disabled) */}
        <div className="flex flex-col md:flex-row gap-4 items-center opacity-50">
          <div className="border border-gray-700 rounded-lg py-3 px-6 flex-1 text-center bg-gray-900/80">
            <span className="text-xl font-bold text-gray-500">STEP 2: CONFIRM SHUTDOWN</span>
          </div>
          <div className="rounded-lg py-3 px-6 flex-1 text-center border border-gray-700 bg-gray-900/80 w-full md:w-[350px]">
            <span className="text-lg text-gray-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>AWAITING KEY VALIDATION</span>
          </div>
        </div>

      </section>

      {/* Footer Section */}
      <footer className="w-full flex flex-col items-center z-10">
        
        {/* Warning Banner */}
        <div 
          className="w-full max-w-5xl relative border-y-4 py-4 px-12 text-center overflow-hidden"
          style={{ borderColor: '#ff2a2a', backgroundColor: 'rgba(19, 19, 19, 0.9)', boxShadow: '0 0 15px rgba(255, 42, 42, 0.8), inset 0 0 10px rgba(255, 42, 42, 0.4)' }}
        >
          {/* Top/Bottom Hazard Stripes Inner Border */}
          <div className="absolute inset-x-0 top-0 h-2 hazard-stripes-red"></div>
          <div className="absolute inset-x-0 bottom-0 h-2 hazard-stripes-red"></div>
          
          {/* Warning Flasher Left */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full blinking-light" style={{ backgroundColor: '#ff2a2a', boxShadow: '0 0 15px rgba(255, 42, 42, 0.8)' }}></div>
          
          <p className="text-lg md:text-xl font-bold text-white tracking-wide z-10 relative">
            <span style={{ color: '#ff2a2a' }}>WARNING:</span> UNAUTHORIZED ACCESS PROHIBITED. CRITICAL INFRASTRUCTURE.<br/>
            DEVIATION FROM PROTOCOL WILL RESULT IN IMMEDIATE LOCKDOWN.
          </p>
          
          {/* Warning Flasher Right */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full blinking-light" style={{ backgroundColor: '#ff2a2a', boxShadow: '0 0 15px rgba(255, 42, 42, 0.8)' }}></div>
        </div>

        {/* System Info */}
        <div className="mt-6 text-center text-gray-500 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <p>SYSTEM TIME: <span>{time}</span> UTC</p>
          <p>UNIT: ZAFIR-PÔLE-TECH-001</p>
        </div>
        
      </footer>
    </div>
  );
}
