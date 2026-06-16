'use client';

function ProgressBar({ step }: { step: number }) {
  const pct = step === 1 ? '0%' : step === 2 ? '50%' : '100%';
  return (
    <div className="mb-4">
      <div className="h-1 w-full bg-gray-200 rounded-full mb-3 relative">
        <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all" style={{ width: pct }} />
        {/* Dot 1 - always active */}
        <div className="absolute -top-1.5 left-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow" />
        {/* Dot 2 - active if step >= 2 */}
        <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
        {/* Dot 3 - active if step >= 3 */}
        <div className={`absolute -top-1.5 right-0 w-4 h-4 rounded-full border-2 border-white shadow ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-wider font-semibold text-gray-500">
        <span className={step >= 1 ? 'text-blue-600' : ''}>Preparation</span>
        <span className={step >= 2 ? 'text-blue-600' : ''}>Quality Check</span>
        <span className={step >= 3 ? 'text-blue-600' : ''}>Out for Delivery</span>
      </div>
    </div>
  );
}

const ORDERS = [
  {
    id: 1, guest: "Chen & Family", room: "1", step: 1,
    desc: "Gourmet breakfast, gourmet roast",
    svg: (
      <svg viewBox="0 0 300 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7"/>
            <stop offset="100%" stopColor="#fde68a"/>
          </linearGradient>
        </defs>
        <rect width="300" height="180" fill="url(#bg1)"/>
        <ellipse cx="150" cy="105" rx="120" ry="30" fill="#fff" opacity="0.95"/>
        <ellipse cx="150" cy="100" rx="115" ry="26" fill="#f9fafb"/>
        {/* Pancakes */}
        <circle cx="130" cy="95" r="32" fill="#d4a373"/>
        <circle cx="125" cy="88" r="28" fill="#e8b888"/>
        <circle cx="128" cy="92" r="22" fill="#d4a373"/>
        {/* Berries */}
        <circle cx="115" cy="85" r="4" fill="#dc2626"/>
        <circle cx="125" cy="80" r="3.5" fill="#7c2d12"/>
        <circle cx="140" cy="85" r="4" fill="#1d4ed8"/>
        <circle cx="118" cy="92" r="3" fill="#dc2626"/>
        {/* Egg */}
        <circle cx="170" cy="90" r="14" fill="#fff"/>
        <circle cx="170" cy="90" r="8" fill="#fde047"/>
        <circle cx="170" cy="90" r="3" fill="#f59e0b"/>
        {/* Bacon */}
        <rect x="95" y="105" width="60" height="8" rx="3" fill="#9a3412"/>
        <rect x="98" y="107" width="54" height="3" rx="1" fill="#c2410c"/>
        {/* Coffee cup */}
        <ellipse cx="60" cy="60" rx="22" ry="8" fill="#fff"/>
        <ellipse cx="60" cy="55" rx="20" ry="6" fill="#451a03"/>
        {/* OJ */}
        <path d="M 230 70 L 250 70 L 248 110 L 232 110 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.5"/>
        <ellipse cx="240" cy="70" rx="10" ry="3" fill="#fb923c"/>
      </svg>
    )
  },
  {
    id: 2, guest: "Ms. Alfayed", room: "3", step: 2,
    desc: "Sushi platter, mango",
    svg: (
      <svg viewBox="0 0 300 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b"/>
            <stop offset="100%" stopColor="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="300" height="180" fill="url(#bg2)"/>
        <ellipse cx="150" cy="100" rx="125" ry="32" fill="#1e293b"/>
        <ellipse cx="150" cy="96" rx="118" ry="28" fill="#fff"/>
        {/* Sushi pieces */}
        <rect x="60" y="92" width="32" height="14" rx="3" fill="#fef3c7"/>
        <rect x="60" y="86" width="32" height="8" rx="3" fill="#f97316"/>
        <ellipse cx="76" cy="86" rx="16" ry="4" fill="#fb923c"/>
        <rect x="100" y="92" width="32" height="14" rx="3" fill="#fef3c7"/>
        <rect x="100" y="86" width="32" height="8" rx="3" fill="#dc2626"/>
        <rect x="140" y="92" width="32" height="14" rx="3" fill="#fef3c7"/>
        <rect x="140" y="86" width="32" height="8" rx="3" fill="#dc2626"/>
        <ellipse cx="156" cy="86" rx="16" ry="4" fill="#b91c1c"/>
        <rect x="180" y="92" width="32" height="14" rx="3" fill="#fef3c7"/>
        <rect x="180" y="86" width="32" height="8" rx="3" fill="#f9a8d4"/>
        <rect x="220" y="92" width="32" height="14" rx="3" fill="#fef3c7"/>
        <rect x="220" y="86" width="32" height="8" rx="3" fill="#22c55e"/>
        {/* Chopsticks */}
        <rect x="40" y="125" width="120" height="2.5" rx="1" fill="#92400e" transform="rotate(-15 40 125)"/>
        <rect x="40" y="130" width="120" height="2.5" rx="1" fill="#78350f" transform="rotate(-15 40 130)"/>
        {/* Wasabi */}
        <circle cx="240" cy="60" r="8" fill="#84cc16"/>
      </svg>
    )
  },
  {
    id: 3, guest: "Dr. Rossi", room: "6", step: 1,
    desc: "Steak dinner, roast veg",
    svg: (
      <svg viewBox="0 0 300 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="180" fill="#0c0a09"/>
        <ellipse cx="150" cy="100" rx="125" ry="32" fill="#1c1917"/>
        <ellipse cx="150" cy="96" rx="118" ry="28" fill="#fef3c7"/>
        <ellipse cx="150" cy="93" rx="110" ry="24" fill="#fff"/>
        <ellipse cx="150" cy="93" rx="60" ry="22" fill="#7c2d12"/>
        <ellipse cx="148" cy="90" rx="50" ry="18" fill="#9a3412"/>
        <ellipse cx="145" cy="87" rx="40" ry="13" fill="#c2410c"/>
        <line x1="115" y1="78" x2="180" y2="78" stroke="#451a03" strokeWidth="2" opacity="0.6"/>
        <line x1="118" y1="100" x2="175" y2="100" stroke="#451a03" strokeWidth="2" opacity="0.6"/>
        <ellipse cx="80" cy="100" rx="8" ry="4" fill="#22c55e"/>
        <ellipse cx="220" cy="100" rx="8" ry="4" fill="#84cc16"/>
        <ellipse cx="100" cy="105" rx="6" ry="3" fill="#fbbf24"/>
        <ellipse cx="200" cy="105" rx="6" ry="3" fill="#fbbf24"/>
      </svg>
    )
  },
  {
    id: 4, guest: "Al Gtore", room: "3", step: 2,
    desc: "Steak Breakfast, 2.8 Tap",
    svg: (
      <svg viewBox="0 0 300 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="180" fill="#0c0a09"/>
        <ellipse cx="150" cy="100" rx="125" ry="32" fill="#1c1917"/>
        <ellipse cx="150" cy="96" rx="118" ry="28" fill="#1c1917"/>
        <ellipse cx="100" cy="100" rx="50" ry="20" fill="#7c2d12"/>
        <ellipse cx="98" cy="97" rx="42" ry="16" fill="#9a3412"/>
        <circle cx="195" cy="95" r="22" fill="#fff"/>
        <circle cx="195" cy="95" r="12" fill="#fde047"/>
        <circle cx="195" cy="95" r="5" fill="#f59e0b"/>
        <ellipse cx="240" cy="105" rx="14" ry="6" fill="#fbbf24"/>
      </svg>
    )
  },
  {
    id: 5, guest: "Contarah", room: "5", step: 2,
    desc: "Steak Bteek, Steak Brawstest",
    svg: (
      <svg viewBox="0 0 300 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="180" fill="#1c1917"/>
        <ellipse cx="150" cy="100" rx="125" ry="32" fill="#292524"/>
        <ellipse cx="150" cy="96" rx="118" ry="28" fill="#fef3c7"/>
        <ellipse cx="150" cy="93" rx="110" ry="24" fill="#fff"/>
        <ellipse cx="150" cy="93" rx="65" ry="24" fill="#7c2d12"/>
        <ellipse cx="148" cy="90" rx="55" ry="20" fill="#9a3412"/>
        <line x1="100" y1="78" x2="200" y2="78" stroke="#451a03" strokeWidth="2" opacity="0.6"/>
        <line x1="105" y1="105" x2="195" y2="105" stroke="#451a03" strokeWidth="2" opacity="0.6"/>
        <ellipse cx="80" cy="105" rx="10" ry="4" fill="#22c55e"/>
        <ellipse cx="225" cy="105" rx="10" ry="4" fill="#22c55e"/>
      </svg>
    )
  },
  {
    id: 6, guest: "Fonuhery", room: "7", step: 2,
    desc: "Steak Dinner, in a 1.3 Tap",
    svg: (
      <svg viewBox="0 0 300 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="180" fill="#1c1917"/>
        <ellipse cx="150" cy="100" rx="125" ry="32" fill="#292524"/>
        <ellipse cx="150" cy="96" rx="118" ry="28" fill="#fef3c7"/>
        <ellipse cx="150" cy="93" rx="110" ry="24" fill="#fff"/>
        {/* Pasta nest */}
        <g stroke="#fbbf24" strokeWidth="2" fill="none">
          <path d="M 90 80 Q 110 70 130 80 Q 150 90 170 80 Q 190 70 210 80"/>
          <path d="M 95 90 Q 115 80 135 90 Q 155 100 175 90 Q 195 80 215 90"/>
          <path d="M 90 100 Q 110 90 130 100 Q 150 110 170 100 Q 190 90 210 100"/>
          <path d="M 95 110 Q 115 100 135 110 Q 155 120 175 110 Q 195 100 215 110"/>
        </g>
        <circle cx="120" cy="95" r="3" fill="#dc2626"/>
        <circle cx="160" cy="100" r="3" fill="#dc2626"/>
        <circle cx="185" cy="92" r="3" fill="#dc2626"/>
        <ellipse cx="150" cy="85" rx="6" ry="3" fill="#16a34a" transform="rotate(20 150 85)"/>
      </svg>
    )
  }
];

export default function RoomServicePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-4 text-gray-800 font-sans">
      <header>
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-1">Zafir Room Service Orders</h1>
        <p className="text-gray-600 font-medium">Zafir Command Center: Pôle Opérations</p>
      </header>

      <section className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ORDERS.map((order) => (
            <article key={order.id} className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div className="h-44 relative overflow-hidden">
                {order.svg}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <ProgressBar step={order.step} />
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-gray-500">Guest</p>
                    <h3 className="font-semibold text-lg">{order.guest}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Room</p>
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 font-semibold text-sm border border-gray-200">{order.room}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-auto">{order.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
