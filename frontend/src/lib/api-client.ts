import { api } from './api';

export type HotelMetrics = {
  from: string; to: string; days: number;
  totalRooms: number; availableRoomNights: number; occupiedRoomNights: number;
  occupancyRate: number; totalRevenue: number; averageDailyRate: number;
  revenuePerAvailableRoom: number;
  occupancyRateChange: number; adrChange: number; revparChange: number;
  daily: Array<{ date: string; occupancyRate: number; adr: number; revpar: number; revenue: number }>;
  byRoomType: Array<{ type: string; revpar: number; adr: number; occupancyRate: number; revenue: number }>;
  bySource: Array<{ source: string; revenue: number; percentage: number; count: number }>;
};

export const analyticsApi = {
  getMetrics: (params: { from?: string; to?: string; preset?: '7d' | '30d' | '90d' | 'ytd' | '12m' }) =>
    api.get<HotelMetrics>('/api/analytics-v2/metrics', { params }).then((r) => r.data),
  
  getForecast: (days = 30) =>
    api.get<any>('/api/analytics-v2/forecast', { params: { days } }).then((r) => r.data),
  
  getPricing: (days = 30) =>
    api.get<any>('/api/analytics-v2/pricing', { params: { days } }).then((r) => r.data),
};

export const segmentationApi = {
  getSegments: () => api.get<any>('/api/segmentation').then((r) => r.data),
};

// Types partagés
export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  hotelId: string;
  isActive: boolean;
  createdAt: string;
  hotel?: { id: string; name: string };
};

export type Room = {
  id: string;
  number: string;
  floor: number;
  type: string;
  price: number;
  status: RoomStatus;
  hotelId: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: number;
  dueAt: string | null;
  hotelId: string;
  assigneeId: string | null;
  assignee?: { id: string; firstName: string; lastName: string } | null;
};

