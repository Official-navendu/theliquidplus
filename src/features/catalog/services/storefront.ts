import { cache } from 'react';
import { db } from '@/lib/db';
import { Product, PRODUCTS } from '../constants/products';

export const getStorefrontProducts = cache(async (): Promise<Product[]> => {
  const list = await db.product.findMany({
    where: {
      status: { in: ['ACTIVE', 'DRAFT', 'REVIEW'] },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      isFeatured: true,
      brand: {
        select: { name: true },
      },
      productCategories: {
        select: {
          category: { select: { name: true } },
        },
        take: 1,
      },
      productCollections: {
        select: {
          collection: { select: { slug: true } },
        },
      },
      images: {
        select: { url: true },
        orderBy: { sortOrder: 'asc' },
        take: 2,
      },
      variants: {
        select: {
          price: true,
          comparePrice: true,
          inventoryItem: { select: { quantity: true } },
        },
        take: 1,
      },
      reviews: {
        where: { status: 'APPROVED' },
        select: { rating: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 40,
  });

  if (!list || list.length === 0) {
    return PRODUCTS;
  }

  return list.map((p) => {
    const reviewsList = p.reviews || [];
    const ratingVal =
      reviewsList.length > 0
        ? Number(
            (
              reviewsList.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) /
              reviewsList.length
            ).toFixed(1),
          )
        : 4.8;

    const primaryImage =
      p.images[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600';
    const hoverImage = p.images[1]?.url || primaryImage;

    const baseVariant = p.variants[0] || {};
    const price = Number(baseVariant.price) || 1500;
    const compareAtPrice = baseVariant.comparePrice ? Number(baseVariant.comparePrice) : undefined;
    const inStock = (baseVariant.inventoryItem?.quantity || 0) > 0;

    const collectionsSlugs =
      (p.productCollections
        ?.map((pc: { collection: { slug: string } | null }) => pc.collection?.slug)
        .filter(Boolean) as string[]) || [];
    const isFeatured = p.isFeatured || collectionsSlugs.includes('featured');
    const isBestSeller = collectionsSlugs.includes('best-sellers');
    const isTrending = collectionsSlugs.includes('trending');
    const isNew = collectionsSlugs.includes('new-arrivals');

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
      productType: 'coating',
      collections: collectionsSlugs,
    };
  });
});

export const getStorefrontHomepageData = cache(async () => {
  // Parallel lean queries — homepage cards do not need full descriptions or all reviews
  const [list, reviewsRaw] = await Promise.all([
    db.product.findMany({
      where: {
        status: { in: ['ACTIVE', 'DRAFT', 'REVIEW'] },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        isFeatured: true,
        brand: {
          select: { name: true },
        },
        productCategories: {
          select: {
            category: { select: { name: true } },
          },
          take: 1,
        },
        productCollections: {
          select: {
            collection: { select: { slug: true } },
          },
        },
        images: {
          select: { url: true },
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
        variants: {
          select: {
            price: true,
            comparePrice: true,
          },
          take: 1,
        },
        reviews: {
          where: { status: 'APPROVED' },
          select: { rating: true },
          take: 20,
        },
        _count: {
          select: {
            reviews: { where: { status: 'APPROVED' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 24,
    }),
    db.productReview.findMany({
      where: { status: 'APPROVED', rating: 5 },
      select: {
        id: true,
        rating: true,
        comment: true,
        user: {
          select: {
            email: true,
            customerProfile: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        product: { select: { title: true } },
      },
      take: 8,
    }),
  ]);

  type HomepageProduct = {
    id: string;
    name: string;
    slug: string;
    category: string;
    brand: string;
    price: number;
    compareAtPrice?: number;
    rating: number;
    reviewsCount: number;
    image: string;
    isFeatured: boolean;
    isBestSeller: boolean;
    isTrending: boolean;
    collections: string[];
  };

  const products: HomepageProduct[] =
    list.length > 0
      ? list.map((p) => {
          const reviewsList = p.reviews || [];
          const ratingVal =
            reviewsList.length > 0
              ? Number(
                  (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(
                    1,
                  ),
                )
              : 4.8;

          const collectionsSlugs =
            (p.productCollections?.map((pc) => pc.collection?.slug).filter(Boolean) as string[]) ||
            [];

          const baseVariant = p.variants[0];
          return {
            id: p.id,
            name: p.title,
            slug: p.slug,
            category: p.productCategories?.[0]?.category?.name || 'Detailing Product',
            brand: p.brand?.name || 'The Liquid Plus',
            price: Number(baseVariant?.price) || 1500,
            compareAtPrice: baseVariant?.comparePrice
              ? Number(baseVariant.comparePrice)
              : undefined,
            rating: ratingVal,
            reviewsCount: p._count.reviews || reviewsList.length || 5,
            image:
              p.images[0]?.url ||
              'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
            isFeatured: p.isFeatured || collectionsSlugs.includes('featured'),
            isBestSeller: collectionsSlugs.includes('best-sellers'),
            isTrending: collectionsSlugs.includes('trending'),
            collections: collectionsSlugs,
          };
        })
      : PRODUCTS.slice(0, 24).map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          brand: p.brand,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          image: p.image,
          isFeatured: !!p.isFeatured,
          isBestSeller: !!p.isBestSeller,
          isTrending: !!p.isTrending,
          collections: p.collections || [],
        }));

  const mapProductToItem = (p: HomepageProduct) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: `$${p.price.toLocaleString('en-US')}`,
    comparePrice: p.compareAtPrice ? `$${p.compareAtPrice.toLocaleString('en-US')}` : undefined,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    image: p.image,
    onSale: !!p.compareAtPrice,
    brand: p.brand,
  });

  const limit = <T>(items: T[]) => items.slice(0, 8);

  let curated = limit(
    products
      .filter((p) => p.isFeatured || p.collections.includes('featured'))
      .map(mapProductToItem),
  );
  let trendingNow = limit(
    products
      .filter((p) => p.isBestSeller || p.isTrending || p.collections.includes('best-sellers'))
      .map(mapProductToItem),
  );
  let essentials = limit(
    products
      .filter(
        (p) => p.collections.includes('tools') || p.category.toLowerCase().includes('microfiber'),
      )
      .map(mapProductToItem),
  );

  if (curated.length === 0 && products.length > 0) {
    curated = limit(products.slice(0, 8).map(mapProductToItem));
  }
  if (trendingNow.length === 0 && products.length > 0) {
    trendingNow = limit(
      products
        .slice(Math.min(4, Math.max(0, products.length - 4)), Math.min(12, products.length))
        .map(mapProductToItem),
    );
  }
  if (essentials.length === 0 && products.length > 0) {
    essentials = limit(products.slice(Math.max(0, products.length - 8)).map(mapProductToItem));
  }

  const testimonialsData =
    reviewsRaw.length > 0
      ? reviewsRaw.map((r, idx) => {
          const profile = r.user?.customerProfile;
          const name =
            profile && profile.firstName
              ? `${profile.firstName} ${profile.lastName || ''}`.trim()
              : r.user?.email || 'Verified Customer';
          return {
            id: idx + 1,
            name,
            vehicle: r.product?.title || 'Product User',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
            quote: r.comment || 'Amazing product results.',
          };
        })
      : undefined;

  return {
    productsData: {
      Curated: curated,
      'Trending Now': trendingNow,
      Essentials: essentials,
    },
    testimonialsData,
  };
});
