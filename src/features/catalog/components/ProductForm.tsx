'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductInput } from '../schemas/product';
import { Plus, Trash, Image as ImageIcon, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: SafeAny;
  brands: SafeAny[];
  categories: SafeAny[];
  collections: SafeAny[];
  onSubmit: (data: SafeAny) => Promise<void>;
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
        homepageCollections: [],
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
      categoryIds: initialData.productCategories?.map((c: SafeAny) => c.categoryId) || [],
      collectionIds: initialData.productCollections?.map((c: SafeAny) => c.collectionId) || [],
      images:
        initialData.images?.map((img: SafeAny) => ({
          url: img.url,
          altText: img.altText || '',
          sortOrder: img.sortOrder || 0,
        })) || [],
      variants: initialData.variants?.map((v: SafeAny) => ({
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
        attributes:
          v.variantAttributes?.map((va: SafeAny) => ({
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
      homepageCollections: initialData.homepageCollections || [],
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
    defaultValues: defaultValues as SafeAny,
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
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

  const seoDescriptionVal = watch('seoDescription');
  const seoTitleVal = watch('seoTitle');

  // SEO Score calculator placeholder
  const seoScore = React.useMemo(() => {
    let score = 0;
    const desc = seoDescriptionVal;
    const title = seoTitleVal;
    if (title && title.length > 10) score += 30;
    if (desc && desc.length > 50) score += 40;
    if (watchSlug && watchSlug.length > 3) score += 30;
    return score;
  }, [seoDescriptionVal, seoTitleVal, watchSlug]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left text-white">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-[10px] font-black tracking-[0.35em] text-[#FF4D00] uppercase">
            Enterprise Product Catalog
          </span>
          <h2 className="mt-1 text-xl font-light tracking-widest text-white uppercase sm:text-2xl">
            {initialData ? `Edit: ${initialData.title}` : 'Create New Product Product'}
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-bold tracking-wider uppercase">
          <Link
            href="/admin/products"
            className="flex items-center space-x-1.5 rounded-xl border border-white/10 px-4 py-2.5 transition-all hover:border-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel</span>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="flex cursor-pointer items-center space-x-1.5 rounded-xl border-0 bg-[#FF4D00] px-6 py-2.5 text-white transition-all hover:bg-[#E04400] disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Saving Ledger...' : 'Save Product'}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
        {/* Navigation tabs column */}
        <div className="space-y-1 rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-4 lg:col-span-1">
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
              className={`w-full cursor-pointer rounded-xl border-0 px-4 py-3 text-left text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === tab.id
                  ? 'border border-[#FF4D00]/30 bg-[#FF4D00]/10 font-black text-[#FF4D00]'
                  : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Validation errors flag */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 flex items-center space-x-2 rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-[10px] font-bold text-red-500 uppercase">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
              <span>Fix validations details before saving</span>
            </div>
          )}
        </div>

        {/* Editor Form content column */}
        <div className="space-y-6 rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-6 lg:col-span-3">
          {/* 1. GENERAL INFORMATION TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="border-b border-white/5 pb-2 text-xs font-black tracking-widest text-[#FF4D00] uppercase">
                General Product Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Product Name
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="E.g., Ultimate Nano-Shield Ceramic 9H"
                  />
                  {errors.title && (
                    <span className="text-[9px] font-bold text-red-500 uppercase">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    {...register('slug')}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="ultimate-nano-shield-ceramic-9h"
                  />
                  {errors.slug && (
                    <span className="text-[9px] font-bold text-red-500 uppercase">
                      {errors.slug.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Short Description / Summary
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                  placeholder="Enter a premium description detailing the product science, durability and application rules..."
                />
                {errors.description && (
                  <span className="text-[9px] font-bold text-red-500 uppercase">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
                <label className="flex cursor-pointer items-center space-x-2.5 rounded-xl border border-white/10 bg-black p-3.5 select-none">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="h-4 w-4 rounded border-white/10 bg-black text-[#FF4D00]"
                  />
                  <span className="text-[10px] font-bold text-zinc-300 uppercase">Featured</span>
                </label>

                <label className="flex cursor-pointer items-center space-x-2.5 rounded-xl border border-white/10 bg-black p-3.5 select-none">
                  <input
                    type="checkbox"
                    {...register('isPhysical')}
                    className="h-4 w-4 rounded border-white/10 bg-black text-[#FF4D00]"
                  />
                  <span className="text-[10px] font-bold text-zinc-300 uppercase">
                    Physical product
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* 2. MEDIA & GALLERY TAB */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <h3 className="border-b border-white/5 pb-2 text-xs font-black tracking-widest text-[#FF4D00] uppercase">
                Media & Gallery Images
              </h3>

              {/* Upload Dropzone */}
              <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-white/10 bg-black/40 p-8 text-center">
                <div className="rounded-xl border border-[#FF4D00]/20 bg-[#FF4D00]/10 p-3 text-[#FF4D00]">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">
                    Drag and drop images, or browse files
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                    Supports JPG, PNG, WEBP (up to 5MB)
                  </span>
                </div>
                <label className="cursor-pointer rounded-xl bg-[#FF4D00] px-5 py-2.5 text-[10px] font-black tracking-wider text-white uppercase transition-all select-none hover:bg-[#E04400]">
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
                <div className="rounded-xl border border-white/5 bg-black/20 py-8 text-center text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                  No images uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {watchImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative space-y-2 overflow-hidden rounded-xl border border-white/10 bg-black p-2"
                    >
                      <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-[#111]">
                        <Image
                          src={img.url}
                          alt={img.altText || ''}
                          fill
                          className="object-contain"
                          unoptimized={img.url?.startsWith('data:')}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-0 bg-red-600 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-2 left-2 rounded bg-[#FF4D00] px-2 py-0.5 text-[7px] font-black tracking-wider text-white uppercase">
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
                        className="w-full rounded-lg border border-white/10 bg-black px-2 py-1.5 text-[10px] text-white outline-none focus:border-[#FF4D00]"
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
              <h3 className="border-b border-white/5 pb-2 text-xs font-black tracking-widest text-[#FF4D00] uppercase">
                Pricing Details
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Base Price (USD)
                  </label>
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
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Compare-At Price (USD)
                  </label>
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
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Cost Price (USD)
                  </label>
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
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="0.00"
                  />
                </div>

                {/* Discount Preview */}
                {watchVariants[0]?.comparePrice &&
                  watchVariants[0]?.price < watchVariants[0]?.comparePrice && (
                    <div className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-950/20 p-4 text-xs font-bold text-green-500 uppercase">
                      <span>Discount Margin:</span>
                      <span>
                        {Math.round(
                          ((watchVariants[0].comparePrice - watchVariants[0].price) /
                            watchVariants[0].comparePrice) *
                            100,
                        )}
                        % Off
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* 4. INVENTORY & VARIANTS TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <h3 className="border-b border-white/5 pb-2 text-xs font-black tracking-widest text-[#FF4D00] uppercase">
                Inventory & SKU Products
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Default SKU
                  </label>
                  <input
                    type="text"
                    {...register('variants.0.sku')}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="LP-SHIELD-500"
                  />
                  {errors.variants?.[0]?.sku && (
                    <span className="text-[9px] font-bold text-red-500 uppercase">
                      {errors.variants[0].sku.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Barcode (UPC/EAN)
                  </label>
                  <input
                    type="text"
                    {...register('variants.0.barcode')}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="8901234567890"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    {...register('variants.0.quantity', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="0"
                  />
                </div>
              </div>

              {watchIsPhysical && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('variants.0.weight', { valueAsNumber: true })}
                      className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('variants.0.width', { valueAsNumber: true })}
                      className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('variants.0.height', { valueAsNumber: true })}
                      className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('variants.0.length', { valueAsNumber: true })}
                      className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              )}

              {/* Sub-section: Unlimited Custom Variants */}
              <div className="space-y-4 border-t border-white/5 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black tracking-wider text-zinc-400 uppercase">
                    Variants Matrix
                  </h4>
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
                    className="flex cursor-pointer items-center space-x-1 rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-[10px] font-bold tracking-wider text-white uppercase transition-all hover:border-white"
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
                          className="relative space-y-4 rounded-2xl border border-white/10 bg-black/60 p-4 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black tracking-widest text-[#FF4D00] uppercase">
                              Variant #{realIndex}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeVariant(realIndex)}
                              className="flex cursor-pointer items-center space-x-1 border-0 bg-transparent text-[10px] font-bold tracking-wider text-red-500 uppercase hover:text-red-400"
                            >
                              <Trash className="h-3.5 w-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                                SKU
                              </label>
                              <input
                                type="text"
                                {...register(`variants.${realIndex}.sku`)}
                                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                                Price (USD)
                              </label>
                              <input
                                type="number"
                                {...register(`variants.${realIndex}.price`, {
                                  valueAsNumber: true,
                                })}
                                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                                Stock
                              </label>
                              <input
                                type="number"
                                {...register(`variants.${realIndex}.quantity`, {
                                  valueAsNumber: true,
                                })}
                                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-zinc-500 uppercase">
                                Barcode
                              </label>
                              <input
                                type="text"
                                {...register(`variants.${realIndex}.barcode`)}
                                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white"
                              />
                            </div>
                          </div>

                          {/* Attributes on Variant (Size/Color/Finish) */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-bold tracking-widest text-zinc-500 uppercase">
                                Variant Options
                              </span>
                              <button
                                type="button"
                                onClick={() => addVariantAttribute(realIndex)}
                                className="cursor-pointer border-0 bg-transparent text-[8px] font-bold tracking-wider text-[#FF4D00] uppercase hover:underline"
                              >
                                + Add Option
                              </button>
                            </div>

                            {watchVariants[realIndex]?.attributes?.map((attr, aIdx) => (
                              <div
                                key={aIdx}
                                className="flex items-center space-x-3 rounded-xl border border-white/5 bg-zinc-900/50 p-2.5"
                              >
                                <select
                                  value={attr.name}
                                  onChange={(e) => {
                                    const next = [...watchVariants];
                                    next[realIndex].attributes![aIdx].name = e.target.value;
                                    setValue('variants', next);
                                  }}
                                  className="rounded-lg border border-white/10 bg-black px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase outline-none"
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
                                  className="flex-grow rounded-lg border border-white/10 bg-black px-3 py-1.5 text-xs text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeVariantAttribute(realIndex, aIdx)}
                                  className="cursor-pointer border-0 bg-transparent p-1.5 text-red-500 hover:text-red-400"
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
                  <div className="rounded-xl border border-dashed border-white/5 bg-black/10 py-6 text-center text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                    Base SKU configured. Click &quot;Add Variant&quot; to build dimensions.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. CATEGORIES & BRAND TAB */}
          {activeTab === 'metadata' && (
            <div className="space-y-6">
              <h3 className="border-b border-white/5 pb-2 text-xs font-black tracking-widest text-[#FF4D00] uppercase">
                Metadata, Brand & Category Links
              </h3>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Brand Selection */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Product Brand
                  </label>
                  <select
                    {...register('brandId')}
                    className="w-full cursor-pointer rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
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
                  <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Linked Collections
                  </label>
                  <div className="grid h-44 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-white/10 bg-black p-3">
                    {collections.map((col) => {
                      const watchColIds = watch('collectionIds') || [];
                      const isChecked = watchColIds.includes(col.id);
                      return (
                        <label
                          key={col.id}
                          className="flex cursor-pointer items-center space-x-2.5 text-xs select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const next = isChecked
                                ? watchColIds.filter((id) => id !== col.id)
                                : [...watchColIds, col.id];
                              setValue('collectionIds', next);
                            }}
                            className="h-4 w-4 cursor-pointer rounded border-white/10 bg-black text-[#FF4D00] focus:ring-0"
                          />
                          <span
                            className={isChecked ? 'font-bold text-[#FF4D00]' : 'text-zinc-300'}
                          >
                            {col.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Homepage Collection Selection */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Homepage Collection
                </label>
                <div className="flex flex-wrap gap-6 rounded-xl border border-white/10 bg-black p-4">
                  {['Curated', 'Trending Now', 'Essentials'].map((colOption) => {
                    const watchHomepageCols = watch('homepageCollections') || [];
                    const isChecked = watchHomepageCols.includes(colOption);
                    return (
                      <label
                        key={colOption}
                        className="flex cursor-pointer items-center space-x-2.5 text-xs select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const next = isChecked
                              ? watchHomepageCols.filter((val) => val !== colOption)
                              : [...watchHomepageCols, colOption];
                            setValue('homepageCollections', next);
                          }}
                          className="h-4 w-4 cursor-pointer rounded border-white/10 bg-black text-[#FF4D00] focus:ring-0"
                        />
                        <span className={isChecked ? 'font-bold text-[#FF4D00]' : 'text-zinc-300'}>
                          {colOption}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Categories Tree Multi-Select */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Product Categories
                </label>
                <div className="grid max-h-60 grid-cols-1 gap-3 overflow-y-auto rounded-xl border border-white/10 bg-black p-4 sm:grid-cols-2 md:grid-cols-3">
                  {categories.map((cat) => {
                    const watchCatIds = watch('categoryIds') || [];
                    const isChecked = watchCatIds.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className="flex cursor-pointer items-center space-x-2.5 rounded-lg border border-white/5 bg-zinc-950 p-2 text-xs select-none hover:border-white/10"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const next = isChecked
                              ? watchCatIds.filter((id) => id !== cat.id)
                              : [...watchCatIds, cat.id];
                            setValue('categoryIds', next);
                          }}
                          className="h-4 w-4 cursor-pointer rounded border-white/10 bg-black text-[#FF4D00] focus:ring-0"
                        />
                        <span className={isChecked ? 'font-bold text-[#FF4D00]' : 'text-zinc-300'}>
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
              <h3 className="border-b border-white/5 pb-2 text-xs font-black tracking-widest text-[#FF4D00] uppercase">
                SEO Optimizer & Publishing
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    {...register('seoTitle')}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="Best Ceramic Coating | The Liquid Plus"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Canonical Link URL
                  </label>
                  <input
                    type="text"
                    {...register('canonicalUrl')}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                    placeholder="https://theliquidplus.com/shop/product/coating"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Meta Description
                </label>
                <textarea
                  {...register('seoDescription')}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
                  placeholder="Enter a search engine optimized snippet describing this product..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* SEO Score Visual placeholder */}
                <div className="flex flex-col justify-center space-y-2 rounded-xl border border-white/5 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    <span>SEO Assessment Score</span>
                    <span className={seoScore >= 70 ? 'text-green-500' : 'text-amber-500'}>
                      {seoScore}/100
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className={`h-full transition-all duration-500 ${seoScore >= 70 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${seoScore}%` }}
                    />
                  </div>
                </div>

                {/* Status Options */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Visibility Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full cursor-pointer rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF4D00]"
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
