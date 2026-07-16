'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema, PasswordInput } from '../schemas/customer';
import { changePasswordAction } from '../actions/customer';
import { toast } from 'sonner';
import { Smartphone, Cpu } from 'lucide-react';

export function AccountSecurityContainer() {
  const [twoFactor, setTwoFactor] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordInput) => {
    const res = await changePasswordAction(data);
    if (res.success) {
      toast.success('Password changed successfully!');
      reset();
    } else {
      toast.error(res.error?.message || 'Failed to change password');
    }
  };

  return (
    <div className="border border-white/5 bg-[#0a0a0a] p-6 sm:p-8 rounded-xl space-y-8 text-left text-white animate-fade-in">
      {/* Change Password */}
      <div className="space-y-4">
        <div className="border-b border-white/5 pb-4">
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">Security Settings</h3>
          <p className="text-[10px] text-[#B5B5B5] font-light mt-1">Configure your login credentials and multi-factor authorization block.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md text-xs">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Current Password</label>
            <input
              type="password"
              {...register('currentPassword')}
              className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded outline-none focus:border-[#FF4D00]"
            />
            {errors.currentPassword && <span className="text-[9px] text-red-500 block">{errors.currentPassword.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">New Password</label>
            <input
              type="password"
              {...register('newPassword')}
              className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded outline-none focus:border-[#FF4D00]"
            />
            {errors.newPassword && <span className="text-[9px] text-red-500 block">{errors.newPassword.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Confirm New Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full bg-black border border-white/10 text-white px-4 py-3 rounded outline-none focus:border-[#FF4D00]"
            />
            {errors.confirmPassword && <span className="text-[9px] text-red-500 block">{errors.confirmPassword.message}</span>}
          </div>

          <div className="pt-2 flex items-center space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white px-8 py-3.5 text-[10px] tracking-widest font-black uppercase transition-all rounded-xl cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* 2FA Placeholder */}
      <div className="border-t border-white/5 pt-8 space-y-4">
        <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">Two-Factor Authentication (2FA)</h4>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-black p-5 border border-white/5 rounded-xl">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-lg bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[#FF4D00]">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#E5E5E5]">Authenticator App</h5>
              <p className="text-[10px] text-[#B5B5B5] mt-0.5 leading-relaxed">Protect your account using TOTP verification codes.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setTwoFactor(!twoFactor);
              toast.success(`2FA ${!twoFactor ? 'enabled' : 'disabled'} placeholder`);
            }}
            className={`py-2 px-5 text-[9px] tracking-widest font-black uppercase transition-all rounded-xl border cursor-pointer ${
              twoFactor
                ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white'
                : 'bg-white text-black border-white hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00]'
            }`}
          >
            {twoFactor ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Active Sessions Placeholder */}
      <div className="border-t border-white/5 pt-8 space-y-4">
        <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#B5B5B5]">Active Device Sessions</h4>
        <div className="bg-black border border-white/5 rounded-xl divide-y divide-white/5 text-xs">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Cpu className="h-4 w-4 text-[#FF4D00]" />
              <div>
                <p className="font-semibold text-[#E5E5E5]">Chrome on Windows (Current Session)</p>
                <p className="text-[9px] text-[#B5B5B5]">IP: 192.168.1.1 · Active now</p>
              </div>
            </div>
            <span className="text-[8px] bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded uppercase font-black">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AccountSecurityContainer;
