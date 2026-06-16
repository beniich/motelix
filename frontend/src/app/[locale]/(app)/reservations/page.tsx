'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Calendar as CalendarIcon, List as ListIcon } from 'lucide-react';
import { reservationsApi, roomsApi, type Reservation } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import CalendarView from './CalendarView';
import ReservationList from './ReservationList';
import ReservationModal from './ReservationModal';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export default function ReservationsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Pour le calendrier, on charge le mois en cours (simplifié pour le MVP)
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const from = format(startOfMonth(currentDate), 'yyyy-MM-dd');
  const to = format(endOfMonth(currentDate), 'yyyy-MM-dd');

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomsApi.list({ pageSize: 100 }).then(res => res.items),
  });

  const { data: calendarEvents = [], isLoading: isLoadingCalendar } = useQuery({
    queryKey: ['reservations', 'calendar', from, to],
    queryFn: () => reservationsApi.getCalendar(from, to),
    enabled: view === 'calendar',
  });

  const openNewReservation = () => {
    setSelectedReservation(null);
    setModalOpen(true);
  };

  const handleEdit = (res: Reservation) => {
    setSelectedReservation(res);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Réservations</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-lg transition-all ${
                view === 'calendar' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <CalendarIcon size={18} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${
                view === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <ListIcon size={18} />
            </button>
          </div>

          <button
            onClick={openNewReservation}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', color: '#0A0E27' }}
          >
            <Plus size={16} />
            Nouvelle réservation
          </button>
        </div>
      </div>

      <GlassCard className="p-6">
        {view === 'calendar' ? (
          <CalendarView 
            currentDate={currentDate} 
            onDateChange={setCurrentDate} 
            rooms={rooms} 
            events={calendarEvents} 
            isLoading={isLoadingRooms || isLoadingCalendar}
            onEventClick={handleEdit}
          />
        ) : (
          <ReservationList onEdit={handleEdit} />
        )}
      </GlassCard>

      {isModalOpen && (
        <ReservationModal
          reservation={selectedReservation}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
