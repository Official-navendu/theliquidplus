'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { ProductRepository } from '../repositories/product.repository';
import { productSchema, ProductInput } from '../schemas/product';
import { ApiResponse } from '@/types/api';
import { db } from '@/lib/db';
import { ProductStatus, UserType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const repo = new ProductRepository();

function revalidateStorefront() {
  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/products/[slug]', 'page');
  revalidatePath('/categories/[slug]', 'page');
  revalidatePath('/brands/[slug]', 'page');
}

/**
 * Helper to assert admin or product manager permissions
 */
async function assertProductManager() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized access');
  }
  const allowed: UserType[] = [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.PRODUCT_MANAGER];
  if (!allowed.includes(user.role)) {
    throw new Error('Access denied: insufficient permissions');
  }
  return user;
}

/**
 * Server Action: Fetch list of products
 */
export async function getProductsAction(params: {
  search?: string;
  category?: string;
  brand?: string;
  status?: ProductStatus;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ items: SafeAny[]; total: number }>> {
  try {
    await assertProductManager();
    const result = await repo.getProducts(params);

    // Convert decimals/dates to plain JSON objects
    const items = JSON.parse(JSON.stringify(result.items));
    return {
      success: true,
      data: {
        items,
        total: result.total,
      },
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error.message || 'Failed to retrieve products list',
      },
    };
  }
}

/**
 * Server Action: Fetch single product details
 */
export async function getProductByIdAction(id: string): Promise<ApiResponse<SafeAny>> {
  try {
    await assertProductManager();
    const result = await repo.getProductById(id);
    if (!result) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found',
        },
      };
    }
    const data = JSON.parse(JSON.stringify(result));
    return {
      success: true,
      data,
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error.message || 'Failed to retrieve product details',
      },
    };
  }
}

/**
 * Server Action: Create new product
 */
export async function createProductAction(input: ProductInput): Promise<ApiResponse<SafeAny>> {
  try {
    await assertProductManager();
    const validated = productSchema.parse(input);
    const result = await repo.createProduct(validated);
    revalidateStorefront();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: error.message || 'Failed to create product',
      },
    };
  }
}

/**
 * Server Action: Update product
 */
export async function updateProductAction(
  id: string,
  input: ProductInput,
): Promise<ApiResponse<SafeAny>> {
  try {
    await assertProductManager();
    const validated = productSchema.parse(input);
    const result = await repo.updateProduct(id, validated);
    revalidateStorefront();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: error.message || 'Failed to update product',
      },
    };
  }
}

/**
 * Server Action: Delete/Archive product
 */
export async function deleteProductAction(id: string, soft = true): Promise<ApiResponse<SafeAny>> {
  try {
    await assertProductManager();
    const result = await repo.deleteProduct(id, soft);
    revalidateStorefront();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: error.message || 'Failed to delete product',
      },
    };
  }
}

/**
 * Server Action: Restore product
 */
export async function restoreProductAction(id: string): Promise<ApiResponse<SafeAny>> {
  try {
    await assertProductManager();
    const result = await repo.restoreProduct(id);
    revalidateStorefront();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'RESTORE_ERROR',
        message: error.message || 'Failed to restore product',
      },
    };
  }
}

/**
 * Server Action: Bulk Delete
 */
export async function bulkDeleteProductsAction(ids: string[]): Promise<ApiResponse<SafeAny>> {
  try {
    await assertProductManager();
    const result = await repo.bulkDelete(ids);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'BULK_ERROR',
        message: error.message || 'Failed to execute bulk delete',
      },
    };
  }
}

/**
 * Server Action: Bulk Status Update
 */
export async function bulkUpdateStatusAction(
  ids: string[],
  status: ProductStatus,
): Promise<ApiResponse<SafeAny>> {
  try {
    await assertProductManager();
    const result = await repo.bulkUpdateStatus(ids, status);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'BULK_ERROR',
        message: error.message || 'Failed to execute status update',
      },
    };
  }
}

/**
 * Helper to fetch lists of all categories, brands, collections
 */
export async function getBrandsAndCategoriesAction(): Promise<
  ApiResponse<{
    brands: SafeAny[];
    categories: SafeAny[];
    collections: SafeAny[];
  }>
> {
  try {
    await assertProductManager();
    const [brands, categories, collections] = await Promise.all([
      db.brand.findMany({ orderBy: { name: 'asc' } }),
      db.category.findMany({ orderBy: { name: 'asc' } }),
      db.collection.findMany({ orderBy: { name: 'asc' } }),
    ]);

    return {
      success: true,
      data: {
        brands: JSON.parse(JSON.stringify(brands)),
        categories: JSON.parse(JSON.stringify(categories)),
        collections: JSON.parse(JSON.stringify(collections)),
      },
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error.message || 'Failed to retrieve setup choices',
      },
    };
  }
}

/**
 * Server Action: Duplicate Product
 */
export async function duplicateProductAction(id: string): Promise<ApiResponse<SafeAny>> {
  try {
    await assertProductManager();
    const existing = await repo.getProductById(id);
    if (!existing) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found',
        },
      };
    }

    const duplicatedInput: ProductInput = {
      title: `Copy of ${existing.title}`,
      slug: `${existing.slug}-copy-${Date.now()}`,
      description: existing.description || '',
      status: ProductStatus.DRAFT,
      isFeatured: existing.isFeatured,
      isPhysical: existing.isPhysical,
      brandId: existing.brandId,
      categoryIds: existing.productCategories?.map((c: SafeAny) => c.categoryId) || [],
      collectionIds: existing.productCollections?.map((c: SafeAny) => c.collectionId) || [],
      homepageCollections: existing.homepageCollections || [],
      images:
        existing.images?.map((img: SafeAny) => ({
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder,
        })) || [],
      variants:
        existing.variants?.map((v: SafeAny) => ({
          sku: `${v.sku}-COPY-${Math.floor(Math.random() * 1000)}`,
          barcode: v.barcode ? `${v.barcode}-COPY` : null,
          price: Number(v.price) || 0,
          comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
          costPrice: v.costPrice ? Number(v.costPrice) : null,
          quantity: v.inventoryItem?.quantity || 0,
          weight: v.weight ? Number(v.weight) : null,
          width: v.width ? Number(v.width) : null,
          height: v.height ? Number(v.height) : null,
          length: v.length ? Number(v.length) : null,
          isActive: v.isActive,
          attributes:
            v.variantAttributes?.map((va: SafeAny) => ({
              name: va.attributeValue?.attribute?.name,
              value: va.attributeValue?.value,
            })) || [],
        })) || [],
      seoTitle: existing.seo?.metaTitle || `Copy of ${existing.title}`,
      seoDescription: existing.seo?.metaDescription || '',
      canonicalUrl: existing.seo?.canonicalUrl || '',
      ogImage: existing.seo?.ogImage || '',
    };

    const result = await repo.createProduct(duplicatedInput);
    revalidateStorefront();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return {
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: error.message || 'Failed to duplicate product',
      },
    };
  }
}
