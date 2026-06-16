import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, POSTS } from '@/lib/blog';
import { Header } from '@/components/landing/Header';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  
  return {
    title: `${post.title} | Blog Sapphire`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  
  // Générer JSON-LD pour le SEO (Article schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
  };
  
  const mdxComponents = {
    h1: (props: any) => <h1 className="text-3xl md:text-4xl font-display font-bold mt-12 mb-6 text-white" {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-display font-bold mt-10 mb-4 text-white" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-bold mt-8 mb-3 text-white" {...props} />,
    p: (props: any) => <p className="text-midnight-200 leading-relaxed mb-6" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 mb-6 text-midnight-200 space-y-2" {...props} />,
    li: (props: any) => <li {...props} />,
    strong: (props: any) => <strong className="font-semibold text-white" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-gold-400 pl-4 py-1 my-8 bg-gold-400/5 text-midnight-100 italic rounded-r-lg" {...props} />
    ),
  };
  
  return (
    <main className="min-h-screen bg-midnight-950 text-white font-sans pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <article className="max-w-3xl mx-auto px-6 pt-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-midnight-300 hover:text-gold-400 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Retour au blog
        </Link>
        
        <header className="mb-12 border-b border-white/10 pb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-midnight-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-a flex items-center justify-center text-white font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <span className="text-midnight-100 block">{post.author}</span>
                <span className="text-xs">{post.authorRole}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </header>
        
        <div className="prose prose-invert max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
        
        <div className="mt-16 pt-10 border-t border-white/10 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">Prêt à optimiser la gestion de votre hôtel ?</h3>
          <p className="text-midnight-200 mb-8">Découvrez comment le PMS Sapphire peut vous aider à mettre en pratique ces stratégies.</p>
          <Link href="/demo">
            <button className="px-8 py-3 rounded-full bg-gradient-gold text-midnight-900 font-medium hover:opacity-90 transition-opacity">
              Demander une démo
            </button>
          </Link>
        </div>
      </article>
    </main>
  );
}
