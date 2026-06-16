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
      <p className="text-xs" style={{ color: '#8E96BD' }}>Page {page} / {totalPages}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg glass disabled:opacity-30 hover:bg-white/10"
          style={{ color: '#C2C7DC' }}
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
                {gap && <span className="px-1" style={{ color: '#5A659E' }}>…</span>}
                <button
                  onClick={() => onPageChange(p)}
                  className={clsx(
                    'min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium',
                    p === page ? 'text-white' : 'glass hover:bg-white/10'
                  )}
                  style={
                    p === page
                      ? {
                          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                          boxShadow: '0 0 24px rgba(139,92,246,0.35)',
                        }
                      : { color: '#C2C7DC' }
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
          className="p-1.5 rounded-lg glass disabled:opacity-30 hover:bg-white/10"
          style={{ color: '#C2C7DC' }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
