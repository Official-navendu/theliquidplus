import { db } from '@/lib/db';
import { CouponType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class MarketingRepository {
  async getCoupons() {
    return db.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCouponById(id: string) {
    return db.coupon.findUnique({
      where: { id },
    });
  }

  async createCoupon(data: {
    code: string;
    type: CouponType;
    value: number;
    minCartValue?: number | null;
    maxDiscount?: number | null;
    perUserLimit?: number;
    maxUsageCount?: number | null;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  }) {
    return db.coupon.create({
      data: {
        code: data.code,
        type: data.type,
        value: new Decimal(data.value),
        minCartValue: data.minCartValue ? new Decimal(data.minCartValue) : null,
        maxDiscount: data.maxDiscount ? new Decimal(data.maxDiscount) : null,
        perUserLimit: data.perUserLimit || 1,
        maxUsageCount: data.maxUsageCount || null,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      },
    });
  }

  async updateCoupon(
    id: string,
    data: {
      code: string;
      type: CouponType;
      value: number;
      minCartValue?: number | null;
      maxDiscount?: number | null;
      perUserLimit?: number;
      maxUsageCount?: number | null;
      startDate: Date;
      endDate: Date;
      isActive: boolean;
    }
  ) {
    return db.coupon.update({
      where: { id },
      data: {
        code: data.code,
        type: data.type,
        value: new Decimal(data.value),
        minCartValue: data.minCartValue ? new Decimal(data.minCartValue) : null,
        maxDiscount: data.maxDiscount ? new Decimal(data.maxDiscount) : null,
        perUserLimit: data.perUserLimit || 1,
        maxUsageCount: data.maxUsageCount || null,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      },
    });
  }

  async deleteCoupon(id: string) {
    return db.coupon.delete({
      where: { id },
    });
  }

  async getCouponAnalytics() {
    const list = await db.coupon.findMany({
      include: {
        couponUsages: {
          include: {
            order: true,
          },
        },
      },
    });

    const now = new Date();
    let usageCount = 0;
    let revenueGenerated = 0;
    let averageDiscount = 0;
    let mostUsedCoupon = 'None';
    let expiredCoupons = 0;
    let upcomingExpiry = 0;
    let maxUsage = 0;

    for (const c of list) {
      const uCount = c.couponUsages.length;
      usageCount += uCount;

      if (uCount > maxUsage) {
        maxUsage = uCount;
        mostUsedCoupon = c.code;
      }

      for (const usage of c.couponUsages) {
        if (usage.order) {
          revenueGenerated += Number(usage.order.totalAmount);
          averageDiscount += Number(usage.order.discountAmount);
        }
      }

      if (c.endDate < now) {
        expiredCoupons++;
      } else {
        const diffTime = Math.abs(c.endDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          upcomingExpiry++;
        }
      }
    }

    if (usageCount > 0) {
      averageDiscount = averageDiscount / usageCount;
    }

    return {
      usageCount,
      revenueGenerated,
      averageDiscount,
      mostUsedCoupon,
      expiredCoupons,
      upcomingExpiry,
    };
  }
}
export default MarketingRepository;
