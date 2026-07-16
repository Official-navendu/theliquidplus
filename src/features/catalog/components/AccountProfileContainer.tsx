'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileInput } from '../schemas/customer';
import { getProfileData, updateProfileData } from '../actions/customer';
import { toast } from 'sonner';

export function AccountProfileContainer() {
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      gender: 'Male',
    },
  });

  React.useEffect(() => {
    async function loadData() {
      const res = await getProfileData();
      if (res.success && res.data) {
        setValue('firstName', res.data.firstName || '');
        setValue('lastName', res.data.lastName || '');
        setValue('email', res.data.email || '');
        setValue('phone', res.data.phone || localStorage.getItem('profile_phone') || '+91 98765 43210');
        setValue('dob', res.data.dob || localStorage.getItem('profile_dob') || '1995-08-15');
        setValue('gender', res.data.gender || localStorage.getItem('profile_gender') || 'Male');
      }
      setIsLoading(false);
    }
    loadData();
  }, [setValue]);

  const onSubmit = async (data: ProfileInput) => {
    // Save phone, dob, gender in localStorage as they are not in user database model
    if (data.phone) localStorage.setItem('profile_phone', data.phone);
    if (data.dob) localStorage.setItem('profile_dob', data.dob);
    if (data.gender) localStorage.setItem('profile_gender', data.gender);

    const res = await updateProfileData({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });

    if (res.success) {
      toast.success('Profile settings updated successfully!');
    } else {
      toast.error(res.error?.message || 'Failed to update profile settings');
    }
  };

  if (isLoading) {
    return (
      <div className="border border-white/5 bg-[#0a0a0a] p-8 rounded-xl space-y-6 text-left animate-pulse">
        <div className="h-4 bg-white/5 w-1/4 rounded" />
        <div className="h-8 bg-white/5 w-full rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-white/5 rounded" />
          <div className="h-10 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/5 bg-[#0a0a0a] p-6 sm:p-8 rounded-xl space-y-6 text-left text-white">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">My Profile Settings</h3>
        <p className="text-[10px] text-[#B5B5B5] font-light mt-1">Manage your customer credentials and contact information details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center font-bold text-lg text-[#FF4D00]">
            U
          </div>
          <div className="space-y-1">
            <button type="button" className="text-[10px] tracking-widest uppercase font-bold text-[#FF4D00] hover:text-[#FF4D00]/80 bg-transparent border-0 cursor-pointer">
              Upload New Avatar
            </button>
            <span className="text-[9px] text-[#B5B5B5] block uppercase">Max size: 2MB. JPG or PNG.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">First Name</label>
            <input
              type="text"
              {...register('firstName')}
              className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none rounded"
            />
            {errors.firstName && <span className="text-[9px] text-red-500 block">{errors.firstName.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Last Name</label>
            <input
              type="text"
              {...register('lastName')}
              className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none rounded"
            />
            {errors.lastName && <span className="text-[9px] text-red-500 block">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none rounded"
            />
            {errors.email && <span className="text-[9px] text-red-500 block">{errors.email.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Phone Number</label>
            <input
              type="text"
              {...register('phone')}
              className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Date of Birth</label>
            <input
              type="date"
              {...register('dob')}
              className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-[#B5B5B5]">Gender</label>
            <select
              {...register('gender')}
              className="w-full bg-black border border-white/10 text-white text-xs px-4 py-3.5 focus:border-[#FF4D00] outline-none rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Non-binary / Other</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white px-8 py-3.5 text-[10px] tracking-widest font-black uppercase transition-all rounded-xl cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
export default AccountProfileContainer;
