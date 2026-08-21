'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Megaphone,
  CalendarDays,
  AlertCircle,
  Search,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

export interface DashboardAnnouncement {
  id: string;
  title: string;
  content: string;
  category: string;
  publishedAt: string | Date;
  imageUrl?: string | null;
}

export interface DashboardSchedule {
  id: string;
  subject: string;
  className: string;
  room: string;
  startTime: string;
  endTime: string;
}

export interface DashboardEvent {
  id: string;
  title: string;
  date: string | Date;
  startTime: string;
  endTime: string;
}

interface DashboardViewProps {
  timeGreeting: string;
  studentName: string;
  todayLabel: string;
  featured: DashboardAnnouncement | null;
  otherAnnouncements: DashboardAnnouncement[];
  todaySchedules: DashboardSchedule[];
  upcomingEvents: DashboardEvent[];
  pendingReportsCount: number;
  totalAnnouncementsCount: number;
  todayScheduleCount: number;
  upcomingEventsCount: number;
}

const quickLinks = [
  { href: '/announcements', label: 'Pengumuman', icon: Megaphone },
  { href: '/schedule', label: 'Jadwal', icon: CalendarDays },
  { href: '/events', label: 'Acara', icon: CalendarDays },
  { href: '/reports', label: 'Laporan', icon: AlertCircle },
  { href: '/lost-found', label: 'Lost & Found', icon: Search },
];

// Fade-up reveal used for every top-level section. Stagger is applied by the
// parent's `variants`, not per-element delays, so the rhythm stays consistent
// even as sections are added or removed.
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  timeGreeting,
  studentName,
  todayLabel,
  featured,
  otherAnnouncements,
  todaySchedules,
  upcomingEvents,
  pendingReportsCount,
  totalAnnouncementsCount,
  todayScheduleCount,
  upcomingEventsCount,
}) => {
  const reduceMotion = useReducedMotion();
  const MotionSection = reduceMotion ? 'div' : motion.div;
  const motionProps = reduceMotion ? {} : { variants: item };

  return (
    <motion.div
      className="space-y-10 sm:space-y-12"
      initial={reduceMotion ? undefined : 'hidden'}
      animate={reduceMotion ? undefined : 'show'}
      variants={reduceMotion ? undefined : container}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Hero — cinematic greeting, deliberately spacious.                 */}
      {/* ---------------------------------------------------------------- */}
      <MotionSection {...motionProps} className="relative overflow-hidden rounded-3xl">
        {/* Ambient layer: faint grid + one slow-drifting glow. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] via-[#0f1b30] to-[#0b1220]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:40px_40px]" />
          <motion.div
            className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.35),transparent_70%)] blur-2xl"
            animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, 16, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-8 px-6 py-9 sm:px-9 sm:py-12">
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-blue-200/70">
            <span>{todayLabel}</span>
            <span className="flex items-center gap-1.5 text-emerald-300/90">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              SSC · System Online
            </span>
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-medium text-blue-200/80">{timeGreeting},</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {studentName}.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300/90 sm:text-[15px]">
              Semua informasi sekolah ada di satu tempat — pengumuman, jadwal, agenda, dan
              layanan pelaporan fasilitas.
            </p>
          </div>
        </div>
      </MotionSection>

      {/* ---------------------------------------------------------------- */}
      {/* Featured announcement — one large editorial slot, not a card grid. */}
      {/* ---------------------------------------------------------------- */}
      {featured && (
        <MotionSection {...motionProps}>
          <Link
            href={`/announcements/${featured.id}`}
            className="group relative block overflow-hidden rounded-3xl border border-slate-200/70 bg-white transition-colors hover:border-blue-300/70 dark:border-white/10 dark:bg-surface"
          >
            {featured.imageUrl && (
              <div className="absolute inset-0" aria-hidden>
                <img
                  src={featured.imageUrl}
                  alt=""
                  className="h-full w-full scale-105 object-cover opacity-[0.07] transition-transform duration-700 group-hover:scale-110 dark:opacity-[0.1]"
                />
              </div>
            )}
            <div className="relative z-10 flex flex-col gap-4 p-6 sm:p-9">
              <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Important Update
              </span>
              <h2 className="max-w-2xl text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
                {featured.title}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 line-clamp-2">
                {featured.content}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {formatDate(featured.publishedAt)}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:text-blue-600 dark:border-white/10 dark:text-slate-400 dark:group-hover:border-blue-400/30 dark:group-hover:bg-blue-400/10">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>

          {otherAnnouncements.length > 0 && (
            <div className="mt-3 flex items-center justify-between px-1">
              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                {otherAnnouncements.map((a) => (
                  <Link
                    key={a.id}
                    href={`/announcements/${a.id}`}
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {a.title}
                  </Link>
                ))}
              </div>
              <Link
                href="/announcements"
                className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 hover:underline sm:flex dark:text-blue-400"
              >
                Semua <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </MotionSection>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Two-column: schedule timeline + live status                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
        {/* Schedule as timeline */}
        <MotionSection {...motionProps} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Jadwal Hari Ini
            </h2>
            <Link
              href="/schedule"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Buka Jadwal <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {todaySchedules.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400 dark:border-white/10">
              Tidak ada jadwal pelajaran untuk hari ini.
            </p>
          ) : (
            <ol className="relative border-l border-slate-200 pl-6 dark:border-white/10">
              {todaySchedules.map((s) => (
                <li key={s.id} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[29px] top-0.5 h-2 w-2 rounded-full border-2 border-blue-500 bg-white dark:bg-surface" />
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      {s.startTime}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-300 dark:text-slate-600">
                      WIB
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {s.subject}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {s.className} · {s.room}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </MotionSection>

        {/* Live status */}
        <MotionSection {...motionProps} className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            SSC Live
          </h2>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-white/10 dark:bg-surface">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Sistem berjalan normal
              </span>
            </div>
            <p className="mt-1 pl-4 text-[11px] text-slate-400">
              Pembaruan terakhir {new Intl.DateTimeFormat('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta',
              }).format(new Date())}
              {' '}WIB
            </p>

            <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Pengumuman</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                  {String(totalAnnouncementsCount).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Jadwal hari ini</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                  {String(todayScheduleCount).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Agenda mendatang</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                  {String(upcomingEventsCount).padStart(2, '0')}
                </span>
              </div>
              {pendingReportsCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Laporan diproses</span>
                  <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                    {String(pendingReportsCount).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {upcomingEvents.length > 0 && (
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl px-1 py-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-semibold text-slate-700 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                      {event.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {formatDate(event.date)} · {event.startTime} WIB
                    </p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-blue-500" />
                </Link>
              ))}
            </div>
          )}
        </MotionSection>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Quick actions — a command row, not five colorful mini-cards.      */}
      {/* ---------------------------------------------------------------- */}
      <MotionSection {...motionProps} className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Akses Cepat
        </h2>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/80 sm:grid-cols-5 dark:border-white/10 dark:bg-white/10">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center justify-center gap-2 bg-white px-3 py-5 text-center transition-colors hover:bg-blue-50/60 dark:bg-surface dark:hover:bg-blue-400/5"
            >
              <Icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-700 dark:text-slate-300 dark:group-hover:text-blue-300">
                {label}
                {href === '/reports' && pendingReportsCount > 0 ? ` (${pendingReportsCount})` : ''}
              </span>
            </Link>
          ))}
        </div>
      </MotionSection>
    </motion.div>
  );
};
