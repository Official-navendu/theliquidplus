'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordInput } from '../schemas/auth';
import { forgotPasswordAction } from '../actions/forgotPassword';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await forgotPasswordAction(data);
      if (!response.success) {
        setErrorMessage(response.error.message);
      } else {
        setSuccessMessage(
          'If an account matches that email, a password reset link has been dispatched.'
        );
        form.reset();
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A0A0A] border border-white/10 rounded-xl p-8 shadow-2xl space-y-6 text-left text-white animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-light uppercase tracking-wider text-white">Reset Password</h1>
        <p className="text-xs text-[#B5B5B5] font-light">
          Enter your email address and we will email you a secure link to reset your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20 font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20 font-medium">
              {successMessage}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] uppercase tracking-wider text-[#B5B5B5]">Email Address</FormLabel>
                <FormControl>
                  <input
                    type="email"
                    disabled={isLoading}
                    placeholder="name@example.com"
                    className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[9px] text-red-500" />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] tracking-widest font-black uppercase transition-all rounded-xl hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,77,0,0.35)] cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
          </button>
        </form>
      </Form>

      <div className="text-center pt-2 border-t border-white/5">
        <p className="text-xs text-[#B5B5B5] font-light">
          Remember your password?{' '}
          <Link href="/login" className="font-bold text-[#FF4D00] hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
export default ForgotPasswordForm;
