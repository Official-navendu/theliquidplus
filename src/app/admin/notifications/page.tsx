'use client';

import * as React from 'react';
import { AdminPageHeader, AdminCard } from '@/components/admin/AdminLayoutPrimitives';
import { useAdminStore } from '@/components/admin/AdminStore';
import { Bell, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNotificationsPage() {
  const { notifications, markAllAsRead, markAsRead } = useAdminStore();

  const handleMarkAll = () => {
    markAllAsRead();
    toast.success('All administrative alerts marked as read.');
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <AdminPageHeader
          title="System Notifications"
          description="Inspect real-time system logs, automated stock triggers, and enterprise transactions."
        />
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAll}
            className="bg-white text-black hover:bg-[#FF4D00] hover:text-black py-2.5 px-5 text-[9px] tracking-widest font-black uppercase transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer rounded-xl"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      <div className="space-y-4 max-w-3xl">
        {notifications.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-zinc-500 text-xs">
            No system notifications logged.
          </div>
        ) : (
          notifications.map((notif) => (
            <AdminCard
              key={notif.id}
              className={`transition-all duration-300 relative flex items-start space-x-4 ${
                notif.isRead ? 'opacity-60 bg-zinc-950/40' : 'border-[#FF4D00]/20 bg-[#FF4D00]/2'
              }`}
            >
              <div className={`p-2 bg-zinc-900 border border-white/5 rounded-xl ${notif.isRead ? 'text-zinc-500' : 'text-[#FF4D00]'}`}>
                <Bell className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-grow text-xs text-left">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-zinc-200">{notif.title}</h4>
                  <span className="text-[8px] text-zinc-500 uppercase">
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-zinc-400 font-light leading-relaxed">{notif.message}</p>
                {!notif.isRead && (
                  <button
                    onClick={() => {
                      markAsRead(notif.id);
                      toast.success('Notification marked as read.');
                    }}
                    className="text-[9px] font-black uppercase text-[#FF4D00] tracking-wider hover:underline pt-1 block cursor-pointer"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </AdminCard>
          ))
        )}
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
