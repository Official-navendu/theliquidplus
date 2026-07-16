import { auth, signIn as authSignIn, signOut as authSignOut } from './auth';
import { redirect } from 'next/navigation';
import { UserType } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  role: UserType;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    role: session.user.role,
  };
}

export async function requireAuth(allowedRoles?: UserType[]): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect('/');
  }
  return user;
}

export async function requireGuest(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    const dest = (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') ? '/admin' : '/account';
    redirect(dest);
  }
}

export async function signIn(provider?: string, options?: Record<string, unknown>) {
  return authSignIn(provider, options);
}

export async function signOut(options?: Record<string, unknown>) {
  return authSignOut(options);
}
