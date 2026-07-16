import { requireGuest } from '@/lib/auth-helpers';
import { ForgotPasswordForm } from '@/features/iam/components/ForgotPasswordForm';

export default async function ForgotPasswordPage() {
  await requireGuest();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <ForgotPasswordForm />
    </div>
  );
}
