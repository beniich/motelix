import Link from 'next/link';
import { POSTS } from '@/lib/blog';
import { Header } from '@/components/landing/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Hôtelier & Astuces PMS | Sapphire',
  description: 'Découvrez nos conseils en revenue management, gestion hôtelière et technologies pour augmenter votre RevPAR.',
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-midnight-950 text-white font-sans pt-24">
      <Header />
      
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ressources pour <span className="text-transparent bg-clip-text bg-gradient-gold">l'hôtellerie moderne</span>
          </h1>
          <p className="text-xl text-midnight-200 max-w-2xl mx-auto">
            Stratégies, guides et analyses pour optimiser vos revenus et simplifier vos opérations.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <GlassCard className="h-full flex flex-col group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 text-xs text-midnight-300 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                
                <h2 className="text-xl font-display font-bold text-midnight-50 mb-3 group-hover:text-gold-400 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-midnight-200 text-sm flex-grow mb-6">
                  {post.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="text-xs">
                    <span className="text-midnight-100 font-medium">{post.author}</span>
                    <span className="text-midnight-400 block">{post.authorRole}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-400 group-hover:text-midnight-900 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
