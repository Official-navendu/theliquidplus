'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  History,
} from 'lucide-react';
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
        className={`fixed top-0 left-0 z-50 w-full text-white transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'border-b border-white/10 bg-black/85 py-2 shadow-lg shadow-black/40 backdrop-blur-xl md:py-2.5'
            : 'border-b border-transparent bg-transparent py-4 shadow-none md:py-5'
        }`}
      >
        <div className="relative flex h-9 w-full items-center justify-between px-5 sm:px-8 md:h-11">
          {/* Left: Logo */}
          <div className="flex h-full items-center">
            <Link href="/" className="flex items-center">
              <Logo className="transition-opacity hover:opacity-90" />
            </Link>
          </div>

          {/* Center: Navigation Menu */}
          <nav className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center justify-center space-x-6 lg:flex xl:space-x-8">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex h-full items-center py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                    isActive ? 'text-[#FF4D00]' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <span>{item.name}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full origin-left transform bg-[#FF4D00] transition-transform duration-300 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: Icons */}
          <div className="flex h-full items-center space-x-4 sm:space-x-5">
            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer border-0 bg-transparent p-1 text-zinc-300 transition-colors hover:text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="cursor-pointer border-0 bg-transparent p-1 text-zinc-300 transition-colors hover:text-white"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative block p-1 text-zinc-300 transition-colors hover:text-white"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="font-num absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#FF4D00] text-[7px] font-black text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* MiniCart Trigger */}
            <button
              onClick={() => setMiniCartOpen(true)}
              className="relative block cursor-pointer border-0 bg-transparent p-1 text-zinc-300 transition-colors hover:text-white"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="font-num absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#FF4D00] text-[7px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown Menu */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="block cursor-pointer border-0 bg-transparent p-1 text-zinc-300 transition-colors hover:text-white"
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
                    className="absolute right-0 z-50 mt-3 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F0F] text-left shadow-2xl"
                  >
                    <div className="border-b border-white/5 bg-black/40 p-3">
                      <span className="block text-[8px] font-black tracking-wider text-zinc-500 uppercase">
                        Account Directory
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] font-bold text-white">
                        {session?.user?.email || 'Guest detailer'}
                      </span>
                    </div>

                    <div className="space-y-0.5 p-1 text-[10px] font-bold tracking-wider uppercase">
                      {session ? (
                        <>
                          <Link
                            href="/account/dashboard"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center space-x-2 rounded-xl px-3 py-2 text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
                          >
                            <LayoutDashboard className="h-3.5 w-3.5 text-[#FF4D00]" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/account/dashboard"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center space-x-2 rounded-xl px-3 py-2 text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
                          >
                            <History className="h-3.5 w-3.5 text-[#FF4D00]" />
                            <span>Orders</span>
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center space-x-2 rounded-xl px-3 py-2 text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
                          >
                            <Heart className="h-3.5 w-3.5 text-[#FF4D00]" />
                            <span>Wishlist</span>
                          </Link>
                          <button
                            onClick={() => {
                              setAccountMenuOpen(false);
                              signOut({ callbackUrl: '/' });
                            }}
                            className="flex w-full cursor-pointer items-center space-x-2 rounded-xl border-0 bg-transparent px-3 py-2 text-left font-bold text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400"
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
                            className="flex items-center space-x-2 rounded-xl px-3 py-2 text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
                          >
                            <span>Login</span>
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center space-x-2 rounded-xl px-3 py-2 text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full overflow-hidden rounded-b-3xl border-t border-white/5 bg-[#0A0A0A]/95 backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col space-y-4 p-6 text-left">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`border-b border-white/5 py-2 text-[9px] font-bold tracking-[0.25em] uppercase transition-colors ${
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-md"
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 cursor-pointer rounded-lg border border-white/10 bg-zinc-900 p-2 text-zinc-400 transition-all hover:border-white hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-full max-w-2xl space-y-6 text-center">
              <span className="text-[10px] font-black tracking-[0.3em] text-[#FF4D00] uppercase">
                Search Catalog
              </span>
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center border-b-2 border-white/10 pb-3 transition-colors focus-within:border-[#FF4D00]"
              >
                <input
                  type="text"
                  placeholder="What detailing solution are you looking for?"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full border-none bg-transparent text-center text-xl font-light text-white placeholder-zinc-700 outline-none sm:text-2xl"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-0 cursor-pointer border-0 bg-transparent text-zinc-400 hover:text-white"
                >
                  <Search className="h-6 w-6" />
                </button>
              </form>
              <p className="text-[10px] tracking-widest text-zinc-500 uppercase">
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
