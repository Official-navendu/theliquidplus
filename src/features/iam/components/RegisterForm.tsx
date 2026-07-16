'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '../schemas/auth';
import { registerAction } from '../actions/register';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import Link from 'next/link';

export function RegisterForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = form.watch('password') || '';

  // Password strength logic
  const requirements = [
    { label: 'At least 8 characters', met: passwordValue.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(passwordValue) },
    { label: 'At least one lowercase letter', met: /[a-z]/.test(passwordValue) },
    { label: 'At least one number', met: /\d/.test(passwordValue) },
    { label: 'At least one special character (@$!%*?&)', met: /[@$!%*?&]/.test(passwordValue) },
  ];

  const metCount = requirements.filter((r) => r.met).length;

  const strengthColor =
    metCount <= 2 ? 'bg-red-500' : metCount <= 4 ? 'bg-amber-500' : 'bg-green-500';

  const strengthLabel =
    metCount === 0 ? 'Empty' : metCount <= 2 ? 'Weak' : metCount <= 4 ? 'Fair' : 'Strong';

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await registerAction(data);
      if (!response.success) {
        setErrorMessage(response.error.message);
      } else {
        setSuccessMessage('Registration successful! Please check your email to verify your account.');
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
        <h1 className="text-2xl font-light uppercase tracking-wider text-white">Create Account</h1>
        <p className="text-xs text-[#B5B5B5] font-light">
          Enter your details below to set up your detailing studio profile.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] uppercase tracking-wider text-[#B5B5B5]">First Name</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      disabled={isLoading}
                      placeholder="John"
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
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[10px] uppercase tracking-wider text-[#B5B5B5]">Last Name</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      disabled={isLoading}
                      placeholder="Doe"
                      className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none transition-colors rounded"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px] text-red-500" />
                </FormItem>
              )}
            />
          </div>

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
                <FormLabel className="text-[10px] uppercase tracking-wider text-[#B5B5B5]">Password</FormLabel>
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

          {/* Password Strength Indicator */}
          {passwordValue.length > 0 && (
            <div className="space-y-2 p-3 bg-black border border-white/5 rounded">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#B5B5B5] uppercase tracking-wider">Password strength:</span>
                <span className="font-bold text-white">{strengthLabel}</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor}`}
                  style={{ width: `${(metCount / requirements.length) * 100}%` }}
                />
              </div>
              <ul className="text-[9px] text-[#B5B5B5] space-y-1.5 pt-1 uppercase tracking-wider font-semibold">
                {requirements.map((r, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className={r.met ? 'text-green-500' : 'text-[#B5B5B5]'}>
                      {r.met ? '✓' : '•'}
                    </span>
                    <span className={r.met ? 'text-green-500 line-through' : ''}>
                      {r.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] uppercase tracking-wider text-[#B5B5B5]">Confirm Password</FormLabel>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] tracking-widest font-black uppercase transition-all rounded-xl hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,77,0,0.35)] cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </Form>

      <div className="text-center pt-2 border-t border-white/5">
        <p className="text-xs text-[#B5B5B5] font-light">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#FF4D00] hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
export default RegisterForm;
