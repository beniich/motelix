import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export interface RoomServiceOrder {
  id: string;
  hotelId: string;
  reservationId: string;
  roomId: string;
  status: string; // RECEIVED, PREPARING, DELIVERED, CANCELLED
  progress: number;
  totalCents: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  room: {
    id: string;
    number: string;
  };
  reservation: {
    guest: {
      firstName: string;
      lastName: string;
      vip: boolean;
    };
  };
  items: {
    id: string;
    name: string;
    quantity: number;
  }[];
}

export function useRoomService() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<RoomServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.hotelId) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/api/room-service?hotelId=${user.hotelId}`);
      setOrders(res.data);
    } catch (err: any) {
      console.error('Failed to fetch room service orders:', err);
      setError('Failed to load orders.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.hotelId]);

  const updateOrderStatus = async (orderId: string, status: string, progress: number) => {
    try {
      const res = await api.patch(`/api/room-service/${orderId}/status`, {
        status,
        progress,
      });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? res.data : order))
      );
      return res.data;
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
    // In a real application, you'd set up a polling or WebSocket here for live updates
    const interval = setInterval(() => {
      fetchOrders();
    }, 15000); // refresh every 15s

    return () => clearInterval(interval);
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    updateOrderStatus,
  };
}
