'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlassInput } from '@/components/ui/GlassInput';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clear } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    try {
      await login(email, password);
      startTransition(() => {
        const from = searchParams.get('from');
        router.push(from ? (from as '/dashboard') : '/dashboard');
        router.refresh();
      });
    } catch {
      // error surfaced from store
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(59,130,246,0.15)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(139,92,246,0.15)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'rgba(212,175,55,0.05)' }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                boxShadow: '0 0 32px rgba(139,92,246,0.4)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-2xl font-semibold text-gray-900"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              {t('common.appName')}
            </span>
          </div>
        </div>

        <GlassCard variant="strong" className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1
              className="text-3xl font-light tracking-tight text-gray-900"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              {t('auth.welcomeBack')}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {t('auth.loginSubtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <GlassInput
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
              placeholder="admin@sapphire.luxury"
            />
            <GlassInput
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />

            {error && (
              <div
                className="text-sm px-3 py-2 rounded-lg"
                style={{
                  color: '#FCA5A5',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                {t('auth.invalidCredentials')}
              </div>
            )}

            <GradientButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading || isPending}
            >
              {t('auth.submitLogin')}
            </GradientButton>
          </form>

          <div className="pt-4 text-center text-xs space-y-1 text-gray-500 border-t border-gray-100">
            <p>
              <span className="font-medium text-gray-700">admin@sapphire.luxury</span>
              {' / '}
              <span className="font-medium text-gray-700">Password123!</span>
            </p>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
