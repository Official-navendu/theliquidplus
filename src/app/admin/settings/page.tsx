'use client';

import * as React from 'react';
import { AdminPageHeader, AdminCard, AdminSection } from '@/components/admin/AdminLayoutPrimitives';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = React.useState('The Liquid Plus');
  const [supportEmail, setSupportEmail] = React.useState('enterprise@theliquidplus.com');
  const [currency, setCurrency] = React.useState('USD');
  const [maintenance, setMaintenance] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Global enterprise configurations updated successfully!');
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Global Admin Settings"
        description="Configure global store configurations, payment gateways, currencies, and tax rules."
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl text-left">
        <AdminCard className="space-y-6">
          <AdminSection title="Core Store Metadata">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3 rounded-xl focus:border-[#FF4D00] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Support Email Address</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3 rounded-xl focus:border-[#FF4D00] outline-none"
                />
              </div>
            </div>
          </AdminSection>

          <AdminSection title="Currency & Locales">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Default Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3 rounded-xl focus:border-[#FF4D00] outline-none cursor-pointer"
                >
                  <option value="USD">USD ($) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                </select>
              </div>
            </div>
          </AdminSection>

          <AdminSection title="System Diagnostics">
            <div className="pt-2">
              <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5 rounded-xl">
                <div className="text-left space-y-0.5 max-w-xl">
                  <span className="text-xs font-semibold text-zinc-200 block">Storefront Maintenance Mode</span>
                  <p className="text-[9px] text-zinc-500 font-light leading-relaxed">
                    Instantly intercept public storefront requests with a customizable maintenance landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenance(!maintenance)}
                  className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-300 relative cursor-pointer ${
                    maintenance ? 'bg-red-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-black shadow-md transform transition-transform duration-300 ${
                      maintenance ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </AdminSection>

          <div className="pt-2 border-t border-white/5">
            <button
              type="submit"
              className="bg-white text-black hover:bg-[#FF4D00] hover:text-black px-8 py-3.5 text-[10px] tracking-widest font-black uppercase transition-colors rounded-xl cursor-pointer"
            >
              Save Storefront Settings
            </button>
          </div>
        </AdminCard>
      </form>
    </div>
  );
}
export const dynamic = 'force-dynamic';
