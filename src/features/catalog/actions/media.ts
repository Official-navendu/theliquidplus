'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { ApiResponse } from '@/types/api';
import { UserType } from '@prisma/client';

async function assertMediaManager() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const allowed: UserType[] = [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.PRODUCT_MANAGER, UserType.CONTENT_WRITER];
  if (!allowed.includes(user.role)) throw new Error('Insufficient permissions');
}

export async function getMediaImagesAction(): Promise<ApiResponse<string[]>> {
  try {
    await assertMediaManager();
    
    // Fetch all image sources concurrently to eliminate waterfall
    const [productImages, blogImages, brandLogos, customSetting] = await Promise.all([
      db.productImage.findMany({
        select: { url: true },
      }),
      db.blogPost.findMany({
        where: { featuredImage: { not: null } },
        select: { featuredImage: true },
      }),
      db.brand.findMany({
        where: { logoUrl: { not: null } },
        select: { logoUrl: true },
      }),
      db.storeSetting.findUnique({
        where: { key: 'media_library_images' },
      })
    ]);

    const customImages: string[] = customSetting ? (customSetting.value as string[]) : [];

    // Combine all unique URLs
    const urls = new Set<string>();
    productImages.forEach((img) => urls.add(img.url));
    blogImages.forEach((img) => img.featuredImage && urls.add(img.featuredImage));
    brandLogos.forEach((img) => img.logoUrl && urls.add(img.logoUrl));
    customImages.forEach((url) => urls.add(url));

    return {
      success: true,
      data: Array.from(urls),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function addMediaImageAction(url: string): Promise<ApiResponse<any>> {
  try {
    await assertMediaManager();

    const existing = await db.storeSetting.findUnique({
      where: { key: 'media_library_images' },
    });

    const list: string[] = existing ? (existing.value as string[]) : [];
    if (!list.includes(url)) {
      list.push(url);
    }

    const item = await db.storeSetting.upsert({
      where: { key: 'media_library_images' },
      update: { value: list },
      create: {
        key: 'media_library_images',
        group: 'MEDIA',
        value: list,
      },
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(item)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'UPLOAD_ERROR', message: error.message } };
  }
}

export async function deleteMediaImageAction(url: string): Promise<ApiResponse<any>> {
  try {
    await assertMediaManager();

    const existing = await db.storeSetting.findUnique({
      where: { key: 'media_library_images' },
    });

    if (existing) {
      const list: string[] = existing.value as string[];
      const filtered = list.filter((x) => x !== url);
      await db.storeSetting.update({
        where: { key: 'media_library_images' },
        data: { value: filtered },
      });
    }

    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, error: { code: 'DELETE_ERROR', message: error.message } };
  }
}
