'use client';

import * as React from 'react';
import {
  getBlogPostsAction,
  getBlogCategoriesAction,
  updateBlogPostAction,
} from '@/features/catalog/actions/cms';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminLoading } from '@/components/admin/AdminFeedbackPrimitives';
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

interface BlogEditProps {
  params: Promise<{ id: string }>;
}

export default function AdminBlogEditPage({ params }: BlogEditProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const blogId = resolvedParams.id;

  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState<SafeAny[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'DRAFT',
      categoryId: '',
      featuredImage: '',
      publishedAt: '',
      seoTitle: '',
      seoDescription: '',
      tags: '',
      author: 'Antigravity Editor',
    },
  });

  const loadData = React.useCallback(async () => {
    try {
      const [catsRes, blogsRes] = await Promise.all([
        getBlogCategoriesAction(),
        getBlogPostsAction(),
      ]);

      if (catsRes.success && catsRes.data) {
        setCategories(catsRes.data);
      }

      if (blogsRes.success && blogsRes.data) {
        const found = blogsRes.data.find((x) => x.id === blogId);
        if (found) {
          reset({
            title: found.title,
            slug: found.slug,
            excerpt: found.excerpt || '',
            content: found.content || '',
            status: found.status,
            categoryId: found.categoryId || '',
            featuredImage: found.featuredImage || '',
            publishedAt: found.publishedAt
              ? new Date(found.publishedAt).toISOString().split('T')[0]
              : '',
            seoTitle: found.seoMetadata?.metaTitle || '',
            seoDescription: found.seoMetadata?.metaDescription || '',
            tags: found.tags?.join(', ') || '',
            author: found.author || 'Antigravity Editor',
          });
        } else {
          toast.error('Blog post not found');
          router.push('/admin/blog');
        }
      }
    } catch {
      toast.error('Failed to load blog data');
    } finally {
      setLoading(false);
    }
  }, [blogId, reset, router]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

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
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      );
    }, 10);
  };

  const onSubmit = async (values: SafeAny) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        publishedAt: values.publishedAt ? new Date(values.publishedAt) : new Date(),
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
      };

      const res = await updateBlogPostAction(blogId, payload);
      if (res.success) {
        toast.success('Blog post updated successfully');
        router.push('/admin/blog');
      } else {
        toast.error(res.error?.message || 'Failed to update blog post');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="max-w-4xl space-y-8 text-left text-white">
      <div className="flex items-center space-x-2">
        <Link href="/admin/blog" className="text-zinc-500 transition-all hover:text-white">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <AdminPageHeader
          title="Edit Blog Article"
          description="Compose a detailing product blog post and map custom SEO/OG indexing keys."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Left Columns: Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <AdminCard className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  {...register('title')}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#FF4D00]"
                  placeholder="e.g. Master the Art of Ceramic Coatings"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Short Excerpt
                </label>
                <textarea
                  {...register('excerpt')}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#FF4D00]"
                  placeholder="Summarize the article..."
                />
              </div>

              {/* Rich text Editor formatting tools */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Rich Text Article Body
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
                      title="List"
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
                      title="Embed"
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
                    placeholder="Write article HTML contents..."
                  />
                </div>
              </div>
            </AdminCard>

            {/* SEO metadata */}
            <AdminCard className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-[#FF4D00] uppercase">
                SEO & OpenGraph parameters
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Meta Title (OG Title)
                  </label>
                  <input
                    type="text"
                    {...register('seoTitle')}
                    className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="Focus SEO title"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Meta Description (OG Description)
                  </label>
                  <input
                    type="text"
                    {...register('seoDescription')}
                    className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="Google search results snippets"
                  />
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Right Column: Settings */}
          <div className="space-y-6 lg:col-span-1">
            <AdminCard className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Slug URL path
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
                  Featured Image URL
                </label>
                <input
                  type="text"
                  {...register('featuredImage')}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#FF4D00]"
                  placeholder="https://image-url"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Category
                </label>
                <select
                  {...register('categoryId')}
                  className="w-full cursor-pointer rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#FF4D00]"
                  placeholder="wax, graphene, coating"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Author Name
                </label>
                <input
                  type="text"
                  required
                  {...register('author')}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Publish Option
                </label>
                <select
                  {...register('status')}
                  className="w-full cursor-pointer rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published Live</option>
                  <option value="SCHEDULED">Scheduled Publish</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Schedule Publish Date
                </label>
                <input
                  type="date"
                  {...register('publishedAt')}
                  className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#FF4D00]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full cursor-pointer rounded-xl border-0 bg-[#FF4D00] py-2.5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-[#E04400] disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Save & Publish Article'}
              </button>
            </AdminCard>
          </div>
        </div>
      </form>
    </div>
  );
}
export const dynamic = 'force-dynamic';
