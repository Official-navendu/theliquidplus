'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferenceSchema, PreferenceInput } from '../schemas/customer';
import { getProfileData, savePreferencesAction } from '../actions/customer';
import { toast } from 'sonner';

interface PreferenceFormValues {
  emailMarketing: boolean;
  smsMarketing: boolean;
}

export function AccountNotificationsContainer() {
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<PreferenceFormValues>({
    resolver: zodResolver(preferenceSchema) as unknown as import('react-hook-form').Resolver<PreferenceFormValues>,
    defaultValues: {
      emailMarketing: true,
      smsMarketing: false,
    },
  });

  const emailMarketing = watch('emailMarketing');
  const smsMarketing = watch('smsMarketing');

  React.useEffect(() => {
    async function loadData() {
      const res = await getProfileData();
      if (res.success && res.data) {
        setValue('emailMarketing', res.data.emailMarketing);
        setValue('smsMarketing', res.data.smsMarketing);
      }
      setIsLoading(false);
    }
    loadData();
  }, [setValue]);

  const onSubmit = async (data: PreferenceInput) => {
    const res = await savePreferencesAction(data);
    if (res.success) {
      toast.success('Notification preferences updated successfully!');
    } else {
      toast.error(res.error?.message || 'Failed to update preferences');
    }
  };

  if (isLoading) {
    return (
      <div className="border border-white/5 bg-[#0a0a0a] p-8 rounded-xl space-y-6 text-left animate-pulse">
        <div className="h-4 bg-white/5 w-1/4 rounded" />
        <div className="h-12 bg-white/5 w-full rounded" />
        <div className="h-12 bg-white/5 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="border border-white/5 bg-[#0a0a0a] p-6 sm:p-8 rounded-xl space-y-6 text-left text-white animate-fade-in">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">Notification Preferences</h3>
        <p className="text-[10px] text-[#B5B5B5] font-light mt-1">Control your email alerts, sms dispatch timelines, and newsletters updates.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Marketing Switch */}
        <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5 rounded-lg">
          <div className="text-left space-y-1 max-w-xl">
            <span className="text-xs font-semibold text-[#E5E5E5] block">Email Marketing Subscriptions</span>
            <p className="text-[10px] text-[#B5B5B5] font-light leading-relaxed">
              Get seasonal promotional emails, early access to newly formulated glazes, and weekly detailing tips.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setValue('emailMarketing', !emailMarketing)}
            className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-300 relative cursor-pointer ${
              emailMarketing ? 'bg-[#FF4D00]' : 'bg-[#1A1A1A] border border-white/10'
            }`}
            aria-label="Toggle Email Marketing"
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                emailMarketing ? 'translate-x-5 bg-black' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* SMS Marketing Switch */}
        <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5 rounded-lg">
          <div className="text-left space-y-1 max-w-xl">
            <span className="text-xs font-semibold text-[#E5E5E5] block">SMS Notifications</span>
            <p className="text-[10px] text-[#B5B5B5] font-light leading-relaxed">
              Receive critical transit updates, delivery confirmations, and transactional alerts on your phone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setValue('smsMarketing', !smsMarketing)}
            className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-300 relative cursor-pointer ${
              smsMarketing ? 'bg-[#FF4D00]' : 'bg-[#1A1A1A] border border-white/10'
            }`}
            aria-label="Toggle SMS Marketing"
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                smsMarketing ? 'translate-x-5 bg-black' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white px-8 py-3.5 text-[10px] tracking-widest font-black uppercase transition-all rounded-xl cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
export default AccountNotificationsContainer;
