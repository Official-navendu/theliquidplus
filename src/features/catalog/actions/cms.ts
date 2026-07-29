'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { CmsRepository } from '../repositories/cms.repository';
import { ApiResponse } from '@/types/api';
import { UserType } from '@prisma/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const repo = new CmsRepository();

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  categoryId: z.string().min(1, 'Category is required'),
  featuredImage: z.string().optional(),
  publishedAt: z
    .string()
    .or(z.date())
    .nullable()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

async function assertCmsManager() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const allowed: UserType[] = [
    UserType.SUPER_ADMIN,
    UserType.ADMIN,
    UserType.CONTENT_WRITER,
    UserType.PRODUCT_MANAGER,
  ];
  if (!allowed.includes(user.role)) throw new Error('Insufficient permissions');
  return user;
}

// Pages Actions
export async function getPagesAction(): Promise<ApiResponse<SafeAny[]>> {
  try {
    await assertCmsManager();
    const list = await repo.getPages();
    return { success: true, data: JSON.parse(JSON.stringify(list)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getPageByIdAction(id: string): Promise<ApiResponse<SafeAny>> {
  try {
    await assertCmsManager();
    const item = await repo.getPageById(id);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function createPageAction(input: SafeAny): Promise<ApiResponse<SafeAny>> {
  try {
    await assertCmsManager();
    const validated = pageSchema.parse(input);
    const item = await repo.createPage(validated);

    revalidatePath('/');
    revalidatePath('/[slug]', 'page');
    if (item?.slug) revalidatePath(`/${item.slug}`);

    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'CREATE_ERROR', message: error.message } };
  }
}

export async function updatePageAction(id: string, input: SafeAny): Promise<ApiResponse<SafeAny>> {
  try {
    await assertCmsManager();
    const validated = pageSchema.parse(input);
    const item = await repo.updatePage(id, validated);

    revalidatePath('/');
    revalidatePath('/[slug]', 'page');
    if (item?.slug) revalidatePath(`/${item.slug}`);

    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}

export async function deletePageAction(id: string): Promise<ApiResponse<SafeAny>> {
  try {
    await assertCmsManager();
    const item = await repo.deletePage(id);

    revalidatePath('/');
    revalidatePath('/[slug]', 'page');
    if (item?.slug) revalidatePath(`/${item.slug}`);

    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'DELETE_ERROR', message: error.message } };
  }
}

// Blog Actions
export async function getBlogPostsAction(): Promise<ApiResponse<SafeAny[]>> {
  try {
    await assertCmsManager();
    const list = await repo.getBlogPosts();
    return { success: true, data: JSON.parse(JSON.stringify(list)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getBlogPostByIdAction(id: string): Promise<ApiResponse<SafeAny>> {
  try {
    await assertCmsManager();
    const item = await repo.getBlogPostById(id);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function createBlogPostAction(input: SafeAny): Promise<ApiResponse<SafeAny>> {
  try {
    const user = await assertCmsManager();
    const validated = blogSchema.parse(input);
    const item = await repo.createBlogPost({
      ...validated,
      authorId: user.id,
    } as SafeAny);

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]', 'page');
    if (item?.slug) revalidatePath(`/blog/${item.slug}`);

    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'CREATE_ERROR', message: error.message } };
  }
}

export async function updateBlogPostAction(
  id: string,
  input: SafeAny,
): Promise<ApiResponse<SafeAny>> {
  try {
    await assertCmsManager();
    const validated = blogSchema.parse(input);
    const item = await repo.updateBlogPost(id, validated as SafeAny);

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]', 'page');
    if (item?.slug) revalidatePath(`/blog/${item.slug}`);

    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}

export async function deleteBlogPostAction(id: string): Promise<ApiResponse<SafeAny>> {
  try {
    await assertCmsManager();
    const item = await repo.deleteBlogPost(id);

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]', 'page');
    if (item?.slug) revalidatePath(`/blog/${item.slug}`);

    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'DELETE_ERROR', message: error.message } };
  }
}

export async function getBlogCategoriesAction(): Promise<ApiResponse<SafeAny[]>> {
  try {
    await assertCmsManager();
    const list = await repo.getBlogCategories();
    return { success: true, data: JSON.parse(JSON.stringify(list)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function createBlogCategoryAction(
  name: string,
  slug: string,
): Promise<ApiResponse<SafeAny>> {
  try {
    await assertCmsManager();
    const item = await repo.createBlogCategory(name, slug);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'CREATE_ERROR', message: error.message } };
  }
}
