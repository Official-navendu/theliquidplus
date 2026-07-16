import { db } from '@/lib/db';
import crypto from 'crypto';

export async function generateVerificationToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const identifier = `email-verify:${email}`;

  // Delete existing tokens for this identifier
  await db.verificationToken.deleteMany({
    where: { identifier },
  });

  // Create new verification token
  await db.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });

  return token;
}

export async function generateResetToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  const identifier = `password-reset:${email}`;

  // Delete existing tokens for this identifier
  await db.verificationToken.deleteMany({
    where: { identifier },
  });

  // Create new reset token
  await db.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });

  return token;
}

export async function validateToken(email: string, token: string, purpose: 'email-verify' | 'password-reset'): Promise<boolean> {
  const identifier = `${purpose}:${email}`;

  const tokenRecord = await db.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier,
        token,
      },
    },
  });

  if (!tokenRecord) {
    return false;
  }

  const isExpired = new Date() > tokenRecord.expires;

  // Single-use: delete immediately after fetching
  await db.verificationToken.delete({
    where: {
      identifier_token: {
        identifier,
        token,
      },
    },
  });

  return !isExpired;
}
