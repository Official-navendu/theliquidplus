'use server';

import { db } from '@/lib/db';
import { registerSchema, RegisterInput } from '../schemas/auth';
import { generateVerificationToken } from '../utils/tokens';
import { sendVerificationEmail } from '../utils/email';
import { ConflictError } from '@/core/error/errors';
import { handleAppError } from '@/core/error/handler';
import { ApiResponse } from '@/types/api';
import bcrypt from 'bcryptjs';
import { UserStatus, UserType } from '@prisma/client';

export async function registerAction(input: RegisterInput): Promise<ApiResponse<{ email: string }>> {
  try {
    const parsed = registerSchema.parse(input);
    const { email, password, firstName, lastName } = parsed;

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('An account with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create User, Profile and default Role inside a transaction
    await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          status: UserStatus.ACTIVE,
          type: UserType.CUSTOMER,
          isActive: true,
        },
      });

      await tx.customerProfile.create({
        data: {
          userId: newUser.id,
          firstName,
          lastName,
        },
      });

      // Find standard customer role
      const customerRole = await tx.role.findUnique({
        where: { name: 'CUSTOMER' },
      });

      if (customerRole) {
        await tx.userRole.create({
          data: {
            userId: newUser.id,
            roleId: customerRole.id,
          },
        });
      }
    });

    // Generate and send verification email
    const token = await generateVerificationToken(email);
    await sendVerificationEmail(email, token);

    return {
      success: true,
      data: { email },
    };
  } catch (error) {
    return handleAppError(error);
  }
}
