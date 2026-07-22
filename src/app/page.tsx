/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
// import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Hero } from '@/components/storefront/Hero';
import { FeaturedCollection } from '@/components/storefront/FeaturedCollection';
import { LimitedTimeSale } from '@/components/storefront/LimitedTimeSale';
import { BeforeAfter } from '@/components/storefront/BeforeAfter';
import { ExploreCollections } from '@/components/storefront/ExploreCollections';
import { WhyUs } from '@/components/storefront/WhyUs';
import { Testimonials } from '@/components/storefront/Testimonials';
import { SocialGallery } from '@/components/storefront/SocialGallery';
import { Footer } from '@/components/storefront/Footer';
import { Process } from '@/components/storefront/Process';
import PremiumScrollingCategories from '@/components/home/PremiumScrollingCategories';
import { db } from '@/lib/db';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';

export default async function Home() {
  // Query all database resources concurrently to avoid waterfalls
  const [categoriesRaw, brandsRaw, productsRaw, reviewsRaw] = await Promise.all([
    db.category.findMany({
      where: {
        parentId: null,
        status: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    }),
    db.brand.findMany({ take: 10 }),
    db.product.findMany({
      where: {
        status: { in: ["ACTIVE", "DRAFT", "REVIEW"] },
      },
      include: {
        brand: true,
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
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        variants: true,
        reviews: {
          where: {
            status: "APPROVED",
          },
        },
      },
    }),
    db.productReview.findMany({
      where: { status: 'APPROVED', rating: 5 },
      include: {
        user: { include: { customerProfile: true } },
        product: true,
      },
      take: 8,
    }),
  ]);

  const categoriesData = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    imageUrl: c.imageUrl,
  }));

  const brandsData = brandsRaw.length > 0 ? brandsRaw.map((b) => b.name) : undefined;

  const mapProductToItem = (p: any) => {
    const ratingVal = p.reviews.length > 0 ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length : 4.8;
    const primaryImage = p.images[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600';
    const baseVariant = p.variants[0] || {};
    const price = Number(baseVariant.price) || 1500;
    const comparePrice = baseVariant.comparePrice ? `$${Number(baseVariant.comparePrice).toLocaleString('en-US')}` : undefined;

    return {
      id: p.id,
      name: p.title,
      slug: p.slug,
      category: p.productCategories[0]?.category?.name || "Detailing Product",
      price: `$${price.toLocaleString('en-US')}`,
      comparePrice,
      rating: ratingVal,
      reviewsCount: p.reviews.length || 5,
      image: primaryImage,
      onSale: !!baseVariant.comparePrice,
      brand: p.brand?.name || 'The Liquid Plus',
    };
  };

  const featured = productsRaw
    .filter((p) => p.isFeatured || p.productCollections?.some((pc) => pc.collection?.slug === 'featured'))
    .map(mapProductToItem);
  const bestSellers = productsRaw
    .filter((p) => p.productCollections?.some((pc) => pc.collection?.slug === 'best-sellers'))
    .map(mapProductToItem);
  const trending = productsRaw
    .filter((p) => p.productCollections?.some((pc) => pc.collection?.slug === 'trending'))
    .map(mapProductToItem);
  const newArrivals = productsRaw
    .filter((p) => p.productCollections?.some((pc) => pc.collection?.slug === 'new-arrivals'))
    .map(mapProductToItem);

  const productsData: any = {
    'Featured': featured.length > 0 ? featured : undefined,
    'Best Sellers': bestSellers.length > 0 ? bestSellers : undefined,
    'Trending': trending.length > 0 ? trending : undefined,
    'New Arrivals': newArrivals.length > 0 ? newArrivals : undefined,
    'Most Popular': featured.length > 0 ? featured : undefined,
  };

  const testimonialsData = reviewsRaw.length > 0 ? reviewsRaw.map((r, idx) => {
    const profile = r.user?.customerProfile;
    const name = profile && profile.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : r.user?.email || 'Verified Customer';
    return {
      id: idx + 1,
      name,
      vehicle: r.product?.title || 'Product User',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
      quote: r.comment || 'Amazing product results.',
    };
  }) : undefined;

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-clip font-sans">
      {/* 1. Announcement Bar (Temporarily Disabled - Easy to Re-enable) */}
      {/* <AnnouncementBar /> */}

      {/* 2. Header / Navigation */}
      <Header />

      <main className="flex-grow bg-black">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Featured Collection (Tabs & 4x2 Grid) */}
        <FeaturedCollection initialProductsData={productsData} />

        {/* 3. Premium Immersive Scrolling Category Experience */}
        <PremiumScrollingCategories categories={categoriesData} />

        {/* 5. Limited Time Sale (Temporarily Disabled) */}
        {/* <LimitedTimeSale /> */}

        {/* 6. Before & After Showcase Slider */}
        <BeforeAfter />

        {/* 7. Why Choose The Liquid Plus (Advantage widgets) */}
        <WhyUs />

        {/* 8. Detailing Process Timeline */}
        <Process />

        {/* 9. Customer Testimonials Carousel */}
        <Testimonials testimonialsData={testimonialsData} />

        {/* 10. Instagram Photo Grid Gallery */}
        <SocialGallery />
      </main>

      {/* 15. Footer Links & Copyright */}
      <Footer />
    </div>
  );
}
export const revalidate = 300;
