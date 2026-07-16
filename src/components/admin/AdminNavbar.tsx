'use client';

import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, Search, Bell, Sun, Moon, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAdminStore } from './AdminStore';
import { AdminBreadcrumb } from './AdminLayoutPrimitives';
import Link from 'next/link';

export function AdminNavbar() {
  const { data: session } = useSession();
  const {
    toggleSidebar,
    notifications,
    markAllAsRead,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
  } = useAdminStore();

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const user = session?.user;
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'AD';
  const name = user?.email ? user.email.split('@')[0] : 'Administrator';
  const role = user?.role || 'SUPER_ADMIN';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-md px-6 py-4 text-white">
      {/* Left items: menu toggle & breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-xl border border-white/5 bg-black text-[#B5B5B5] hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="hidden sm:block">
          <AdminBreadcrumb />
        </div>
      </div>

      {/* Right items: Search, Theme, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        {/* Global Search Input */}
        <div className="relative hidden md:block text-xs">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#B5B5B5]" />
          <input
            type="text"
            placeholder="Global search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 bg-black border border-white/10 text-white pl-9 pr-4 py-1.5 rounded-xl text-xs outline-none focus:border-[#FF4D00] focus:w-64 transition-all duration-300"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[#B5B5B5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-0"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="p-2 rounded-xl text-[#B5B5B5] hover:text-white hover:bg-white/5 transition-colors relative cursor-pointer bg-transparent border-0"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FF4D00]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 z-40 w-80 border border-white/5 bg-[#0c0c0c] rounded-2xl shadow-2xl p-4 space-y-3 text-left text-white">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#E5E5E5]">
                  Notifications ({unreadCount} new)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[8px] font-black uppercase tracking-widest text-[#FF4D00] hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-[10px] text-[#B5B5B5] text-center py-4 uppercase">
                    No active notifications
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl border border-white/5 text-[10px] leading-relaxed space-y-0.5 ${
                        notif.isRead ? 'bg-black text-[#B5B5B5]' : 'bg-black text-[#E5E5E5]'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span>{notif.title}</span>
                        {!notif.isRead && <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D00]" />}
                      </div>
                      <p className="font-light">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left bg-transparent border-0 text-white"
          >
            <div className="h-8 w-8 rounded-lg bg-[#FF4D00]/10 border border-[#FF4D00]/20 flex items-center justify-center font-bold text-xs text-[#FF4D00]">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-[#E5E5E5]">{name}</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <Shield className="h-3 w-3 text-[#FF4D00]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-[#FF4D00]">
                  {role}
                </span>
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-[#B5B5B5]" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 z-40 w-48 border border-white/5 bg-[#0c0c0c] rounded-2xl p-2.5 shadow-2xl space-y-1 text-left text-[10px] uppercase font-bold tracking-wider text-white">
              <Link
                href="/admin/profile"
                onClick={() => setShowProfile(false)}
                className="flex items-center space-x-2 px-3 py-2 text-[#B5B5B5] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <span>My Profile</span>
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setShowProfile(false)}
                className="flex items-center space-x-2 px-3 py-2 text-[#B5B5B5] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <span>Settings</span>
              </Link>
              <button
                onClick={() => {
                  setShowProfile(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left bg-transparent border-0 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
export default AdminNavbar;
