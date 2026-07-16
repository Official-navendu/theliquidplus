import { db } from '@/lib/db';
import { CustomerAddress } from '@prisma/client';

export class CustomerRepository {
  /**
   * Get customer profile (User + CustomerProfile)
   */
  async getProfile(userId: string) {
    return db.user.findUnique({
      where: { id: userId },
      include: {
        customerProfile: true,
        customerPreference: true,
      },
    });
  }

  /**
   * Update customer profile info
   */
  async updateProfile(userId: string, data: { firstName: string; lastName: string; email: string }) {
    return db.$transaction(async (tx) => {
      // Update User email
      await tx.user.update({
        where: { id: userId },
        data: { email: data.email },
      });

      // Upsert CustomerProfile
      await tx.customerProfile.upsert({
        where: { userId },
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        create: {
          userId,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      return true;
    });
  }

  /**
   * Change user password hash
   */
  async updatePassword(userId: string, passwordHash: string) {
    return db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  /**
   * Get all customer addresses
   */
  async getAddresses(userId: string): Promise<CustomerAddress[]> {
    return db.customerAddress.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create new customer address
   */
  async createAddress(userId: string, data: Omit<CustomerAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    return db.$transaction(async (tx) => {
      if (data.isDefaultShipping) {
        await tx.customerAddress.updateMany({
          where: { userId, isDefaultShipping: true },
          data: { isDefaultShipping: false },
        });
      }
      if (data.isDefaultBilling) {
        await tx.customerAddress.updateMany({
          where: { userId, isDefaultBilling: true },
          data: { isDefaultBilling: false },
        });
      }

      return tx.customerAddress.create({
        data: {
          userId,
          ...data,
        },
      });
    });
  }

  /**
   * Update existing customer address
   */
  async updateAddress(userId: string, addressId: string, data: Partial<Omit<CustomerAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
    return db.$transaction(async (tx) => {
      if (data.isDefaultShipping) {
        await tx.customerAddress.updateMany({
          where: { userId, isDefaultShipping: true, NOT: { id: addressId } },
          data: { isDefaultShipping: false },
        });
      }
      if (data.isDefaultBilling) {
        await tx.customerAddress.updateMany({
          where: { userId, isDefaultBilling: true, NOT: { id: addressId } },
          data: { isDefaultBilling: false },
        });
      }

      return tx.customerAddress.update({
        where: { id: addressId, userId },
        data,
      });
    });
  }

  /**
   * Delete customer address
   */
  async deleteAddress(userId: string, addressId: string) {
    return db.customerAddress.delete({
      where: { id: addressId, userId },
    });
  }

  /**
   * Get customer orders with details
   */
  async getOrders(userId: string) {
    return db.order.findMany({
      where: { customerId: userId },
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single order by ID
   */
  async getOrderById(userId: string, orderId: string) {
    return db.order.findFirst({
      where: { id: orderId, customerId: userId },
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
        orderStatusHistory: true,
        orderTimeline: true,
        orderNotes: true,
      },
    });
  }

  /**
   * Get customer reviews (submitted and pending)
   */
  async getReviews(userId: string) {
    return db.productReview.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Add a review for a product
   */
  async createReview(userId: string, data: { productId: string; rating: number; title?: string; comment?: string }) {
    return db.productReview.create({
      data: {
        userId,
        productId: data.productId,
        rating: data.rating,
        title: data.title || null,
        comment: data.comment || null,
        status: 'PENDING',
      },
    });
  }

  /**
   * Update notification preference
   */
  async updateNotificationPreference(userId: string, data: { emailMarketing: boolean; smsMarketing: boolean }) {
    return db.customerPreference.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}
