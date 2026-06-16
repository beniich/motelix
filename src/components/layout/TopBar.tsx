import { useState } from 'react';
import { Menu, Sun, Moon, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CurrentUser } from '@/lib/rbac';

interface TopBarProps {
  currentUser: CurrentUser | null;
  onToggleSidebar: () => void;
  onLogout: () => Promise<void>;
}

function useThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return !document.documentElement.classList.contains('light');
  });

  const toggle = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('light');
      html.classList.remove('dark');
      localStorage.setItem('sapphire_theme', 'light');
      setIsDark(false);
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      localStorage.setItem('sapphire_theme', 'dark');
      setIsDark(true);
    }
  };

  return { isDark, toggle };
}

export function TopBar({ currentUser, onToggleSidebar, onLogout }: TopBarProps) {
  const { isDark, toggle } = useThemeToggle();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="h-16 flex items-center gap-4 px-6 border-b border-white/5 flex-shrink-0"
      style={{ backgroundColor: 'var(--bg-secondary, #0A0E1A)' }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="p-2 rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-colors"
        aria-label="Toggle theme"
        title={isDark ? 'Mode clair' : 'Mode sombre'}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* User dropdown */}
      {currentUser && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#0A0E27] font-bold text-xs flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E8B8)' }}
            >
              {currentUser.name?.[0] ?? 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-primary leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-muted leading-tight font-mono">{currentUser.clearance}</p>
            </div>
            <ChevronDown className={cn('w-3 h-3 text-muted transition-transform', menuOpen && 'rotate-180')} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 mt-1 w-48 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                style={{ backgroundColor: 'var(--bg-secondary, #0A0E1A)' }}
              >
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-xs font-medium text-primary">{currentUser.name}</p>
                  <p className="text-[10px] text-muted font-mono">{currentUser.role}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-primary hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4" /> Mon profil
                  </button>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-primary hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Paramètres
                  </button>
                </div>
                <div className="border-t border-white/5 py-1">
                  <button
                    onClick={() => { setMenuOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
