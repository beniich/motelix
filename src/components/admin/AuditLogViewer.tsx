import { Shield, UserCog, Eye, AlertTriangle, X, Download } from 'lucide-react';
import { useAuditLog } from '../../lib/auditLog';
import type { AuditEvent } from '../../lib/auditLog';
import { format, parseISO } from 'date-fns';

const ACTION_META: Record<AuditEvent['action'], { label: string; color: string; bg: string; icon: React.ElementType }> = {
  ROLE_ELEVATED: { label: 'Role Elevated', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Shield },
  ROLE_DEMOTED: { label: 'Role Demoted', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: UserCog },
  RESTRICTED_ACCESS_ATTEMPTED: { label: 'Restricted Access', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', icon: AlertTriangle },
  CLEARANCE_GRANTED: { label: 'Clearance Granted', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: Eye },
};

export function AuditLogViewer() {
  const { events, clear } = useAuditLog();

  const exportCSV = () => {
    const csv = [
      'Timestamp,User,Action,Details',
      ...events.map((e) =>
        [
          e.timestamp,
          e.userName,
          e.action,
          `"${JSON.stringify(e.details).replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
            Security Audit Log
          </h2>
          <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
            {events.length} / 500 events recorded
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            disabled={events.length === 0}
            className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl disabled:opacity-50 flex items-center gap-1.5 cursor-pointer hover:border-indigo-500 transition-all"
          >
            <Download className="w-3 h-3" />
            Export CSV
          </button>
          <button
            onClick={() => {
              if (window.confirm('Clear all audit logs? This cannot be undone.')) clear();
            }}
            disabled={events.length === 0}
            className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl disabled:opacity-50 flex items-center gap-1.5 cursor-pointer hover:bg-rose-500/20 transition-all"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      {/* Events list */}
      {events.length === 0 ? (
        <div className="p-10 text-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Shield className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wide">
            No audit events recorded
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
            Role changes and restricted access attempts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => {
            const meta = ACTION_META[event.action];
            const Icon = meta.icon;
            return (
              <div
                key={event.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Icon */}
                <div className={`p-1.5 rounded-lg border ${meta.bg} shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {event.userName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono ml-auto">
                      {format(parseISO(event.timestamp), 'd MMM yyyy, HH:mm:ss')}
                    </span>
                  </div>
                  <pre className="text-[10px] text-slate-500 dark:text-slate-500 font-mono truncate">
                    {JSON.stringify(event.details)}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
