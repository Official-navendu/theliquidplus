'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { CategoryRepository } from '../repositories/category.repository';
import { ApiResponse } from '@/types/api';
import { UserType } from '@prisma/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const repo = new CategoryRepository();

const categorySchema = z.object({
  name: z.string().min(1, 'Category Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().nullable().optional(),
  status: z.boolean().default(true),
  sortOrder: z.number().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

async function assertManager() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const allowed: UserType[] = [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.PRODUCT_MANAGER];
  if (!allowed.includes(user.role)) throw new Error('Insufficient permissions');
}

export async function getCategoriesAction(): Promise<ApiResponse<any[]>> {
  try {
    await assertManager();
    const list = await repo.getCategories();
    return { success: true, data: JSON.parse(JSON.stringify(list)) };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getCategoryByIdAction(id: string): Promise<ApiResponse<any>> {
  try {
    await assertManager();
    const item = await repo.getCategoryById(id);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function createCategoryAction(input: any): Promise<ApiResponse<any>> {
  try {
    await assertManager();
    const validated = categorySchema.parse(input);
    const item = await repo.createCategory(validated);
    revalidatePath('/');
    revalidatePath('/shop');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'CREATE_ERROR', message: error.message } };
  }
}

export async function updateCategoryAction(id: string, input: any): Promise<ApiResponse<any>> {
  try {
    await assertManager();
    const validated = categorySchema.parse(input);
    const item = await repo.updateCategory(id, validated);
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/categories/[slug]', 'page');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}

export async function deleteCategoryAction(id: string): Promise<ApiResponse<any>> {
  try {
    await assertManager();
    const item = await repo.deleteCategory(id);
    revalidatePath('/');
    revalidatePath('/shop');
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'DELETE_ERROR', message: error.message } };
  }
}
