'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, ExternalLink, TrendingUp } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  hotels?: string;
  role?: string;
  source: string;
  status: LeadStatus;
  score: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  notes?: string;
  contactedAt?: string;
  createdAt: string;
}

interface PaginatedLeads {
  items: Lead[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW:       'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  CONTACTED: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  QUALIFIED: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  CONVERTED: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  LOST:      'bg-red-500/20 text-red-400 border border-red-500/30',
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW:       'Nouveau',
  CONTACTED: 'Contacté',
  QUALIFIED: 'Qualifié',
  CONVERTED: 'Converti',
  LOST:      'Perdu',
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 60 ? 'text-emerald-400' : score >= 30 ? 'text-amber-400' : 'text-slate-400';
  return (
    <span className={`flex items-center gap-1 font-bold text-sm ${color}`}>
      <TrendingUp className="w-3 h-3" />
      {score}
    </span>
  );
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`${API}/api/leads?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Not authenticated');
      const data: PaginatedLeads = await res.json();
      setLeads(data.items);
      setPagination(data.pagination);
    } catch {
      // Could redirect to login or show error
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateStatus(id: string, status: LeadStatus) {
    setUpdatingId(id);
    try {
      await fetch(`${API}/api/leads/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white p-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">CRM Leads</h1>
        <p className="text-slate-400 text-sm mt-1">
          {pagination.total} prospect{pagination.total !== 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="leads-search"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition"
            placeholder="Rechercher nom, email, entreprise…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          id="leads-status-filter"
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button
          id="leads-refresh"
          onClick={fetchLeads}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-300 flex items-center gap-2 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Hôtels</th>
                <th className="text-left px-4 py-3">Score</th>
                <th className="text-left px-4 py-3">Statut</th>
                <th className="text-left px-4 py-3">Créé le</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-white/5 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    Aucun lead trouvé
                  </td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-slate-400 text-xs">{lead.email}</p>
                      {lead.company && <p className="text-slate-500 text-xs">{lead.company}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-white/5 px-2 py-0.5 rounded text-xs text-slate-300">{lead.source}</span>
                      {lead.utmSource && (
                        <p className="text-slate-500 text-xs mt-1">{lead.utmSource}/{lead.utmMedium}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{lead.hotels ?? '—'}</td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={lead.score} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[lead.status]}`}>
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        id={`lead-status-${lead.id}`}
                        disabled={updatingId === lead.id}
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-violet-500/50 disabled:opacity-50 transition"
                        value={lead.status}
                        onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-xs text-slate-400">
              Page {pagination.page} sur {pagination.totalPages} • {pagination.total} résultats
            </p>
            <div className="flex gap-2">
              <button
                id="leads-prev-page"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 rounded-lg p-2 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="leads-next-page"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 rounded-lg p-2 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick link to PMS */}
      <div className="mt-6 text-center">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition"
        >
          <ExternalLink className="w-4 h-4" />
          Accéder au PMS complet
        </a>
      </div>
    </div>
  );
}
