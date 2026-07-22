'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { ApiResponse } from '@/types/api';
import { UserType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function assertWarehouseManager() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const allowed: UserType[] = [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.PRODUCT_MANAGER];
  if (!allowed.includes(user.role)) throw new Error('Insufficient permissions');
}

export async function getInventoryAction(): Promise<ApiResponse<any[]>> {
  try {
    await assertWarehouseManager();
    const list = await db.productVariant.findMany({
      include: {
        product: true,
        inventoryItem: true,
      },
      orderBy: { sku: 'asc' },
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(list)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function updateStockAction(variantId: string, quantity: number): Promise<ApiResponse<any>> {
  try {
    await assertWarehouseManager();
    const item = await db.inventoryItem.upsert({
      where: { variantId },
      update: { quantity },
      create: { variantId, quantity },
    });

    // Revalidate storefront cache to display correct stock status
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/products/[slug]', 'page');

    return {
      success: true,
      data: JSON.parse(JSON.stringify(item)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}
