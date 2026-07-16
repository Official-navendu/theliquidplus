'use server';

import { db } from '@/lib/db';
import { forgotPasswordSchema, ForgotPasswordInput } from '../schemas/auth';
import { generateResetToken } from '../utils/tokens';
import { sendResetPasswordEmail } from '../utils/email';
import { handleAppError } from '@/core/error/handler';
import { ApiResponse } from '@/types/api';

export async function forgotPasswordAction(input: ForgotPasswordInput): Promise<ApiResponse<{ sent: boolean }>> {
  try {
    const parsed = forgotPasswordSchema.parse(input);
    const { email } = parsed;

    const user = await db.user.findUnique({
      where: { email },
    });

    // Timing attack mitigation: do not reveal whether user email exists.
    // We return success to prevent user enumeration.
    if (!user || !user.isActive) {
      return {
        success: true,
        data: { sent: true },
      };
    }

    const token = await generateResetToken(email);
    await sendResetPasswordEmail(email, token);

    return {
      success: true,
      data: { sent: true },
    };
  } catch (error) {
    return handleAppError(error);
  }
}
