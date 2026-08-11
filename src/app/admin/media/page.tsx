'use client';

import * as React from 'react';
import {
  getMediaImagesAction,
  addMediaImageAction,
  deleteMediaImageAction,
} from '@/features/catalog/actions/media';
import { AdminPageHeader } from '@/components/admin/AdminLayoutPrimitives';
import { Image as ImageIcon, Upload, Copy, Trash, Check, FileCode } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMediaPage() {
  const [images, setImages] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  const loadMedia = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMediaImagesAction();
      if (res.success && res.data) {
        setImages(res.data);
      } else {
        toast.error(res.error?.message || 'Failed to query media asset list');
      }
    } catch {
      toast.error('Failed to communicate with media server action');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const readPromise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const base64Url = await readPromise;
        const res = await addMediaImageAction(base64Url);
        if (res.success) {
          toast.success(`Asset "${file.name}" uploaded successfully`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
      loadMedia();
    } catch {
      toast.error('Failed to upload file assets');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('Asset URL copied to clipboard');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (url: string) => {
    try {
      const res = await deleteMediaImageAction(url);
      if (res.success) {
        toast.success('Asset deleted from media library');
        loadMedia();
      } else {
        toast.error(res.error?.message || 'Failed to delete asset');
      }
    } catch {
      toast.error('Failed to submit asset deletion');
    }
  };

  return (
    <div className="space-y-8 text-left text-white">
      <AdminPageHeader
        title="CRM Asset & Media Library"
        description="Upload product images, brand marks, banners, and detailing demonstration videos."
        actions={
          <label className="flex cursor-pointer items-center space-x-1.5 rounded-xl border-0 bg-[#FF4D00] px-5 py-2.5 text-[10px] font-bold tracking-wider text-white uppercase transition-all select-none hover:bg-[#E04400]">
            <Upload className="h-4 w-4" />
            <span>Upload Assets</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        }
      />

      {uploading && (
        <div className="flex items-center justify-center space-x-2 rounded-2xl border border-white/5 bg-zinc-950 p-4 text-xs text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF4D00] border-t-transparent" />
          <span>Processing asset upload...</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="h-40 animate-pulse rounded-2xl border border-white/5 bg-zinc-900"
            />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-white/10 bg-black/10 py-20 text-center text-zinc-500">
          <ImageIcon className="h-10 w-10 text-zinc-600" />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            No media assets in store catalog. Drag or upload files to save.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a]"
            >
              {/* Image Preview */}
              <div className="relative flex h-32 w-full items-center justify-center overflow-hidden bg-[#111] p-2">
                <img
                  src={url}
                  alt={`Asset ${idx}`}
                  className="max-h-full max-w-full object-contain"
                />

                {/* Actions overlay */}
                <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/85 opacity-0 transition-all group-hover:opacity-100">
                  <button
                    onClick={() => handleCopy(url)}
                    className="cursor-pointer rounded-lg border border-white/10 bg-zinc-900 p-2 text-zinc-400 transition-all hover:border-white hover:text-white"
                    title="Copy URL"
                  >
                    {copiedUrl === url ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(url)}
                    className="cursor-pointer rounded-lg border border-white/10 bg-zinc-900 p-2 text-zinc-400 transition-all hover:border-red-500 hover:text-red-500"
                    title="Delete Image"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* URL String clip */}
              <div className="flex items-center justify-between border-t border-white/5 bg-black p-2 font-mono text-[8px] text-zinc-500">
                <span className="max-w-[100px] truncate">{url}</span>
                <FileCode className="ml-1.5 h-3.5 w-3.5 flex-shrink-0 text-zinc-600" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
