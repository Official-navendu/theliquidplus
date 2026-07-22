import { db } from '@/lib/db';
import { OrderStatus, PaymentStatus, ShipmentStatus } from '@prisma/client';

export class OrderRepository {
  async getOrders(params: {
    search?: string;
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }) {
    const { search, status, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { invoiceRef: { contains: search, mode: 'insensitive' } },
        { guestEmail: { contains: search, mode: 'insensitive' } },
        { couponCode: { contains: search, mode: 'insensitive' } },
        {
          customer: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          customer: {
            include: {
              customerProfile: true,
            },
          },
          orderItems: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return { items, total };
  }

  async getOrderById(id: string) {
    return db.order.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            customerProfile: true,
            customerAddresses: true,
          },
        },
        orderItems: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        orderStatusHistory: true,
        orderTimeline: {
          orderBy: { createdAt: 'asc' },
        },
        payments: true,
        shipments: true,
      },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus, description?: string) {
    return db.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });

      if (existingOrder && existingOrder.status !== 'CANCELLED' && status === 'CANCELLED') {
        const variantIds = existingOrder.orderItems.map((item) => item.variantId);
        const invItems = await tx.inventoryItem.findMany({
          where: { variantId: { in: variantIds } },
        });
        const invMap = new Map(invItems.map((inv) => [inv.variantId, inv]));

        const updates = [];
        for (const item of existingOrder.orderItems) {
          const inv = invMap.get(item.variantId);
          if (inv) {
            updates.push(
              tx.inventoryItem.update({
                where: { id: inv.id },
                data: {
                  quantity: inv.quantity + item.quantity,
                },
              })
            );
          }
        }

        if (updates.length > 0) {
          await Promise.all(updates);
        }
      }

      const order = await tx.order.update({
        where: { id },
        data: { status },
      });

      // Log status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
          notes: description || `Status updated to ${status}`,
        },
      });

      // Log timeline event
      await tx.orderTimeline.create({
        data: {
          orderId: id,
          event: status.toString(),
          description: description || `Order marked as ${status.toLowerCase()}`,
        },
      });

      return order;
    });
  }

  async updateOrderTracking(id: string, carrier: string, trackingNumber: string) {
    return db.$transaction(async (tx) => {
      // Find or create shipment
      const existing = await tx.shipment.findFirst({
        where: { orderId: id },
      });

      if (existing) {
        return tx.shipment.update({
          where: { id: existing.id },
          data: {
            carrier,
            trackingNumber,
            status: ShipmentStatus.DISPATCHED,
            shippedAt: new Date(),
          },
        });
      } else {
        return tx.shipment.create({
          data: {
            orderId: id,
            carrier,
            trackingNumber,
            status: ShipmentStatus.DISPATCHED,
            shippedAt: new Date(),
          },
        });
      }
    });
  }

  async updateOrderPayment(id: string, paymentStatus: PaymentStatus) {
    return db.$transaction(async (tx) => {
      // Find first payment
      const existing = await tx.payment.findFirst({
        where: { orderId: id },
      });

      if (existing) {
        return tx.payment.update({
          where: { id: existing.id },
          data: { status: paymentStatus },
        });
      } else {
        const order = await tx.order.findUnique({
          where: { id },
        });
        return tx.payment.create({
          data: {
            orderId: id,
            amount: order?.totalAmount || 0,
            provider: 'Razorpay',
            status: paymentStatus,
          },
        });
      }
    });
  }

  async saveOrderNote(orderId: string, note: string) {
    const existing = await db.orderNote.findFirst({
      where: { orderId },
    });

    if (existing) {
      return db.orderNote.update({
        where: { id: existing.id },
        data: { note },
      });
    } else {
      return db.orderNote.create({
        data: { orderId, note },
      });
    }
  }
}
export default OrderRepository;
