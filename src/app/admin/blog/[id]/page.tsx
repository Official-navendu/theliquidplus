'use client';

import * as React from 'react';
import { getBlogPostsAction } from '@/features/catalog/actions/cms';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminLoading } from '@/components/admin/AdminFeedbackPrimitives';
import { ArrowLeft, Edit3, Settings, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface BlogDetailsProps {
  params: Promise<{ id: string }>;
}

export default function AdminBlogDetailsPage({ params }: BlogDetailsProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const blogId = resolvedParams.id;

  const [loading, setLoading] = React.useState(true);
  const [post, setPost] = React.useState<SafeAny>(null);

  const loadPost = React.useCallback(async () => {
    try {
      const res = await getBlogPostsAction();
      if (res.success && res.data) {
        const found = res.data.find((x) => x.id === blogId);
        if (found) {
          setPost(found);
        } else {
          toast.error('Blog post not found');
          router.push('/admin/blog');
        }
      }
    } catch {
      toast.error('Failed to load blog post details');
    } finally {
      setLoading(false);
    }
  }, [blogId, router]);

  React.useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="max-w-4xl space-y-8 text-left text-white">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2">
          <Link href="/admin/blog" className="text-zinc-500 transition-all hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <AdminPageHeader title={post.title} description={`Slug: /blog/${post.slug}`} />
        </div>

        <Link
          href={`/admin/blog/${post.id}/edit`}
          className="flex items-center space-x-1.5 rounded-xl border-0 bg-[#FF4D00] px-4 py-2 text-[10px] font-bold tracking-wider text-white uppercase transition-all hover:bg-[#E04400]"
        >
          <Edit3 className="h-4.5 w-4.5" />
          <span>Edit Article</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Render Preview */}
        <div className="space-y-6 lg:col-span-2">
          {post.featuredImage && (
            <AdminCard className="relative flex h-64 items-center justify-center overflow-hidden border border-white/5 bg-zinc-950 p-0">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="max-h-full max-w-full object-contain"
              />
            </AdminCard>
          )}

          <AdminCard className="space-y-4">
            <h3 className="flex items-center space-x-1.5 border-b border-white/5 pb-2 text-xs font-black tracking-widest text-[#FF4D00] uppercase">
              <Eye className="h-4 w-4" />
              <span>Article Layout Body</span>
            </h3>

            <div
              className="prose prose-invert min-h-[200px] max-w-none rounded-xl border border-white/5 bg-black p-4 text-xs leading-relaxed font-light text-zinc-300"
              dangerouslySetInnerHTML={{
                __html: post.content || '<em>No article content body defined.</em>',
              }}
            />
          </AdminCard>
        </div>

        {/* Configurations */}
        <div className="space-y-6 lg:col-span-1">
          <AdminCard className="space-y-4">
            <h3 className="flex items-center space-x-1.5 border-b border-white/5 pb-2 text-xs font-black tracking-widest text-[#FF4D00] uppercase">
              <Settings className="h-4 w-4" />
              <span>Details & Metadata</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Status:</span>
                <span
                  className={`rounded-[3px] border px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${
                    post.status === 'PUBLISHED'
                      ? 'border-green-500/20 bg-green-500/10 text-green-500'
                      : 'border-white/5 bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {post.status}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Category:</span>
                <span className="font-bold text-zinc-300">
                  {post.category?.name || 'Uncategorized'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Author:</span>
                <span className="font-bold text-zinc-300">{post.author || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">SEO Title:</span>
                <span className="font-bold text-zinc-300">
                  {post.seoMetadata?.metaTitle || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">SEO Description:</span>
                <span className="line-clamp-2 max-w-[150px] text-right font-bold text-zinc-400">
                  {post.seoMetadata?.metaDescription || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tags:</span>
                <span className="text-right font-bold text-zinc-400">
                  {post.tags?.join(', ') || 'None'}
                </span>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
