'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  getBrandsAndCategoriesAction,
  getProductByIdAction,
  updateProductAction,
} from '@/features/catalog/actions/product';
import { ProductForm } from '@/features/catalog/components/ProductForm';
import { toast } from 'sonner';
import { AdminLoading } from '@/components/admin/AdminFeedbackPrimitives';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [product, setProduct] = React.useState<SafeAny>(null);
  const [setup, setSetup] = React.useState<{
    brands: SafeAny[];
    categories: SafeAny[];
    collections: SafeAny[];
  }>({
    brands: [],
    categories: [],
    collections: [],
  });

  React.useEffect(() => {
    async function loadData() {
      try {
        const [setupRes, productRes] = await Promise.all([
          getBrandsAndCategoriesAction(),
          getProductByIdAction(productId),
        ]);

        if (setupRes.success && setupRes.data) {
          setSetup(setupRes.data);
        }
        if (productRes.success && productRes.data) {
          setProduct(productRes.data);
        } else {
          toast.error(productRes.error?.message || 'Failed to locate product ledger record');
          router.push('/admin/products');
        }
      } catch {
        toast.error('Failed to communicate with setup or catalog ledgers');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId, router]);

  const handleSubmit = async (data: SafeAny) => {
    setIsSubmitting(true);
    try {
      const res = await updateProductAction(productId, data);
      if (res.success) {
        toast.success('Product ledger updated successfully');
        router.push('/admin/products');
        router.refresh();
      } else {
        toast.error(res.error?.message || 'Failed to update product record');
      }
    } catch (err: SafeAny) {
      console.error('Update product submission error:', err);
      toast.error(err?.message || 'Error submitting product modifications');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <ProductForm
      initialData={product}
      brands={setup.brands}
      categories={setup.categories}
      collections={setup.collections}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
export const dynamic = 'force-dynamic';
