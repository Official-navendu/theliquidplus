'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { BrandRepository } from '../repositories/brand.repository';
import { ApiResponse } from '@/types/api';
import { UserType } from '@prisma/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const repo = new BrandRepository();

const brandSchema = z.object({
  name: z.string().min(1, 'Brand Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

async function assertManager() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const allowed: UserType[] = [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.PRODUCT_MANAGER];
  if (!allowed.includes(user.role)) throw new Error('Insufficient permissions');
}

export async function getBrandsAction(): Promise<ApiResponse<any[]>> {
  try {
    await assertManager();
    const list = await repo.getBrands();
    return { success: true, data: JSON.parse(JSON.stringify(list)) };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getBrandByIdAction(id: string): Promise<ApiResponse<any>> {
  try {
    await assertManager();
    const item = await repo.getBrandById(id);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function createBrandAction(input: any): Promise<ApiResponse<any>> {
  try {
    await assertManager();
    const validated = brandSchema.parse(input);
    const item = await repo.createBrand(validated);
    revalidatePath('/');
    revalidatePath('/shop');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'CREATE_ERROR', message: error.message } };
  }
}

export async function updateBrandAction(id: string, input: any): Promise<ApiResponse<any>> {
  try {
    await assertManager();
    const validated = brandSchema.parse(input);
    const item = await repo.updateBrand(id, validated);
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/brands/[slug]', 'page');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}

export async function deleteBrandAction(id: string): Promise<ApiResponse<any>> {
  try {
    await assertManager();
    const item = await repo.deleteBrand(id);
    revalidatePath('/');
    revalidatePath('/shop');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'DELETE_ERROR', message: error.message } };
  }
}
