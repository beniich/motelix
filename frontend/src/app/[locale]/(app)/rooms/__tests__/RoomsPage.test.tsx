import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RoomsPage from '../page';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock auth
vi.mock('@/lib/auth', () => ({
  useAuth: () => ({ user: { role: 'ADMIN' } }),
}));

// Mock API
vi.mock('@/lib/api-client', () => ({
  roomsApi: {
    list: vi.fn().mockResolvedValue({
      items: [{ id: '1', number: '101', floor: 1, type: 'Standard', price: 200, status: 'AVAILABLE', hotelId: 'h1' }],
      pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
    }),
  },
}));

const renderWithQuery = (ui: React.ReactNode) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe('RoomsPage', () => {
  it('renders the title', async () => {
    renderWithQuery(<RoomsPage />);
    await waitFor(() => {
      expect(screen.getByText('rooms.title')).toBeInTheDocument();
    });
  });

  it('shows the room number from the API', async () => {
    renderWithQuery(<RoomsPage />);
    await waitFor(() => {
      expect(screen.getByText('101')).toBeInTheDocument();
    });
  });
});
