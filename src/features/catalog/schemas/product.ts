import { z } from 'zod';

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional().nullable(),
  price: z.number().min(0, 'Price must be non-negative'),
  comparePrice: z.number().min(0, 'Compare price must be non-negative').optional().nullable(),
  costPrice: z.number().min(0, 'Cost price must be non-negative').optional().nullable(),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  weight: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  length: z.number().optional().nullable(),
  isActive: z.boolean(),
  attributes: z
    .array(
      z.object({
        name: z.string(), // e.g. Size, Color
        value: z.string(), // e.g. 500ml, Red
      }),
    )
    .optional(),
});

export const productSchema = z.object({
  title: z.string().min(1, 'Product Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['DRAFT', 'REVIEW', 'ACTIVE', 'ARCHIVED']),
  isFeatured: z.boolean(),
  isPhysical: z.boolean(),
  brandId: z.string().optional().nullable(),
  categoryIds: z.array(z.string()),
  collectionIds: z.array(z.string()),
  homepageCollections: z.array(z.string()),
  images: z.array(
    z.object({
      url: z.string().url('Invalid image URL'),
      altText: z.string().optional().nullable(),
      sortOrder: z.number(),
    }),
  ),
  variants: z.array(productVariantSchema).min(1, 'At least one variant is required'),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export default productSchema;
