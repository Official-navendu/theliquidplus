'use server';

import { signOut } from '@/lib/auth-helpers';

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/login' });
}
