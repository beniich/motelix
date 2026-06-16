'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { GradientButton } from '../ui/GradientButton';
import { clsx } from 'clsx';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'glass-strong py-3' : 'py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center shadow-glow-gold">
            <span className="text-midnight-900 font-bold font-display text-lg">S</span>
          </div>
          <span className="font-display font-bold text-xl text-midnight-50 tracking-wide">
            Sapphire
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-midnight-200 hover:text-white transition-colors">Fonctionnalités</Link>
          <Link href="/solutions/for-boutique-hotels" className="text-sm font-medium text-midnight-200 hover:text-white transition-colors">Boutique-hôtels</Link>
          <Link href="/pricing" className="text-sm font-medium text-midnight-200 hover:text-white transition-colors">Tarifs</Link>
          <Link href="/customers" className="text-sm font-medium text-midnight-200 hover:text-white transition-colors">Clients</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-midnight-200 hover:text-white transition-colors">
            Connexion
          </Link>
          <Link href="/demo">
            <GradientButton size="sm" variant="gold" leftIcon={<Sparkles className="w-4 h-4" />}>
              Réserver une démo
            </GradientButton>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden text-midnight-200 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 glass-strong border-t border-white/10 p-6 flex flex-col gap-4"
        >
          <Link href="/features" className="text-lg font-medium text-midnight-50">Fonctionnalités</Link>
          <Link href="/solutions/for-boutique-hotels" className="text-lg font-medium text-midnight-50">Boutique-hôtels</Link>
          <Link href="/pricing" className="text-lg font-medium text-midnight-50">Tarifs</Link>
          <Link href="/customers" className="text-lg font-medium text-midnight-50">Clients</Link>
          <div className="h-px bg-white/10 my-2" />
          <Link href="/login" className="text-lg font-medium text-midnight-200">Connexion</Link>
          <Link href="/demo" className="mt-2">
            <GradientButton className="w-full" variant="gold">
              Réserver une démo
            </GradientButton>
          </Link>
        </motion.div>
      )}
    </header>
  );
}
