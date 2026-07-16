import { redirect } from 'next/navigation';

export default function AdminMarketingPage() {
  redirect('/admin/marketing/coupons');
}
export const dynamic = 'force-dynamic';
