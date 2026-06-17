'use client';

import { useEffect, useState, useCallback } from 'react';
import { auditApi, AuditEvent, AuditVerifyResult } from '@/lib/api-client';

// ============================================================
// NAVY & CAMEL DESIGN SYSTEM
// Navy: #0a1f44 (primary), #1e3a8a (hover)
// Camel: #c89b6a (accent), #e8b07a (light), #a67b4d (dark)
// Glass: rgba(255, 255, 255, 0.55) + backdrop-blur
// ============================================================

const theme = {
  navy: {
    900: '#0a1f44',
    800: '#102a5b',
    700: '#1e3a8a',
    600: '#1e40af',
  },
  camel: {
    900: '#a67b4d',
    700: '#c89b6a',
    500: '#d4a373',
    300: '#e8b07a',
    100: '#f5e6d3',
  },
  glass: {
    panel: 'rgba(255, 255, 255, 0.55)',
    card: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.6)',
  },
};

const actionColors: Record<string, { bg: string; text: string }> = {
  CREATE: { bg: 'rgba(46, 125, 50, 0.12)', text: '#2e7d32' },
  UPDATE: { bg: 'rgba(0, 102, 204, 0.12)', text: '#0066cc' },
  DELETE: { bg: 'rgba(198, 40, 40, 0.12)', text: '#c62828' },
  LOGIN: { bg: 'rgba(200, 155, 106, 0.18)', text: '#a67b4d' },
  LOGOUT: { bg: 'rgba(100, 116, 139, 0.12)', text: '#475569' },
  EXPORT: { bg: 'rgba(14, 116, 144, 0.12)', text: '#0e7490' },
  VERIFY: { bg: 'rgba(124, 58, 237, 0.12)', text: '#7c3aed' },
};

function ActionBadge({ action }: { action: string }) {
  const colors = actionColors[action] || actionColors.UPDATE;
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        padding: '4px 10px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.05em',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      {action}
    </span>
  );
}

