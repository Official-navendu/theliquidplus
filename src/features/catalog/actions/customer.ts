'use server';

import { getCurrentUser } from '@/lib/auth-helpers';
import { CustomerRepository } from '../repositories/customer.repository';
import {
  profileSchema,
  ProfileInput,
  addressSchema,
  AddressInput,
  passwordSchema,
  PasswordInput,
  reviewSchema,
  ReviewInput,
  preferenceSchema,
  PreferenceInput,
} from '../schemas/customer';
import { ApiResponse } from '@/types/api';
import { handleAppError } from '@/core/error/handler';
import { db } from '@/lib/db';

export interface ProfileData {
  id?: string;
  email?: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: string;
  rewardPoints: number;
  emailMarketing: boolean;
  smsMarketing: boolean;
}

export interface AddressData {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface OrderData {
  id: string;
  invoiceRef: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: Date;
  itemsCount: number;
}

export interface OrderDetailsData {
  id: string;
  invoiceRef: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  subtotalAmount: number;
  createdAt: Date;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingZipCode: string;
  items: Array<{
    id: string;
    name: string;
    variantName: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  timelines: Array<{
    status: string;
    description: string;
    createdAt: Date;
  }>;
}

export interface ReviewData {
  id: string;
  productName: string;
  rating: number;
  title: string;
  comment: string;
  status: string;
  createdAt: Date;
}

const repo = new CustomerRepository();

/**
 * Get authenticated customer data helper
 */
async function getAuthedUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function getProfileData(): Promise<ApiResponse<ProfileData>> {
  try {
    const authed = await getAuthedUser();
    const user = await repo.getProfile(authed.id);
    return {
      success: true,
      data: {
        id: user?.id,
        email: user?.email,
        firstName: user?.customerProfile?.firstName || '',
        lastName: user?.customerProfile?.lastName || '',
        phone: '', // Mocked or resolved via localStorage client-side
        dob: '',
        gender: 'Male',
        rewardPoints: 450, // Mock reward points
        emailMarketing: user?.customerPreference?.emailMarketing ?? true,
        smsMarketing: user?.customerPreference?.smsMarketing ?? false,
      },
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function updateProfileData(input: ProfileInput): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const authed = await getAuthedUser();
    const parsed = profileSchema.parse(input);
    await repo.updateProfile(authed.id, {
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      email: parsed.email,
    });
    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function changePasswordAction(input: PasswordInput): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const authed = await getAuthedUser();
    const parsed = passwordSchema.parse(input);

    const user = await db.user.findUnique({
      where: { id: authed.id },
    });

    if (!user || !user.passwordHash) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'User account not found' },
      };
    }

