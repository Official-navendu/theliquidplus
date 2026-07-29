'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { ReviewRepository } from '../repositories/review.repository';
import { ApiResponse } from '@/types/api';
import { UserType, ReviewStatus } from '@prisma/client';

const repo = new ReviewRepository();

async function assertReviewManager() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const allowed: UserType[] = [
    UserType.SUPER_ADMIN,
    UserType.ADMIN,
    UserType.CUSTOMER_SUPPORT,
    UserType.PRODUCT_MANAGER,
  ];
  if (!allowed.includes(user.role)) throw new Error('Insufficient permissions');
}

export async function getReviewsAction(params: {
  status?: ReviewStatus;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ items: SafeAny[]; total: number }>> {
  try {
    await assertReviewManager();
    const result = await repo.getReviews(params);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function updateReviewStatusAction(
  id: string,
  status: ReviewStatus,
): Promise<ApiResponse<SafeAny>> {
  try {
    await assertReviewManager();
    const result = await repo.updateReviewStatus(id, status);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}

export async function deleteReviewAction(id: string): Promise<ApiResponse<SafeAny>> {
  try {
    await assertReviewManager();
    const result = await repo.deleteReview(id);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: SafeAny) {
    return { success: false, error: { code: 'DELETE_ERROR', message: error.message } };
  }
}
