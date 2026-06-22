'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { Clock, CheckCircle2, PlayCircle, AlertCircle, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import { type HousekeepingTask, type HousekeepingType } from '@/lib/api-client';
import { HousekeepingStatusBadge } from './HousekeepingStatusBadge';

const TYPE_CONFIG: Record<HousekeepingType, { label: string; icon: React.ElementType; color: string }> = {
  CHECKOUT_CLEAN: { label: 'Départ (À blanc)', icon: Sparkles,    color: 'text-blue-600 bg-blue-100' },
  STAYOVER:       { label: 'Recouche',         icon: Sparkles,    color: 'text-emerald-600 bg-emerald-100' },
  DEEP_CLEAN:     { label: 'Grand ménage',     icon: Sparkles,    color: 'text-purple-600 bg-purple-100' },
  INSPECTION:     { label: 'Inspection',       icon: CheckCircle2,color: 'text-amber-600 bg-amber-100' },
  TURNDOWN:       { label: 'Couverture',       icon: PlayCircle,  color: 'text-indigo-600 bg-indigo-100' },
};

export function HousekeepingTaskCard({ task }: { task: HousekeepingTask }) {
  const typeCfg = TYPE_CONFIG[task.type] || TYPE_CONFIG.STAYOVER;
  const TypeIcon = typeCfg.icon;

  const isOverdue = task.dueAt && new Date(task.dueAt) < new Date() && !['COMPLETED', 'INSPECTED'].includes(task.status);

  return (
    <Link
      href={`/housekeeping/${task.id}`}
      className="block bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Room Number Circle */}
          <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {task.room.number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${typeCfg.color}`}>
                <TypeIcon className="w-3 h-3" />
                {typeCfg.label}
              </span>
              {task.priority > 1 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase">
                  Prio {task.priority}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {task.room.type} • Étage {task.room.floor}
            </p>
          </div>
        </div>
        
        <HousekeepingStatusBadge status={task.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 p-2 rounded-xl">
          <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-500' : ''}`} />
          <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
            {task.dueAt ? format(new Date(task.dueAt), 'HH:mm') : 'Flexible'}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 p-2 rounded-xl">
          <User className="w-3.5 h-3.5" />
          <span className="truncate">
            {task.assignee ? task.assignee.firstName : 'Non assigné'}
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-gray-400">
          {task.issueReported && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          {task.photos?.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <ImageIcon className="w-3.5 h-3.5" />
              {task.photos.length}
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-blue-600">Voir détail →</span>
      </div>
    </Link>
  );
}