function HashCell({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  const short = `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;

  const copy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      title={hash}
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12px',
        color: theme.navy[700],
        background: 'transparent',
        border: '1px solid rgba(200, 155, 106, 0.3)',
        padding: '4px 8px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(200, 155, 106, 0.1)';
        e.currentTarget.style.borderColor = theme.camel[700];
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'rgba(200, 155, 106, 0.3)';
      }}
    >
      {copied ? '✓ Copied' : short}
    </button>
  );
}

function StatusPill({ result, loading }: { result: AuditVerifyResult | null; loading: boolean }) {
  if (loading) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 18px',
          borderRadius: '14px',
          background: 'rgba(100, 116, 139, 0.1)',
          color: '#475569',
          fontWeight: 600,
        }}
      >
        <Spinner size={16} color="#475569" /> Verifying chain...
      </div>
    );
  }

  if (!result) return null;

  if (result.valid) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 18px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.12), rgba(46, 125, 50, 0.04))',
          border: '1px solid rgba(46, 125, 50, 0.3)',
          color: '#2e7d32',
          fontWeight: 700,
        }}
      >
        <CheckIcon /> Valid Chain · {result.totalEvents} events verified
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 18px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(198, 40, 40, 0.12), rgba(198, 40, 40, 0.04))',
        border: '1px solid rgba(198, 40, 40, 0.3)',
        color: '#c62828',
        fontWeight: 700,
      }}
    >
      <AlertIcon /> Broken Chain at event {result.brokenAt?.id}
    </div>
  );
}

function Spinner({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.15)" strokeWidth="3" fill="none" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  );
}

function ChainIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.camel[700]} strokeWidth="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

export default function AuditForensicLedgerPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<AuditVerifyResult | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterActor, setFilterActor] = useState('');
  const [filterResource, setFilterResource] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditApi.list({
        page,
        limit: 20,
        actor: filterActor || undefined,
        resource: filterResource || undefined,
      });
      setEvents(res.events);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (e) {
      console.error('Failed to load audit events', e);
    } finally {
      setLoading(false);
    }
  }, [page, filterActor, filterResource]);

  useEffect(() => {
    load();
  }, [load]);

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const result = await auditApi.verify();
      setVerifyResult(result);
    } catch (e) {
      console.error('Verification failed', e);
    } finally {
      setVerifying(false);
    }
  };

  const handleExport = async () => {
    try {
      await auditApi.exportCsv();
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at 20% 20%, ${theme.camel[100]} 0%, transparent 60%),
          radial-gradient(ellipse at 80% 80%, ${theme.camel[300]}30 0%, transparent 60%),
          linear-gradient(135deg, #faf6ef 0%, #f0e6d2 100%)
        `,
        padding: '32px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: theme.navy[900],
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 8,
              }}
            >
              <ChainIcon />
              <h1
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: '-0.02em',
                  color: theme.navy[900],
                }}
              >
                Forensic Ledger
              </h1>
            </div>
            <p
              style={{
                color: theme.camel[900],
                fontSize: 15,
                fontWeight: 500,
                margin: 0,
              }}
            >
              Phase 4 · SHA-256 Chained Audit Trail · {total} events indexed
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <StatusPill result={verifyResult} loading={verifying} />
            <button
              onClick={handleVerify}
              disabled={verifying}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                background: `linear-gradient(135deg, ${theme.navy[700]}, ${theme.navy[900]})`,
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                fontWeight: 600,
                fontSize: 14,
                cursor: verifying ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(10, 31, 68, 0.25)',
                transition: 'transform 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <ShieldIcon /> Verify Integrity
            </button>
            <button
              onClick={handleExport}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                background: theme.glass.card,
                backdropFilter: 'blur(12px)',
                color: theme.navy[900],
                border: `1px solid ${theme.glass.border}`,
                borderRadius: 14,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <DownloadIcon /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap: 12,
            marginBottom: 24,
          }}
        >
          <FilterInput
            icon={<SearchIcon />}
            placeholder="Filter by actor (e.g. admin@auditax.io)"
            value={filterActor}
            onChange={setFilterActor}
          />
          <FilterInput
            icon={<SearchIcon />}
            placeholder="Filter by resource (e.g. Invoice, User)"
            value={filterResource}
            onChange={setFilterResource}
          />
          <button
            onClick={load}
            style={{
              padding: '12px 24px',
              background: theme.camel[700],
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </div>

        {/* Ledger Table */}
        <div
          style={{
            background: theme.glass.panel,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${theme.glass.border}`,
            borderRadius: 24,
            boxShadow: '0 10px 40px -10px rgba(10, 31, 68, 0.1)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: `linear-gradient(135deg, ${theme.navy[900]}, ${theme.navy[700]})`,
                    color: '#fff',
                  }}
                >
                  <Th>#</Th>
                  <Th>Timestamp</Th>
                  <Th>Actor</Th>
                  <Th>Action</Th>
                  <Th>Resource</Th>
                  <Th>Resource ID</Th>
                  <Th>SHA-256 Hash</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ padding: 60, textAlign: 'center', color: theme.camel[900] }}
                    >
                      <Spinner size={28} color={theme.camel[700]} /> Loading forensic chain...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ padding: 60, textAlign: 'center', color: theme.camel[900] }}
                    >
                      No audit events match the current filters.
                    </td>
                  </tr>
                ) : (
                  events.map((event, idx) => (
                    <tr
                      key={event.id}
                      style={{
                        background:
                          idx % 2 === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(248, 246, 239, 0.4)',
                        borderBottom: `1px solid rgba(200, 155, 106, 0.15)`,
                        transition: 'background 0.15s',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = 'rgba(200, 155, 106, 0.08)')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          idx % 2 === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(248, 246, 239, 0.4)')
                      }
                    >
                      <Td>
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            color: theme.camel[900],
                            fontSize: 12,
                          }}
                        >
                          {(page - 1) * 20 + idx + 1}
                        </span>
                      </Td>
                      <Td>
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 12,
                            color: theme.navy[800],
                          }}
                        >
                          {new Date(event.timestamp).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </Td>
                      <Td>
                        <span
                          style={{
                            fontWeight: 500,
                            color: theme.navy[900],
                          }}
                        >
                          {event.actor}
                        </span>
                      </Td>
                      <Td>
                        <ActionBadge action={event.action} />
                      </Td>
                      <Td>
                        <span
                          style={{
                            color: theme.camel[900],
                            fontWeight: 500,
                          }}
                        >
                          {event.resource}
                        </span>
                      </Td>
                      <Td>
                        <code
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 12,
                            color: theme.navy[700],
                            background: 'rgba(200, 155, 106, 0.08)',
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}
                        >
                          {event.resourceId}
                        </code>
                      </Td>
                      <Td>
                        <HashCell hash={event.hash} />
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderTop: `1px solid rgba(200, 155, 106, 0.2)`,
                background: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <span style={{ fontSize: 13, color: theme.camel[900] }}>
                Page {page} of {totalPages} · {total} total events
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  ← Previous
                </PageBtn>
                <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next →
                </PageBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '14px 18px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, 0.85)',
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '14px 18px' }}>{children}</td>;
}

function FilterInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        background: theme.glass.card,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${theme.glass.border}`,
        borderRadius: 12,
        color: theme.camel[900],
      }}
    >
      {icon}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 14,
          color: theme.navy[900],
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

function PageBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: disabled ? 'rgba(0,0,0,0.05)' : theme.camel[700],
        color: disabled ? '#94a3b8' : '#fff',
        border: 'none',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}
