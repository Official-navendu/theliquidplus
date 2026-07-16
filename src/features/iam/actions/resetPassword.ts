'use server';

import { db } from '@/lib/db';
import { resetPasswordSchema, ResetPasswordInput } from '../schemas/auth';
import { validateToken } from '../utils/tokens';
import { NotFoundError, ValidationError } from '@/core/error/errors';
import { handleAppError } from '@/core/error/handler';
import { ApiResponse } from '@/types/api';
import bcrypt from 'bcryptjs';

export async function resetPasswordAction(
  email: string,
  token: string,
  input: ResetPasswordInput
): Promise<ApiResponse<{ reset: boolean }>> {
  try {
    if (!email || !token) {
      throw new ValidationError('Email and reset token are required.');
    }

    const parsed = resetPasswordSchema.parse(input);
    const { password } = parsed;

    const isValid = await validateToken(email, token, 'password-reset');
    if (!isValid) {
      throw new ValidationError('The password reset link is invalid or has expired.');
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError('No user account found matching this email address.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { email },
      data: {
        passwordHash,
      },
    });

    return {
      success: true,
      data: { reset: true },
    };
  } catch (error) {
    return handleAppError(error);
  }
}
