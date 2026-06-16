'use client';

import { ChefHat, Clock, AlertTriangle, CheckCircle, Flame, Star } from 'lucide-react';

import { useRoomService } from '@/hooks/useRoomService';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function ProgressBar({ progress }: { progress: number }) {
  const color =
    progress === 100
      ? 'from-emerald-500 to-emerald-400'
      : progress >= 66
      ? 'from-blue-500 to-purple-500'
      : 'from-amber-500 to-orange-400';

  return (
    <div className="space-y-1.5">
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5A659E' }}>
        <span className={progress >= 33 ? 'text-amber-400' : ''}>Received</span>
        <span className={progress >= 66 ? 'text-blue-400' : ''}>Preparing</span>
        <span className={progress === 100 ? 'text-emerald-400' : ''}>Delivery</span>
      </div>
    </div>
  );
}

export default function RoomServicePage() {
  const { orders, isLoading, error } = useRoomService();

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const active = orders.filter((o) => o.progress < 100).length;
  const completed = orders.filter((o) => o.progress === 100).length;
  const delayed = 0; // Logic for delayed orders based on createdAt vs current time could be added here


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-semibold flex items-center gap-3"
            style={{ fontFamily: 'var(--font-playfair), serif', color: '#E6E8F2' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}
            >
              <ChefHat className="w-5 h-5 text-[#0A0E27]" />
            </div>
            Room Service
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#8E96BD' }}>
            Live Kitchen Ticket Feed
          </p>
        </div>

        {/* KPI bar */}
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#10B981' }}>{completed}</div>
            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#8E96BD' }}>Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{active}</div>
            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#8E96BD' }}>Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#EF4444' }}>{delayed}</div>
            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#8E96BD' }}>Delayed</div>
          </div>
        </div>
      </div>

      {/* Orders grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            No active room service orders.
          </div>
        ) : (
          orders.map((order) => {
            // Unsplash placeholder since we don't have catalog image links dynamically set
            const img = 'https://images.unsplash.com/photo-1544025162-811114bd4083?auto=format&fit=crop&w=800&q=80';
            const guestName = `${order.reservation?.guest?.firstName || ''} ${order.reservation?.guest?.lastName || 'Unknown'}`;
            const timeAgo = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true });
            
            return (
            <div
              key={order.id}
              className="rounded-2xl overflow-hidden flex flex-col group"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = '';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '';
              }}
            >
              {/* Image */}
              <div className="h-44 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${guestName} order`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* VIP badge */}
                {order.reservation?.guest?.vip && (
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase"
                    style={{ background: 'rgba(212,175,55,0.9)', color: '#0A0E27' }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    VIP
                  </div>
                )}

                {/* Guest info */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white leading-tight">{guestName}</h3>
                    <p className="text-xs font-mono mt-0.5" style={{ color: '#C2C7DC' }}>Suite {order.room?.number || 'Unknown'}</p>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-lg text-xs font-mono text-white"
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    {order.id.split('-')[0]}-{order.id.slice(-4)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                {/* Items */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: '#8E96BD' }}>
                    Order Items
                  </p>
                  <ul className="space-y-1">
                    {order.items.map((item, i) => (
                      <li key={item.id || i} className="flex items-center gap-2 text-sm" style={{ color: '#C2C7DC' }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#D4AF37' }} />
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status + time */}
                <div className="flex items-center justify-between text-sm">
                  <span
                    className="font-semibold"
                    style={{ color: order.progress === 100 ? '#10B981' : '#D4AF37' }}
                  >
                    {order.status}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: '#8E96BD' }}>
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo}
                  </span>
                </div>

                {/* Progress */}
                <ProgressBar progress={order.progress} />
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
