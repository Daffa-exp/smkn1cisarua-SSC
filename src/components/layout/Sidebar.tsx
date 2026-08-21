'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  CalendarDays,
  AlertCircle,
  Search,
  Bell,
  User,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { SchoolLogo } from '@/components/ui/SchoolLogo';
import { SCHOOL_NAME } from '@/lib/branding';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname === '/login') return null;

  const menuGroups = [
    {
      title: 'Utama',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Pengumuman', href: '/announcements', icon: Megaphone },
        { label: 'Jadwal Pelajaran', href: '/schedule', icon: Calendar },
        { label: 'Event Sekolah', href: '/events', icon: CalendarDays },
      ],
    },
    {
      title: 'Layanan Siswa',
      items: [
        { label: 'Laporan Fasilitas', href: '/reports', icon: AlertCircle },
        { label: 'Lost & Found', href: '/lost-found', icon: Search },
        { label: 'Notifikasi', href: '/notifications', icon: Bell },
      ],
    },
    {
      title: 'Pengaturan & Admin',
      items: [
        { label: 'Profil Saya', href: '/profile', icon: User },
        ...(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
          ? [{ label: 'Admin Command Center', href: '/admin', icon: ShieldCheck }]
          : []),
      ],
    },
  ];

  return (
    <aside className="hidden md:flex md:sticky md:top-[61px] md:h-[calc(100vh-61px)] flex-col w-64 border-r border-slate-200/80 dark:border-border bg-white dark:bg-surface-raised overflow-y-auto p-4 shrink-0">
      <div className="space-y-6 flex-1">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
              {group.title}
            </h2>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4',
                        isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-surface-sunken border border-slate-200/60 dark:border-border-subtle rounded-xl mt-auto flex items-center gap-2.5">
        <SchoolLogo size="xs" />
        <div className="text-xs text-slate-500 dark:text-slate-500 min-w-0">
          <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{SCHOOL_NAME}</p>
          <p className="text-[11px]">Connect Platform v0.2</p>
        </div>
      </div>
    </aside>
  );
};
