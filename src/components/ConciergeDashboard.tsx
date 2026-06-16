import React, { useState, useMemo } from 'react';
import { Send, Paperclip, CalendarDays, Plane, Star, Users, Loader2, AlertCircle, RefreshCw, Crown } from 'lucide-react';
import { useGuests, type Guest } from '@/hooks/useGuests';
import { useReservations } from '@/hooks/useReservations';
import type { Reservation } from '@/types';

// ─── Chat types (messages stored locally, no backend endpoint) ───────────────

interface ChatMessage {
  id: string;
  from: 'guest' | 'concierge';
  text: string;
  time: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(g: Guest) {
  return `${g.firstName[0] ?? ''}${g.lastName[0] ?? ''}`;
}

function reservationTaskType(res: Reservation): 'restaurant' | 'jet' | 'experience' {
  const notes = (res.notes ?? '').toLowerCase();
  if (notes.includes('jet') || notes.includes('avion') || notes.includes('charter')) return 'jet';
  if (notes.includes('spa') || notes.includes('tour') || notes.includes('expérience') || notes.includes('experience')) return 'experience';
  return 'restaurant';
}

function taskStatusColor(status: string) {
  if (status === 'CONFIRMED' || status === 'CHECKED_IN') return { text: '#15803d', bg: 'rgba(21,128,61,0.08)' };
  if (status === 'PENDING') return { text: '#b45309', bg: 'rgba(180,83,9,0.08)' };
  return { text: '#94a3b8', bg: 'rgba(148,163,184,0.08)' };
}

function taskStatusLabel(status: string) {
  const map: Record<string, string> = {
    CONFIRMED: 'Confirmé', CHECKED_IN: 'En cours', PENDING: 'En attente',
    CANCELLED: 'Annulé', CHECKED_OUT: 'Terminé',
  };
  return map[status] ?? status;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ListSkeleton() {
  return (
    <div className="flex-1 p-2 space-y-1 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-[60px] rounded-lg bg-gray-100" />
      ))}
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-white/60 border border-gray-100" />
      ))}
    </div>
  );
}

// ─── Guest avatar circle ──────────────────────────────────────────────────────

