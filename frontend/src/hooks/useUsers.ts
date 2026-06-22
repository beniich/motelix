'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, toApiError } from '@/lib/api';
import type { User, PaginatedResponse, Role } from '@/lib/api-client';

interface UseUsersOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: Role;
  isActive?: boolean | 'ALL';
  autoFetch?: boolean;
}

export function useUsers(options: UseUsersOptions = {}) {
  const { autoFetch = true, ...params } = options;
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: Record<string, any> = {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 50,
      };
      if (params.search) queryParams.search = params.search;
      if (params.role) queryParams.role = params.role;
      if (params.isActive && params.isActive !== 'ALL') {
        queryParams.isActive = params.isActive.toString();
      }
      
      const { data } = await api.get<PaginatedResponse<User>>('/users', {
        params: queryParams,
      });
      setUsers(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.pageSize, params.search, params.role, params.isActive]);
  
  useEffect(() => {
    if (autoFetch) fetchUsers();
  }, [fetchUsers, autoFetch]);
  
  const create = async (payload: {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    sendInvitation?: boolean;
  }) => {
    const { data } = await api.post<{ user: User; invitationSent: boolean }>('/users', {
      ...payload,
      sendInvitation: payload.sendInvitation ?? true,
    });
    await fetchUsers();
    return data;
  };
  
  const update = async (id: string, payload: Partial<User>) => {
    const { data } = await api.patch<{ user: User }>(`/users/${id}`, payload);
    setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
    return data.user;
  };
  
  const updateRole = async (id: string, role: Role) => {
    const { data } = await api.patch<{ user: User }>(`/users/${id}/role`, { role });
    setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
    return data.user;
  };
  
  const toggleActive = async (id: string) => {
    const { data } = await api.patch<{ user: User }>(`/users/${id}/toggle-active`);
    setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
    return data.user;
  };
  
  const resetPassword = async (id: string, sendEmail = true) => {
    const { data } = await api.post(`/users/${id}/reset-password`, { sendEmail });
    return data;
  };
  
  const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };
  
  return {
    users,
    pagination,
    loading,
    error,
    fetchUsers,
    create,
    update,
    updateRole,
    toggleActive,
    resetPassword,
    deleteUser,
  };
}
