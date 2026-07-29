import { db } from '@/lib/db';
import { ReviewStatus } from '@prisma/client';

export class ReviewRepository {
  async getReviews(params: {
    status?: ReviewStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, search, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const where: SafeAny = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
        {
          product: {
            title: { contains: search, mode: 'insensitive' },
          },
        },
        {
          user: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      db.productReview.findMany({
        where,
        include: {
          product: true,
          user: {
            include: {
              customerProfile: true,
            },
          },
          media: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.productReview.count({ where }),
    ]);

    return { items, total };
  }

  async updateReviewStatus(id: string, status: ReviewStatus) {
    return db.productReview.update({
      where: { id },
      data: { status },
    });
  }

  async deleteReview(id: string) {
    return db.productReview.delete({
      where: { id },
    });
  }
}
export default ReviewRepository;
