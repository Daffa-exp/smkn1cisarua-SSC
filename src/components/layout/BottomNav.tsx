'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Jadwal', href: '/schedule', icon: Calendar },
  { label: 'Laporan', href: '/reports', icon: AlertCircle },
  { label: 'Profil', href: '/profile', icon: User },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/92 px-1 shadow-[0_-8px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl pb-safe dark:border-white/10 dark:bg-slate-950/88 dark:shadow-none md:hidden"
      aria-label="Navigasi utama"
    >
      <div className="mx-auto flex max-w-lg items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex min-h-[56px] min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-center transition-colors',
                isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-500'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-active"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-brand-500 dark:bg-brand-400"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  aria-hidden
                />
              )}
              <motion.span whileTap={{ scale: 0.9 }} className="flex h-6 items-center justify-center">
                <Icon className={cn('h-[19px] w-[19px]', isActive && 'stroke-[2.35px]')} />
              </motion.span>
              <span className={cn('max-w-full truncate text-[10px] leading-none', isActive ? 'font-semibold' : 'font-medium')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
