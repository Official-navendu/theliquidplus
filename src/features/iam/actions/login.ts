'use server';

import { signIn } from '@/lib/auth-helpers';
import { loginSchema, LoginInput } from '../schemas/auth';
import { handleAppError } from '@/core/error/handler';
import { ApiResponse } from '@/types/api';
import { AuthError } from 'next-auth';
import { db } from '@/lib/db';

export async function loginAction(input: LoginInput, redirectTo = '/'): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const parsed = loginSchema.parse(input);
    const { email, password } = parsed;

    const user = await db.user.findUnique({ where: { email } });
    const targetRedirect = redirectTo === '/' 
      ? (user?.type === 'SUPER_ADMIN' || user?.type === 'ADMIN' ? '/admin/dashboard' : '/account')
      : redirectTo;

    await signIn('credentials', {
      email,
      password,
      redirectTo: targetRedirect,
    });

    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Invalid email address or password.',
            },
          };
        default:
          return {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication failed. Please check your credentials.',
            },
          };
      }
    }

    // NextAuth throws a redirect on success, which we must bubble up
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    return handleAppError(error);
  }
}
