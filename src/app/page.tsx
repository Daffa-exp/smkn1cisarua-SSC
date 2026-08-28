import React from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Calendar,
  CalendarDays,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Badge } from '@/components/ui/Badge';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getSession();

  const todayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date());

  const announcements = await db.announcement.findMany({
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  const todaySchedules = await db.schedule.findMany({
    where: { day: { equals: todayName.charAt(0).toUpperCase() + todayName.slice(1) } },
    orderBy: { startTime: 'asc' },
    take: 2,
  });

  const upcomingEvents = await db.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    take: 2,
  });

  const pendingReportsCount = await db.incidentReport.count({
    where: { status: { in: ['SUBMITTED', 'REVIEWING', 'IN_PROGRESS'] } },
  });

  return (
    <div className="space-y-7 sm:space-y-8">
      <WelcomeBanner />

      {/* Emergency Alert Banner Preview */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 shadow-xs dark:border-amber-400/15 dark:bg-amber-400/10">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
            Pengumuman Penting / Status Sekolah
          </h3>
          <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-200/80">
            Sistem informasi sekolah beroperasi normal. Gunakan menu Laporan jika menemukan fasilitas rusak.
          </p>
        </div>
      </div>

      {/* Important Announcement */}
      {announcements.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Megaphone className="w-4 h-4 text-brand-600" />
              Pengumuman Terbaru
            </h2>
            <Link href="/announcements" className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                href={`/announcements/${item.id}`}
                className="block bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:border-brand-300 transition-colors group"
              >
                <div className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="info" className="text-[10px]">{item.category}</Badge>
                      <span className="text-[11px] text-slate-400">{formatDate(item.publishedAt)}</span>
                    </div>
                    <h3 className="line-clamp-1 text-sm font-semibold text-slate-800 transition-colors group-hover:text-brand-600 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{item.content}</p>
                  </div>
                  {item.imageUrl && (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Today's Schedule */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Jadwal Hari Ini
          </h2>
          <Link href="/schedule" className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
            Buka Jadwal <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-2">
          {todaySchedules.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between space-y-1 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs dark:border-white/10 dark:bg-surface"
            >
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{s.subject}</span>
                <p className="text-slate-500 dark:text-slate-400">
                  {s.startTime} - {s.endTime} WIB • {s.room}
                </p>
              </div>
              <Badge variant="success" className="shrink-0">Aktif</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Agenda / Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <CalendarDays className="w-4 h-4 text-purple-600" />
              Agenda Mendatang
            </h2>
            <Link href="/events" className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-purple-300 transition-colors group"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-brand-600 dark:text-slate-100">
                    {event.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{formatDate(event.date)} • {event.startTime} - {event.endTime} WIB</p>
                </div>
                <Badge variant="info" className="shrink-0">Agenda</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-brand-600" />
          Akses Cepat
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          <Link href="/announcements" className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card dark:border-white/10 dark:bg-surface">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 dark:text-slate-100 truncate">Pengumuman</h3>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">Info Sekolah</p>
            </div>
          </Link>

          <Link href="/schedule" className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card dark:border-white/10 dark:bg-surface">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 dark:text-slate-100 truncate">Jadwal</h3>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">Pelajaran</p>
            </div>
          </Link>

          <Link href="/events" className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card dark:border-white/10 dark:bg-surface">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 dark:text-slate-100 truncate">Event</h3>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">Agenda</p>
            </div>
          </Link>

          <Link href="/reports" className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card dark:border-white/10 dark:bg-surface">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 dark:text-slate-100 truncate">Laporan</h3>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">Fasilitas{pendingReportsCount > 0 ? ` (${pendingReportsCount})` : ''}</p>
            </div>
          </Link>

          <Link href="/lost-found" className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card dark:border-white/10 dark:bg-surface">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 dark:text-slate-100 truncate">Lost & Found</h3>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">Barang</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
