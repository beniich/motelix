import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, CalendarDays, BedDouble, Brush,
  FileText, Globe, BarChart3, Shield, Zap, Power, ChevronLeft,
  ChevronRight, Sparkles, LogOut, Settings, Bell, Coffee, Waves,
  ShoppingBag, CreditCard, Box, FileLock, Wrench, Plane, Radio, Monitor, Thermometer
} from 'lucide-react';
import type { CurrentUser } from '@/lib/rbac';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  group?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Operations
  { id: 'arrivals',      label: 'Arrivées',          icon: LayoutDashboard, group: 'Opérations' },
  { id: 'housekeeping',  label: 'Housekeeping',       icon: Brush,           group: 'Opérations' },
  { id: 'concierge',     label: 'Conciergerie',       icon: Bell,            group: 'Opérations' },
  { id: 'valet',         label: 'Valet & Parking',    icon: BedDouble,       group: 'Opérations' },
  { id: 'room-service',  label: 'Room Service',       icon: Coffee,          group: 'Opérations' },
  { id: 'minibar',       label: 'Minibar Connecté',   icon: Thermometer,     group: 'Opérations' },
  { id: 'pool',          label: 'Piscine & Spa',      icon: Waves,           group: 'Opérations' },
  { id: 'boutique',      label: 'Boutique',           icon: ShoppingBag,     group: 'Opérations' },
  // Business
  { id: 'reservations',  label: 'Réservations',       icon: CalendarDays,    group: 'Business' },
  { id: 'guests',        label: 'Clients & Segments', icon: Users,           group: 'Business' },
  { id: 'billing',       label: 'Facturation',        icon: FileText,        group: 'Business' },
  { id: 'channels',      label: 'Channel Manager',    icon: Globe,           group: 'Business' },
  { id: 'strategy',      label: 'Intelligence',       icon: BarChart3,       group: 'Business' },
  { id: 'subscriptions', label: 'Abonnements',        icon: CreditCard,      group: 'Business' },
  // Advanced
  { id: 'security',      label: 'Sécurité',           icon: Shield,          group: 'Avancé' },
  { id: 'energy',        label: 'Énergie',            icon: Zap,             group: 'Avancé' },
  { id: 'digital-twin',  label: 'Digital Twin',       icon: Box,             group: 'Avancé' },
  { id: 'document-vault',label: 'Coffre-fort',        icon: FileLock,        group: 'Avancé' },
  { id: 'maintenance',   label: 'Maintenance 3D',     icon: Wrench,          group: 'Avancé' },
  { id: 'drones',        label: 'Drones',             icon: Plane,           group: 'Avancé' },
  { id: 'omni-stream',   label: 'Omni Stream',        icon: Radio,           group: 'Avancé' },
  { id: 'admin-center',  label: 'Admin',              icon: Monitor,         group: 'Avancé' },
  { id: 'master-switch', label: 'Contrôle Global',    icon: Power,           group: 'Avancé' },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  currentUser: CurrentUser | null;
}

export function Sidebar({ activeTab, onTabChange, collapsed, onToggle, currentUser }: SidebarProps) {
  const groups = Array.from(new Set(NAV_ITEMS.map(i => i.group!)));

  return (
    <aside
      className={cn(
        'flex flex-col min-h-screen transition-all duration-300 border-r border-white/5',
        'bg-[hsl(var(--bg-secondary))]',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-white/5 h-16',
        collapsed && 'justify-center'
      )}>
        <div
          className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)' }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-display font-bold text-primary truncate">Zafir</p>
            <p className="text-[10px] text-muted truncate font-mono">Operations Center</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4">
        {groups.map(group => (
          <div key={group}>
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-mono uppercase tracking-widest text-muted">
                {group}
              </p>
            )}
            <div className="space-y-0.5 px-2">
              {NAV_ITEMS.filter(i => i.group === group).map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium',
                      'transition-all duration-150',
                      isActive
                        ? 'text-white'
                        : 'text-muted hover:text-primary hover:bg-white/5',
                      collapsed && 'justify-center px-0'
                    )}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,47,190,0.2))',
                      borderLeft: '2px solid #00D4FF',
                    } : undefined}
                  >
                    <Icon className={cn('flex-shrink-0 w-4 h-4', isActive && 'text-cyan-400')} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-full font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-white/5 p-3 space-y-2">
        {currentUser && !collapsed && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-white/5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#0A0E27] font-bold text-xs flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E8B8)' }}
            >
              {currentUser.name?.[0] ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-primary truncate">{currentUser.name}</p>
              <p className="text-[10px] text-muted truncate font-mono">{currentUser.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg text-muted hover:bg-white/5 hover:text-primary transition-colors"
          title={collapsed ? 'Agrandir' : 'Réduire'}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft className="w-4 h-4" />
          }
        </button>
      </div>
    </aside>
  );
}
