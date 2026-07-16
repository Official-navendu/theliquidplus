/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductInput } from '../schemas/product';
import { Plus, Trash, Image as ImageIcon, Sparkles, AlertTriangle, Eye, ArrowLeft, ArrowUpRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  initialData?: any;
  brands: any[];
  categories: any[];
  collections: any[];
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

export function ProductForm({
  initialData,
  brands,
  categories,
  collections,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const [activeTab, setActiveTab] = React.useState('general');
  const [uploading, setUploading] = React.useState(false);

  // Normalize initial data if editing
  const defaultValues = React.useMemo(() => {
    if (!initialData) {
      return {
        title: '',
        slug: '',
        description: '',
        status: 'ACTIVE',
        isFeatured: false,
        isPhysical: true,
        brandId: '',
        categoryIds: [],
        collectionIds: [],
        images: [],
        variants: [
          {
            sku: '',
            barcode: '',
            price: 0,
            comparePrice: null,
            costPrice: null,
            quantity: 0,
            weight: null,
            width: null,
            height: null,
            length: null,
            isActive: true,
            attributes: [],
          },
        ],
        seoTitle: '',
        seoDescription: '',
        canonicalUrl: '',
        ogImage: '',
      };
    }

    return {
      title: initialData.title || '',
      slug: initialData.slug || '',
      description: initialData.description || '',
      status: initialData.status || 'ACTIVE',
      isFeatured: initialData.isFeatured || false,
      isPhysical: initialData.isPhysical !== undefined ? initialData.isPhysical : true,
      brandId: initialData.brandId || '',
      categoryIds: initialData.productCategories?.map((c: any) => c.categoryId) || [],
      collectionIds: initialData.productCollections?.map((c: any) => c.collectionId) || [],
      images: initialData.images?.map((img: any) => ({
        url: img.url,
        altText: img.altText || '',
        sortOrder: img.sortOrder || 0,
      })) || [],
      variants: initialData.variants?.map((v: any) => ({
        id: v.id,
        sku: v.sku || '',
        barcode: v.barcode || '',
        price: Number(v.price) || 0,
        comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
        costPrice: v.costPrice ? Number(v.costPrice) : null,
        quantity: v.inventoryItem?.quantity || 0,
        weight: v.weight ? Number(v.weight) : null,
        width: v.width ? Number(v.width) : null,
        height: v.height ? Number(v.height) : null,
        length: v.length ? Number(v.length) : null,
        isActive: v.isActive !== undefined ? v.isActive : true,
        attributes: v.variantAttributes?.map((va: any) => ({
          name: va.attributeValue?.attribute?.name || '',
          value: va.attributeValue?.value || '',
        })) || [],
      })) || [
        {
          sku: '',
          barcode: '',
          price: 0,
          comparePrice: null,
          costPrice: null,
          quantity: 0,
          weight: null,
          width: null,
          height: null,
          length: null,
          isActive: true,
          attributes: [],
        },
      ],
      seoTitle: initialData.seo?.metaTitle || '',
      seoDescription: initialData.seo?.metaDescription || '',
      canonicalUrl: initialData.seo?.canonicalUrl || '',
      ogImage: initialData.seo?.ogImage || '',
    };
  }, [initialData]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues as any,
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  const watchTitle = watch('title');
  const watchSlug = watch('slug');
  const watchImages = watch('images') || [];
  const watchVariants = watch('variants') || [];
  const watchIsPhysical = watch('isPhysical');

  // Auto-generate slug from title
  React.useEffect(() => {
    if (watchTitle && !initialData) {
      const generated = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generated);
    }
  }, [watchTitle, setValue, initialData]);

  // Handle local image drop / select simulation
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages = [...watchImages];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const base64Data = await base64Promise;
        // Simulating upload/secure URL
        newImages.push({
          url: base64Data,
          altText: file.name.split('.')[0],
          sortOrder: newImages.length,
        });
      }
      setValue('images', newImages);
    } catch (err) {
      console.error('Image loading failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const next = [...watchImages];
    next.splice(index, 1);
    setValue('images', next);
  };

  const addVariantAttribute = (vIndex: number) => {
    const currentVariants = [...watchVariants];
    const currentAttributes = currentVariants[vIndex].attributes || [];
    currentVariants[vIndex].attributes = [...currentAttributes, { name: 'Size', value: '' }];
    setValue('variants', currentVariants);
  };

  const removeVariantAttribute = (vIndex: number, aIndex: number) => {
    const currentVariants = [...watchVariants];
    const currentAttributes = [...(currentVariants[vIndex].attributes || [])];
    currentAttributes.splice(aIndex, 1);
    currentVariants[vIndex].attributes = currentAttributes;
    setValue('variants', currentVariants);
  };

  // SEO Score calculator placeholder
  const seoScore = React.useMemo(() => {
    let score = 0;
    const desc = watch('seoDescription');
    const title = watch('seoTitle');
    if (title && title.length > 10) score += 30;
    if (desc && desc.length > 50) score += 40;
    if (watchSlug && watchSlug.length > 3) score += 30;
    return score;
  }, [watch('seoDescription'), watch('seoTitle'), watchSlug]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-white text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-[0.35em] text-[#FF4D00] uppercase font-black">
            Enterprise Product Catalog
          </span>
          <h2 className="text-xl sm:text-2xl font-light uppercase tracking-widest text-white mt-1">
            {initialData ? `Edit: ${initialData.title}` : 'Create New Product Product'}
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 border border-white/10 hover:border-white rounded-xl transition-all flex items-center space-x-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel</span>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="px-6 py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white rounded-xl transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer border-0"
          >
            <span>{isSubmitting ? 'Saving Ledger...' : 'Save Product'}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Navigation tabs column */}
        <div className="lg:col-span-1 border border-white/5 bg-[#0a0a0a]/80 rounded-2xl p-4 space-y-1">
          {[
            { id: 'general', label: 'General Information' },
            { id: 'media', label: 'Media & Gallery' },
            { id: 'pricing', label: 'Pricing details' },
            { id: 'inventory', label: 'Inventory & Variants' },
            { id: 'metadata', label: 'Categories & Brand' },
            { id: 'seo', label: 'SEO & Visibility' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all border-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FF4D00]/10 border border-[#FF4D00]/30 text-[#FF4D00] font-black'
                  : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Validation errors flag */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-3 bg-red-950/20 border border-red-500/30 rounded-xl flex items-center space-x-2 text-[10px] text-red-500 font-bold uppercase">
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span>Fix validations details before saving</span>
            </div>
          )}
        </div>

        {/* Editor Form content column */}
        <div className="lg:col-span-3 border border-white/5 bg-[#0a0a0a]/80 p-6 rounded-2xl space-y-6">
          
          {/* 1. GENERAL INFORMATION TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
                General Product Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Product Name</label>
                  <input
                    type="text"
                    {...register('title')}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="E.g., Ultimate Nano-Shield Ceramic 9H"
                  />
                  {errors.title && <span className="text-[9px] text-red-500 uppercase font-bold">{errors.title.message}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Slug URL</label>
                  <input
                    type="text"
                    {...register('slug')}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="ultimate-nano-shield-ceramic-9h"
                  />
                  {errors.slug && <span className="text-[9px] text-red-500 uppercase font-bold">{errors.slug.message}</span>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Short Description / Summary</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs resize-none"
                  placeholder="Enter a premium description detailing the product science, durability and application rules..."
                />
                {errors.description && <span className="text-[9px] text-red-500 uppercase font-bold">{errors.description.message}</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <label className="flex items-center space-x-2.5 p-3.5 bg-black border border-white/10 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="h-4 w-4 rounded bg-black border-white/10 text-[#FF4D00]"
                  />
                  <span className="text-[10px] uppercase font-bold text-zinc-300">Featured</span>
                </label>

                <label className="flex items-center space-x-2.5 p-3.5 bg-black border border-white/10 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('isPhysical')}
                    className="h-4 w-4 rounded bg-black border-white/10 text-[#FF4D00]"
                  />
                  <span className="text-[10px] uppercase font-bold text-zinc-300">Physical product</span>
                </label>
              </div>
            </div>
          )}

          {/* 2. MEDIA & GALLERY TAB */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
                Media & Gallery Images
              </h3>

              {/* Upload Dropzone */}
              <div className="border border-dashed border-white/10 bg-black/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-3 bg-[#FF4D00]/10 border border-[#FF4D00]/20 rounded-xl text-[#FF4D00]">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Drag and drop images, or browse files</span>
                  <span className="text-[10px] text-zinc-500 block mt-1 uppercase tracking-wider font-semibold">Supports JPG, PNG, WEBP (up to 5MB)</span>
                </div>
                <label className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] uppercase font-black tracking-wider rounded-xl transition-all cursor-pointer select-none">
                  <span>Browse Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Gallery Grid */}
              {watchImages.length === 0 ? (
                <div className="py-8 text-center border border-white/5 bg-black/20 rounded-xl text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                  No images uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {watchImages.map((img, idx) => (
                    <div key={idx} className="group border border-white/10 bg-black rounded-xl p-2 relative overflow-hidden space-y-2">
                      <div className="h-32 w-full relative bg-[#111] rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={img.url} alt={img.altText || ''} className="h-full w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white h-7 w-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border-0 cursor-pointer"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-2 left-2 bg-[#FF4D00] text-white text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Alt text description"
                        value={img.altText || ''}
                        onChange={(e) => {
                          const next = [...watchImages];
                          next[idx].altText = e.target.value;
                          setValue('images', next);
                        }}
                        className="w-full bg-black border border-white/10 text-white px-2 py-1.5 rounded-lg outline-none focus:border-[#FF4D00] text-[10px]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. PRICING TAB */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
                Pricing Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Base Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={watchVariants[0]?.price || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const next = [...watchVariants];
                      if (next[0]) {
                        next[0].price = val;
                        setValue('variants', next);
                      }
                    }}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Compare-At Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={watchVariants[0]?.comparePrice || ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseFloat(e.target.value) : null;
                      const next = [...watchVariants];
                      if (next[0]) {
                        next[0].comparePrice = val;
                        setValue('variants', next);
                      }
                    }}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Cost Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={watchVariants[0]?.costPrice || ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseFloat(e.target.value) : null;
                      const next = [...watchVariants];
                      if (next[0]) {
                        next[0].costPrice = val;
                        setValue('variants', next);
                      }
                    }}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="0.00"
                  />
                </div>

                {/* Discount Preview */}
                {watchVariants[0]?.comparePrice && watchVariants[0]?.price < watchVariants[0]?.comparePrice && (
                  <div className="p-4 bg-green-950/20 border border-green-500/20 rounded-xl flex items-center justify-between text-xs text-green-500 font-bold uppercase">
                    <span>Discount Margin:</span>
                    <span>
                      {Math.round(((watchVariants[0].comparePrice - watchVariants[0].price) / watchVariants[0].comparePrice) * 100)}% Off
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. INVENTORY & VARIANTS TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
                Inventory & SKU Products
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Default SKU</label>
                  <input
                    type="text"
                    {...register('variants.0.sku')}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="LP-SHIELD-500"
                  />
                  {errors.variants?.[0]?.sku && <span className="text-[9px] text-red-500 uppercase font-bold">{errors.variants[0].sku.message}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Barcode (UPC/EAN)</label>
                  <input
                    type="text"
                    {...register('variants.0.barcode')}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="8901234567890"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Stock Quantity</label>
                  <input
                    type="number"
                    {...register('variants.0.quantity', { valueAsNumber: true })}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="0"
                  />
                </div>
              </div>

              {watchIsPhysical && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('variants.0.weight', { valueAsNumber: true })}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none text-xs"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Width (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('variants.0.width', { valueAsNumber: true })}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none text-xs"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('variants.0.height', { valueAsNumber: true })}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none text-xs"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Length (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('variants.0.length', { valueAsNumber: true })}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none text-xs"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              )}

              {/* Sub-section: Unlimited Custom Variants */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-black">Variants Matrix</h4>
                  <button
                    type="button"
                    onClick={() =>
                      appendVariant({
                        sku: `${watchVariants[0]?.sku || 'LP'}-V${variantFields.length}`,
                        barcode: '',
                        price: watchVariants[0]?.price || 0,
                        comparePrice: null,
                        costPrice: null,
                        quantity: 0,
                        weight: null,
                        width: null,
                        height: null,
                        length: null,
                        isActive: true,
                        attributes: [],
                      })
                    }
                    className="px-3.5 py-2 bg-zinc-900 border border-white/10 hover:border-white text-white text-[10px] uppercase tracking-wider font-bold rounded-xl flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Variant</span>
                  </button>
                </div>

                {variantFields.length > 1 ? (
                  <div className="space-y-4">
                    {variantFields.slice(1).map((field, idx) => {
                      const realIndex = idx + 1;
                      return (
                        <div
                          key={field.id}
                          className="p-4 border border-white/10 bg-black/60 rounded-2xl relative space-y-4 text-left"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-widest text-[#FF4D00] font-black">
                              Variant #{realIndex}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeVariant(realIndex)}
                              className="text-red-500 hover:text-red-400 text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1 cursor-pointer bg-transparent border-0"
                            >
                              <Trash className="h-3.5 w-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-500 uppercase font-bold">SKU</label>
                              <input
                                type="text"
                                {...register(`variants.${realIndex}.sku`)}
                                className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-500 uppercase font-bold">Price (USD)</label>
                              <input
                                type="number"
                                {...register(`variants.${realIndex}.price`, { valueAsNumber: true })}
                                className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-500 uppercase font-bold">Stock</label>
                              <input
                                type="number"
                                {...register(`variants.${realIndex}.quantity`, { valueAsNumber: true })}
                                className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-500 uppercase font-bold">Barcode</label>
                              <input
                                type="text"
                                {...register(`variants.${realIndex}.barcode`)}
                                className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg text-xs"
                              />
                            </div>
                          </div>

                          {/* Attributes on Variant (Size/Color/Finish) */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Variant Options</span>
                              <button
                                type="button"
                                onClick={() => addVariantAttribute(realIndex)}
                                className="text-[8px] uppercase tracking-wider text-[#FF4D00] font-bold hover:underline cursor-pointer bg-transparent border-0"
                              >
                                + Add Option
                              </button>
                            </div>

                            {watchVariants[realIndex]?.attributes?.map((attr, aIdx) => (
                              <div key={aIdx} className="flex items-center space-x-3 bg-zinc-900/50 p-2.5 rounded-xl border border-white/5">
                                <select
                                  value={attr.name}
                                  onChange={(e) => {
                                    const next = [...watchVariants];
                                    next[realIndex].attributes![aIdx].name = e.target.value;
                                    setValue('variants', next);
                                  }}
                                  className="bg-black border border-white/10 text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider outline-none"
                                >
                                  <option value="Size">Size</option>
                                  <option value="Color">Color</option>
                                  <option value="Material">Material</option>
                                  <option value="Capacity">Capacity</option>
                                  <option value="Finish">Finish</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="Option value (e.g. 500ml, Matte, Carbon)"
                                  value={attr.value}
                                  onChange={(e) => {
                                    const next = [...watchVariants];
                                    next[realIndex].attributes![aIdx].value = e.target.value;
                                    setValue('variants', next);
                                  }}
                                  className="flex-grow bg-black border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeVariantAttribute(realIndex, aIdx)}
                                  className="text-red-500 hover:text-red-400 p-1.5 bg-transparent border-0 cursor-pointer"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center border border-dashed border-white/5 bg-black/10 rounded-xl text-[9px] uppercase tracking-wider font-bold text-zinc-500">
                    Base SKU configured. Click &quot;Add Variant&quot; to build dimensions.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. CATEGORIES & BRAND TAB */}
          {activeTab === 'metadata' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
                Metadata, Brand & Category Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Brand Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                    Product Brand
                  </label>
                  <select
                    {...register('brandId')}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs cursor-pointer"
                  >
                    <option value="">No Brand Linked</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Collections Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                    Linked Collections
                  </label>
                  <div className="grid grid-cols-1 gap-2 p-3 bg-black border border-white/10 rounded-xl h-44 overflow-y-auto">
                    {collections.map((col) => {
                      const watchColIds = watch('collectionIds') || [];
                      const isChecked = watchColIds.includes(col.id);
                      return (
                        <label key={col.id} className="flex items-center space-x-2.5 cursor-pointer text-xs select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const next = isChecked
                                ? watchColIds.filter((id) => id !== col.id)
                                : [...watchColIds, col.id];
                              setValue('collectionIds', next);
                            }}
                            className="h-4 w-4 rounded bg-black border-white/10 text-[#FF4D00] focus:ring-0 cursor-pointer"
                          />
                          <span className={isChecked ? 'text-[#FF4D00] font-bold' : 'text-zinc-300'}>
                            {col.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Categories Tree Multi-Select */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                  Product Categories
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-black border border-white/10 rounded-xl max-h-60 overflow-y-auto">
                  {categories.map((cat) => {
                    const watchCatIds = watch('categoryIds') || [];
                    const isChecked = watchCatIds.includes(cat.id);
                    return (
                      <label key={cat.id} className="flex items-center space-x-2.5 cursor-pointer text-xs select-none p-2 bg-zinc-950 rounded-lg border border-white/5 hover:border-white/10">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const next = isChecked
                              ? watchCatIds.filter((id) => id !== cat.id)
                              : [...watchCatIds, cat.id];
                            setValue('categoryIds', next);
                          }}
                          className="h-4 w-4 rounded bg-black border-white/10 text-[#FF4D00] focus:ring-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'text-[#FF4D00] font-bold' : 'text-zinc-300'}>
                          {cat.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 6. SEO & VISIBILITY TAB */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
                SEO Optimizer & Publishing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">SEO Title</label>
                  <input
                    type="text"
                    {...register('seoTitle')}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="Best Ceramic Coating | The Liquid Plus"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Canonical Link URL</label>
                  <input
                    type="text"
                    {...register('canonicalUrl')}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs"
                    placeholder="https://theliquidplus.com/shop/product/coating"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Meta Description</label>
                <textarea
                  {...register('seoDescription')}
                  rows={3}
                  className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs resize-none"
                  placeholder="Enter a search engine optimized snippet describing this product..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SEO Score Visual placeholder */}
                <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 space-y-2 flex flex-col justify-center">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <span>SEO Assessment Score</span>
                    <span className={seoScore >= 70 ? 'text-green-500' : 'text-amber-500'}>{seoScore}/100</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${seoScore >= 70 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${seoScore}%` }}
                    />
                  </div>
                </div>

                {/* Status Options */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                    Visibility Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl outline-none focus:border-[#FF4D00] text-xs cursor-pointer"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="REVIEW">In Review</option>
                    <option value="ACTIVE">Published (Active)</option>
                    <option value="ARCHIVED">Archived (Soft Deleted)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </form>
  );
}
export default ProductForm;
