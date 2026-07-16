'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { MarketingRepository } from '../repositories/marketing.repository';
import { ApiResponse } from '@/types/api';
import { UserType, CouponType } from '@prisma/client';
import { z } from 'zod';

const repo = new MarketingRepository();

const couponSchema = z.object({
  code: z.string().min(1, 'Coupon Code is required'),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  value: z.number().min(0, 'Discount value must be non-negative'),
  minCartValue: z.number().nullable().optional(),
  maxDiscount: z.number().nullable().optional(),
  perUserLimit: z.number().int().min(1).default(1),
  maxUsageCount: z.number().nullable().optional(),
  startDate: z.string().or(z.date()).transform((val) => new Date(val)),
  endDate: z.string().or(z.date()).transform((val) => new Date(val)),
  isActive: z.boolean().default(true),
});

async function assertMarketingManager() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const allowed: UserType[] = [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MARKETING, UserType.PRODUCT_MANAGER];
  if (!allowed.includes(user.role)) throw new Error('Insufficient permissions');
}

export async function getCouponsAction(): Promise<ApiResponse<any[]>> {
  try {
    await assertMarketingManager();
    const list = await repo.getCoupons();
    return { success: true, data: JSON.parse(JSON.stringify(list)) };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getCouponByIdAction(id: string): Promise<ApiResponse<any>> {
  try {
    await assertMarketingManager();
    const item = await repo.getCouponById(id);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function createCouponAction(input: any): Promise<ApiResponse<any>> {
  try {
    await assertMarketingManager();
    const validated = couponSchema.parse(input);
    const item = await repo.createCoupon(validated as any);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'CREATE_ERROR', message: error.message } };
  }
}

export async function updateCouponAction(id: string, input: any): Promise<ApiResponse<any>> {
  try {
    await assertMarketingManager();
    const validated = couponSchema.parse(input);
    const item = await repo.updateCoupon(id, validated as any);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}

export async function deleteCouponAction(id: string): Promise<ApiResponse<any>> {
  try {
    await assertMarketingManager();
    const item = await repo.deleteCoupon(id);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    return { success: false, error: { code: 'DELETE_ERROR', message: error.message } };
  }
}

export async function duplicateCouponAction(id: string): Promise<ApiResponse<any>> {
  try {
    await assertMarketingManager();
    const existing = await repo.getCouponById(id);
    if (!existing) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Coupon not found' } };
    }

    const payload = {
      code: `${existing.code}_COPY_${Math.floor(Math.random() * 1000)}`,
      type: existing.type,
      value: Number(existing.value),
      minCartValue: existing.minCartValue ? Number(existing.minCartValue) : null,
      maxDiscount: existing.maxDiscount ? Number(existing.maxDiscount) : null,
      perUserLimit: existing.perUserLimit,
      maxUsageCount: existing.maxUsageCount,
      startDate: existing.startDate,
      endDate: existing.endDate,
      isActive: false,
    };

    const result = await repo.createCoupon(payload);
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    return { success: false, error: { code: 'DUPLICATE_ERROR', message: error.message } };
  }
}

export async function getCouponAnalyticsAction(): Promise<ApiResponse<any>> {
  try {
    await assertMarketingManager();
    const result = await repo.getCouponAnalytics();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: { code: 'ANALYTICS_ERROR', message: error.message } };
  }
}

