import { resend } from '@/lib/resend';
import { env } from '@/config/env';

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verifyLink = `${env.NEXTAUTH_URL}/verify-email?email=${encodeURIComponent(email)}&token=${token}`;

  await resend.emails.send({
    from: 'The Liquid Plus <onboarding@resend.dev>', // Resend sandbox default sender
    to: email,
    subject: 'Verify your email address - The Liquid Plus',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #111;">Welcome to The Liquid Plus</h2>
        <p>Thank you for registering. Please click the button below to verify your email address and activate your account:</p>
        <div style="margin: 30px 0;">
          <a href="${verifyLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email</a>
        </div>
        <p style="color: #666; font-size: 14px;">This link will expire in 24 hours. If you did not register for this account, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999;">The Liquid Plus, Inc.</p>
      </div>
    `,
  });
}

export async function sendResetPasswordEmail(email: string, token: string): Promise<void> {
  const resetLink = `${env.NEXTAUTH_URL}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

  await resend.emails.send({
    from: 'The Liquid Plus <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your password - The Liquid Plus',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #111;">Password Reset Request</h2>
        <p>You requested to reset your password for your The Liquid Plus account. Please click the button below to set a new password:</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 14px;">This link will expire in 30 minutes. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999;">The Liquid Plus, Inc.</p>
      </div>
    `,
  });
}
