import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-midnight-950 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-gold flex items-center justify-center">
              <span className="text-midnight-900 font-bold font-display text-sm">S</span>
            </div>
            <span className="font-display font-bold text-lg text-midnight-50">Sapphire</span>
          </Link>
          <p className="text-sm text-midnight-300">
            L'OS tout-en-un pour hôtels de luxe qui veulent reprendre le contrôle de leur distribution et maximiser leur RevPAR.
          </p>
        </div>
        
        <div>
          <h4 className="text-midnight-50 font-semibold mb-4">Produit</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><Link href="/features/pms" className="hover:text-gold-400 transition-colors">PMS Complet</Link></li>
            <li><Link href="/features/channel-manager" className="hover:text-gold-400 transition-colors">Channel Manager</Link></li>
            <li><Link href="/features/bi" className="hover:text-gold-400 transition-colors">BI & Pricing IA</Link></li>
            <li><Link href="/features/mobile" className="hover:text-gold-400 transition-colors">App Mobile Native</Link></li>
            <li><Link href="/pricing" className="hover:text-gold-400 transition-colors">Tarifs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-midnight-50 font-semibold mb-4">Ressources</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><Link href="/blog" className="hover:text-gold-400 transition-colors">Blog Hôtellerie</Link></li>
            <li><Link href="/tools/roi-calculator" className="hover:text-gold-400 transition-colors">Calculateur ROI</Link></li>
            <li><Link href="/customers" className="hover:text-gold-400 transition-colors">Études de cas</Link></li>
            <li><Link href="/docs" className="hover:text-gold-400 transition-colors">Documentation API</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-midnight-50 font-semibold mb-4">Légal</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><Link href="/legal/terms" className="hover:text-gold-400 transition-colors">CGV</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-gold-400 transition-colors">Confidentialité (RGPD)</Link></li>
            <li><Link href="/legal/cookies" className="hover:text-gold-400 transition-colors">Cookies</Link></li>
            <li><Link href="/contact" className="hover:text-gold-400 transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-midnight-400">
        <p>© {new Date().getFullYear()} Sapphire Luxury Solutions. Tous droits réservés.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
