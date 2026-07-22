/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
import * as React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';

interface BlogPostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostDetailPageProps) {
  const resolvedParams = await params;
  const post = await db.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post) return {};

  const seo = await db.seoMetadata.findUnique({
    where: {
      entityType_entityId: {
        entityType: 'BLOG',
        entityId: post.id,
      },
    },
  });

  const excerpt = post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : '';

  return {
    title: seo?.metaTitle || `${post.title} | Blog | The Liquid Plus`,
    description: seo?.metaDescription || excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const resolvedParams = await params;
  const post = await db.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      category: true,
      blogTags: true,
    },
  });

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Fetch author
  const authorUser = await db.user.findUnique({
    where: { id: post.authorId },
    include: { customerProfile: true },
  });
  const authorName = authorUser?.customerProfile?.firstName
    ? `${authorUser.customerProfile.firstName} ${authorUser.customerProfile.lastName || ''}`.trim()
    : authorUser?.email || 'Editor';

  const excerpt = post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : '';

  // Get related posts in same category
  const related = await db.blogPost.findMany({
    where: {
      categoryId: post.categoryId,
      id: { not: post.id },
      status: 'PUBLISHED',
    },
    take: 3,
    include: { category: true },
  });

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans text-left">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-8">
        {/* Back Link */}
        <Link href="/blog" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
          ← Back to Blog
        </Link>

        {/* Title Block */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-[9px] uppercase tracking-widest text-[#FF4D00] font-black">
            <span>{post.category?.name || 'Products'}</span>
            <span>•</span>
            <span className="text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-widest leading-tight text-white">
            {post.title}
          </h1>

          <div className="flex items-center space-x-3 text-[9px] uppercase tracking-wider text-zinc-400 border-t border-b border-white/5 py-3">
            <span>By {authorName}</span>
            <span>•</span>
            <span>5 min read</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="aspect-[21/9] bg-zinc-950 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center p-2">
            <img src={post.featuredImage} alt={post.title} className="max-h-full max-w-full object-contain" />
          </div>
        )}

        {/* Content Body */}
        <div
          className="prose prose-invert max-w-none text-zinc-300 text-xs leading-relaxed font-light space-y-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.blogTags && post.blogTags.length > 0 && (
          <div className="border-t border-white/5 pt-6 flex flex-wrap gap-2">
            {post.blogTags.map((tag: any) => (
              <span key={tag.id} className="px-3 py-1 bg-zinc-900 border border-white/5 rounded-full text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="border-t border-white/5 pt-12 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#FF4D00]">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div key={rel.id} className="border border-white/5 bg-[#0a0a0a] p-4 rounded-xl space-y-2">
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">{rel.category?.name || 'Detailing'}</span>
                  <Link href={`/blog/${rel.slug}`}>
                    <h4 className="text-xs font-bold text-white hover:text-[#FF4D00] transition-colors leading-snug line-clamp-2">{rel.title}</h4>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
export const revalidate = 300;
