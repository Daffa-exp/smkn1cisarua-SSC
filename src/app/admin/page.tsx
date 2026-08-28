'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  ArrowLeft,
  Users,
  Megaphone,
  Calendar,
  AlertCircle,
  ClipboardList,
  PackageOpen,
  Bell,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { LoadingState } from '@/components/ui/LoadingState';
import { Button } from '@/components/ui/Button';

interface MetricsData {
  totalStudents: number;
  totalTeachers: number;
  activeAnnouncements: number;
  totalSchedules: number;
  upcomingEvents: number;
  pendingReports: number;
  lostFoundActive: number;
  totalNotifications: number;
}

const METRIC_CARDS = [
  { key: 'totalStudents', label: 'Total Siswa', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
  { key: 'totalTeachers', label: 'Total Guru', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'activeAnnouncements', label: 'Pengumuman Aktif', icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'totalSchedules', label: 'Jadwal Pelajaran', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'upcomingEvents', label: 'Event Mendatang', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'pendingReports', label: 'Laporan Tertunda', icon: ClipboardList, color: 'text-rose-600', bg: 'bg-rose-50' },
  { key: 'lostFoundActive', label: 'Lost & Found Aktif', icon: PackageOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'totalNotifications', label: 'Notifikasi', icon: Bell, color: 'text-cyan-600', bg: 'bg-cyan-50' },
] as const;

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      if (data.success && data.metrics) {
        setMetrics(data.metrics);
      } else {
        setError('Gagal memuat data metrics.');
      }
    } catch {
      setError('Terjadi kesalahan saat memuat data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-600" />
            Command Center Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ringkasan operasional platform SMKN 1 Cisarua Connect.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchMetrics} isLoading={isLoading}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat data command center..." />
      ) : error ? (
        <div className="p-6 text-center text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl">{error}</div>
      ) : !metrics ? (
        <div className="p-6 text-center text-sm text-slate-500 bg-white border border-slate-200/80 rounded-2xl">Tidak ada data.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {METRIC_CARDS.map((card) => {
            const Icon = card.icon;
            const value = metrics[card.key];
            return (
              <div
                key={card.key}
                className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2"
              >
                <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-[11px] font-medium text-slate-500">{card.label}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/students"
          className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-brand-300 transition-colors"
        >
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" /> Manajemen Pengguna
          </h3>
          <p className="text-xs text-slate-500 mt-1">Daftar siswa, guru, dan admin. Registrasi massal siswa.</p>
        </Link>

        <Link
          href="/admin/analytics"
          className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-brand-300 transition-colors"
        >
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600" /> Analitik & Laporan
          </h3>
          <p className="text-xs text-slate-500 mt-1">Visualisasi data operasional, status aduan, dan demografi.</p>
        </Link>

        <Link
          href="/admin/announcements"
          className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-brand-300 transition-colors"
        >
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-brand-600" /> Pengumuman
          </h3>
          <p className="text-xs text-slate-500 mt-1">Kelola pengumuman sekolah,prioritas, dan target audiens.</p>
        </Link>

        <Link
          href="/admin/schedule"
          className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-brand-300 transition-colors"
        >
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" /> Jadwal Pelajaran
          </h3>
          <p className="text-xs text-slate-500 mt-1">Atur jadwal kelas, mapel, guru, dan ruangan.</p>
        </Link>

        <Link
          href="/admin/events"
          className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-brand-300 transition-colors"
        >
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" /> Event Sekolah
          </h3>
          <p className="text-xs text-slate-500 mt-1">Buat dan kelola event/agenda sekolah.</p>
        </Link>

        <Link
          href="/admin/reports"
          className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-brand-300 transition-colors"
        >
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-brand-600" /> Laporan Fasilitas
          </h3>
          <p className="text-xs text-slate-500 mt-1">Review dan kelola laporan kerusakan fasilitas.</p>
        </Link>

        <Link
          href="/admin/emergency"
          className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-brand-300 transition-colors"
        >
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" /> Emergency Alert
          </h3>
          <p className="text-xs text-slate-500 mt-1">Publikasikan banner darurat untuk seluruh pengguna.</p>
        </Link>

        <Link
          href="/admin/notifications"
          className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-brand-300 transition-colors"
        >
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600" /> Notifikasi
          </h3>
          <p className="text-xs text-slate-500 mt-1">Kirim notifikasi targeted atau broadcast ke pengguna.</p>
        </Link>
      </div>
    </div>
  );
}
