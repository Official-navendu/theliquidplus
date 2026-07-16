'use client';

import * as React from 'react';
import { verifyEmailAction } from '../actions/verifyEmail';
import Link from 'next/link';

interface VerifyEmailCardProps {
  email: string;
  token: string;
}

export function VerifyEmailCard({ email, token }: VerifyEmailCardProps) {
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('Verifying your email address, please wait...');

  React.useEffect(() => {
    let active = true;

    async function triggerVerification() {
      try {
        const response = await verifyEmailAction(email, token);
        if (!active) return;

        if (response.success) {
          setStatus('success');
          setMessage('Your email address has been successfully verified! You can now log in.');
        } else {
          setStatus('error');
          setMessage(response.error.message);
        }
      } catch {
        if (!active) return;
        setStatus('error');
        setMessage('An unexpected error occurred during email verification.');
      }
    }

    triggerVerification();

    return () => {
      active = false;
    };
  }, [email, token]);

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A0A0A] border border-white/10 rounded-xl p-8 shadow-2xl space-y-6 text-left text-white animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-light uppercase tracking-wider text-white">Email Verification</h1>
        <p className="text-xs text-[#B5B5B5] font-light">
          Activating your account credentials
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4D00]" />
            <p className="text-xs text-[#B5B5B5] font-light">{message}</p>
          </div>
        )}
        {status === 'success' && (
          <div className="space-y-2">
            <div className="text-4xl text-green-500 font-bold">✓</div>
            <p className="text-xs text-green-500 font-medium">{message}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-2">
            <div className="text-4xl text-red-500 font-bold">✗</div>
            <p className="text-xs text-red-500 font-medium">{message}</p>
          </div>
        )}
      </div>

      {status !== 'loading' && (
        <div className="pt-2">
          <Link
            href="/login"
            className="w-full py-3.5 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] tracking-widest font-black uppercase transition-all rounded-xl hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,77,0,0.35)] cursor-pointer flex justify-center items-center"
          >
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
}
export default VerifyEmailCard;
