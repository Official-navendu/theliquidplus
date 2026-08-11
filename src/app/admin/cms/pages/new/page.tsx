'use client';

import * as React from 'react';
import { createPageAction } from '@/features/catalog/actions/cms';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  List,
  Table,
  Code,
  Quote,
  Link2,
  Image,
  Play,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCmsPagesNewPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const { register, handleSubmit, setValue, watch } = useForm({
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

  const watchTitle = watch('title');
  React.useEffect(() => {
    if (watchTitle) {
      setValue(
        'slug',
        watchTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      );
    }
  }, [watchTitle, setValue]);

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

    // Refocus & reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      );
    }, 10);
  };

  const onSubmit = async (values: SafeAny) => {
    setSubmitting(true);
    try {
      const res = await createPageAction(values);
      if (res.success) {
        toast.success('Static page created successfully');
        router.push('/admin/cms/pages');
      } else {
        toast.error(res.error?.message || 'Failed to create page');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 text-left text-white">
      <div className="flex items-center space-x-2">
        <Link href="/admin/cms/pages" className="text-zinc-500 transition-all hover:text-white">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <AdminPageHeader
          title="New Static Page"
          description="Design and publish a new product catalog page or business policy page."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Main Body */}
          <div className="space-y-6 lg:col-span-2">
            <AdminCard className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  {...register('title')}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF4D00]"
                  placeholder="e.g. Terms of Service"
                />
              </div>

              {/* Rich text formatting toolbar */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Page Content (HTML/Markdown Editor)
                </label>

                <div className="overflow-hidden rounded-lg border border-white/10 bg-black">
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 bg-zinc-950 p-2">
                    <button
                      type="button"
                      onClick={() => insertText('<h1>', '</h1>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="H1"
                    >
                      <Heading1 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('<h2>', '</h2>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="H2"
                    >
                      <Heading2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('<h3>', '</h3>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="H3"
                    >
                      <Heading3 className="h-3.5 w-3.5" />
                    </button>
                    <div className="mx-1 h-4 w-[1px] bg-white/10" />
                    <button
                      type="button"
                      onClick={() => insertText('<strong>', '</strong>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Bold"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('<em>', '</em>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Italic"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('<u>', '</u>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Underline"
                    >
                      <Underline className="h-3.5 w-3.5" />
                    </button>
                    <div className="mx-1 h-4 w-[1px] bg-white/10" />
                    <button
                      type="button"
                      onClick={() => insertText('<ul>\n  <li>', '</li>\n</ul>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Unordered List"
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('<blockquote>', '</blockquote>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Blockquote"
                    >
                      <Quote className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('<pre><code>', '</code></pre>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Code Block"
                    >
                      <Code className="h-3.5 w-3.5" />
                    </button>
                    <div className="mx-1 h-4 w-[1px] bg-white/10" />
                    <button
                      type="button"
                      onClick={() => insertText('<a href="https://">', '</a>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Link"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('<img src="https://" alt="', '" />')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Image"
                    >
                      <Image className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('<iframe src="https://">', '</iframe>')}
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Embed Video"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertText(
                          '<table className="w-full border-collapse">\n  <thead>\n    <tr className="border-b">\n      <th>Header</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Cell</td>\n    </tr>\n  </tbody>\n</table>',
                        )
                      }
                      className="cursor-pointer rounded border-0 p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Table"
                    >
                      <Table className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <textarea
                    required
                    {...register('content')}
                    ref={(e) => {
                      register('content').ref(e);
                      (textAreaRef as SafeAny).current = e;
                    }}
                    rows={12}
                    className="w-full resize-y bg-black p-4 font-mono text-xs leading-relaxed text-white outline-none"
                    placeholder="Compose page html contents..."
                  />
                </div>
              </div>
            </AdminCard>

            {/* SEO Panel */}
            <AdminCard className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-[#FF4D00] uppercase">
                SEO Optimization Metadata
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    {...register('seoTitle')}
                    className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="Focus Keyword title"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    {...register('seoDescription')}
                    className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="Brief description for search engines"
                  />
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Sidebar controls */}
          <div className="space-y-6 lg:col-span-1">
            <AdminCard className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Slug URL
                </label>
                <input
                  type="text"
                  required
                  {...register('slug')}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-xs font-bold text-white outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Template Layout
                </label>
                <select
                  {...register('template')}
                  className="w-full cursor-pointer rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="DEFAULT">Default Layout</option>
                  <option value="FULL_WIDTH">Full Width Grid</option>
                  <option value="LANDING">Landing Page (No Header/Footer)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Publish Status
                </label>
                <select
                  {...register('isActive', {
                    setValueAs: (val) => val === 'true',
                  })}
                  className="w-full cursor-pointer rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="true">Published</option>
                  <option value="false">Draft / Hidden</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full cursor-pointer rounded-xl border-0 bg-[#FF4D00] py-2.5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-[#E04400] disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Save & Publish Page'}
              </button>
            </AdminCard>
          </div>
        </div>
      </form>
    </div>
  );
}
export const dynamic = 'force-dynamic';
