/**
 * The Liquid Plus - Site Configuration
 * Single source of truth for global SEO metadata and static navigation maps.
 */
export const SITE_CONFIG = {
  name: 'The Liquid Plus',
  shortName: 'Liquid Plus',
  description: 'Enterprise eCommerce platform offering premium experiences.',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/theliquidplus',
  },
  seo: {
    defaultTitle: 'The Liquid Plus | Premium eCommerce',
    titleTemplate: '%s | The Liquid Plus',
    keywords: [
      'eCommerce',
      'Premium shopping',
      'Next.js 15 App Router',
      'Tailwind CSS v4',
      'Luxury products',
      'Enterprise catalog',
    ],
  },
  
  // Navigation Structures
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
  ],

  adminNav: [
    { title: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { title: 'Products', href: '/admin/products', icon: 'Package' },
    { title: 'Categories', href: '/admin/categories', icon: 'FolderTree' },
    { title: 'Orders', href: '/admin/orders', icon: 'ShoppingBag' },
    { title: 'Customers', href: '/admin/customers', icon: 'Users' },
    { title: 'Analytics', href: '/admin/analytics', icon: 'BarChart' },
    { title: 'Audit Logs', href: '/admin/audit-logs', icon: 'History' },
    { title: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ],
} as const;

export type SiteConfig = typeof SITE_CONFIG;
export default SITE_CONFIG;
