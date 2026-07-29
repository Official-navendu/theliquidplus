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
      url: `https://theliquidplus.com/blog/${post.slug}`,
    },
    alternates: {
      canonical: `https://theliquidplus.com/blog/${post.slug}`,
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

  const authorUser = await db.user.findUnique({
    where: { id: post.authorId },
    include: { customerProfile: true },
  });
  const authorName = authorUser?.customerProfile?.firstName
    ? `${authorUser.customerProfile.firstName} ${authorUser.customerProfile.lastName || ''}`.trim()
    : authorUser?.email || 'Editor';

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
    <div className="flex min-h-screen flex-col bg-zinc-50 text-left font-sans text-zinc-800">
      <AnnouncementBar />
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-grow space-y-8 px-6 py-24">
        {/* Back Link */}
        <Link
          href="/blog"
          className="text-[10px] font-bold tracking-widest text-[#FF4D00] uppercase transition-colors hover:underline"
        >
          ← Back to Blog
        </Link>

        {/* Content Card container */}
        <div className="space-y-6 rounded-[24px] border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-10">
          {/* Title Block */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-[9px] font-black tracking-widest text-[#FF4D00] uppercase">
              <span>{post.category?.name || 'Products'}</span>
              <span>•</span>
              <span className="text-zinc-400">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <h1 className="text-2xl leading-tight font-light tracking-widest text-zinc-900 uppercase sm:text-4xl">
              {post.title}
            </h1>

            <div className="flex items-center space-x-3 border-t border-b border-zinc-100 py-3 text-[9px] tracking-wider text-zinc-500 uppercase">
              <span>By {authorName}</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="border-zinc-150 flex aspect-[21/9] items-center justify-center overflow-hidden rounded-2xl border bg-zinc-50 p-2">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          {/* Content Body */}
          <div
            className="prose prose-zinc text-zinc-650 max-w-none space-y-4 text-xs leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.blogTags && post.blogTags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-6">
              {post.blogTags.map((tag: SafeAny) => (
                <span
                  key={tag.id}
                  className="border-zinc-150 rounded-full border bg-zinc-50 px-3 py-1 text-[9px] font-bold tracking-wider text-zinc-500 uppercase"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="space-y-6 border-t border-zinc-200/80 pt-12">
            <h3 className="text-sm font-bold tracking-widest text-[#FF4D00] uppercase">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  className="space-y-2 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm"
                >
                  <span className="text-[8px] font-bold tracking-widest text-zinc-400 uppercase">
                    {rel.category?.name || 'Detailing'}
                  </span>
                  <Link href={`/blog/${rel.slug}`}>
                    <h4 className="line-clamp-2 text-xs leading-snug font-bold text-zinc-800 transition-colors hover:text-[#FF4D00]">
                      {rel.title}
                    </h4>
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
