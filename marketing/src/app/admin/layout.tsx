import type { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BarChart2, Settings, LogOut } from 'lucide-react';

const NAV = [
  { href: '/admin/leads', label: 'Leads CRM', icon: Users },
  { href: '/admin/metrics', label: 'Métriques', icon: BarChart2 },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0d14] flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/10 flex flex-col py-6 px-3 shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Sapphire Admin</span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
