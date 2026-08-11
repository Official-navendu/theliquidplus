import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  RESEND_API_KEY: z.string().min(1),

  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),

  STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),

  // Placeholders (Disabled/Optional in Phase 1)
  REDIS_URL: z.string().url().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Perform validation
const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  REDIS_URL: process.env.REDIS_URL,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  NODE_ENV: process.env.NODE_ENV,
};

// Check if we are running in an environment where process.env is populated (e.g. Node server side)
const isServer = typeof window === 'undefined';

let env: z.infer<typeof envSchema>;

if (isServer) {
  const parsed = envSchema.safeParse(processEnv);

  if (!parsed.success) {
    console.error('❌ Environment configuration validation failed:');
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    throw new Error('Invalid environment variables. Please check your .env file configurations.');
  }

  env = parsed.data;
} else {
  // Client side fallback for non-sensitive placeholders if required in future
  env = processEnv as unknown as z.infer<typeof envSchema>;
}

export { env };
export default env;
