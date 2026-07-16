'use server';

import { db } from '@/lib/db';
import { validateToken } from '../utils/tokens';
import { NotFoundError, ValidationError } from '@/core/error/errors';
import { handleAppError } from '@/core/error/handler';
import { ApiResponse } from '@/types/api';

export async function verifyEmailAction(email: string, token: string): Promise<ApiResponse<{ verified: boolean }>> {
  try {
    if (!email || !token) {
      throw new ValidationError('Email and verification token are required.');
    }

    const isValid = await validateToken(email, token, 'email-verify');
    if (!isValid) {
      throw new ValidationError('The verification link is invalid or has expired.');
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError('No user account found matching this email address.');
    }

    await db.user.update({
      where: { email },
      data: {
        emailVerifiedAt: new Date(),
      },
    });

    return {
      success: true,
      data: { verified: true },
    };
  } catch (error) {
    return handleAppError(error);
  }
}
