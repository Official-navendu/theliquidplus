import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'ZIP/Postal Code is required'),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type PasswordInput = z.infer<typeof passwordSchema>;

export const reviewSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  rating: z.number().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  title: z.string().optional(),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const preferenceSchema = z.object({
  emailMarketing: z.boolean().default(true),
  smsMarketing: z.boolean().default(false),
});

export type PreferenceInput = z.infer<typeof preferenceSchema>;
