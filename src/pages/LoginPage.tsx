import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { handleApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const expired = searchParams.get('expired') === '1';

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const apiError = handleApiError(err);
      setError(
        apiError.status === 401 
          ? 'Identifiants invalides' 
          : apiError.message || 'Erreur de connexion'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-cyan-500/20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/20" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-electric flex items-center justify-center glow-blue mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary">Zafir</h1>
          <p className="text-sm text-muted mt-1">Luxury Hospitality Command Center</p>
        </div>

        {/* Card */}
        <div className="bg-secondary border border-black rounded-2xl p-8 glow-blue-subtle">
          {expired && (
            <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                Session expirée. Reconnectez-vous.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@zafir.luxury"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-tertiary border border-black text-primary placeholder:text-muted focus:outline-none focus:border-[#00D4FF] focus:glow-blue-subtle transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-tertiary border border-black text-primary placeholder:text-muted focus:outline-none focus:border-[#00D4FF] focus:glow-blue-subtle transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all",
                isLoading
                  ? "bg-tertiary text-muted cursor-wait"
                  : "bg-gradient-electric text-white glow-blue hover:glow-blue-strong hover:scale-[1.01]"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-black text-center">
            <p className="text-xs text-muted">
              Besoin d'aide ?{' '}
              <a href="mailto:support@zafir.luxury" className="text-cyan-400 hover:text-glow-blue">
                Contacter le support
              </a>
            </p>
          </div>
        </div>

        {/* Dev hint */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-3 rounded-lg bg-tertiary border border-black text-center">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">Dev Mode</p>
            <p className="text-xs text-secondary">
              Comptes test : <code className="text-cyan-400">admin@zafir.luxury</code> /{' '}
              <code className="text-cyan-400">Password123!</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
