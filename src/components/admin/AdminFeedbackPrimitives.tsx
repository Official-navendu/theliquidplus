'use client';

import * as React from 'react';
import { ShieldAlert, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

// ==============================================================================
// EMPTY STATE
// ==============================================================================
interface AdminEmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}

export function AdminEmptyState({ title, description, icon: Icon = Info, action }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-2xl bg-zinc-950/40 text-[#B5B5B5] space-y-4 text-white">
      <div className="p-3 bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[#FF4D00] rounded-xl">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E5E5E5]">{title}</h4>
        <p className="text-[10px] text-[#B5B5B5] font-light leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

// ==============================================================================
// LOADING SKELETON / SPINNER
// ==============================================================================
export function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3 text-white">
      <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-[#FF4D00] animate-spin" />
      <span className="text-[10px] uppercase tracking-widest text-[#B5B5B5] font-bold">
        Resolving administration data...
      </span>
    </div>
  );
}

// ==============================================================================
// MODAL DIALOG
// ==============================================================================
interface AdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AdminDialog({ isOpen, onClose, title, children }: AdminDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-white">
      <div className="w-full max-w-lg border border-white/10 bg-[#0c0c0c] rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/5 px-6 py-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#FF4D00]">{title}</h4>
          <button
            onClick={onClose}
            className="text-[#B5B5B5] hover:text-white text-xs uppercase tracking-widest font-black bg-transparent border-0 cursor-pointer"
          >
            ✕ Close
          </button>
        </div>
        <div className="p-6 text-xs text-left">{children}</div>
      </div>
    </div>
  );
}

// ==============================================================================
// CONFIRMATION DIALOG
// ==============================================================================
interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Proceed',
  cancelText = 'Cancel',
  type = 'warning',
}: AdminConfirmDialogProps) {
  if (!isOpen) return null;

  const typeConfig = {
    danger: { icon: ShieldAlert, color: 'text-red-500', btnBg: 'bg-red-600 hover:bg-red-700' },
    warning: { icon: AlertTriangle, color: 'text-amber-500', btnBg: 'bg-amber-600 hover:bg-amber-700' },
    info: { icon: CheckCircle2, color: 'text-[#FF4D00]', btnBg: 'bg-white text-black hover:bg-[#FF4D00]' },
  }[type];

  const Icon = typeConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-white">
      <div className="w-full max-w-sm border border-white/10 bg-[#0c0c0c] rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5">
        <div className="flex items-center space-x-3">
          <div className={`p-2 bg-zinc-900 border border-white/5 rounded-lg ${typeConfig.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white">{title}</h4>
        </div>
        
        <p className="text-[11px] text-[#B5B5B5] font-light leading-relaxed text-left">
          {message}
        </p>

        <div className="flex justify-end space-x-3 text-[10px] font-bold uppercase tracking-wider">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-white/10 hover:border-white rounded transition-colors text-[#B5B5B5] hover:text-white bg-transparent cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2.5 rounded transition-all text-white font-black uppercase cursor-pointer ${typeConfig.btnBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
