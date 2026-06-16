import React from 'react';

export default function MinibarDashboard() {
  return (
    <div 
      className="relative w-full h-full min-h-screen overflow-y-auto font-sans text-gray-800"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundImage: "url('https://lh3.googleusercontent.com/aida/AP1WRLsLaUm8E8WXoAUEebOgPSDM2dQKT4sTSm_Sih2K2dFIqKAmB1G2EO9WYrPHpWpINhQ2Ev1VaHdNhKjqRNOASqw3fsFJPulnCY3vGKrQ8HmXz7yi-YRgYYaJpoAXbCiy8gghYjsUiVR8c6QAb8lUs6S0j1goBix0G15ALo1ZL29X8bOHeNzeyPJc6NGEZWvJB7oqPqiXesJ3bbcLXlQMquh78nTMQdILSo3qilmfKcLzHSjYkMPrWscFWjk')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[5px] z-0"></div>

      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Header */}
        <header className="mb-8 pt-4">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2 drop-shadow-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Zafir Smart Minibar</h1>
          <p className="text-gray-600 font-medium drop-shadow-sm">October 26, 2024, 10:30 AM</p>
        </header>

        <div className="flex gap-6 flex-1 items-start">
          
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Inventory Overview */}
            <section className="glass-panel rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>Minibar Inventory Overview</h3>
                <span className="text-sm font-medium text-gray-600">Across all rooms</span>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                
                {/* Water Gauge */}
                <div className="glass-card rounded-2xl p-5 flex flex-col items-center shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-4">Water</h4>
                  <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round"></circle>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="37.68"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>85%</span>
                      <span className="text-xs text-gray-500 font-medium">full</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">85% rooms</p>
                </div>

                {/* Soda Gauge */}
                <div className="glass-card rounded-2xl p-5 flex flex-col items-center shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-4">Soda</h4>
                  <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round"></circle>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#F43F5E" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="75.36"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>70%</span>
                      <span className="text-xs text-gray-500 font-medium">full</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">70% rooms</p>
                </div>

                {/* Spirits Gauge */}
                <div className="glass-card rounded-2xl p-5 flex flex-col items-center shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-4">Spirits</h4>
                  <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round"></circle>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#2563EB" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="25.12"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>90%</span>
                      <span className="text-xs text-gray-500 font-medium">full</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">90% rooms</p>
                </div>

                {/* Snacks Gauge */}
                <div className="glass-card rounded-2xl p-5 flex flex-col items-center shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-4">Snacks</h4>
                  <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round"></circle>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#D97706" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="100.48"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>60%</span>
                      <span className="text-xs text-gray-500 font-medium">full</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">60% rooms</p>
                </div>

              </div>
            </section>

            {/* Bottom Row */}
            <div className="flex gap-6">
              
              {/* Billing Alerts */}
              <section className="glass-panel rounded-3xl p-6 flex-1 shadow-sm">
                <h3 className="text-xl font-medium mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Automatic Billing Alerts</h3>
                <ul className="space-y-3">
                  <li className="text-gray-800 font-medium bg-white/40 px-4 py-2 rounded-xl">Room 302: Spirits - $25.00 (09:15 AM)</li>
                  <li className="text-gray-800 font-medium bg-white/40 px-4 py-2 rounded-xl">Room 510: Water - $10.00 (09:30 AM)</li>
                  <li className="text-gray-800 font-medium bg-white/40 px-4 py-2 rounded-xl">Room 412: Snacks - $18.50 (09:45 AM)</li>
                </ul>
              </section>

              {/* Total Restocks */}
              <section className="glass-panel rounded-3xl p-6 w-56 flex flex-col justify-center shadow-sm">
                <h3 className="text-base font-medium text-gray-700 mb-2">Total Restocks Today:</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>28</div>
                <p className="text-sm text-gray-600 font-medium">Items Low: 12</p>
              </section>

            </div>

          </div>

          {/* Right Column */}
          <aside className="w-80 flex flex-col gap-6 shrink-0 h-full">
            
            {/* Restock Map */}
            <section className="glass-panel rounded-3xl p-6 flex-1 flex flex-col shadow-sm">
              <h3 className="text-xl font-medium mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>Restock Visualizer</h3>
              
              {/* Floor Plan Mockup */}
              <div className="glass-card rounded-2xl flex-1 border border-gray-200/50 p-4 relative mb-6">
                <div className="absolute inset-0 m-4 border-2 border-dashed border-gray-400/50 rounded-xl flex items-center justify-center bg-white/20">
                  <div className="flex flex-wrap gap-2 justify-center p-2">
                    {/* Top Row */}
                    <div className="w-6 h-6 bg-red-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-red-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-emerald-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-red-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-emerald-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-emerald-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-red-400 rounded-md shadow-sm"></div>
                    
                    {/* Middle */}
                    <div className="w-full flex justify-between px-2 py-4">
                      <div className="w-6 h-6 bg-emerald-400 rounded-md shadow-sm"></div>
                      <div className="w-24 h-16 bg-gray-300/50 rounded-lg shadow-inner"></div>
                      <div className="w-6 h-6 bg-emerald-400 rounded-md shadow-sm"></div>
                    </div>
                    
                    {/* Bottom Row */}
                    <div className="w-6 h-6 bg-red-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-emerald-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-red-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-red-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-emerald-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-emerald-400 rounded-md shadow-sm"></div>
                    <div className="w-6 h-6 bg-emerald-400 rounded-md shadow-sm"></div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-auto bg-white/40 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded-sm shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Needs Restock</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-400 rounded-sm shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Full</span>
                </div>
              </div>
            </section>

            {/* Status */}
            <section className="glass-panel rounded-3xl p-6 shadow-sm bg-gradient-to-br from-emerald-500/10 to-transparent">
              <h3 className="text-base font-medium text-gray-700 mb-2">System Status:</h3>
              <div className="text-2xl font-medium text-gray-900 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                All Systems<br/>Normal
              </div>
            </section>

          </aside>

        </div>
      </div>
    </div>
  );
}
