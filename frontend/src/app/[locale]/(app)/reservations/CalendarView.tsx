'use client';

import { useMemo } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Room, Reservation } from '@/lib/api-client';

type CalendarViewProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  rooms: Room[];
  events: Reservation[];
  isLoading: boolean;
  onEventClick: (res: Reservation) => void;
};

export default function CalendarView({ currentDate, onDateChange, rooms, events, isLoading, onEventClick }: CalendarViewProps) {
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
  }, [currentDate]);

  const prevMonth = () => onDateChange(subMonths(currentDate, 1));
  const nextMonth = () => onDateChange(addMonths(currentDate, 1));

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent border-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  // Sort rooms by floor then number
  const sortedRooms = [...rooms].sort((a, b) => {
    if (a.floor === b.floor) return a.number.localeCompare(b.number);
    return a.floor - b.floor;
  });

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Grid container with independent scrolling */}
      <div className="flex-1 overflow-auto border border-white/10 rounded-xl bg-slate-900/50 scrollbar-thin">
        <div className="min-w-max">
          {/* Header row (Days) */}
          <div className="flex border-b border-white/10 sticky top-0 bg-slate-900 z-20">
            {/* Corner block */}
            <div className="w-32 shrink-0 border-r border-white/10 p-3 bg-slate-900 sticky left-0 z-30">
              <span className="text-xs font-semibold text-slate-400 uppercase">Chambres</span>
            </div>
            {/* Days block */}
            <div className="flex flex-1">
              {days.map(day => {
                const isToday = isSameDay(day, new Date());
                return (
                  <div key={day.toISOString()} className={`w-12 shrink-0 border-r border-white/10 flex flex-col items-center justify-center py-2 ${isToday ? 'bg-[#D4AF37]/10' : ''}`}>
                    <span className={`text-[10px] uppercase ${isToday ? 'text-[#D4AF37]' : 'text-slate-500'}`}>
                      {format(day, 'E', { locale: fr })}
                    </span>
                    <span className={`text-sm font-semibold ${isToday ? 'text-[#D4AF37]' : 'text-slate-300'}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rooms rows */}
          <div className="flex flex-col relative pb-4">
            {sortedRooms.map(room => (
              <div key={room.id} className="flex border-b border-white/5 group hover:bg-white/[0.02]">
                {/* Room column */}
                <div className="w-32 shrink-0 border-r border-white/10 p-3 bg-slate-900 group-hover:bg-slate-800/80 sticky left-0 z-10 flex flex-col justify-center">
                  <span className="text-sm font-bold text-white">{room.number}</span>
                  <span className="text-xs text-slate-500">{room.type}</span>
                </div>
                
                {/* Days cells (background) */}
                <div className="flex flex-1 relative">
                  {days.map(day => (
                    <div key={day.toISOString()} className={`w-12 shrink-0 border-r border-white/5 ${isSameDay(day, new Date()) ? 'bg-[#D4AF37]/5' : ''}`} />
                  ))}
                  
                  {/* Events layer for this room */}
                  {events.filter(e => e.roomId === room.id).map(event => {
                    const checkInDate = new Date(event.checkIn);
                    const checkOutDate = new Date(event.checkOut);
                    const startIdx = days.findIndex(d => isSameDay(d, checkInDate) || d > checkInDate);
                    
                    // Si l'événement commence après la fin du mois, on l'ignore (déjà filtré par l'API logiquement)
                    if (startIdx === -1 && checkInDate > days[days.length - 1]) return null;
                    
                    const actualStartIdx = startIdx === -1 ? 0 : startIdx;
                    // Décaler le début s'il commence avant le mois
                    const renderStartIdx = checkInDate < days[0] ? 0 : actualStartIdx;
                    
                    const endIdx = days.findIndex(d => isSameDay(d, checkOutDate));
                    const renderEndIdx = endIdx === -1 ? days.length : endIdx;

                    const width = (renderEndIdx - renderStartIdx) * 48; // 48px = w-12
                    const left = renderStartIdx * 48;

                    // Déterminer la couleur selon le statut
                    let bgClass = 'bg-slate-700 border-slate-500 text-slate-200';
                    if (event.status === 'CONFIRMED') bgClass = 'bg-blue-900/60 border-blue-500/50 text-blue-200';
                    if (event.status === 'CHECKED_IN') bgClass = 'bg-emerald-900/60 border-emerald-500/50 text-emerald-200';
                    if (event.status === 'PENDING') bgClass = 'bg-amber-900/60 border-amber-500/50 text-amber-200';

                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`absolute top-1 bottom-1 rounded-md border text-xs px-2 py-1 overflow-hidden cursor-pointer shadow-sm hover:z-10 transition-transform hover:scale-[1.02] ${bgClass}`}
                        style={{ left: `${left}px`, width: `${width}px` }}
                        title={`${event.guest?.firstName} ${event.guest?.lastName} (${event.status})`}
                      >
                        <div className="font-medium whitespace-nowrap truncate">
                          {event.guest?.lastName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
