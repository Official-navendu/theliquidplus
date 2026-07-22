/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use server';

import { db } from '@/lib/db';
import { ApiResponse } from '@/types/api';
import { getCurrentUser } from '@/lib/auth-helpers';

export async function getStorefrontProductsAction(): Promise<ApiResponse<any[]>> {
  try {
    const list = await db.product.findMany({
      where: {
        status: { in: ['ACTIVE', 'DRAFT', 'REVIEW'] },
      },
      include: {
        productCategories: {
          include: {
            category: true,
          },
        },
        productCollections: {
          include: {
            collection: true,
          },
        },
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          include: {
            inventoryItem: true,
          },
        },
        reviews: {
          where: { status: 'APPROVED' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = list.map((p) => {
      const reviewsList = p.reviews || [];
      const ratingVal = reviewsList.length > 0 ? reviewsList.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewsList.length : 4.8;
      const primaryImage = p.images[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600';
      const hoverImage = p.images[1]?.url || primaryImage;

      // Price mapping
      const baseVariant = p.variants[0] || {};
      const price = Number(baseVariant.price) || 1500;
      const compareAtPrice = baseVariant.comparePrice ? Number(baseVariant.comparePrice) : undefined;
      const inStock = (baseVariant.inventoryItem?.quantity || 0) > 0;

      // Collections mapping
      const collectionsSlugs = p.productCollections?.map((pc: any) => pc.collection?.slug) || [];
      const isFeatured = p.isFeatured || collectionsSlugs.includes('featured');
      const isBestSeller = collectionsSlugs.includes('best-sellers');
      const isTrending = collectionsSlugs.includes('trending');
      const isNew = collectionsSlugs.includes('new-arrivals');

      // Category mapping
      const categoryName = p.productCategories?.[0]?.category?.name || 'Detailing Product';

      return {
        id: p.id,
        name: p.title,
        brand: p.brand?.name || 'The Liquid Plus',
        category: categoryName,
        slug: p.slug,
        price,
        compareAtPrice,
        rating: ratingVal,
        reviewsCount: reviewsList.length || 5,
        image: primaryImage,
        hoverImage,
        shortDescription: p.description || '',
        description: p.description || '',
        inStock,
        isNew,
        isFeatured,
        isTrending,
        isBestSeller,
        productType: 'coating', // placeholder key
        collections: collectionsSlugs,
      };
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(mapped)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getStorefrontCategoriesAction(): Promise<ApiResponse<any[]>> {
  try {
    const list = await db.category.findMany({
      where: { parentId: null }, // Core parent categories
    });

    const mapped = list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.imageUrl || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400',
      href: `/categories/${c.slug}`,
    }));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(mapped)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getStorefrontBrandsAction(): Promise<ApiResponse<any[]>> {
  try {
    const list = await db.brand.findMany({
      include: {
        products: {
          where: { status: { in: ['ACTIVE', 'DRAFT', 'REVIEW'] } },
        },
      },
    });

    const mapped = list.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      image: b.logoUrl || '',
      description: 'Premium Automotive Detailing Partner Brand',
      href: `/brands/${b.slug}`,
    }));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(mapped)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function getStorefrontBlogPostsAction(): Promise<ApiResponse<any[]>> {
  try {
    const list = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(list)),
    };
  } catch (error: any) {
    return { success: false, error: { code: 'FETCH_ERROR', message: error.message } };
  }
}

export async function createStorefrontOrderAction(input: {
  guestEmail?: string;
  guestPhone?: string;
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  couponCode?: string;
  items: Array<{
    productId: string;
    quantity: number;
    selectedSize: string;
  }>;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}): Promise<ApiResponse<{ id: string; invoiceRef: string }>> {
  try {
    let user = await getCurrentUser();
    
    if (!user && input.guestEmail) {
      const existingUser = await db.user.findUnique({
        where: { email: input.guestEmail },
      });
      if (existingUser) {
        user = { id: existingUser.id, email: existingUser.email, role: existingUser.type };
      } else {
        const createdUser = await db.user.create({
          data: {
            email: input.guestEmail,
            type: 'CUSTOMER',
            status: 'ACTIVE',
            isActive: true,
          },
        });
        user = { id: createdUser.id, email: createdUser.email, role: createdUser.type };
      }
    }

    if (user) {
      const nameFirst = input.shippingAddress?.firstName || '';
      const nameLast = input.shippingAddress?.lastName || '';
      
      await db.customerProfile.upsert({
        where: { userId: user.id },
        update: {
          firstName: nameFirst,
          lastName: nameLast,
        },
        create: {
          userId: user.id,
          firstName: nameFirst,
          lastName: nameLast,
        },
      });

      if (input.shippingAddress) {
        await db.customerAddress.create({
          data: {
            userId: user.id,
            street: input.shippingAddress.street,
            city: input.shippingAddress.city,
            state: input.shippingAddress.state,
            country: input.shippingAddress.country,
            zipCode: input.shippingAddress.zipCode,
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        });
      }
    }

    const invoiceRef = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const productIds = input.items.map((item) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });

    const productsMap = new Map(products.map((p) => [p.id, p]));
    const variantIds = products.flatMap((p) => p.variants.map((v) => v.id));

    const inventoryItems = await db.inventoryItem.findMany({
      where: { variantId: { in: variantIds } },
    });
    const inventoryMap = new Map(inventoryItems.map((inv) => [inv.variantId, inv]));

    const orderItemsData = [];
    const inventoryUpdates = [];

    for (const item of input.items) {
      const product = productsMap.get(item.productId);
      if (!product) continue;
      const variant = product.variants[0];
      if (!variant) continue;

      const inv = inventoryMap.get(variant.id);
      if (inv) {
        inventoryUpdates.push(
          db.inventoryItem.update({
            where: { id: inv.id },
            data: {
              quantity: Math.max(0, inv.quantity - item.quantity),
            },
          })
        );
      }

      orderItemsData.push({
        variantId: variant.id,
        sku: variant.sku,
        quantity: item.quantity,
        price: variant.price,
        discount: 0,
        taxRate: 18,
        taxAmount: Number(variant.price) * item.quantity * 0.18,
      });
    }

    if (inventoryUpdates.length > 0) {
      await Promise.all(inventoryUpdates);
    }

    const order = await db.order.create({
      data: {
        invoiceRef,
        customerId: user?.id || null,
        guestEmail: input.guestEmail || user?.email || 'guest@theliquidplus.com',
        guestPhone: input.guestPhone || '',
        status: 'PENDING',
        subtotalAmount: input.subtotalAmount,
        discountAmount: input.discountAmount,
        taxAmount: input.taxAmount,
        shippingAmount: input.shippingAmount,
        totalAmount: input.subtotalAmount - input.discountAmount + input.taxAmount + input.shippingAmount,
        couponCode: input.couponCode || null,
        orderItems: {
          create: orderItemsData,
        },
      },
    });

    await db.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        provider: 'Razorpay Checkout',
        status: 'PENDING',
      },
    });

    await db.orderTimeline.create({
      data: {
        orderId: order.id,
        event: 'PENDING',
        description: 'Order placed via storefront checkout.',
      },
    });

    return {
      success: true,
      data: { id: order.id, invoiceRef: order.invoiceRef },
    };
  } catch (error: any) {
    return { success: false, error: { code: 'ORDER_ERROR', message: error.message } };
  }
}
