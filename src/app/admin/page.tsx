'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Megaphone,
  AlertCircle,
  ArrowRight,
  Calendar,
  CalendarDays,
  Bell,
  ShieldAlert,
  ClipboardList,
  Search,
  BarChart3,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';

interface Metrics {
  totalStudents: number;
  totalTeachers: number;
  activeAnnouncements: number;
  totalSchedules: number;
  upcomingEvents: number;
  pendingReports: number;
  lostFoundActive: number;
  totalNotifications: number;
}

interface ChartData {
  label: string;
  value: number;
}

interface Charts {
  usersByRole: ChartData[];
  reportsByStatus: ChartData[];
  announcementsByPriority: ChartData[];
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.metrics);
          setCharts(data.charts);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-700" />
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pusat kendali operasional platform sekolah SMKN 1 Cisarua.
          </p>
        </div>
        <Badge variant="warning">ADMIN / SUPER ADMIN ROLE</Badge>
      </div>

      {/* Live Metrics */}
      {isLoading ? (
        <LoadingState message="Memuat statistik platform..." />
      ) : metrics ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-white border border-brand-200 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-600" /> Siswa
            </span>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalStudents}</p>
          </div>
          <div className="p-4 bg-white border border-emerald-200 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-600" /> Guru & Staf
            </span>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalTeachers}</p>
          </div>
          <div className="p-4 bg-white border border-blue-200 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Megaphone className="w-3.5 h-3.5 text-blue-600" /> Pengumuman Aktif
            </span>
            <p className="text-2xl font-bold text-slate-900">{metrics.activeAnnouncements}</p>
          </div>
          <div className="p-4 bg-white border border-rose-200 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Aduan Pending
            </span>
            <p className="text-2xl font-bold text-slate-900">{metrics.pendingReports}</p>
          </div>
          <div className="p-4 bg-white border border-purple-200 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-purple-600" /> Event Mendatang
            </span>
            <p className="text-2xl font-bold text-slate-900">{metrics.upcomingEvents}</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Total Jadwal
            </span>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalSchedules}</p>
          </div>
          <div className="p-4 bg-white border border-amber-200 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-amber-600" /> Lost & Found Aktif
            </span>
            <p className="text-2xl font-bold text-slate-900">{metrics.lostFoundActive}</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-slate-500" /> Total Notifikasi
            </span>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalNotifications}</p>
          </div>
        </div>
      ) : null}

      {/* Charts */}
      {charts && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-surface">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Pengguna per Peran</h3>
            <div className="space-y-2">
              {charts.usersByRole.map((item) => {
                const max = Math.max(...charts.usersByRole.map((c) => c.value), 1);
                const pct = Math.round((item.value / max) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5">
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-surface">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Laporan per Status</h3>
            <div className="space-y-2">
              {charts.reportsByStatus.map((item) => {
                const max = Math.max(...charts.reportsByStatus.map((c) => c.value), 1);
                const pct = Math.round((item.value / max) * 100);
                const color = item.label === 'RESOLVED' ? 'bg-emerald-500' : item.label === 'SUBMITTED' ? 'bg-amber-500' : 'bg-brand-500';
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5">
                      <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-surface">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Pengumuman per Prioritas</h3>
            <div className="space-y-2">
              {charts.announcementsByPriority.map((item) => {
                const max = Math.max(...charts.announcementsByPriority.map((c) => c.value), 1);
                const pct = Math.round((item.value / max) * 100);
                const color = item.label === 'URGENT' ? 'bg-rose-500' : item.label === 'HIGH' ? 'bg-amber-500' : 'bg-sky-500';
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5">
                      <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Module Navigation */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-3">Modul Admin</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/emergency"
            className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl shadow-xs space-y-2 hover:border-rose-400 transition-colors block group"
          >
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-xs font-semibold">Kontrol Darurat</span>
              <ShieldAlert className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-rose-950">Emergency</p>
            <span className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
              Buka Kontrol Darurat <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            href="/admin/students"
            className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 hover:border-brand-300 transition-colors block group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Kelola Pengguna</span>
              <Users className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-slate-900">Pengguna</p>
            <span className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
              Buka Manajemen Pengguna <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            href="/admin/announcements"
            className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 hover:border-blue-300 transition-colors block group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Kelola Pengumuman</span>
              <Megaphone className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-slate-900">Pengumuman</p>
            <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              Buka Modul Pengumuman <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            href="/admin/notifications"
            className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 hover:border-amber-300 transition-colors block group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Kirim Notifikasi</span>
              <Bell className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-slate-900">Siaran</p>
            <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
              Kirim Broadcast Notifikasi <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            href="/admin/schedule"
            className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 hover:border-emerald-300 transition-colors block group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Kelola Jadwal</span>
              <Calendar className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-slate-900">Jadwal</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              Buka Modul Jadwal <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            href="/admin/events"
            className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 hover:border-purple-300 transition-colors block group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Kelola Event</span>
              <CalendarDays className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-slate-900">Event</p>
            <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1">
              Buka Modul Event <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            href="/admin/reports"
            className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 hover:border-rose-300 transition-colors block group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Laporan Masuk</span>
              <AlertCircle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-slate-900">Laporan</p>
            <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
              Buka Modul Laporan <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            href="/admin/analytics"
            className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 hover:border-brand-400 transition-colors block group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Analitik & Laporan</span>
              <BarChart3 className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-slate-900">Analitik</p>
            <span className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
              Buka Modul Analitik <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <Link
            href="/lost-found"
            className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 hover:border-slate-400 transition-colors block group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Lost & Found</span>
              <Search className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold text-slate-900">Lost & Found</p>
            <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
              Buka Halaman Lost & Found <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
