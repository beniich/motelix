'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs text-gray-400">Page {page} / {totalPages}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-gray-200 bg-white/70 disabled:opacity-30 hover:bg-white hover:border-blue-300 transition-colors text-gray-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
          .map((p, idx, arr) => {
            const prev = arr[idx - 1];
            const gap = prev && p - prev > 1;
            return (
              <span key={p} className="flex items-center gap-1">
                {gap && <span className="px-1 text-gray-300">…</span>}
                <button
                  onClick={() => onPageChange(p)}
                  className={clsx(
                    'min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-all',
                    p === page
                      ? 'text-white shadow-sm'
                      : 'border border-gray-200 bg-white/70 text-gray-500 hover:bg-white hover:border-blue-300'
                  )}
                  style={
                    p === page
                      ? { background: 'linear-gradient(135deg, #0a66c2, #2563eb)' }
                      : undefined
                  }
                >
                  {p}
                </button>
              </span>
            );
          })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-gray-200 bg-white/70 disabled:opacity-30 hover:bg-white hover:border-blue-300 transition-colors text-gray-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
