'use client';

import * as React from 'react';
import { getPagesAction, updatePageAction } from '@/features/catalog/actions/cms';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminLoading } from '@/components/admin/AdminFeedbackPrimitives';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Heading1, Heading2, Heading3, Bold, Italic, Underline, List, Table, Code, Quote, Link2, Image, Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageEditProps {
  params: Promise<{ id: string }>;
}

export default function AdminCmsPagesEditPage({ params }: PageEditProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const pageId = resolvedParams.id;

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      isActive: true,
      seoTitle: '',
      seoDescription: '',
      template: 'DEFAULT',
    },
  });

  const loadPage = React.useCallback(async () => {
    try {
      const res = await getPagesAction();
      if (res.success && res.data) {
        const found = res.data.find((x) => x.id === pageId);
        if (found) {
          reset({
            title: found.title,
            slug: found.slug,
            content: found.content || '',
            isActive: found.isActive,
            seoTitle: found.seoMetadata?.metaTitle || '',
            seoDescription: found.seoMetadata?.metaDescription || '',
            template: 'DEFAULT',
          });
        } else {
          toast.error('Page not found');
          router.push('/admin/cms/pages');
        }
      }
    } catch (err) {
      toast.error('Failed to load page data');
    } finally {
      setLoading(false);
    }
  }, [pageId, reset, router]);

  React.useEffect(() => {
    loadPage();
  }, [loadPage]);

  const insertText = (before: string, after: string = '') => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end);
    const replacement = before + selectedText + after;

    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);
    setValue('content', newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
  };

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const res = await updatePageAction(pageId, values);
      if (res.success) {
        toast.success('Page updated successfully');
        router.push('/admin/cms/pages');
      } else {
        toast.error(res.error?.message || 'Failed to update page');
      }
    } catch (err) {
      toast.error('Network request failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-8 text-white text-left max-w-4xl">
      <div className="flex items-center space-x-2">
        <Link href="/admin/cms/pages" className="text-zinc-500 hover:text-white transition-all">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <AdminPageHeader
          title="Edit Static Page"
          description="Design and publish a new product catalog page or business policy page."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Body */}
          <div className="lg:col-span-2 space-y-6">
            <AdminCard className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Page Title</label>
                <input
                  type="text"
                  required
                  {...register('title')}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00] text-xs font-bold"
                  placeholder="e.g. Terms of Service"
                />
              </div>

              {/* Rich text formatting toolbar */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Page Content (HTML/Markdown Editor)</label>
                
                <div className="border border-white/10 rounded-lg overflow-hidden bg-black">
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-zinc-950 border-b border-white/10">
                    <button type="button" onClick={() => insertText('<h1>', '</h1>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="H1"><Heading1 className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => insertText('<h2>', '</h2>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="H2"><Heading2 className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => insertText('<h3>', '</h3>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="H3"><Heading3 className="h-3.5 w-3.5" /></button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    <button type="button" onClick={() => insertText('<strong>', '</strong>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Bold"><Bold className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => insertText('<em>', '</em>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Italic"><Italic className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => insertText('<u>', '</u>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Underline"><Underline className="h-3.5 w-3.5" /></button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    <button type="button" onClick={() => insertText('<ul>\n  <li>', '</li>\n</ul>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Unordered List"><List className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => insertText('<blockquote>', '</blockquote>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Blockquote"><Quote className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => insertText('<pre><code>', '</code></pre>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Code Block"><Code className="h-3.5 w-3.5" /></button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    <button type="button" onClick={() => insertText('<a href="https://">', '</a>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Link"><Link2 className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => insertText('<img src="https://" alt="', '" />')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Image"><Image className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => insertText('<iframe src="https://">', '</iframe>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Embed Video"><Play className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => insertText('<table className="w-full border-collapse">\n  <thead>\n    <tr className="border-b">\n      <th>Header</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Cell</td>\n    </tr>\n  </tbody>\n</table>')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded cursor-pointer border-0" title="Table"><Table className="h-3.5 w-3.5" /></button>
                  </div>
                  
                  <textarea
                    required
                    {...register('content')}
                    ref={(e) => {
                      register('content').ref(e);
                      (textAreaRef as any).current = e;
                    }}
                    rows={12}
                    className="w-full bg-black text-white p-4 outline-none text-xs leading-relaxed font-mono resize-y"
                    placeholder="Compose page html contents..."
                  />
                </div>
              </div>
            </AdminCard>

            {/* SEO Panel */}
            <AdminCard className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00]">SEO Optimization Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Meta Title</label>
                  <input
                    type="text"
                    {...register('seoTitle')}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="Focus Keyword title"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Meta Description</label>
                  <input
                    type="text"
                    {...register('seoDescription')}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="Brief description for search engines"
                  />
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Sidebar controls */}
          <div className="lg:col-span-1 space-y-6">
            <AdminCard className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Slug URL</label>
                <input
                  type="text"
                  required
                  {...register('slug')}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00] text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Template Layout</label>
                <select
                  {...register('template')}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none cursor-pointer text-xs"
                >
                  <option value="DEFAULT">Default Layout</option>
                  <option value="FULL_WIDTH">Full Width Grid</option>
                  <option value="LANDING">Landing Page (No Header/Footer)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Publish Status</label>
                <select
                  {...register('isActive', {
                    setValueAs: (val) => val === 'true',
                  })}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none cursor-pointer text-xs"
                >
                  <option value="true">Published</option>
                  <option value="false">Draft / Hidden</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 disabled:opacity-50 mt-2"
              >
                {submitting ? 'Updating...' : 'Save & Publish Page'}
              </button>
            </AdminCard>
          </div>

        </div>
      </form>
    </div>
  );
}
export const dynamic = 'force-dynamic';
