'use client';

import { Download, X, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function InstallPrompt() {
  const { canInstall, triggerInstall, dismiss } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-[9998] w-80 rounded-2xl border border-gray-200 backdrop-blur-xl shadow-2xl overflow-hidden bg-white/95"
    >
      {/* Gradient accent line */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #D4AF37, #7C3AED)' }} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' }}
            >
              <Smartphone size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Installer Sapphire</p>
              <p className="text-xs text-gray-500 mt-0.5">Accès hors-ligne · Notifications push</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        <button
          onClick={triggerInstall}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', color: '#ffffff' }}
        >
          <Download size={15} />
          Installer l'application
        </button>
      </div>
    </div>
  );
}
