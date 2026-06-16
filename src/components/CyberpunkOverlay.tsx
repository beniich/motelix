import { useEffect, useState } from 'react';

interface CyberpunkOverlayProps {
  enabled: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export function CyberpunkOverlay({ enabled, intensity = 'medium' }: CyberpunkOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    const count = intensity === 'high' ? 30 : intensity === 'medium' ? 15 : 8;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [enabled, intensity]);

  if (!enabled) return null;

  return (
    <>
      {/* Scanlines sweep */}
      <div className="cyberpunk-scanlines fixed inset-0 pointer-events-none z-[60]" />

      {/* Floating particles */}
      <div className="cyberpunk-particles">
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
