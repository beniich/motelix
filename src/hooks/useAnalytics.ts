import { useQuery } from '@tanstack/react-query';
import api from '@/lib/apiClient';

export type MetricsPreset = '7d' | '30d' | '90d' | 'ytd' | '12m';

export type HotelMetrics = {
  from: string;
  to: string;
  days: number;
  totalRooms: number;
  availableRoomNights: number;
  occupiedRoomNights: number;
  occupancyRate: number;
  totalRevenue: number;
  averageDailyRate: number;
  revenuePerAvailableRoom: number;
  occupancyRateChange: number;
  adrChange: number;
  revparChange: number;
  daily: Array<{ date: string; occupancyRate: number; adr: number; revpar: number; revenue: number }>;
  byRoomType: Array<{ type: string; revpar: number; adr: number; occupancyRate: number; revenue: number }>;
  bySource: Array<{ source: string; revenue: number; percentage: number; count: number }>;
};

export type ForecastData = {
  historicalAverage: { occupancy: number; adr: number };
  forecast: Array<{ date: string; occupancyRate: number; adr: number; revpar: number; confidence: number }>;
  methodology: string;
};

export type PricingRecommendation = {
  date: string;
  roomType: string;
  basePrice: number;
  recommendedPrice: number;
  expectedOccupancy: number;
  priceChange: number;
  reason: string;
};

export const PRESETS: Array<{ value: MetricsPreset; label: string }> = [
  { value: '7d', label: '7 jours' },
  { value: '30d', label: '30 jours' },
  { value: '90d', label: '90 jours' },
  { value: 'ytd', label: 'Année en cours' },
  { value: '12m', label: '12 mois' },
];

export function useMetrics(preset: MetricsPreset) {
  return useQuery({
    queryKey: ['analytics', 'metrics', preset],
    queryFn: () => api.get<HotelMetrics>('/analytics-v2/metrics', { preset }),
    staleTime: 60_000,
  });
}

export function useTimeseries(days: number = 30) {
  return useQuery({
    queryKey: ['analytics', 'timeseries', days],
    queryFn: () => api.get<{ metrics: Array<{ date: string; mrrCents: number; leadsCreated: number; trialsStarted: number }> }>('/analytics-v2/timeseries', { days }),
  });
}

export function useForecast(days: number = 30) {
  return useQuery({
    queryKey: ['analytics', 'forecast', days],
    queryFn: () => api.get<ForecastData>('/analytics-v2/forecast', { days }),
  });
}

export function usePricing(days: number = 30) {
  return useQuery({
    queryKey: ['analytics', 'pricing', days],
    queryFn: () => api.get<{ recommendations: PricingRecommendation[] }>('/analytics-v2/pricing', { days }),
  });
}
