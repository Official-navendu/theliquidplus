'use client';

import * as React from 'react';
import { getMediaImagesAction, addMediaImageAction, deleteMediaImageAction } from '@/features/catalog/actions/media';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      toast.error('Failed to submit asset deletion');
    }
  };

  return (
    <div className="space-y-8 text-white text-left">
      <AdminPageHeader
        title="CRM Asset & Media Library"
        description="Upload product images, brand marks, banners, and detailing demonstration videos."
        actions={
          <label className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer border-0 select-none">
            <Upload className="h-4 w-4" />
            <span>Upload Assets</span>
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        }
      />

      {uploading && (
        <div className="p-4 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center space-x-2 text-xs text-zinc-400">
          <div className="h-4 w-4 border-2 border-t-transparent border-[#FF4D00] animate-spin rounded-full" />
          <span>Processing asset upload...</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="h-40 bg-zinc-900 border border-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 bg-black/10 rounded-2xl flex flex-col items-center justify-center space-y-3 text-zinc-500">
          <ImageIcon className="h-10 w-10 text-zinc-600" />
          <span className="text-[10px] uppercase font-bold tracking-wider">No media assets in store catalog. Drag or upload files to save.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {images.map((url, idx) => (
            <div key={idx} className="group relative border border-white/5 bg-[#0a0a0a] rounded-2xl overflow-hidden flex flex-col justify-between">
              
              {/* Image Preview */}
              <div className="h-32 w-full relative bg-[#111] overflow-hidden flex items-center justify-center p-2">
                <img src={url} alt={`Asset ${idx}`} className="max-h-full max-w-full object-contain" />
                
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleCopy(url)}
                    className="p-2 bg-zinc-900 border border-white/10 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedUrl === url ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(url)}
                    className="p-2 bg-zinc-900 border border-white/10 hover:border-red-500 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                    title="Delete Image"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* URL String clip */}
              <div className="p-2 border-t border-white/5 bg-black flex justify-between items-center text-[8px] font-mono text-zinc-500">
                <span className="truncate max-w-[100px]">{url}</span>
                <FileCode className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0 ml-1.5" />
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
