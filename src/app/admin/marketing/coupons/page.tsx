'use client';

import * as React from 'react';
import {
  getCouponsAction,
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
  duplicateCouponAction,
  getCouponAnalyticsAction,
} from '@/features/catalog/actions/marketing';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { AdminTable } from '@/components/admin/AdminTable';
import { Plus, Trash, Edit3, Tag, Copy, ToggleLeft, ToggleRight, Sparkles, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { AdminConfirmDialog } from '@/components/admin/AdminFeedbackPrimitives';
import { useForm } from 'react-hook-form';

export default function AdminMarketingCouponsPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [analytics, setAnalytics] = React.useState<any>({
    usageCount: 0,
    revenueGenerated: 0,
    averageDiscount: 0,
    mostUsedCoupon: 'None',
    expiredCoupons: 0,
    upcomingExpiry: 0,
  });

  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<any>(null);
  
  // Confirm delete states
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { register, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      code: '',
      type: 'PERCENTAGE',
      value: 0,
      minCartValue: 0,
      maxDiscount: null,
      perUserLimit: 1,
      maxUsageCount: null,
      startDate: '',
      endDate: '',
      isActive: true,
    },
  });

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, analyticsRes] = await Promise.all([
        getCouponsAction(),
        getCouponAnalyticsAction(),
      ]);

      if (listRes.success && listRes.data) {
        setData(listRes.data);
      }
      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }
    } catch (err) {
      toast.error('Failed to query coupons catalog database');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEditClick = (c: any) => {
    setEditingCoupon(c);
    reset({
      code: c.code,
      type: c.type,
      value: Number(c.value) || 0,
      minCartValue: c.minCartValue ? Number(c.minCartValue) : 0,
      maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
      perUserLimit: c.perUserLimit || 1,
      maxUsageCount: c.maxUsageCount ? Number(c.maxUsageCount) : null,
      startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '',
      endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : '',
      isActive: c.isActive !== undefined ? c.isActive : true,
    } as any);
    setEditorOpen(true);
  };

  const handleCreateClick = () => {
    setEditingCoupon(null);
    reset({
      code: '',
      type: 'PERCENTAGE',
      value: 0,
      minCartValue: 0,
      maxDiscount: null,
      perUserLimit: 1,
      maxUsageCount: null,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    } as any);
    setEditorOpen(true);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await updateCouponAction(id, {
        code: data.find(c => c.id === id).code,
        type: data.find(c => c.id === id).type,
        value: Number(data.find(c => c.id === id).value),
        isActive: !currentActive,
        startDate: data.find(c => c.id === id).startDate,
        endDate: data.find(c => c.id === id).endDate,
      });
      if (res.success) {
        toast.success(`Coupon ${!currentActive ? 'activated' : 'deactivated'} successfully`);
        loadData();
      }
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await duplicateCouponAction(id);
      if (res.success) {
        toast.success('Coupon replicated successfully');
        loadData();
      } else {
        toast.error(res.error?.message || 'Failed to replicate coupon');
      }
    } catch (err) {
      toast.error('Network request failed');
    }
  };

  const onSubmit = async (formValues: any) => {
    try {
      const payload = {
        ...formValues,
        value: Number(formValues.value) || 0,
        minCartValue: formValues.minCartValue ? Number(formValues.minCartValue) : null,
        maxDiscount: formValues.maxDiscount ? Number(formValues.maxDiscount) : null,
        perUserLimit: Number(formValues.perUserLimit) || 1,
        maxUsageCount: formValues.maxUsageCount ? Number(formValues.maxUsageCount) : null,
      };

      let res;
      if (editingCoupon) {
        res = await updateCouponAction(editingCoupon.id, payload);
      } else {
        res = await createCouponAction(payload);
      }

      if (res.success) {
        toast.success(editingCoupon ? 'Coupon updated successfully' : 'Coupon created successfully');
        setEditorOpen(false);
        loadData();
      } else {
        toast.error(res.error?.message || 'Failed to save coupon details');
      }
    } catch (err) {
      toast.error('Error submitting coupon details to ledger');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteCouponAction(deleteTarget);
      if (res.success) {
        toast.success('Coupon deleted successfully');
        loadData();
      } else {
        toast.error(res.error?.message || 'Failed to delete coupon');
      }
    } catch (err) {
      toast.error('Network request failed');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const tableData = React.useMemo(() => {
    return data.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      valueText: coupon.type === 'PERCENTAGE' ? `${Number(coupon.value)}%` : `$${Number(coupon.value).toLocaleString()}`,
      minCartValue: coupon.minCartValue ? `$${Number(coupon.minCartValue).toLocaleString()}` : 'None',
      usage: `${coupon.currentUsageCount} / ${coupon.maxUsageCount || '∞'}`,
      expiry: new Date(coupon.endDate).toLocaleDateString(),
      status: coupon.isActive ? 'Active' : 'Inactive',
      raw: coupon,
    }));
  }, [data]);

  return (
    <div className="space-y-8 text-white text-left">
      <AdminPageHeader
        title="CRM Coupon Campaigns"
        description="Launch discount promotions, view user claims analytics, and configure checkout codes."
        actions={
          <button
            onClick={handleCreateClick}
            className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer border-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Coupon</span>
          </button>
        }
      />

      {/* Analytics widgets strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Used Claims', val: analytics.usageCount, icon: Activity },
          { label: 'Total Sales Revenue', val: `$${Math.round(analytics.revenueGenerated).toLocaleString()}`, icon: DollarSign },
          { label: 'Average Discount', val: `$${Math.round(analytics.averageDiscount).toLocaleString()}`, icon: TrendingUp },
          { label: 'Most Used Coupon', val: analytics.mostUsedCoupon, icon: Sparkles },
        ].map((met) => {
          const Icon = met.icon;
          return (
            <div key={met.label} className="p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center space-x-3 text-left">
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 text-[#FF4D00]">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="font-num text-lg font-black text-white">{met.val}</span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block mt-0.5">{met.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Table */}
        <div className="lg:col-span-2">
          <AdminCard>
            <AdminTable<any>
              isLoading={loading}
              columns={[
                { key: 'code', label: 'Promo Code', sortable: true },
                { key: 'type', label: 'Type' },
                { key: 'valueText', label: 'Value', sortable: true },
                { key: 'minCartValue', label: 'Min Cart' },
                { key: 'usage', label: 'Usage Count' },
                { key: 'expiry', label: 'Expiry Date', sortable: true },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => (
                    <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase tracking-wider border ${row.status === 'Active' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-zinc-800 border-white/5 text-zinc-500'}`}>
                      {row.status}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(row.raw)}
                        className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                        title="Edit Coupon"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(row.id, row.raw.isActive)}
                        className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                        title={row.raw.isActive ? 'Deactivate Coupon' : 'Activate Coupon'}
                      >
                        {row.raw.isActive ? <ToggleRight className="h-3.5 w-3.5 text-green-500" /> : <ToggleLeft className="h-3.5 w-3.5 text-zinc-500" />}
                      </button>
                      <button
                        onClick={() => handleDuplicate(row.id)}
                        className="p-1.5 bg-zinc-900 border border-white/5 hover:border-white rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                        title="Duplicate Coupon"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(row.id)}
                        className="p-1.5 bg-zinc-900 border border-white/5 hover:border-red-500 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={tableData}
              searchPlaceholder="Search promo codes..."
            />
          </AdminCard>
        </div>

        {/* Right 1 Column: Editor Panel */}
        {editorOpen ? (
          <div className="lg:col-span-1 border border-white/5 bg-[#0a0a0a] p-6 rounded-2xl space-y-6">
            <div className="border-b border-white/5 pb-3 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4D00]">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              <button
                onClick={() => setEditorOpen(false)}
                className="text-[9px] uppercase tracking-wider text-zinc-400 hover:text-white cursor-pointer bg-transparent border-0"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Promo Code</label>
                <input
                  type="text"
                  {...register('code')}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00] uppercase font-mono font-bold"
                  placeholder="CERAMIC30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Type</label>
                  <select
                    {...register('type')}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amt</option>
                    <option value="FREE_SHIPPING">Free Ship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Discount Value</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('value', { valueAsNumber: true })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Min Cart Value</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('minCartValue', { valueAsNumber: true })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Max Discount</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('maxDiscount', { valueAsNumber: true })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none"
                    placeholder="None"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Max Usage Count</label>
                  <input
                    type="number"
                    {...register('maxUsageCount', { valueAsNumber: true })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none"
                    placeholder="Unlimited"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Per User Limit</label>
                  <input
                    type="number"
                    {...register('perUserLimit', { valueAsNumber: true })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Start Date</label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">End Date</label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Status</label>
                <select
                  {...register('isActive', {
                    setValueAs: (val) => val === 'true',
                  })}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none cursor-pointer"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 mt-2"
              >
                Save Coupon
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-1 border border-dashed border-white/10 bg-black/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 text-zinc-500">
            <Tag className="h-8 w-8 text-zinc-600" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Select a campaign code to edit, or click create coupon to configure customer discounts</span>
          </div>
        )}
      </div>

      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon Campaign"
        message="Are you sure you want to delete this coupon? Storefront orders currently using this promo code will no longer receive the discount."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
export const dynamic = 'force-dynamic';
