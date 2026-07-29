import { db } from '@/lib/db';
import { UserType, UserStatus } from '@prisma/client';

export class CustomerAdminRepository {
  async getCustomers(params: {
    search?: string;
    status?: UserStatus;
    page?: number;
    limit?: number;
  }) {
    const { search, status, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const where: SafeAny = {
      type: UserType.CUSTOMER,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        {
          customerProfile: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          customerProfile: true,
          orders: {
            select: { id: true, totalAmount: true },
          },
          wishlist: {
            include: {
              _count: {
                select: { wishlistItems: true },
              },
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    // Query couponUsages for each retrieved customer
    const itemsWithCoupons = await Promise.all(
      items.map(async (user) => {
        const count = await db.couponUsage.count({
          where: { userId: user.id },
        });
        return {
          ...user,
          couponUsages: Array(count).fill({}),
        };
      }),
    );

    return { items: itemsWithCoupons, total };
  }

  async getCustomerById(id: string) {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        customerProfile: true,
        customerAddresses: true,
        orders: {
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
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        reviews: {
          include: {
            product: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        wishlist: {
          include: {
            wishlistItems: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
        recentlyViewedProducts: {
          include: {
            product: true,
          },
          orderBy: { viewedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) return null;

    const couponUsages = await db.couponUsage.findMany({
      where: { userId: id },
      include: {
        coupon: true,
      },
    });

    return {
      ...user,
      couponUsages,
    };
  }

  async updateCustomerStatus(id: string, status: UserStatus) {
    return db.user.update({
      where: { id },
      data: { status },
    });
  }
}
export default CustomerAdminRepository;
