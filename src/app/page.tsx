import { Header } from '@/components/storefront/Header';
import { Hero } from '@/components/storefront/Hero';
import { FeaturedCollection } from '@/components/storefront/FeaturedCollection';
import { BeforeAfter } from '@/components/storefront/BeforeAfter';
import { WhyUs } from '@/components/storefront/WhyUs';
import { Testimonials } from '@/components/storefront/Testimonials';
import { SocialGallery } from '@/components/storefront/SocialGallery';
import { Footer } from '@/components/storefront/Footer';
import { Process } from '@/components/storefront/Process';
import { getStorefrontHomepageData } from '@/features/catalog/services/storefront';

export default async function Home() {
  const { productsData, testimonialsData } = await getStorefrontHomepageData();

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-black font-sans">
      {/* 1. Announcement Bar (Temporarily Disabled - Easy to Re-enable) */}
      {/* <AnnouncementBar /> */}

      {/* 2. Header / Navigation */}
      <Header />

      <main className="flex-grow bg-black">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Featured Collection (Tabs & 4x2 Grid) */}
        <FeaturedCollection initialProductsData={productsData} />

        {/* 3. Premium Immersive Scrolling Category Experience (Temporarily Hidden) */}
        {/* <PremiumScrollingCategories categories={categoriesData} /> */}

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
