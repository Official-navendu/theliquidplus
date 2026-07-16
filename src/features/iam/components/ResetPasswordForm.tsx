'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordInput } from '../schemas/auth';
import { resetPasswordAction } from '../actions/resetPassword';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import Link from 'next/link';

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
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

  async function onSubmit(data: ResetPasswordInput) {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await resetPasswordAction(email, token, data);
      if (!response.success) {
        setErrorMessage(response.error.message);
      } else {
        setSuccessMessage('Password reset successfully! You can now log in with your new password.');
        form.reset();
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-green-50 text-green-600 text-sm rounded-md border border-green-200">
                {successMessage}
              </div>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Strength Indicator */}
            {passwordValue.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className="font-semibold">{strengthLabel}</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColor}`}
                    style={{ width: `${(metCount / requirements.length) * 100}%` }}
                  />
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {requirements.map((r, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className={r.met ? 'text-green-600' : 'text-gray-400'}>
                        {r.met ? '✓' : '•'}
                      </span>
                      <span className={r.met ? 'text-green-600 line-through' : ''}>
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
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? 'Resetting password...' : 'Reset Password'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center text-muted-foreground w-full">
          Ready to log in?{' '}
          <Link href="/login" className="font-semibold text-foreground hover:underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
export default ResetPasswordForm;
