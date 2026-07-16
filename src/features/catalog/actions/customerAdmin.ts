'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { CustomerAdminRepository } from '../repositories/customerAdmin.repository';
import { ApiResponse } from '@/types/api';
import { UserType, UserStatus } from '@prisma/client';

const repo = new CustomerAdminRepository();

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const allowed: UserType[] = [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.CUSTOMER_SUPPORT];
  if (!allowed.includes(user.role)) throw new Error('Insufficient permissions');
}

export async function getCustomersAction(params: {
  search?: string;
  status?: UserStatus;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ items: any[]; total: number }>> {
  try {
    await assertAdmin();
    const result = await repo.getCustomers(params);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getCustomerByIdAction(id: string): Promise<ApiResponse<any>> {
  try {
    await assertAdmin();
    const result = await repo.getCustomerById(id);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function updateCustomerStatusAction(id: string, status: UserStatus): Promise<ApiResponse<any>> {
  try {
    await assertAdmin();
    const result = await repo.updateCustomerStatus(id, status);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}
