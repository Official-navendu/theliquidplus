'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

// ==============================================================================
// BREADCRUMB
// ==============================================================================
export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-1.5 text-[10px] tracking-wider uppercase text-[#B5B5B5] font-bold">
      <Link href="/admin/dashboard" className="hover:text-white transition-colors">
        Admin
      </Link>
      {segments.slice(1).map((seg, idx) => {
        const url = `/admin/${segments.slice(2, 2 + idx + 1).join('/')}`;
        const isLast = idx === segments.length - 2;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="h-3 w-3 text-[#B5B5B5]" />
            {isLast ? (
              <span className="text-[#FF4D00] font-black">{seg}</span>
            ) : (
              <Link href={url} className="hover:text-white transition-colors">
                {seg}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ==============================================================================
// PAGE HEADER
// ==============================================================================
interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-5 mb-6 text-left">
      <div className="space-y-1 text-left">
        <h2 className="text-xl sm:text-2xl font-light uppercase tracking-widest text-white">
          {title}
        </h2>
        {description && (
          <p className="text-[10px] text-[#B5B5B5] font-light uppercase tracking-wider">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

// ==============================================================================
// SECTION CONTAINER
// ==============================================================================
interface AdminSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminSection({ title, children, className = '' }: AdminSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      {title && (
        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00] border-b border-white/5 pb-2">
          {title}
        </h4>
      )}
      <div className="text-left">{children}</div>
    </section>
  );
}

// ==============================================================================
// CARD primitive
// ==============================================================================
interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminCard({ children, className = '' }: AdminCardProps) {
  return (
    <div className={`border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md p-6 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
