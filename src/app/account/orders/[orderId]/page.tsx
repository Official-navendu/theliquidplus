import { AccountOrderDetailsContainer } from '@/features/catalog/components/AccountOrderDetailsContainer';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function AccountOrderDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <AccountOrderDetailsContainer orderId={resolvedParams.orderId} />;
}
export const dynamic = 'force-dynamic';
