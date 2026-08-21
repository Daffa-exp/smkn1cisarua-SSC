'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, ShieldAlert, Search } from 'lucide-react';
import { SchoolLogo } from '@/components/ui/SchoolLogo';
import { SCHOOL_NAME } from '@/lib/branding';
import { useAuth } from '@/components/providers/AuthProvider';
import { Badge } from '@/components/ui/Badge';
import { ConfirmLogoutModal } from '@/components/ui/ConfirmLogoutModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/announcements?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    if (!user) return;
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {});
  }, [user, pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname === '/login') return null;

  const roleVariantMap: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
    STUDENT: 'info',
    TEACHER: 'success',
    ADMIN: 'warning',
    SUPER_ADMIN: 'danger',
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b px-3 pt-safe transition-all duration-300 sm:px-6',
          scrolled
            ? 'border-slate-200/80 bg-white/88 shadow-[0_6px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none'
            : 'border-transparent bg-white/75 backdrop-blur-md dark:bg-slate-950/55'
        )}
      >
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 sm:min-h-16">
          <Link href="/dashboard" className="group flex min-w-0 items-center gap-2.5 rounded-xl py-1.5">
            <span className="shrink-0 transition-transform duration-300 group-hover:scale-[1.04]">
              <SchoolLogo size="sm" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-base">
                {SCHOOL_NAME}
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400 sm:text-[10px]">
                CONNECT
              </span>
            </span>
          </Link>

          {/* Global search (desktop) */}
          <form onSubmit={onSearch} className="hidden flex-1 justify-center px-4 lg:flex">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pengumuman, agenda, informasi sekolah..."
                aria-label="Cari"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:focus:bg-white/5"
              />
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            <ThemeToggle />

            <Link
              href="/notifications?filter=emergency"
              aria-label="Darurat / Alert"
              title="Darurat / Alert"
              className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-400/10 dark:hover:text-amber-300"
            >
              <ShieldAlert className="h-5 w-5" />
            </Link>

            <Link
              href="/notifications"
              aria-label={`Notifikasi${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ''}`}
              className="relative rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-brand-400"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white dark:ring-slate-950">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/profile"
                  className="group flex items-center gap-2 rounded-xl border border-transparent p-1.5 transition-colors hover:border-slate-200 hover:bg-slate-100 dark:hover:border-white/10 dark:hover:bg-slate-800 sm:px-2.5"
                >
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-700">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      (user.name ? user.name.charAt(0).toUpperCase() : 'U')
                    )}
                  </div>
                  <div className="hidden min-w-0 sm:flex sm:flex-col sm:text-left">
                    <span className="max-w-28 truncate text-xs font-semibold leading-tight text-slate-700 dark:text-slate-300">
                      {user.name}
                    </span>
                    <Badge variant={roleVariantMap[user.role] || 'info'} className="mt-0.5 w-fit px-1.5 py-0 text-[9px]">
                      {user.role}
                    </Badge>
                  </div>
                </Link>

                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  aria-label="Keluar / Logout"
                  title="Keluar / Logout"
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-400/10 dark:hover:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <ConfirmLogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={logout} />
    </>
  );
};
