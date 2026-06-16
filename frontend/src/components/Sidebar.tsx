'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import {
  LayoutDashboard, CalendarDays, BedDouble, ListTodo, Users, UserSquare,
  Building2, BarChart3, LogOut, Sparkles, FileText, Brush, Globe2,
  ConciergeBell, TrendingUp, Crown, Shield, Power, ShieldAlert, Cpu,
  Navigation, Zap, Radio, Target, Bot, GraduationCap, ShoppingBag,
  Waves, Car, Map, PlaneLanding, Wrench, Wine, ChevronDown, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/lib/auth';
import { HotelSwitcher } from './HotelSwitcher';
import { useApiWithHotel } from '@/hooks/useApiWithHotel';
import { LocaleSwitcher } from './LocaleSwitcher';

const MAIN_NAV_ITEMS = [
  { key: 'super',        href: '/super'       as const, icon: Building2,     roles: ['SUPER_ADMIN'] },
  { key: 'dashboard',    href: '/dashboard'   as const, icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'reservations', href: '/reservations' as const, icon: CalendarDays, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'guests',       href: '/guests'      as const, icon: UserSquare,     roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'memberships',  href: '/memberships' as const, icon: Crown,          roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { key: 'rooms',        href: '/rooms'       as const, icon: BedDouble,      roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'housekeeping', href: '/housekeeping' as const, icon: Brush,         roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'tasks',        href: '/tasks'       as const, icon: ListTodo,       roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'invoices',     href: '/invoices'    as const, icon: FileText,       roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'roomService',  href: '/room-service' as const, icon: ConciergeBell, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'channels',     href: '/channels'    as const, icon: Globe2,         roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { key: 'analytics',    href: '/analytics-v2' as const, icon: BarChart3,     roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { key: 'forecast',     href: '/forecast'    as const, icon: TrendingUp,     roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { key: 'segments',     href: '/guests-segments' as const, icon: Users,      roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { key: 'vault',        href: '/vault'       as const, icon: Shield,         roles: ['SUPER_ADMIN', 'ADMIN'] },
  { key: 'admin',        href: '/admin'       as const, icon: Users,          roles: ['ADMIN'] },
] as const;

const ADVANCED_NAV_ITEMS = [
  { key: 'masterSwitch', href: '/master-switch' as const, icon: Power,         roles: ['SUPER_ADMIN'] },
  { key: 'security',     href: '/security'      as const, icon: ShieldAlert,   roles: ['SUPER_ADMIN', 'ADMIN'] },
  { key: 'digitalTwin',  href: '/digital-twin'  as const, icon: Cpu,           roles: ['SUPER_ADMIN'] },
  { key: 'drones',       href: '/drones'        as const, icon: Navigation,    roles: ['SUPER_ADMIN', 'ADMIN'] },
  { key: 'energy',       href: '/energy'        as const, icon: Zap,           roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { key: 'omnistream',   href: '/omnistream'    as const, icon: Radio,         roles: ['SUPER_ADMIN', 'ADMIN'] },
  { key: 'strategy',     href: '/strategy'      as const, icon: Target,        roles: ['SUPER_ADMIN', 'ADMIN'] },
  { key: 'aethelred',    href: '/aethelred'     as const, icon: Bot,           roles: ['SUPER_ADMIN', 'ADMIN'] },
  { key: 'academy',      href: '/academy'       as const, icon: GraduationCap, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { key: 'boutique',     href: '/boutique'      as const, icon: ShoppingBag,   roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { key: 'pool',         href: '/pool'          as const, icon: Waves,         roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { key: 'valet',        href: '/valet'         as const, icon: Car,           roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'concierge',    href: '/concierge'     as const, icon: Map,           roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'arrivals',     href: '/arrivals'      as const, icon: PlaneLanding,  roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'maintenance',  href: '/maintenance'   as const, icon: Wrench,        roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  { key: 'minibar',      href: '/minibar'       as const, icon: Wine,          roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
] as const;

export function Sidebar() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  useApiWithHotel();
  
  const [advancedOpen, setAdvancedOpen] = useState(false);

  if (!user) return null;

  const mainItems = MAIN_NAV_ITEMS.filter((i) => (i.roles as readonly string[]).includes(user.role));
  const advItems = ADVANCED_NAV_ITEMS.filter((i) => (i.roles as readonly string[]).includes(user.role));

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const renderLink = (item: any) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        key={item.key}
        href={item.href}
        className={clsx(
          'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
          isActive ? 'text-white' : 'hover:bg-white/5'
        )}
        style={
          isActive
            ? {
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                boxShadow: '0 0 24px rgba(139,92,246,0.35)',
              }
            : { color: '#8E96BD' }
        }
      >
        <Icon className="w-4 h-4 shrink-0" />
        {t(`nav.${item.key}`)}
      </Link>
    );
  };

  return (
    <aside
      className="w-64 h-screen p-4 flex flex-col flex-shrink-0"
      style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 mb-4 shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            boxShadow: '0 0 24px rgba(139,92,246,0.35)',
          }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span
          className="font-semibold text-lg gradient-text-gold"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          {t('common.appName')}
        </span>
      </Link>

      <div className="shrink-0 mb-4">
        <HotelSwitcher />
      </div>

      {/* Navigation (scrollable) */}
      <nav className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {mainItems.map(renderLink)}

        {advItems.length > 0 && (
          <div className="pt-4 pb-2">
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:text-white"
              style={{ color: '#5A659E' }}
            >
              <span className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                {t('nav.advancedModules')}
              </span>
              {advancedOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {advancedOpen && (
              <div className="mt-2 space-y-1 pl-2 border-l border-white/10 ml-4">
                {advItems.map(renderLink)}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="space-y-2 pt-4 mt-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <LocaleSwitcher />

        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#0A0E27] font-semibold text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E8B8)' }}
          >
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#E6E8F2' }}>
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs" style={{ color: '#D4AF37' }}>
              {t(`roles.${user.role}`)}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            style={{ color: '#8E96BD' }}
            title={t('common.logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </aside>
  );
}
