import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { 
  Plane, Clock, CheckCircle2, X, User, Crown, MapPin, 
  Mail, Loader2, AlertCircle 
} from 'lucide-react';
import { GlassCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  useTodayArrivals, 
  useCheckIn, 
  useCheckOut, 
  useCancelReservation 
} from '@/hooks/useArrivals';
import type { Reservation } from '@/types';

export function ArrivalsDashboard() {
  const { currentUser } = useAuth();
  const { data: arrivals, isLoading, error, refetch } = useTodayArrivals();
  const checkInMut = useCheckIn();
  const checkOutMut = useCheckOut();
  const cancelMut = useCancelReservation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const clearanceLabel = currentUser?.clearance === 'LEVEL-5-PROPRIETOR' 
    ? 'LEVEL-5-PROPRIETOR' 
    : 'LEVEL-4-ARRIVAL';
  
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8">
        <GlassCard className="border-red-500/30">
          <div className="flex items-center gap-3 text-red-300">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Erreur de chargement</p>
              <p className="text-sm text-red-400 mt-1">
                Impossible de récupérer les arrivées. Vérifiez votre connexion.
              </p>
            </div>
            <Button onClick={() => refetch()} variant="secondary" size="sm" className="ml-auto">
              Réessayer
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }
  
  const reservations = arrivals ?? [];
  const selected = reservations.find((r) => r.id === selectedId);
  const stats = {
    total: reservations.length,
    vip: reservations.filter((r) => r.guest.vip).length,
    checkedIn: reservations.filter((r) => r.status === 'CHECKED_IN').length,
    pending: reservations.filter((r) => r.status === 'CONFIRMED').length,
  };
  
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">VIP Arrivals Corridor</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: frLocale })} • {reservations.length} arrivées
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Clearance Level
          </span>
          <span className={`font-mono text-sm font-bold ${
            currentUser?.clearance === 'LEVEL-5-PROPRIETOR' 
              ? 'text-amber-500 dark:text-amber-400 text-glow-gold' 
              : 'text-blue-500 dark:text-blue-400'
          }`}>
            {clearanceLabel}
          </span>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total" value={stats.total} icon={Plane} color="cyan" />
        <StatCard label="VIP" value={stats.vip} icon={Crown} color="amber" />
        <StatCard label="Checked-in" value={stats.checkedIn} icon={CheckCircle2} color="emerald" />
        <StatCard label="En attente" value={stats.pending} icon={Clock} color="purple" />
      </div>
      
      {/* Layout: list + detail */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {reservations.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Plane className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">Aucune arrivée aujourd'hui</p>
            </GlassCard>
          ) : (
            reservations.map((res) => (
              <ArrivalCard
                key={res.id}
                reservation={res}
                selected={selectedId === res.id}
                onClick={() => setSelectedId(res.id)}
                onCheckIn={() => checkInMut.mutate(res.id)}
                onCheckOut={() => checkOutMut.mutate(res.id)}
                isLoading={checkInMut.isPending || checkOutMut.isPending}
              />
            ))
          )}
        </div>
        
        {/* Detail panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <ReservationDetail reservation={selected} onCancel={(reason) => cancelMut.mutate({ id: selected.id, reason })} />
          ) : (
            <GlassCard className="text-center py-12 sticky top-8">
              <User className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Sélectionnez une arrivée pour voir les détails</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function StatCard({ label, value, icon: Icon, color }: any) {
  const colors = {
    cyan: 'text-cyan-500 dark:text-cyan-400 bg-cyan-500/10',
    amber: 'text-amber-500 dark:text-amber-400 bg-amber-500/10',
    emerald: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10',
    purple: 'text-purple-500 dark:text-purple-400 bg-purple-500/10',
  };
  return (
    <GlassCard className="!p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function ArrivalCard({ 
  reservation: r, 
  selected, 
  onClick, 
  onCheckIn, 
  onCheckOut, 
  isLoading 
}: {
  reservation: Reservation;
  selected: boolean;
  onClick: () => void;
  onCheckIn: () => void;
  onCheckOut: () => void;
  isLoading: boolean;
}) {
  const isCheckedIn = r.status === 'CHECKED_IN';
  const isPending = r.status === 'CONFIRMED';
  
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected 
          ? 'bg-cyan-500/5 border-[#00D4FF] glow-blue-subtle' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-black hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#00D4FF]/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
            r.guest.vip 
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black' 
              : 'bg-gradient-to-br from-cyan-500 to-purple-500 text-white'
          }`}>
            {r.guest.firstName[0]}{r.guest.lastName[0]}
          </div>
          {r.guest.vip && (
            <Crown className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {r.guest.lastName} {r.guest.firstName}
            </h3>
            {r.guest.vip && <Badge variant="gold">VIP</Badge>}
            <StatusBadge status={r.status} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {r.room ? `Room ${r.room.number} • ${r.room.type}` : r.roomType}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {format(parseISO(r.checkIn), 'HH:mm')} → {format(parseISO(r.checkOut), 'HH:mm')}
            {' • '}
            {r.adults} adulte{r.adults > 1 ? 's' : ''}
            {r.children > 0 && `, ${r.children} enfant${r.children > 1 ? 's' : ''}`}
          </p>
        </div>
        
        {/* Quick action */}
        {isPending && (
          <Button
            variant="gold"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onCheckIn(); }}
            disabled={isLoading}
          >
            Check-in
          </Button>
        )}
        {isCheckedIn && (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onCheckOut(); }}
            disabled={isLoading}
          >
            Check-out
          </Button>
        )}
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: Reservation['status'] }) {
  const map = {
    INQUIRY: { label: 'Demande', variant: 'info' as const },
    CONFIRMED: { label: 'Confirmé', variant: 'info' as const },
    CHECKED_IN: { label: 'Sur place', variant: 'gold' as const },
    CHECKED_OUT: { label: 'Parti', variant: 'default' as const },
    CANCELLED: { label: 'Annulé', variant: 'danger' as const },
    NO_SHOW: { label: 'No-show', variant: 'warning' as const },
  };
  const config = map[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function ReservationDetail({ 
  reservation: r, 
  onCancel 
}: { 
  reservation: Reservation; 
  onCancel: (reason?: string) => void;
}) {
  return (
    <GlassCard className="sticky top-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Référence</p>
          <p className="font-mono text-sm text-cyan-600 dark:text-cyan-400">{r.reference}</p>
        </div>
        {r.guest.vip && <Crown className="w-5 h-5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />}
      </div>
      
      {/* Guest info */}
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-lg font-display font-semibold text-slate-900 dark:text-white">
            {r.guest.firstName} {r.guest.lastName}
          </p>
          {r.guest.nationality && (
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {r.guest.nationality}
            </p>
          )}
        </div>
        
        <div className="space-y-1 text-xs">
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <a href={`mailto:${r.guest.email}`} className="hover:text-cyan-600 dark:hover:text-cyan-400 truncate">
              {r.guest.email}
            </a>
          </p>
        </div>
      </div>
      
      {/* Stay details */}
      <div className="border-t border-slate-200 dark:border-black pt-3 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Chambre</span>
          <span className="text-slate-900 dark:text-white font-mono">
            {r.room ? `${r.room.number} (${r.room.type})` : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Arrivée</span>
          <span className="text-slate-900 dark:text-white">{format(parseISO(r.checkIn), 'd MMM HH:mm', { locale: frLocale })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Départ</span>
          <span className="text-slate-900 dark:text-white">{format(parseISO(r.checkOut), 'd MMM HH:mm', { locale: frLocale })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Nuits</span>
          <span className="text-slate-900 dark:text-white">{r.adults} ad. {r.children > 0 && `+ ${r.children} enf.`}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-black">
          <span className="text-slate-500 dark:text-slate-400">Total</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">
            {r.totalPrice.toLocaleString('fr-FR')} {r.currency}
          </span>
        </div>
      </div>
      
      {r.notes && (
        <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-black">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Notes</p>
          <p className="text-xs text-slate-700 dark:text-slate-300">{r.notes}</p>
        </div>
      )}
      
      {/* Actions */}
      {(r.status === 'CONFIRMED' || r.status === 'INQUIRY') && (
        <Button
          variant="danger"
          size="sm"
          className="w-full mt-4"
          onClick={() => {
            if (confirm('Annuler cette réservation ?')) onCancel('Operator cancellation');
          }}
        >
          <X className="w-3 h-3" /> Annuler la réservation
        </Button>
      )}
    </GlassCard>
  );
}
