'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { AdminPageHeader, AdminCard, AdminSection } from '@/components/admin/AdminLayoutPrimitives';
import { toast } from 'sonner';

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const [phone, setPhone] = React.useState('+91 99999 88888');
  
  const user = session?.user;
  const name = user?.email ? user.email.split('@')[0] : 'Admin User';
  const email = user?.email || 'admin@theliquidplus.com';
  const role = user?.role || 'SUPER_ADMIN';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Admin profile credentials updated successfully!');
  };

  return (
    <div className="space-y-8 text-left">
      <AdminPageHeader
        title="Admin User Profile"
        description="Inspect and manage your administrative privileges, security codes, and contact info."
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <AdminCard className="space-y-6">
          <div className="flex items-center space-x-5 border-b border-white/5 pb-6">
            <div className="h-16 w-16 rounded-2xl bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center font-bold text-xl text-[#FF4D00]">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-zinc-100 uppercase">{name}</h3>
              <span className="text-[9px] bg-[#FF4D00]/15 text-[#FF4D00] border border-[#FF4D00]/20 px-2 py-0.5 rounded uppercase font-black tracking-widest mt-1 inline-block">
                {role}
              </span>
            </div>
          </div>

          <AdminSection title="Personal Credentials">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-zinc-900 border border-white/5 text-zinc-500 text-xs px-4 py-3 rounded-xl cursor-not-allowed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Contact Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3 rounded-xl focus:border-[#FF4D00] outline-none"
                />
              </div>
            </div>
          </AdminSection>

          <div className="pt-2 border-t border-white/5">
            <button
              type="submit"
              className="bg-white text-black hover:bg-[#FF4D00] hover:text-black px-8 py-3.5 text-[10px] tracking-widest font-black uppercase transition-colors rounded-xl cursor-pointer"
            >
              Update Profile Details
            </button>
          </div>
        </AdminCard>
      </form>
    </div>
  );
}
export const dynamic = 'force-dynamic';
