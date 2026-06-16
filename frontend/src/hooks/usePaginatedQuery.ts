'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';

type Params = Record<string, unknown>;

export function usePaginatedQuery<T>(
  key: string,
  fetcher: (params: Params) => Promise<{ items: T[]; pagination: any }>,
  extraParams: Params = {}
) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const query = useQuery({
    queryKey: [key, page, pageSize, extraParams],
    queryFn: () => fetcher({ page, pageSize, ...extraParams }),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    page,
    setPage,
    pageSize,
  };
}
