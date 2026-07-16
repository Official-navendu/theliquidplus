import { requireGuest } from '@/lib/auth-helpers';
import { LoginForm } from '@/features/iam/components/LoginForm';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireGuest();
  const resolvedParams = await searchParams;
  const callbackUrl = typeof resolvedParams.callbackUrl === 'string' ? resolvedParams.callbackUrl : undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#0A0A0A] text-white space-y-6">
      <Link href="/" className="block">
        <Logo className="h-9 w-auto hover:opacity-90 transition-opacity" />
      </Link>
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
export const dynamic = 'force-dynamic';
