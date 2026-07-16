/**
 * The Liquid Plus - System Messages (User-facing and API)
 */
export const MESSAGES = {
  ERROR: {
    DEFAULT: 'Something went wrong. Please try again later.',
    UNAUTHORIZED: 'You must be logged in to access this page.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    VALIDATION_FAILED: 'Validation failed. Please review input parameters.',
    NOT_FOUND: 'The requested resource was not found.',
    CART_EMPTY: 'Your cart is empty. Add products before checkout.',
    PAYMENT_FAILED: 'Payment authorization failed. Please try a different card.',
  },
  SUCCESS: {
    DEFAULT: 'Operation completed successfully.',
    PRODUCT_CREATED: 'Product added successfully to catalog.',
    PRODUCT_UPDATED: 'Product configuration saved.',
    ORDER_PLACED: 'Thank you for your purchase! Your order has been placed.',
    PROFILE_UPDATED: 'Profile details saved.',
  },
} as const;

export type SystemMessages = typeof MESSAGES;
export default MESSAGES;
