'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  User,
  Shield,
  Bell,
  LogOut,
  Menu,
  X,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: 'Dashboard', href: '/account/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/account/orders', icon: ShoppingBag },
  { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Reviews', href: '/account/reviews', icon: MessageSquare },
  { name: 'Profile', href: '/account/profile', icon: User },
  { name: 'Security', href: '/account/security', icon: Shield },
  { name: 'Notifications', href: '/account/notifications', icon: Bell },
];

export function AccountLayout({ children }: AccountLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const user = session?.user;
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'US';
  const displayName = user?.email ? user.email.split('@')[0] : 'Customer';
  const displayEmail = user?.email || '';

  return (
    <div className="bg-black text-white min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Mobile Menu trigger bar */}
          <div className="lg:hidden flex justify-between items-center bg-[#0a0a0a] p-4 border border-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center font-bold text-xs text-[#FF4D00]">
                {initials}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">{displayName}</h4>
                <span className="text-[8px] uppercase tracking-widest text-[#FF4D00] font-black">{displayEmail}</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-[#B5B5B5] hover:text-white p-1 bg-transparent border-0 cursor-pointer"
              aria-label="Toggle Account Menu"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:col-span-3 lg:block border border-white/5 bg-[#0a0a0a] p-6 rounded-xl space-y-8 animate-fade-in">
            <div className="flex items-center space-x-3.5 border-b border-white/5 pb-6">
              <div className="h-12 w-12 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center font-bold text-[#FF4D00]">
                {initials}
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-[#E5E5E5]">{displayName}</h4>
                <span className="text-[9px] uppercase tracking-widest text-[#FF4D00] font-black">{displayEmail}</span>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 text-xs tracking-wider uppercase transition-colors rounded ${
                      isActive
                        ? 'bg-[#FF4D00]/10 text-white font-bold border-l-2 border-[#FF4D00]'
                        : 'text-[#B5B5B5] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-[#FF4D00]' : 'text-[#B5B5B5]'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-xs tracking-wider uppercase text-red-500 hover:bg-red-500/5 transition-colors rounded text-left bg-transparent border-0 cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Mobile Navigation Drawer */}
          <AnimatePresence>
            {isMobileOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileOpen(false)}
                  className="fixed inset-0 z-40 bg-black lg:hidden"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 z-40 w-[280px] bg-[#0A0A0A] p-6 border-r border-white/10 flex flex-col justify-between lg:hidden"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center font-bold text-[#FF4D00]">
                          {initials}
                        </div>
                        <div className="text-left">
                          <h4 className="text-xs font-semibold text-white">{displayName}</h4>
                          <span className="text-[8px] uppercase tracking-widest text-[#FF4D00] font-black">{displayEmail}</span>
                        </div>
                      </div>
                      <button onClick={() => setIsMobileOpen(false)} className="text-[#B5B5B5] hover:text-white bg-transparent border-0 cursor-pointer">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <nav className="space-y-1">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 text-xs tracking-wider uppercase transition-colors rounded ${
                              isActive
                                ? 'bg-[#FF4D00]/10 text-white font-bold border-l-2 border-[#FF4D00]'
                                : 'text-[#B5B5B5] hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Icon className={`h-4 w-4 ${isActive ? 'text-[#FF4D00]' : 'text-[#B5B5B5]'}`} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-xs tracking-wider uppercase text-red-500 hover:bg-red-500/5 transition-colors rounded text-left bg-transparent border-0 cursor-pointer"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Right Column: Active Dashboard Content viewport */}
          <main className="lg:col-span-9 space-y-6">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
export default AccountLayout;