export type Paginated<T> = {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// ---------- Rooms ----------
export const roomsApi = {
  list: (params?: { page?: number; pageSize?: number; status?: RoomStatus; type?: string }) =>
    api.get<Paginated<Room>>('/api/rooms', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<{ room: Room }>(`/api/rooms/${id}`).then((r) => r.data.room),

  create: (data: { number: string; floor: number; type: string; price: number; status?: RoomStatus }) =>
    api.post<{ room: Room }>('/api/rooms', data).then((r) => r.data.room),

  update: (id: string, data: Partial<{ number: string; floor: number; type: string; price: number; status: RoomStatus }>) =>
    api.patch<{ room: Room }>(`/api/rooms/${id}`, data).then((r) => r.data.room),

  remove: (id: string) => api.delete(`/api/rooms/${id}`),
};

// ---------- Tasks ----------
export const tasksApi = {
  list: (params?: { page?: number; pageSize?: number; status?: TaskStatus; assigneeId?: string }) =>
    api.get<Paginated<Task>>('/api/tasks', { params }).then((r) => r.data),

  create: (data: { title: string; description?: string; priority?: number; dueAt?: string; assigneeId?: string; status?: TaskStatus }) =>
    api.post<{ task: Task }>('/api/tasks', data).then((r) => r.data.task),

  update: (id: string, data: Partial<{ title: string; description: string | null; status: TaskStatus; priority: number; dueAt: string | null; assigneeId: string | null }>) =>
    api.patch<{ task: Task }>(`/api/tasks/${id}`, data).then((r) => r.data.task),

  deleteTask: (id: string) => api.delete(`/api/hotel/tasks/${id}`),
};

// ─────────────────────────────────────────
// Facturation & Stripe
// ─────────────────────────────────────────

export type Invoice = {
  id: string;
  reference: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  paidCents: number;
  currency: string;
  taxRate: number;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  language: 'fr' | 'en';
  notes?: string;
  guest: Pick<Guest, 'id' | 'firstName' | 'lastName' | 'email'>;
  reservation: {
    id: string;
    reference: string;
    checkIn: string;
    checkOut: string;
    totalNights: number;
    room?: { number: string } | null;
    roomType: string;
  };
  _count?: { lineItems: number; payments: number };
  lineItems?: InvoiceLineItem[];
  payments?: Payment[];
};

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  taxRate: number;
  totalCents: number;
  category?: string;
};

export type Payment = {
  id: string;
  amountCents: number;
  currency: string;
  method: 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'OTHER';
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
  reference?: string;
  paidAt: string | null;
  recordedBy?: { firstName: string; lastName: string };
};

export function formatMoney(cents: number, currency = 'EUR', locale = 'fr'): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export const invoicesApi = {
  list: (params?: { page?: number; pageSize?: number; status?: Invoice['status']; guestId?: string }) =>
    api.get<Paginated<Invoice>>('/api/invoices', { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<{ invoice: Invoice }>(`/api/invoices/${id}`).then((r) => r.data.invoice),
  create: (data: any) =>
    api.post<{ invoice: Invoice }>('/api/invoices', data).then((r) => r.data.invoice),
  issue: (id: string) =>
    api.post<{ invoice: Invoice }>(`/api/invoices/${id}/issue`).then((r) => r.data.invoice),
  createCheckout: (id: string) =>
    api.post<{ sessionId: string; url: string }>(`/api/invoices/${id}/checkout`).then((r) => r.data),
  recordPayment: (id: string, data: { amountCents: number; method: string; reference?: string; notes?: string }) =>
    api.post<{ invoice: Invoice; payment: Payment }>(`/api/invoices/${id}/payments`, data).then((r) => r.data),
  pdfUrl: (id: string) => `${api.defaults.baseURL}/api/invoices/${id}/pdf`,
};

// ---------- Users (admin) ----------
export const usersApi = {
  list: (params?: { page?: number; pageSize?: number }) =>
    api.get<Paginated<User>>('/api/users', { params }).then((r) => r.data),

  create: (data: { email: string; password: string; firstName: string; lastName: string; role: Role }) =>
    api.post<{ user: User }>('/api/users', data).then((r) => r.data.user),

  update: (id: string, data: Partial<{ firstName: string; lastName: string; role: Role; isActive: boolean }>) =>
    api.patch<{ user: User }>(`/api/users/${id}`, data).then((r) => r.data.user),

  deactivate: (id: string) =>
    api.post<{ user: User }>(`/api/users/${id}/deactivate`).then((r) => r.data.user),
};

// ---------- Guests ----------
export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  nationality: string | null;
  documentType: string | null;
  documentNumber: string | null;
  preferences: string | null;
  vip: boolean;
  hotelId: string;
  createdAt: string;
  _count?: { reservations: number };
};

export const guestsApi = {
  list: (params?: { page?: number; pageSize?: number; search?: string; vip?: boolean }) =>
    api.get<Paginated<Guest>>('/api/guests', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<Guest & { reservations: any[] }>(`/api/guests/${id}`).then((r) => r.data),

  create: (data: Omit<Partial<Guest>, 'id' | 'hotelId' | 'createdAt'>) =>
    api.post<Guest>('/api/guests', data).then((r) => r.data),

  update: (id: string, data: Partial<Guest>) =>
    api.patch<Guest>(`/api/guests/${id}`, data).then((r) => r.data),

  remove: (id: string) => api.delete(`/api/guests/${id}`),
};

// ---------- Reservations ----------
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED';

export type Reservation = {
  id: string;
  reference: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestId: string;
  roomId: string;
  hotelId: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  pricePerNight: number;
  totalPrice: number;
  discount: number;
  extras: number;
  source: string | null;
  notes: string | null;
  createdAt: string;
  guest?: Pick<Guest, 'id' | 'firstName' | 'lastName' | 'email' | 'vip'>;
  room?: Pick<Room, 'id' | 'number' | 'floor' | 'type'>;
};

export const reservationsApi = {
  list: (params?: { page?: number; pageSize?: number; status?: ReservationStatus; roomId?: string; guestId?: string; from?: string; to?: string }) =>
    api.get<Paginated<Reservation>>('/api/reservations', { params }).then((r) => r.data),

  getCalendar: (from: string, to: string) =>
    api.get<Reservation[]>('/api/reservations/calendar', { params: { from, to } }).then((r) => r.data),

  get: (id: string) =>
    api.get<Reservation>(`/api/reservations/${id}`).then((r) => r.data),

  create: (data: { guestId: string; roomId: string; checkIn: string; checkOut: string; source?: string; discount?: number; extras?: number; notes?: string }) =>
    api.post<Reservation>('/api/reservations', data).then((r) => r.data),

  update: (id: string, data: Partial<{ notes: string; source: string; discount: number; extras: number }>) =>
    api.patch<Reservation>(`/api/reservations/${id}`, data).then((r) => r.data),

  confirm: (id: string) => api.post<Reservation>(`/api/reservations/${id}/confirm`).then((r) => r.data),
  checkIn: (id: string) => api.post<Reservation>(`/api/reservations/${id}/check-in`).then((r) => r.data),
  checkOut: (id: string) => api.post<Reservation>(`/api/reservations/${id}/check-out`).then((r) => r.data),
  cancel: (id: string, reason?: string) => api.post<Reservation>(`/api/reservations/${id}/cancel`, { reason }).then((r) => r.data),
  
  getStats: () => api.get<{ totalActive: number; checkInsToday: number; checkOutsToday: number; pendingConfirmation: number; totalRevenue: number; occupancyRate: number }>('/api/reservations/stats').then((r) => r.data),
};

// ---------- Housekeeping ----------
export type HousekeepingStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'INSPECTED' | 'REJECTED';
export type HousekeepingType = 'CHECKOUT_CLEAN' | 'STAYOVER' | 'DEEP_CLEAN' | 'INSPECTION' | 'TURNDOWN';

export type HousekeepingPhoto = {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  sizeBytes: number;
  caption: string | null;
  takenAt: string;
  uploadedById: string | null;
};

export type HousekeepingTask = {
  id: string;
  reservationId: string | null;
  roomId: string;
  room: { id: string; number: string; type: string; floor: number };
  type: HousekeepingType;
  status: HousekeepingStatus;
  assigneeId: string | null;
  assignee: { id: string; firstName: string; lastName: string } | null;
  priority: number;
  dueAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  inspectedAt: string | null;
  inspectedById: string | null;
  inspectedBy: { id: string; firstName: string; lastName: string } | null;
  photos: HousekeepingPhoto[];
  checklist: string | null; // JSON String
  staffNotes: string | null;
  inspectorNotes: string | null;
  issueReported: boolean;
  issueDescription: string | null;
  hotelId: string;
  createdAt: string;
  updatedAt: string;
  reservation?: { id: string; reference: string; guest?: { firstName: string; lastName: string } } | null;
};

export const housekeepingApi = {
  list: (params?: { page?: number; pageSize?: number; status?: HousekeepingStatus; type?: HousekeepingType; assigneeId?: string; roomId?: string; overdue?: boolean }) =>
    api.get<Paginated<HousekeepingTask>>('/api/housekeeping', { params }).then((r) => r.data),
  
  get: (id: string) =>
    api.get<{ task: HousekeepingTask }>(`/api/housekeeping/${id}`).then((r) => r.data.task),
  
  start: (id: string) =>
    api.post<{ task: HousekeepingTask }>(`/api/housekeeping/${id}/start`).then((r) => r.data.task),
  
  complete: (id: string, data: { checklist?: Record<string, boolean>; notes?: string; issueReported?: boolean; issueDescription?: string }) =>
    api.post<{ task: HousekeepingTask }>(`/api/housekeeping/${id}/complete`, data).then((r) => r.data.task),
  
  inspect: (id: string, data: { approved: boolean; notes?: string }) =>
    api.post<{ task: HousekeepingTask }>(`/api/housekeeping/${id}/inspect`, data).then((r) => r.data.task),
  
  createStayover: (data: { roomId: string; dueInHours?: number; assigneeId?: string; notes?: string }) =>
    api.post<{ task: HousekeepingTask }>('/api/housekeeping/stayover', data).then((r) => r.data.task),
  
  uploadPhoto: (id: string, file: File, caption?: string) => {
    const formData = new FormData();
    formData.append('photo', file);
    if (caption) formData.append('caption', caption);
    return api.post<{ photo: HousekeepingPhoto }>(`/api/housekeeping/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.photo);
  },

  getMyStats: () =>
    api.get<{ pending: number; inProgress: number; completedToday: number; overdue: number }>('/api/housekeeping/my-stats').then((r) => r.data),
};

// ─────────────────────────────────────────
// Channel Manager (OTA)
// ─────────────────────────────────────────

export type ChannelType = 'BOOKING_COM' | 'EXPEDIA' | 'AIRBNB' | 'AGODA' | 'HOTELS_COM';
export type ChannelStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ERROR' | 'DISCONNECTED';

export type Channel = {
  id: string;
  hotelId: string;
  type: ChannelType;
  status: ChannelStatus;
  externalHotelId: string | null;
  autoPushAvailability: boolean;
  autoPushRates: boolean;
  autoPullReservations: boolean;
  lastPushAt: string | null;
  lastPullAt: string | null;
  lastErrorAt: string | null;
  lastErrorMessage: string | null;
  config: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type ChannelSyncLog = {
  id: string;
  channelId: string;
  hotelId: string;
  direction: 'PUSH' | 'PULL';
  operation: string;
  status: 'IN_PROGRESS' | 'SUCCESS' | 'PARTIAL' | 'FAILED';
  itemsCount: number | null;
  successCount: number | null;
  failedCount: number | null;
  errorMessage: string | null;
  duration: number | null;
  startedAt: string;
  completedAt: string | null;
  fromDate: string | null;
  toDate: string | null;
  channel?: { type: ChannelType; externalHotelId: string | null };
};

export type ChannelCapabilities = {
  pushAvailability: boolean;
  pushRates: boolean;
  pullReservations: boolean;
  receiveWebhooks: boolean;
};

export type ChannelTypeInfo = {
  type: ChannelType;
  capabilities: ChannelCapabilities;
  isMock: boolean;
};

export type SyncResult = Array<{
  channelId: string;
  success?: number;
  failed?: number;
  pulled?: number;
  imported?: number;
  error?: string;
  errors?: string[];
}>;

export const channelsApi = {
  list: () =>
    api.get<{ channels: Channel[] }>('/api/channels').then((r) => r.data.channels),

  get: (id: string) =>
    api.get<{ channel: Channel }>(`/api/channels/${id}`).then((r) => r.data.channel),

  getTypes: () =>
    api.get<{ types: ChannelTypeInfo[] }>('/api/channels/types').then((r) => r.data.types),

  getLogs: (params?: { page?: number; pageSize?: number }) =>
    api.get<Paginated<ChannelSyncLog>>('/api/channels/logs', { params }).then((r) => r.data),

  create: (data: {
    type: ChannelType;
    credentials: Record<string, string>;
    autoPushAvailability?: boolean;
    autoPushRates?: boolean;
    autoPullReservations?: boolean;
    markup?: number;
  }) => api.post<{ channel: Channel }>('/api/channels', data).then((r) => r.data.channel),

  pause: (id: string) =>
    api.post<{ channel: Channel }>(`/api/channels/${id}/pause`).then((r) => r.data.channel),

  resume: (id: string) =>
    api.post<{ channel: Channel }>(`/api/channels/${id}/resume`).then((r) => r.data.channel),

  remove: (id: string) =>
    api.delete(`/api/channels/${id}`),

  pushNow: () =>
    api.post<{ results: SyncResult }>('/api/channels/sync/push').then((r) => r.data),

  pullNow: () =>
    api.post<{ results: SyncResult }>('/api/channels/sync/pull').then((r) => r.data),

  fullSync: () =>
    api.post<{ push: SyncResult; pull: SyncResult }>('/api/channels/sync/full').then((r) => r.data),
};
