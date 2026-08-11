import { redirect } from 'next/navigation';

export default function AdminCmsPage() {
  redirect('/admin/cms/pages');
  return null;
}
export const dynamic = 'force-dynamic';