    const bcrypt = await import('bcryptjs');
    const isMatch = await bcrypt.compare(parsed.currentPassword, user.passwordHash);
    if (!isMatch) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Incorrect current password' },
      };
    }

    const newHash = await bcrypt.hash(parsed.newPassword, 10);
    await repo.updatePassword(authed.id, newHash);

    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function getAddressesAction(): Promise<ApiResponse<AddressData[]>> {
  try {
    const authed = await getAuthedUser();
    const addresses = await repo.getAddresses(authed.id);
    return {
      success: true,
      data: addresses.map(addr => ({
        id: addr.id,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        zipCode: addr.zipCode,
        isDefaultShipping: addr.isDefaultShipping,
        isDefaultBilling: addr.isDefaultBilling,
      })),
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function createAddressAction(input: AddressInput): Promise<ApiResponse<AddressData>> {
  try {
    const authed = await getAuthedUser();
    const parsed = addressSchema.parse(input);
    const created = await repo.createAddress(authed.id, {
      street: parsed.street,
      city: parsed.city,
      state: parsed.state,
      country: parsed.country,
      zipCode: parsed.zipCode,
      isDefaultShipping: parsed.isDefaultShipping,
      isDefaultBilling: parsed.isDefaultBilling,
    } as unknown as Omit<import('@prisma/client').CustomerAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
    return {
      success: true,
      data: {
        id: created.id,
        street: created.street,
        city: created.city,
        state: created.state,
        country: created.country,
        zipCode: created.zipCode,
        isDefaultShipping: created.isDefaultShipping,
        isDefaultBilling: created.isDefaultBilling,
      },
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function updateAddressAction(addressId: string, input: AddressInput): Promise<ApiResponse<AddressData>> {
  try {
    const authed = await getAuthedUser();
    const parsed = addressSchema.parse(input);
    const updated = await repo.updateAddress(authed.id, addressId, {
      street: parsed.street,
      city: parsed.city,
      state: parsed.state,
      country: parsed.country,
      zipCode: parsed.zipCode,
      isDefaultShipping: parsed.isDefaultShipping,
      isDefaultBilling: parsed.isDefaultBilling,
    });
    return {
      success: true,
      data: {
        id: updated.id,
        street: updated.street,
        city: updated.city,
        state: updated.state,
        country: updated.country,
        zipCode: updated.zipCode,
        isDefaultShipping: updated.isDefaultShipping,
        isDefaultBilling: updated.isDefaultBilling,
      },
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function deleteAddressAction(addressId: string): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const authed = await getAuthedUser();
    await repo.deleteAddress(authed.id, addressId);
    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function getOrdersAction(): Promise<ApiResponse<OrderData[]>> {
  try {
    const authed = await getAuthedUser();
    const orders = await repo.getOrders(authed.id);
    return {
      success: true,
      data: orders.map(ord => ({
        id: ord.id,
        invoiceRef: ord.invoiceRef || `TLP-${ord.id.substring(0, 8).toUpperCase()}`,
        status: ord.status,
        paymentStatus: 'PAID',
        total: Number(ord.totalAmount),
        createdAt: ord.createdAt,
        itemsCount: ord.orderItems.length,
      })),
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function getOrderDetailsAction(orderId: string): Promise<ApiResponse<OrderDetailsData>> {
  try {
    const authed = await getAuthedUser();
    const order = await repo.getOrderById(authed.id, orderId);
    if (!order) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
      };
    }

    const defaultAddr = await db.customerAddress.findFirst({
      where: { userId: authed.id, isDefaultShipping: true },
    });

    return {
      success: true,
      data: {
        id: order.id,
        invoiceRef: order.invoiceRef || `TLP-${order.id.substring(0, 8).toUpperCase()}`,
        status: order.status,
        paymentStatus: 'PAID',
        totalAmount: Number(order.totalAmount),
        shippingAmount: Number(order.shippingAmount || 0),
        taxAmount: Number(order.taxAmount || 0),
        subtotalAmount: Number(order.totalAmount) - Number(order.shippingAmount || 0) - Number(order.taxAmount || 0),
        createdAt: order.createdAt,
        street: defaultAddr?.street || '12 Premium Way',
        city: defaultAddr?.city || 'Mumbai',
        state: defaultAddr?.state || 'Maharashtra',
        country: defaultAddr?.country || 'India',
        zipCode: defaultAddr?.zipCode || '400001',
        billingStreet: defaultAddr?.street || '12 Premium Way',
        billingCity: defaultAddr?.city || 'Mumbai',
        billingState: defaultAddr?.state || 'Maharashtra',
        billingCountry: defaultAddr?.country || 'India',
        billingZipCode: defaultAddr?.zipCode || '400001',
        items: (order.orderItems as unknown as Array<{
          id: string;
          price: number;
          quantity: number;
          variant: { sku: string; product: { name: string; images: Array<{ imageUrl: string }> } };
        }>).map((item) => ({
          id: item.id,
          name: item.variant.product.name,
          variantName: item.variant.sku,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.variant.product.images[0]?.imageUrl || '',
        })),
        timelines: (order.orderTimeline as unknown as Array<{
          status: string;
          description: string | null;
          createdAt: Date;
        }>).map((t) => ({
          status: t.status,
          description: t.description || 'Order status update.',
          createdAt: t.createdAt,
        })),
      },
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function getReviewsAction(): Promise<ApiResponse<ReviewData[]>> {
  try {
    const authed = await getAuthedUser();
    const reviews = (await repo.getReviews(authed.id)) as unknown as Array<{
      id: string;
      rating: number;
      title: string | null;
      comment: string | null;
      status: string;
      createdAt: Date;
      product: { name: string } | null;
    }>;
    return {
      success: true,
      data: reviews.map(rev => ({
        id: rev.id,
        productName: rev.product?.name || 'Premium Spray Glaze',
        rating: rev.rating,
        title: rev.title || '',
        comment: rev.comment || '',
        status: rev.status,
        createdAt: rev.createdAt,
      })),
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function submitReviewAction(input: ReviewInput): Promise<ApiResponse<{ id: string }>> {
  try {
    const authed = await getAuthedUser();
    const parsed = reviewSchema.parse(input);
    const created = await repo.createReview(authed.id, {
      productId: parsed.productId,
      rating: parsed.rating,
      title: parsed.title,
      comment: parsed.comment,
    });
    return {
      success: true,
      data: { id: created.id },
    };
  } catch (error) {
    return handleAppError(error);
  }
}

export async function savePreferencesAction(input: PreferenceInput): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const authed = await getAuthedUser();
    const parsed = preferenceSchema.parse(input);
    await repo.updateNotificationPreference(authed.id, {
      emailMarketing: parsed.emailMarketing,
      smsMarketing: parsed.smsMarketing,
    });
    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    return handleAppError(error);
  }
}
