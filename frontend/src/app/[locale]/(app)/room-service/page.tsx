'use client';

export default function RoomServicePage() {
  const orders = [
    {
      id: 1,
      guest: "Chen & Family",
      room: "Room 1",
      item: "Gourmet breakfast, gourmet rohat",
      step: 2,
      gradient: "from-amber-200 to-orange-400"
    },
    {
      id: 2,
      guest: "Ms. Alfayed",
      room: "Room 3",
      item: "Sushi platter, mang",
      step: 2,
      gradient: "from-emerald-300 to-teal-500"
    },
    {
      id: 3,
      guest: "Dr. Rossi",
      room: "Room 6",
      item: "Steak dinner, rooat nn",
      step: 2,
      gradient: "from-rose-300 to-red-500"
    },
    {
      id: 4,
      guest: "Al Gtore",
      room: "Room 3",
      item: "Steak Breakfast, 2.8 Tap",
      step: 3,
      gradient: "from-orange-300 to-amber-600"
    },
    {
      id: 5,
      guest: "Contarah",
      room: "Room 5",
      item: "Steak Bteek, Steak Brawstest",
      step: 2,
      gradient: "from-red-300 to-rose-600"
    },
    {
      id: 6,
      guest: "Fonuhery",
      room: "Room 7",
      item: "Steak Dinner, in a 1.3 Tap",
      step: 2,
      gradient: "from-yellow-200 to-amber-500"
    }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-4 text-[#1a1a1a] font-sans">
      <header>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight">
          Zafir Room Service Orders
        </h1>
        <p className="text-[#5b6472] mt-1 text-sm">Zafir Command Center: Pôle Opérations</p>
      </header>

      <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/70 backdrop-blur-md border border-white/70 shadow-sm rounded-2xl overflow-hidden flex flex-col">
              {/* Image Placeholder */}
              <div className={`h-32 w-full bg-gradient-to-tr ${order.gradient} relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                 <svg className="absolute -bottom-4 -right-4 w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                {/* Progress Bar */}
                <div className="relative mb-6 mt-2">
                  <div className="absolute top-1.5 left-0 w-full h-0.5 bg-gray-200 rounded-full" />
                  <div className="absolute top-1.5 left-0 h-0.5 bg-blue-500 rounded-full transition-all duration-500" style={{ width: order.step === 1 ? '0%' : order.step === 2 ? '50%' : '100%' }} />
                  
                  <div className="flex justify-between relative z-10">
                    <div className="flex flex-col items-center">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white ${order.step >= 1 ? 'border-blue-500' : 'border-gray-300'}`} />
                      <span className="text-[10px] font-medium text-gray-500 mt-1">Preparation</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white ${order.step >= 2 ? 'border-blue-500' : 'border-gray-300'}`} />
                      <span className="text-[10px] font-medium text-gray-500 mt-1">Quality Check</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white ${order.step >= 3 ? 'border-blue-500' : 'border-gray-300'}`} />
                      <span className="text-[10px] font-medium text-gray-500 mt-1">Out for Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-semibold text-gray-800">Guest: {order.guest}</p>
                  <p className="text-sm font-semibold text-gray-800">{order.room}</p>
                </div>
                <p className="text-xs text-gray-500">{order.item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