function Avatar({ guest, size = 'sm' }: { guest: Guest; size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
  return (
    <div
      className={`${dim} rounded-full shrink-0 flex items-center justify-center font-bold text-white`}
      style={{ background: 'linear-gradient(135deg,#c4a47c,#a07850)' }}
    >
      {initials(guest)}
    </div>
  );
}

// ─── Task card ────────────────────────────────────────────────────────────────

function TaskCard({ res, icon: Icon }: { res: Reservation; icon: React.ElementType }) {
  const status = taskStatusColor(res.status);
  const checkIn = new Date(res.checkIn);
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h4 className="font-medium text-gray-900 text-sm">
        {res.room ? `${res.room.type} ${res.room.number}` : 'N/A'} — {res.guest.firstName} {res.guest.lastName}
        {res.guest.vip && <Crown className="inline w-3 h-3 ml-1 text-yellow-500" />}
      </h4>
      <p className="text-sm text-gray-500 mt-0.5">
        {checkIn.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}, {res.adults} Pax.
      </p>
      {res.notes && <p className="text-xs text-gray-400 mt-1 italic truncate">{res.notes}</p>}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: status.text, backgroundColor: status.bg }}>
          {taskStatusLabel(res.status)}
        </span>
        <Icon className="w-4 h-4 text-gray-300" />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ConciergeDashboard() {
  const [activeGuestId, setActiveGuestId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [inputText, setInputText] = useState('');

  // Fetch VIP guests
  const { data: guestsData, isLoading: guestsLoading, isError: guestsError, refetch: refetchGuests } = useGuests({ vip: true, pageSize: 10 } as any);
  const guests: Guest[] = (guestsData as any)?.items ?? [];

  const activeId = activeGuestId ?? guests[0]?.id ?? null;
  const activeGuest = guests.find(g => g.id === activeId);

  // Fetch confirmed reservations (for task columns)
  const { data: resData, isLoading: resLoading } = useReservations({ status: 'CONFIRMED', pageSize: 20 });
  const reservations: Reservation[] = resData?.items ?? [];

  // Split into task columns
  const { restaurantTasks, jetTasks, experienceTasks } = useMemo(() => {
    const restaurant: Reservation[] = [];
    const jet: Reservation[] = [];
    const experience: Reservation[] = [];
    reservations.forEach(r => {
      const type = reservationTaskType(r);
      if (type === 'jet') jet.push(r);
      else if (type === 'experience') experience.push(r);
      else restaurant.push(r);
    });
    return { restaurantTasks: restaurant, jetTasks: jet, experienceTasks: experience };
  }, [reservations]);

  // Chat helpers
  const activeMessages = activeId ? (messages[activeId] ?? []) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeId) return;
    const msg: ChatMessage = {
      id: String(Date.now()),
      from: 'concierge',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), msg],
    }));
    setInputText('');
  };

  const columns = [
    { title: 'Réservations Restaurant', tasks: restaurantTasks, icon: CalendarDays },
    { title: 'Jets Privés', tasks: jetTasks, icon: Plane },
    { title: 'Expériences Exclusives', tasks: experienceTasks, icon: Star },
  ];

  return (
    <div
      className="w-full min-h-full flex flex-col p-8 gap-6 overflow-hidden"
      style={{
        backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuBG-vvGdzutve5cxSEnFTlS5osOmfsXlLKzJi8CUfiWurCJGOaWmRIzVLelubU3eSansDHOzFFVQJOleLNa6Dc3K9DbPRn1N066q4YZu9Iv4p11E4GVJciiGxnyI2zbixV_qR3VQAgGaW96XxrDEssaaMBanSWotMk9TOkH7fo-h4Zg2yzUpuylU4EaEqNurEFa_kK1AjSXb5qNyPdkD3muGNKXsSm5bAuceinyqAQWHNVMikFAjjl41-I_OCjOZSfwxt7Bqdu46aE)`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        fontFamily: "'Outfit', sans-serif",
        color: '#333',
      }}
    >
      <style>{`
        .glass-panel-concierge { background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .chat-bubble-guest { background: #f0efe9; border-radius: 0 1rem 1rem 1rem; }
        .chat-bubble-concierge { background: #e0d1b9; border-radius: 1rem 0 1rem 1rem; }
        .chat-list-scroll::-webkit-scrollbar { display: none; }
        .chat-list-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Page title */}
      <section>
        <h2 className="text-4xl text-gray-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Zafir Concierge Hub
        </h2>
        <p className="text-gray-600 text-lg">
          {guestsLoading ? 'Chargement...' : `${guests.length} client${guests.length !== 1 ? 's' : ''} VIP · ${reservations.length} réservations confirmées`}
        </p>
      </section>

      <div className="flex-1 flex gap-6 overflow-hidden" style={{ minHeight: '520px' }}>

        {/* ── VIP Chats ─────────────────────────────────────────────────────── */}
        <section className="w-full lg:w-5/12 glass-panel-concierge rounded-xl flex overflow-hidden shadow-lg">

          {/* Guest list */}
          <div className="w-2/5 border-r flex flex-col" style={{ borderColor: 'rgba(209,213,219,0.6)', backgroundColor: 'rgba(255,255,255,0.5)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(209,213,219,0.6)', backgroundColor: 'rgba(255,255,255,0.8)' }}>
              <h3 className="text-xl text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>VIP Guest Chats</h3>
              {guestsLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>

            {guestsError ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-red-400 p-4">
                <AlertCircle className="w-6 h-6" />
                <p className="text-xs text-center">Erreur chargement</p>
                <button onClick={() => refetchGuests()} className="text-xs flex items-center gap-1 border border-red-300 px-2 py-1 rounded-lg">
                  <RefreshCw className="w-3 h-3" /> Réessayer
                </button>
              </div>
            ) : guestsLoading ? (
              <ListSkeleton />
            ) : guests.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400 p-4 text-center">
                <div>
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  Aucun guest VIP
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto chat-list-scroll">
                {guests.map((guest) => {
                  const lastMsg = messages[guest.id]?.slice(-1)[0];
                  return (
                    <div
                      key={guest.id}
                      onClick={() => setActiveGuestId(guest.id)}
                      className="flex items-center gap-3 p-4 cursor-pointer transition-colors"
                      style={{
                        borderLeft: activeId === guest.id ? '4px solid #c4a47c' : '4px solid transparent',
                        backgroundColor: activeId === guest.id ? 'rgba(196,164,124,0.1)' : 'transparent',
                      }}
                    >
                      <Avatar guest={guest} />
                      <div className="overflow-hidden">
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {guest.firstName} {guest.lastName}
                          {guest.vip && <Crown className="inline w-3 h-3 ml-1 text-yellow-500" />}
                        </h4>
                        <p className="text-xs text-gray-400 truncate">
                          {lastMsg ? lastMsg.text : (guest.nationality ?? 'Concierge VIP')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat window */}
          <div className="w-3/5 flex flex-col bg-white">
            {activeGuest ? (
              <>
                {/* Header */}
                <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#f3f4f6', backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <Avatar guest={activeGuest} />
                  <div>
                    <h3 className="font-medium text-gray-900">{activeGuest.firstName} {activeGuest.lastName}</h3>
                    <p className="text-xs text-gray-400">{activeGuest.totalStays} séjour{activeGuest.totalStays !== 1 ? 's' : ''} · {activeGuest.nationality ?? '—'}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto chat-list-scroll p-4 space-y-4">
                  {activeMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                      <Send className="w-8 h-8 opacity-30" />
                      <p className="text-sm">Démarrer la conversation</p>
                    </div>
                  ) : (
                    activeMessages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.from === 'concierge' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-3 text-sm text-gray-800 ${msg.from === 'guest' ? 'chat-bubble-guest' : 'chat-bubble-concierge'}`}>
                          {msg.text}
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 border-t flex items-center gap-2" style={{ borderColor: '#f3f4f6' }}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Message au guest..."
                    className="flex-1 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-1 border"
                    style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb', color: '#374151' }}
                  />
                  <button type="submit" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c4a47c' }}>
                    <Send className="w-4 h-4 text-white" />
                  </button>
                  <button type="button" className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
                    <Paperclip className="w-4 h-4 text-gray-500" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2">
                <Users className="w-10 h-10 opacity-30" />
                <p className="text-sm">Sélectionnez un guest</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Concierge Tasks ───────────────────────────────────────────────── */}
        <section className="flex-1 glass-panel-concierge rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'rgba(209,213,219,0.4)' }}>
            <h2 className="text-2xl text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Concierge Tasks: Pôle Opérations
            </h2>
            {resLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          </div>

          <div className="flex-1 p-6 overflow-auto chat-list-scroll">
            {resLoading ? (
              <div className="grid grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <TaskSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map(({ title, tasks, icon: Icon }) => (
                  <div key={title}>
                    <h3 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-400" /> {title}
                      <span className="ml-auto text-xs font-normal text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{tasks.length}</span>
                    </h3>
                    <div className="space-y-3">
                      {tasks.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-4 italic">Aucune tâche</p>
                      ) : (
                        tasks.map(r => <TaskCard key={r.id} res={r} icon={Icon} />)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
