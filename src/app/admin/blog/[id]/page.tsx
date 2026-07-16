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
  const [post, setPost] = React.useState<any>(null);

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
    } catch (err) {
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
    <div className="space-y-8 text-white text-left max-w-4xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2">
          <Link href="/admin/blog" className="text-zinc-500 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <AdminPageHeader
            title={post.title}
            description={`Slug: /blog/${post.slug}`}
          />
        </div>

        <Link
          href={`/admin/blog/${post.id}/edit`}
          className="px-4 py-2 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 border-0"
        >
          <Edit3 className="h-4.5 w-4.5" />
          <span>Edit Article</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Render Preview */}
        <div className="lg:col-span-2 space-y-6">
          {post.featuredImage && (
            <AdminCard className="overflow-hidden p-0 relative h-64 bg-zinc-950 flex items-center justify-center border border-white/5">
              <img src={post.featuredImage} alt={post.title} className="max-h-full max-w-full object-contain" />
            </AdminCard>
          )}

          <AdminCard className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2 flex items-center space-x-1.5">
              <Eye className="h-4 w-4" />
              <span>Article Layout Body</span>
            </h3>
            
            <div
              className="prose prose-invert max-w-none text-zinc-300 text-xs leading-relaxed font-light p-4 bg-black border border-white/5 rounded-xl min-h-[200px]"
              dangerouslySetInnerHTML={{ __html: post.content || '<em>No article content body defined.</em>' }}
            />
          </AdminCard>
        </div>

        {/* Configurations */}
        <div className="lg:col-span-1 space-y-6">
          <AdminCard className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2 flex items-center space-x-1.5">
              <Settings className="h-4 w-4" />
              <span>Details & Metadata</span>
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Status:</span>
                <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${
                  post.status === 'PUBLISHED' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-zinc-800 border-white/5 text-zinc-500'
                }`}>
                  {post.status}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Category:</span>
                <span className="font-bold text-zinc-300">{post.category?.name || 'Uncategorized'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Author:</span>
                <span className="font-bold text-zinc-300">{post.author || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">SEO Title:</span>
                <span className="font-bold text-zinc-300">{post.seoMetadata?.metaTitle || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">SEO Description:</span>
                <span className="font-bold text-zinc-400 text-right line-clamp-2 max-w-[150px]">{post.seoMetadata?.metaDescription || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tags:</span>
                <span className="font-bold text-zinc-400 text-right">{post.tags?.join(', ') || 'None'}</span>
              </div>
            </div>
          </AdminCard>
        </div>

      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
