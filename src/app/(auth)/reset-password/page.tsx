import { requireGuest } from '@/lib/auth-helpers';
import { ResetPasswordForm } from '@/features/iam/components/ResetPasswordForm';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  await requireGuest();

  const params = await searchParams;
  const email = typeof params.email === 'string' ? params.email : '';
  const token = typeof params.token === 'string' ? params.token : '';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <ResetPasswordForm email={email} token={token} />
    </div>
  );
}
