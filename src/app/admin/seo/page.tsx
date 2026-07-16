/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { getAllSeoRoutesAction, saveSeoMetadataAction } from '@/features/catalog/actions/seo';
import { toast } from 'sonner';
import { Edit3, CheckCircle, Globe, Search, RefreshCw, X } from 'lucide-react';

interface SeoRouteRow {
  id: string;
  type: string;
  name: string;
  route: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  jsonLd: string;
}

export default function AdminSeoPage() {
  const [routes, setRoutes] = React.useState<SeoRouteRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Modal states
  const [editingRoute, setEditingRoute] = React.useState<SeoRouteRow | null>(null);
  const [formData, setFormData] = React.useState({
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogImage: '',
    jsonLd: '',
  });
  const [saving, setSaving] = React.useState(false);

  const fetchRoutes = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllSeoRoutesAction();
      if (res.success && res.data) {
        setRoutes(res.data);
      } else {
        toast.error(res.error?.message || 'Failed to fetch SEO routes');
      }
    } catch (err) {
      toast.error('Error fetching SEO configurations from database');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const handleEditClick = (route: SeoRouteRow) => {
    setEditingRoute(route);
    setFormData({
      metaTitle: route.metaTitle || '',
      metaDescription: route.metaDescription || '',
      canonicalUrl: route.canonicalUrl || '',
      ogImage: route.ogImage || '',
      jsonLd: route.jsonLd || '',
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute) return;

    // Validate JSON-LD
    if (formData.jsonLd) {
      try {
        JSON.parse(formData.jsonLd);
      } catch (err) {
        toast.error('Invalid JSON-LD schema format. Please verify JSON brackets.');
        return;
      }
    }

    setSaving(true);
    try {
      const res = await saveSeoMetadataAction({
        entityId: editingRoute.id,
        entityType: editingRoute.type,
        ...formData,
      });

      if (res.success) {
        toast.success(`SEO configurations updated for ${editingRoute.route}`);
        setEditingRoute(null);
        fetchRoutes();
      } else {
        toast.error(res.error?.message || 'Failed to update SEO metadata');
      }
    } catch (err) {
      toast.error('Database connection error during SEO update');
    } finally {
      setSaving(false);
    }
  };

  const filteredRoutes = React.useMemo(() => {
    return routes.filter((r) => {
      const query = searchQuery.toLowerCase();
      return (
        r.route.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query) ||
        (r.metaTitle && r.metaTitle.toLowerCase().includes(query))
      );
    });
  }, [routes, searchQuery]);

  return (
    <div className="space-y-8 text-white text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            <span>Enterprise Admin</span>
            <span>/</span>
            <span className="text-[#FF4D00]">SEO Manager</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light uppercase tracking-widest text-white mt-1">
            SEO Index & Metadata
          </h2>
        </div>

        <button
          onClick={fetchRoutes}
          className="px-4 py-2.5 bg-zinc-900 border border-white/10 hover:border-white text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer w-fit"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Scan Routes</span>
        </button>
      </div>

      <div className="flex items-center bg-[#0a0a0a] border border-white/5 rounded-2xl px-4 py-3 max-w-md">
        <Search className="h-4 w-4 text-zinc-500 mr-3" />
        <input
          type="text"
          placeholder="Search paths or page names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-0 outline-none text-xs text-white w-full placeholder-zinc-500"
        />
      </div>

      <AdminCard className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center items-center text-zinc-500 text-xs font-bold uppercase tracking-widest space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#FF4D00]" />
            <span>Retrieving SEO metadata routes...</span>
          </div>
        ) : (
          <AdminTable<SeoRouteRow>
            columns={[
              {
                key: 'route',
                label: 'Route Path',
                sortable: true,
                render: (row) => (
                  <div className="flex items-center space-x-2.5 font-mono text-zinc-300 text-xs">
                    <Globe className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{row.route}</span>
                  </div>
                ),
              },
              { key: 'name', label: 'Page Name / Reference' },
              {
                key: 'metaTitle',
                label: 'Meta Title',
                render: (row) => (
                  <span className="text-zinc-400 font-light truncate max-w-[200px] block">
                    {row.metaTitle || <span className="italic text-zinc-600">None configured</span>}
                  </span>
                ),
              },
              {
                key: 'type',
                label: 'Entity Type',
                render: (row) => (
                  <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${
                    row.type === 'PRODUCT'
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                      : row.type === 'CATEGORY'
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-500'
                        : 'bg-green-500/10 border-green-500/20 text-green-500'
                  }`}>
                    {row.type}
                  </span>
                ),
              },
              {
                key: 'id',
                label: 'Configure',
                render: (row) => (
                  <button
                    onClick={() => handleEditClick(row)}
                    className="text-[#FF4D00] hover:underline text-[10px] font-black uppercase tracking-wider flex items-center space-x-1"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Configure SEO</span>
                  </button>
                ),
              },
            ]}
            data={filteredRoutes}
            searchPlaceholder="Filter routes..."
          />
        )}
      </AdminCard>

      {/* Edit SEO Modal Overlay */}
      {editingRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center bg-black px-6 py-4 border-b border-white/5">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#FF4D00] font-black block">Configure Meta</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mt-0.5">
                  Route: {editingRoute.route}
                </h3>
              </div>
              <button
                onClick={() => setEditingRoute(null)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                    Meta Title (Recommended max 60 chars)
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleFormChange}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="Enter SEO meta title"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                    Meta Description (Recommended max 160 chars)
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs resize-none"
                    placeholder="Enter SEO meta description summary"
                  />
                </div>

                <div className="col-span-1 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    name="canonicalUrl"
                    value={formData.canonicalUrl}
                    onChange={handleFormChange}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="https://theliquidplus.com/..."
                  />
                </div>

                <div className="col-span-1 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                    OpenGraph Image URL
                  </label>
                  <input
                    type="text"
                    name="ogImage"
                    value={formData.ogImage}
                    onChange={handleFormChange}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                    JSON-LD Schema Markup (Structured Data)
                  </label>
                  <textarea
                    name="jsonLd"
                    value={formData.jsonLd}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs font-mono"
                    placeholder={`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Ceramic Spray Coating"
}`}
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingRoute(null)}
                  className="px-4 py-2.5 border border-white/10 hover:border-white text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#FF4D00]/80 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Meta'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
