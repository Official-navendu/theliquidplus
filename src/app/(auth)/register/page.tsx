import { requireGuest } from '@/lib/auth-helpers';
import { RegisterForm } from '@/features/iam/components/RegisterForm';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';

export default async function RegisterPage() {
  await requireGuest();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#0A0A0A] text-white space-y-6">
      <Link href="/" className="block">
        <Logo className="h-9 w-auto hover:opacity-90 transition-opacity" />
      </Link>
      <RegisterForm />
    </div>
  );
}
export const dynamic = 'force-dynamic';
