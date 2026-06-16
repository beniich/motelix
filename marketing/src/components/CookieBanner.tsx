'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, CheckCircle, XCircle } from 'lucide-react';

const COOKIE_KEY = 'sapphire_cookie_consent';

type ConsentState = 'analytics' | 'marketing' | null;

interface Preferences {
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({ analytics: false, marketing: false });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      // Afficher le banner après 1 seconde
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Appliquer les préférences sauvegardées
      try {
        const parsed = JSON.parse(stored) as Preferences;
        applyConsent(parsed);
      } catch {}
    }
  }, []);

  function applyConsent(p: Preferences) {
    // PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      if (p.analytics) {
        (window as any).posthog.opt_in_capturing();
      } else {
        (window as any).posthog.opt_out_capturing();
      }
    }
  }

  function acceptAll() {
    const p = { analytics: true, marketing: true };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(p));
    setPrefs(p);
    applyConsent(p);
    setVisible(false);
  }

  function rejectAll() {
    const p = { analytics: false, marketing: false };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(p));
    setPrefs(p);
    applyConsent(p);
    setVisible(false);
  }

  function savePrefs() {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
    applyConsent(prefs);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-label="Consentement cookies"
    >
      <div className="max-w-3xl mx-auto bg-midnight-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gold-400/10 rounded-lg flex-shrink-0">
            <Cookie className="w-5 h-5 text-gold-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Vos préférences de cookies</h3>
              <button
                onClick={rejectAll}
                className="text-midnight-400 hover:text-white transition-colors p-1"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-midnight-300 text-sm leading-relaxed mb-4">
              Nous utilisons des cookies pour améliorer votre expérience et analyser l&apos;usage du site.
              Les cookies essentiels ne peuvent pas être désactivés.{' '}
              <a href="/legal/privacy" className="text-gold-400 hover:underline">
                En savoir plus
              </a>
            </p>

            {showDetails && (
              <div className="space-y-3 mb-4 p-4 bg-midnight-900/50 rounded-xl border border-white/5">
                <CookieToggle
                  label="Cookies essentiels"
                  description="Authentification, sécurité, session. Requis pour le fonctionnement du site."
                  checked={true}
                  disabled={true}
                  onChange={() => {}}
                />
                <CookieToggle
                  label="Cookies analytiques"
                  description="Mesure d'audience via PostHog (données anonymisées, hébergées en EU)."
                  checked={prefs.analytics}
                  onChange={(v) => setPrefs(p => ({ ...p, analytics: v }))}
                />
                <CookieToggle
                  label="Cookies marketing"
                  description="Suivi des conversions et optimisation des campagnes (utm_source, etc.)."
                  checked={prefs.marketing}
                  onChange={(v) => setPrefs(p => ({ ...p, marketing: v }))}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={acceptAll}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-gold-400 hover:bg-gold-300 text-midnight-900 font-semibold rounded-lg text-sm transition-colors"
              >
                Tout accepter
              </button>
              {showDetails ? (
                <button
                  onClick={savePrefs}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-midnight-700 hover:bg-midnight-600 text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  Enregistrer mes choix
                </button>
              ) : (
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-midnight-700 hover:bg-midnight-600 text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  Personnaliser
                </button>
              )}
              <button
                onClick={rejectAll}
                className="px-5 py-2.5 text-midnight-400 hover:text-white text-sm transition-colors"
              >
                Tout refuser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CookieToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={() => !disabled && onChange(!checked)}
        className={`mt-0.5 flex-shrink-0 w-9 h-5 rounded-full transition-colors ${
          checked ? 'bg-gold-400' : 'bg-midnight-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-pressed={checked}
        aria-disabled={disabled}
      >
        <span
          className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-midnight-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
