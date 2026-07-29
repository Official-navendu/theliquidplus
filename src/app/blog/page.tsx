import * as React from 'react';
import { db } from '@/lib/db';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Detailing Laboratory Blog | The Liquid Plus',
  description:
    'Expert ceramic coating tutorials, paint correction guides, and microfiber maintenance articles written by detailing chemists.',
  alternates: {
    canonical: 'https://theliquidplus.com/blog',
  },
};

export default async function BlogIndexPage() {
  const posts = await db.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const authorIds = posts.map((p) => p.authorId);
  const users = await db.user.findMany({
    where: { id: { in: authorIds } },
    include: { customerProfile: true },
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-left font-sans text-zinc-800">
      <AnnouncementBar />
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow space-y-12 px-6 py-24">
        {/* Header Block */}
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="block text-[10px] font-black tracking-[0.3em] text-[#FF4D00] uppercase">
            Detailing Education
          </span>
          <h1 className="text-3xl font-light tracking-widest text-zinc-900 uppercase sm:text-4xl">
            The Liquid Plus Blog
          </h1>
          <div className="mx-auto mt-2 h-[2px] w-12 bg-[#FF4D00]" />
        </div>

        {/* Hero Banner Illustration */}
        <div className="border-zinc-250/50 relative aspect-[21/9] w-full overflow-hidden rounded-[28px] border bg-zinc-200 shadow-sm">
          <Image
            src="/assets/blog-products.webp"
            alt="The Liquid Plus Premium Detailing Products"
            fill
            className="object-cover"
            priority
          />
        </div>

        {posts.length === 0 ? (
          <div className="text-zinc-550 flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-zinc-200 bg-white py-20 text-center">
            <span className="text-[10px] font-bold tracking-wider uppercase">
              No articles published yet. Stay tuned!
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {posts.map((post) => {
              const authorUser = users.find((u) => u.id === post.authorId);
              const authorName = authorUser?.customerProfile?.firstName
                ? `${authorUser.customerProfile.firstName} ${authorUser.customerProfile.lastName || ''}`.trim()
                : authorUser?.email || 'Editor';

              const excerpt = post.content
                ? post.content.replace(/<[^>]*>/g, '').substring(0, 160)
                : '';

              return (
                <div
                  key={post.id}
                  className="group border-zinc-205/60 flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:border-[#FF4D00]/40 hover:shadow-md"
                >
                  <div>
                    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-zinc-50">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-xs font-black tracking-widest text-zinc-400 uppercase">
                          The Liquid Plus
                        </span>
                      )}
                    </div>
                    <div className="space-y-3 p-6">
                      <div className="text-zinc-450 flex items-center justify-between text-[8px] font-bold tracking-widest uppercase">
                        <span>{post.category?.name || 'Products'}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-zinc-850 line-clamp-2 text-sm leading-snug font-bold transition-colors hover:text-[#FF4D00]">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="line-clamp-3 text-[10px] leading-relaxed font-light text-zinc-500">
                        {excerpt ||
                          'Read this detailing guide to improve your compounding and ceramic shield results.'}
                      </p>
                    </div>
                  </div>
                  <div className="text-zinc-450 mt-auto flex items-center justify-between border-t border-zinc-100 p-6 pt-0 text-[9px] tracking-wider uppercase">
                    <span>By {authorName}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold text-[#FF4D00] hover:underline"
                    >
                      Read Post →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
export const revalidate = 300;
