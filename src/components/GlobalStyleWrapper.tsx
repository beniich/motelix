import { useEffect } from 'react';

/**
 * Injecte le style global au runtime (alternative au index.css).
 * Utile pour les apps qui ont un style existant qu'on ne peut pas toucher directement.
 */
export function GlobalStyleWrapper() {
  useEffect(() => {
    // Inject dynamic theme variables based on user preference
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', '#05060A');
    root.style.setProperty('--bg-secondary', '#0A0E1A');
    root.style.setProperty('--bg-tertiary', '#0F1424');
    root.style.setProperty('--bg-elevated', '#151B2E');
    root.style.setProperty('--text-primary', '#F8F7F2');
    root.style.setProperty('--text-secondary', '#D9D5C2');
    root.style.setProperty('--text-muted', '#7A7565');
    root.style.setProperty('--border-primary', '#000000');
    root.style.setProperty('--glow-blue', '#00D4FF');
    root.style.setProperty('--glow-purple', '#B026FF');
    root.style.setProperty('--glow-gold', '#FFD700');
    
    // Force body background
    document.body.style.backgroundColor = '#05060A';
    document.body.style.color = '#F8F7F2';
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
}
