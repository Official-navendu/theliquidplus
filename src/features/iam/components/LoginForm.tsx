'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '../schemas/auth';
import { loginAction } from '../actions/login';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import Link from 'next/link';

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await loginAction(data, callbackUrl);
      if (!response.success) {
        setErrorMessage(response.error.message);
      } else {
        setSuccessMessage('Logged in successfully! Redirecting...');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A0A0A] border border-white/10 rounded-xl p-8 shadow-2xl space-y-6 text-left text-white">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-light uppercase tracking-wider text-white">Sign In</h1>
        <p className="text-xs text-[#B5B5B5] font-light">
          Enter your email and password to access your detailing studio account.
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-[10px] uppercase tracking-wider text-[#B5B5B5]">Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] uppercase tracking-wider text-[#FF4D00] hover:text-[#FF4D00]/80 font-bold transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <FormControl>
                  <input
                    type="password"
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[9px] text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="flex items-center space-x-2 space-y-0 pt-1">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 bg-black border-white/10 text-[#FF4D00] rounded focus:ring-0"
                    {...field}
                  />
                </FormControl>
                <span className="text-xs text-[#B5B5B5] font-light cursor-pointer select-none">
                  Remember me for 30 days
                </span>
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] tracking-widest font-black uppercase transition-all rounded-xl hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,77,0,0.35)] cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </Form>

      <div className="text-center pt-2 border-t border-white/5">
        <p className="text-xs text-[#B5B5B5] font-light">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-[#FF4D00] hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
export default LoginForm;
