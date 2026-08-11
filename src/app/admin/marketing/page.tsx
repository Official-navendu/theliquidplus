import { redirect } from 'next/navigation';

export default function AdminMarketingPage() {
  redirect('/admin/marketing/coupons');
  return null;
}
export const dynamic = 'force-dynamic';
