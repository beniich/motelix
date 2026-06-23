import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlassCard } from '../GlassCard';

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Hello</GlassCard>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies the gold variant style', () => {
    const { container } = render(<GlassCard variant="gold">x</GlassCard>);
    expect(container.firstChild).toHaveStyle({
      background: 'linear-gradient(135deg, rgba(212,175,55,0.10), rgba(212,175,55,0.05))'
    });
  });
});
