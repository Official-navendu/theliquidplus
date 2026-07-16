'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { OrderRepository } from '../repositories/order.repository';
import { ApiResponse } from '@/types/api';
import { UserType, OrderStatus, PaymentStatus } from '@prisma/client';
import { z } from 'zod';

const repo = new OrderRepository();

async function assertOrderManager() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const allowed: UserType[] = [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.ORDER_MANAGER, UserType.PRODUCT_MANAGER];
  if (!allowed.includes(user.role)) throw new Error('Insufficient permissions');
}

export async function getOrdersAction(params: {
  search?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ items: any[]; total: number }>> {
  try {
    await assertOrderManager();
    const result = await repo.getOrders(params);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getOrderByIdAction(id: string): Promise<ApiResponse<any>> {
  try {
    await assertOrderManager();
    const result = await repo.getOrderById(id);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function updateOrderStatusAction(
  id: string,
  status: OrderStatus,
  description?: string
): Promise<ApiResponse<any>> {
  try {
    await assertOrderManager();
    const result = await repo.updateOrderStatus(id, status, description);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}

export async function updateOrderTrackingAction(
  id: string,
  carrier: string,
  trackingNumber: string
): Promise<ApiResponse<any>> {
  try {
    await assertOrderManager();
    const result = await repo.updateOrderTracking(id, carrier, trackingNumber);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}

export async function updateOrderPaymentAction(
  id: string,
  paymentStatus: PaymentStatus
): Promise<ApiResponse<any>> {
  try {
    await assertOrderManager();
    const result = await repo.updateOrderPayment(id, paymentStatus);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'UPDATE_ERROR', message: error.message } };
  }
}

export async function saveOrderNoteAction(
  orderId: string,
  note: string
): Promise<ApiResponse<any>> {
  try {
    await assertOrderManager();
    const result = await repo.saveOrderNote(orderId, note);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'SAVE_ERROR', message: error.message } };
  }
}
