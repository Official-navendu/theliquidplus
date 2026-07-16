import { redirect } from 'next/navigation';

export default function AdminCmsPage() {
  redirect('/admin/cms/pages');
}
export const dynamic = 'force-dynamic';
