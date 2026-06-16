import { useTranslations } from 'next-intl';
import { Badge, type Variant } from './Badge';
import type { RoomStatus, TaskStatus, HousekeepingStatus, HousekeepingType } from '@/lib/api-client';

const roomVariant: Record<RoomStatus, Variant> = {
  AVAILABLE: 'success',
  OCCUPIED: 'info',
  CLEANING: 'warning',
  MAINTENANCE: 'danger',
};

const taskVariant: Record<TaskStatus, Variant> = {
  PENDING: 'default',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

const housekeepingVariant: Record<HousekeepingStatus, Variant> = {
  PENDING: 'default',
  IN_PROGRESS: 'info',
  COMPLETED: 'warning',
  INSPECTED: 'success',
  REJECTED: 'danger',
};

const housekeepingTypeVariant: Record<HousekeepingType, Variant> = {
  CHECKOUT_CLEAN: 'gold',
  STAYOVER: 'info',
  DEEP_CLEAN: 'success',
  INSPECTION: 'default',
  TURNDOWN: 'warning',
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const t = useTranslations('rooms.status');
  return <Badge variant={roomVariant[status]}>{t(status)}</Badge>;
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const t = useTranslations('tasks.status');
  return <Badge variant={taskVariant[status]}>{t(status)}</Badge>;
}

export function HousekeepingStatusBadge({ status }: { status: HousekeepingStatus }) {
  const t = useTranslations('housekeeping.status');
  return <Badge variant={housekeepingVariant[status]}>{t(status)}</Badge>;
}

export function HousekeepingTypeBadge({ type }: { type: HousekeepingType }) {
  const t = useTranslations('housekeeping.type');
  return <Badge variant={housekeepingTypeVariant[type]}>{t(type)}</Badge>;
}
