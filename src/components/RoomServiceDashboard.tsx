import React from 'react';
import { ChefHat, Clock, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

export default function RoomServiceDashboard() {
  const orders = [
    {
      id: "ORD-9021",
      suite: "PH-801",
      guest: "H.E. Al-Fayed",
      items: ["Wagyu Tomahawk", "Truffle Fries", "Dom Pérignon '08"],
      status: "Preparing",
      progress: 66,
      time: "14 min",
      vip: "vip-badge-gold",
      img: "https://images.unsplash.com/photo-1544025162-811114bd4083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "ORD-9022",
      suite: "STE-402",
      guest: "Elena Morozova",
      items: ["Seared Scallops", "Saffron Risotto", "Chablis Grand Cru"],
      status: "Out for Delivery",
      progress: 100,
      time: "2 min",
      vip: "vip-badge-silver",
      img: "https://images.unsplash.com/photo-1599955740417-6644fcfc664b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "ORD-9023",
      suite: "RM-210",
      guest: "Mr. Smith",
      items: ["Club Sandwich", "Iced Tea"],
      status: "Received",
      progress: 33,
      time: "22 min",
      vip: null,
      img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "ORD-9024",
      suite: "PH-802",
      guest: "James Rothschild",
      items: ["Beluga Caviar", "Blinis", "Krug Clos d'Ambonnay"],
      status: "Preparing",
      progress: 66,
      time: "18 min",
      vip: "vip-badge-gold",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "ORD-9025",
      suite: "STE-305",
      guest: "Ms. Chen",
      items: ["Lobster Thermidor", "Asparagus"],
      status: "Out for Delivery",
      progress: 100,
      time: "5 min",
      vip: "vip-badge-silver",
      img: "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "ORD-9026",
      suite: "RM-102",
      guest: "Dr. Evans",
      items: ["Continental Breakfast", "Fresh OJ"],
      status: "Received",
      progress: 33,
      time: "25 min",
      vip: null,
      img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="relative w-full h-full min-h-screen overflow-y-auto font-sans bg-slate-900">
      {/* Background Image Wrapper */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Kitchen Background" 
          className="w-full h-full object-cover opacity-30" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
      </div>
      
      <div className="relative z-10 p-8 flex flex-col space-y-8">
        
        {/* Header section with KPIs */}
        <div className="flex justify-between items-center glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <ChefHat className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Room Service Orders</h1>
              <p className="text-slate-300 mt-1">Live Kitchen Ticket Feed</p>
            </div>
          </div>
          
          <div className="flex gap-6">
             <div className="text-right">
               <div className="text-3xl font-bold text-white">24</div>
               <div className="text-xs text-slate-300 uppercase mt-1">Completed</div>
             </div>
             <div className="text-right">
               <div className="text-3xl font-bold text-amber-400">6</div>
               <div className="text-xs text-slate-300 uppercase mt-1">Active</div>
             </div>
             <div className="text-right">
               <div className="text-3xl font-bold text-red-400">0</div>
               <div className="text-xs text-slate-300 uppercase mt-1">Delayed</div>
             </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className="glass-card rounded-3xl overflow-hidden flex flex-col group relative">
              {/* Image Section */}
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={order.img} 
                  alt="Order Image" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {order.vip && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${order.vip}`}>
                    VIP {order.vip.includes('gold') ? 'Gold' : 'Silver'}
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">{order.guest}</h3>
                    <div className="text-sm text-slate-300 font-mono mt-1">Suite {order.suite}</div>
                  </div>
                  <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white font-mono text-sm">
                    {order.id}
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Order Items</div>
                  <ul className="text-slate-200 text-sm space-y-1.5 mb-6">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Progress & Status */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-bold ${order.progress === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {order.time}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div 
                      className={`h-full ${
                        order.progress === 33 ? 'progress-track' : 
                        order.progress === 66 ? 'progress-track-half' : 'progress-track-full'
                      }`}
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 uppercase mt-2 font-bold px-1">
                    <span className={order.progress >= 33 ? "text-blue-400" : ""}>Received</span>
                    <span className={order.progress >= 66 ? "text-blue-400" : ""}>Preparing</span>
                    <span className={order.progress === 100 ? "text-emerald-400" : ""}>Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
