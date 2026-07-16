/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
import * as React from 'react';
import { db } from '@/lib/db';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';

export default async function BlogIndexPage() {
  const posts = await db.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  // Query authors
  const authorIds = posts.map((p) => p.authorId);
  const users = await db.user.findMany({
    where: { id: { in: authorIds } },
    include: { customerProfile: true },
  });

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans text-left">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.3em] text-[#FF4D00] uppercase font-black block">
            Detailing Education
          </span>
          <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-widest text-white">
            The Liquid Plus Blog
          </h1>
          <div className="w-12 h-[2px] bg-[#FF4D00] mx-auto mt-2" />
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 bg-black/10 rounded-2xl flex flex-col items-center justify-center space-y-3 text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">No articles published yet. Stay tuned!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => {
              const authorUser = users.find((u) => u.id === post.authorId);
              const authorName = authorUser?.customerProfile?.firstName
                ? `${authorUser.customerProfile.firstName} ${authorUser.customerProfile.lastName || ''}`.trim()
                : authorUser?.email || 'Editor';

              const excerpt = post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : '';

              return (
                <div key={post.id} className="group border border-white/5 bg-[#0a0a0a] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#FF4D00]/40 transition-all duration-300">
                  <div>
                    <div className="aspect-[16/10] bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-zinc-700 text-xs font-black tracking-widest uppercase">The Liquid Plus</span>
                      )}
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-zinc-500 font-bold">
                        <span>{post.category?.name || 'Products'}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-sm font-bold text-white hover:text-[#FF4D00] transition-colors leading-snug line-clamp-2">{post.title}</h3>
                      </Link>
                      <p className="text-zinc-500 text-[10px] leading-relaxed line-clamp-3 font-light">{excerpt || 'Read this detailing guide to improve your compounding and ceramic shield results.'}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-white/5 mt-auto flex justify-between items-center text-[9px] uppercase tracking-wider text-zinc-500">
                    <span>By {authorName}</span>
                    <Link href={`/blog/${post.slug}`} className="text-[#FF4D00] hover:underline font-bold">Read Post →</Link>
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
export const dynamic = 'force-dynamic';
