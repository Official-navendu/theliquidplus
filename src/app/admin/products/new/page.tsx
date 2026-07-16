'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getBrandsAndCategoriesAction, createProductAction } from '@/features/catalog/actions/product';
import { ProductForm } from '@/features/catalog/components/ProductForm';
import { toast } from 'sonner';
import { AdminLoading } from '@/components/admin/AdminFeedbackPrimitives';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [setup, setSetup] = React.useState<{ brands: any[]; categories: any[]; collections: any[] }>({
    brands: [],
    categories: [],
    collections: [],
  });

  React.useEffect(() => {
    async function loadSetup() {
      try {
        const res = await getBrandsAndCategoriesAction();
        if (res.success && res.data) {
          setSetup(res.data);
        } else {
          toast.error(res.error?.message || 'Failed to retrieve setup variables');
        }
      } catch (err) {
        toast.error('Failed to communicate with setup ledger');
      } finally {
        setLoading(false);
      }
    }
    loadSetup();
  }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await createProductAction(data);
      if (res.success) {
        toast.success('Product registered successfully in store catalog');
        router.push('/admin/products');
        router.refresh();
      } else {
        toast.error(res.error?.message || 'Failed to create product record');
      }
    } catch (err) {
      toast.error('Error submitting product product to ledger');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <ProductForm
      brands={setup.brands}
      categories={setup.categories}
      collections={setup.collections}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
export const dynamic = 'force-dynamic';
