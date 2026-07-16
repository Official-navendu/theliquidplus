'use client';

import * as React from 'react';
import { getPagesAction } from '@/features/catalog/actions/cms';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminLoading } from '@/components/admin/AdminFeedbackPrimitives';
import { ArrowLeft, Edit3, Settings, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PageDetailsProps {
  params: Promise<{ id: string }>;
}

export default function AdminCmsPageDetailsPage({ params }: PageDetailsProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const pageId = resolvedParams.id;

  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState<any>(null);

  const loadPage = React.useCallback(async () => {
    try {
      const res = await getPagesAction();
      if (res.success && res.data) {
        const found = res.data.find((x) => x.id === pageId);
        if (found) {
          setPage(found);
        } else {
          toast.error('Page not found');
          router.push('/admin/cms/pages');
        }
      }
    } catch (err) {
      toast.error('Failed to load page details');
    } finally {
      setLoading(false);
    }
  }, [pageId, router]);

  React.useEffect(() => {
    loadPage();
  }, [loadPage]);

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-8 text-white text-left max-w-4xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2">
          <Link href="/admin/cms/pages" className="text-zinc-500 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <AdminPageHeader
            title={page.title}
            description={`Slug: /pages/${page.slug}`}
          />
        </div>

        <Link
          href={`/admin/cms/pages/${page.id}/edit`}
          className="px-4 py-2 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 border-0"
        >
          <Edit3 className="h-4.5 w-4.5" />
          <span>Edit Page</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Render Preview */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2 flex items-center space-x-1.5">
              <Eye className="h-4 w-4" />
              <span>Page Layout Preview</span>
            </h3>
            
            <div
              className="prose prose-invert max-w-none text-zinc-300 text-xs leading-relaxed font-light p-4 bg-black border border-white/5 rounded-xl min-h-[200px]"
              dangerouslySetInnerHTML={{ __html: page.content || '<em>No page content layout defined.</em>' }}
            />
          </AdminCard>
        </div>

        {/* Configurations */}
        <div className="lg:col-span-1 space-y-6">
          <AdminCard className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2 flex items-center space-x-1.5">
              <Settings className="h-4 w-4" />
              <span>Configurations</span>
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Status:</span>
                <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${page.isActive ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-zinc-800 border-white/5 text-zinc-500'}`}>
                  {page.isActive ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Layout Option:</span>
                <span className="font-bold text-zinc-300 font-mono">DEFAULT</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">SEO Title:</span>
                <span className="font-bold text-zinc-300">{page.seoMetadata?.metaTitle || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">SEO Description:</span>
                <span className="font-bold text-zinc-400 text-right line-clamp-2 max-w-[150px]">{page.seoMetadata?.metaDescription || 'N/A'}</span>
              </div>
            </div>
          </AdminCard>
        </div>

      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
