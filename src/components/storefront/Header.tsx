/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '@/features/catalog/hooks/useCartStore';
import { useSession, signOut } from 'next-auth/react';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Collections', href: '/shop#collections' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState('');
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
  const accountMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountMenuOpen]);

  const { cart, wishlist, setMiniCartOpen } = useCartStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlist.length : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  return (
    <>
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out text-white ${
          isScrolled
            ? 'top-2 w-[92%] md:w-[94%] max-w-7xl rounded-[20px] border border-white/10 shadow-2xl bg-black/60 backdrop-blur-xl py-2 md:py-2.5 shadow-black/80'
            : 'top-0 w-full max-w-none rounded-none border-b border-white/5 bg-[#0A0A0A] py-3.5 md:py-4 shadow-none'
        }`}
      >
        <div className="px-5 sm:px-8 flex items-center justify-between w-full h-9 md:h-11 relative">
          {/* Left: Logo */}
          <div className="flex items-center h-full">
            <Link href="/" className="flex items-center">
              <Logo className="hover:opacity-90 transition-opacity" />
            </Link>
          </div>

          {/* Center: Navigation Menu */}
          <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 absolute left-1/2 -translate-x-1/2 h-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[10px] tracking-[0.2em] uppercase transition-all duration-300 py-1.5 relative group font-bold flex items-center h-full ${
                    isActive ? 'text-[#FF4D00]' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <span>{item.name}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#FF4D00] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5 h-full">
            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-zinc-300 hover:text-white transition-colors p-1 cursor-pointer bg-transparent border-0"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-zinc-300 hover:text-white transition-colors p-1 bg-transparent border-0 cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="text-zinc-300 hover:text-white transition-colors p-1 relative block"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF4D00] text-white text-[7px] font-black rounded-full h-3 w-3 flex items-center justify-center font-num">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* MiniCart Trigger */}
            <button
              onClick={() => setMiniCartOpen(true)}
              className="text-zinc-300 hover:text-white transition-colors p-1 relative bg-transparent border-0 cursor-pointer block"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF4D00] text-white text-[7px] font-black rounded-full h-3 w-3 flex items-center justify-center font-num">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown Menu */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="text-zinc-300 hover:text-white transition-colors p-1 block bg-transparent border-0 cursor-pointer"
                aria-label="Profile"
              >
                <User className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {accountMenuOpen && (
                  <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 text-left"
                    >
                      <div className="p-3 border-b border-white/5 bg-black/40">
                        <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-black block">Account Directory</span>
                        <span className="text-[10px] text-white font-bold block truncate mt-0.5">
                          {session?.user?.email || 'Guest detailer'}
                        </span>
                      </div>
                      
                      <div className="p-1 space-y-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {session ? (
                          <>
                            <Link
                              href="/account/dashboard"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                              <LayoutDashboard className="h-3.5 w-3.5 text-[#FF4D00]" />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              href="/account/dashboard"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                              <History className="h-3.5 w-3.5 text-[#FF4D00]" />
                              <span>Orders</span>
                            </Link>
                            <Link
                              href="/wishlist"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                              <Heart className="h-3.5 w-3.5 text-[#FF4D00]" />
                              <span>Wishlist</span>
                            </Link>
                            <button
                              onClick={() => {
                                setAccountMenuOpen(false);
                                signOut({ callbackUrl: '/' });
                              }}
                              className="flex items-center space-x-2 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer border-0 bg-transparent w-full text-left font-bold"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                              <span>Log Out</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/login"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                              <span>Login</span>
                            </Link>
                            <Link
                              href="/register"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                              <span>Register</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden w-full bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden rounded-b-3xl mt-2"
            >
              <nav className="flex flex-col p-6 space-y-4 text-left">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-[9px] tracking-[0.25em] uppercase transition-colors py-2 border-b border-white/5 font-bold ${
                        isActive ? 'text-[#FF4D00]' : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Premium Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-zinc-900 border border-white/10 hover:border-white text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-full max-w-2xl text-center space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#FF4D00] font-black">Search Catalog</span>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b-2 border-white/10 focus-within:border-[#FF4D00] pb-3 transition-colors">
                <input
                  type="text"
                  placeholder="What detailing solution are you looking for?"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="bg-transparent border-none outline-none text-xl sm:text-2xl text-white font-light text-center w-full placeholder-zinc-700"
                  autoFocus
                />
                <button type="submit" className="absolute right-0 text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer">
                  <Search className="h-6 w-6" />
                </button>
              </form>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                Press Enter to search by item name or variant SKU
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default Header;
