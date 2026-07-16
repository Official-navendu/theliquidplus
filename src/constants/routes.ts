/**
 * The Liquid Plus - Application Route Constants
 * Single source of truth for routing paths.
 */
export const ROUTES = {
  // Public Storefront Routes
  STOREFRONT: {
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDER_CONFIRMATION: (id: string) => `/orders/confirmation/${id}`,
    PROFILE: '/profile',
    ORDERS: '/profile/orders',
  },
  
  // Auth Routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // Admin Portal Routes
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    PRODUCT_CREATE: '/admin/products/new',
    PRODUCT_EDIT: (id: string) => `/admin/products/${id}`,
    CATEGORIES: '/admin/categories',
    ORDERS: '/admin/orders',
    ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
    CUSTOMERS: '/admin/customers',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
    AUDIT_LOGS: '/admin/audit-logs',
  },

  // REST API Endpoints
  API: {
    AUTH: '/api/auth',
    PAYMENTS: {
      RAZORPAY: '/api/payments/razorpay',
      STRIPE: '/api/payments/stripe',
    },
    WEBHOOKS: {
      RAZORPAY: '/api/webhooks/razorpay',
      STRIPE: '/api/webhooks/stripe',
    },
  },
} as const;

export type Routes = typeof ROUTES;
export default ROUTES;
