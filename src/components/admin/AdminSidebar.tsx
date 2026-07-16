'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Warehouse,
  ShoppingBag,
  Users,
  Megaphone,
  BarChart3,
  BookOpen,
  Search,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Image,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from './AdminStore';

interface SidebarItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }>;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useAdminStore();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    'Catalog': true,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const sections: SidebarSection[] = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Catalog',
      items: [
        {
          name: 'Catalog Group',
          icon: Package,
          submenu: [
            { name: 'Products', href: '/admin/products', icon: Package },
            { name: 'Categories', href: '/admin/categories', icon: FolderTree },
            { name: 'Brands', href: '/admin/brands', icon: Tag },
          ],
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Customers', href: '/admin/customers', icon: Users },
      ],
    },
    {
      title: 'Growth',
      items: [
        { name: 'Marketing', href: '/admin/marketing/coupons', icon: Megaphone },
        { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
        { name: 'Media Library', href: '/admin/media', icon: Image },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Management',
      items: [
        { name: 'Pages (CMS)', href: '/admin/cms/pages', icon: BookOpen },
        { name: 'Blog (Articles)', href: '/admin/blog', icon: FileText },
        { name: 'SEO', href: '/admin/seo', icon: Search },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <aside
      className={`border-r border-white/5 bg-[#050505] p-5 h-screen flex flex-col justify-between overflow-y-auto transition-all duration-300 relative text-left text-white ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="space-y-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 px-3 py-2 border-b border-white/5">
          <div className="h-9 w-9 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/20 flex items-center justify-center font-black text-[#FF4D00]">
            L+
          </div>
          {!isSidebarCollapsed && (
            <div className="text-left">
              <span className="text-xs font-black tracking-widest uppercase text-white block">
                Liquid Plus
              </span>
              <span className="text-[8px] font-black uppercase text-[#FF4D00] tracking-widest">
                Enterprise Admin
              </span>
            </div>
          )}
        </div>

        {/* Navigation sections */}
        <nav className="space-y-5">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              {!isSidebarCollapsed && (
                <span className="text-[8px] font-black uppercase tracking-widest text-[#B5B5B5] px-3.5 block">
                  {section.title}
                </span>
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  
                  // Handle Nested Menu
                  if (item.submenu) {
                    const isGroupOpen = openGroups[section.title] ?? false;
                    const isAnySubActive = item.submenu.some(
                      (sub) => pathname === sub.href || pathname.startsWith(sub.href + '/')
                    );

                    return (
                      <div key={item.name} className="space-y-1">
                        <button
                          onClick={() => toggleGroup(section.title)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            isAnySubActive
                              ? 'text-[#FF4D00] bg-[#FF4D00]/5'
                              : 'text-[#B5B5B5] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-4 w-4" />
                            {!isSidebarCollapsed && <span>{section.title}</span>}
                          </div>
                          {!isSidebarCollapsed && (
                            isGroupOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <AnimatePresence initial={false}>
                          {isGroupOpen && !isSidebarCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-6 space-y-1 overflow-hidden"
                            >
                              {item.submenu.map((sub) => {
                                const SubIcon = sub.icon;
                                const isSubActive = pathname === sub.href || pathname.startsWith(sub.href + '/');

                                return (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    className={`flex items-center space-x-3 px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${
                                      isSubActive
                                        ? 'text-white border-l-2 border-[#FF4D00] bg-white/5'
                                        : 'text-[#B5B5B5] hover:text-white'
                                    }`}
                                  >
                                    <SubIcon className="h-3.5 w-3.5" />
                                    <span>{sub.name}</span>
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  // Handle Standard Menu Item
                  const isActive = pathname === item.href || (item.href && pathname.startsWith(item.href + '/'));
                  return (
                    <Link
                      key={item.name}
                      href={item.href || '#'}
                      className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                        isSidebarCollapsed ? 'justify-center' : 'space-x-3'
                      } ${
                        isActive
                          ? 'bg-[#FF4D00]/10 border-l-2 border-[#FF4D00] text-[#FF4D00]'
                          : 'text-[#B5B5B5] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout / Bottom Section */}
      <div className="border-t border-white/5 pt-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-colors bg-transparent border-0 cursor-pointer ${
            isSidebarCollapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <LogOut className="h-4 w-4" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
export default AdminSidebar;
