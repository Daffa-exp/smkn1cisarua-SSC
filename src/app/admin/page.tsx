'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Megaphone,
  Calendar,
  AlertCircle,
  ClipboardList,
  PackageOpen,
  Bell,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
  Shield,
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

interface ChartData {
  reportsByStatus: { status: string; count: number }[];
  usersByRole: { role: string; count: number }[];
  announcementsByPriority: { priority: string; count: number }[];
}

const METRIC_CARDS = [
  { key: 'totalStudents', label: 'Total Siswa', desc: 'Akun siswa terdaftar', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-100' },
  { key: 'totalTeachers', label: 'Total Guru', desc: 'Guru & staf aktif', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { key: 'activeAnnouncements', label: 'Pengumuman Aktif', desc: 'Sedang dipublikasikan', icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { key: 'totalSchedules', label: 'Jadwal Pelajaran', desc: 'Jadwal minggu ini', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { key: 'upcomingEvents', label: 'Event Mendatang', desc: 'Agenda sekolah', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { key: 'pendingReports', label: 'Laporan Tertunda', desc: 'Menunggu tindakan', icon: ClipboardList, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { key: 'lostFoundActive', label: 'Lost & Found Aktif', desc: 'Barang belum ditemukan', icon: PackageOpen, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  { key: 'totalNotifications', label: 'Notifikasi', desc: 'Total siaran sistem', icon: Bell, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
] as const;

const QUICK_LINKS = [
  { href: '/admin/students', label: 'Manajemen Pengguna', desc: 'Daftar siswa, guru, dan admin', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
  { href: '/admin/analytics', label: 'Analitik & Laporan', desc: 'Visualisasi data operasional', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  { href: '/admin/announcements', label: 'Pengumuman', desc: 'Kelola pengumuman sekolah', icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
  { href: '/admin/schedule', label: 'Jadwal Pelajaran', desc: 'Atur jadwal kelas', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { href: '/admin/events', label: 'Event Sekolah', desc: 'Buat dan kelola event', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  { href: '/admin/reports', label: 'Laporan Fasilitas', desc: 'Review laporan kerusakan', icon: ClipboardList, color: 'text-rose-600', bg: 'bg-rose-50' },
  { href: '/admin/emergency', label: 'Emergency Alert', desc: 'Publikasikan banner darurat', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  { href: '/admin/notifications', label: 'Notifikasi', desc: 'Kirim broadcast notifikasi', icon: Bell, color: 'text-cyan-600', bg: 'bg-cyan-50' },
] as const;

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [metricsRes, chartsRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/analytics'),
      ]);

      const metricsData = await metricsRes.json();
      const chartsData = await chartsRes.json();

      if (metricsData.success && metricsData.metrics) {
        setMetrics(metricsData.metrics);
      } else {
        setError('Gagal memuat data metrics.');
      }

      if (chartsData.success && chartsData.analytics) {
        setChartData(chartsData.analytics);
      }
    } catch {
      setError('Terjadi kesalahan saat memuat data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderBarChart = (data: { label: string; value: number }[], color: string) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
      <div className="space-y-2.5">
        {data.map((item, idx) => {
          const pct = (item.value / max) * 100;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-600">
                <span className="truncate">{item.label}</span>
                <span className="tabular-nums">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDoughnutChart = (data: { label: string; value: number }[]) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    if (total === 0) return <p className="text-xs text-slate-400">Belum ada data.</p>;

    const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
    let cumulativePercent = 0;

    const segments = data.map((item, idx) => {
      const percent = (item.value / total) * 100;
      const start = cumulativePercent;
      cumulativePercent += percent;
      return { ...item, percent, start, end: cumulativePercent, color: colors[idx % colors.length] };
    });

    return (
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            {segments.map((seg, idx) => {
              const radius = 15.9155;
              const circumference = 2 * Math.PI * radius;
              const dashArray = `${(seg.percent / 100) * circumference} ${circumference}`;
              const dashOffset = -((seg.start / 100) * circumference);
              return (
                <circle
                  key={idx}
                  cx="18"
                  cy="18"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="3"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">{total}</p>
              <p className="text-[9px] text-slate-500">Total</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-slate-600 truncate">{seg.label}</span>
              </div>
              <span className="tabular-nums font-medium text-slate-700">{seg.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-brand-600" />
            </div>
            Command Center Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ringkasan operasional platform SMKN 1 Cisarua Connect.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchData} isLoading={isLoading}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Metrics Grid */}
      {isLoading ? (
        <LoadingState message="Memuat data command center..." />
      ) : error ? (
        <div className="p-6 text-center text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl">{error}</div>
      ) : !metrics ? (
        <div className="p-6 text-center text-sm text-slate-500 bg-white border border-slate-200/80 rounded-2xl">Tidak ada data.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {METRIC_CARDS.map((card) => {
              const Icon = card.icon;
              const value = metrics[card.key];
              return (
                <div
                  key={card.key}
                  className={`p-4 sm:p-5 bg-white border ${card.border} rounded-2xl shadow-xs space-y-2 hover:shadow-md transition-shadow`}
                >
                  <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
                    <p className="text-[11px] font-medium text-slate-500">{card.label}</p>
                    <p className="text-[10px] text-slate-400">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Reports by Status */}
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Status Laporan Fasilitas</h3>
                  <p className="text-[10px] text-slate-500">Distribusi status aduan & kerusakan</p>
                </div>
              </div>
              {chartData?.reportsByStatus && chartData.reportsByStatus.length > 0 ? (
                renderBarChart(
                  chartData.reportsByStatus.map((item) => ({ label: item.status, value: item.count })),
                  'bg-rose-500'
                )
              ) : (
                <p className="text-xs text-slate-400">Belum ada data laporan.</p>
              )}
            </div>

            {/* Users by Role */}
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Demografi Pengguna</h3>
                  <p className="text-[10px] text-slate-500">Distribusi peran pengguna</p>
                </div>
              </div>
              {chartData?.usersByRole && chartData.usersByRole.length > 0 ? (
                renderDoughnutChart(chartData.usersByRole.map((item) => ({ label: item.role, value: item.count })))
              ) : (
                <p className="text-xs text-slate-400">Belum ada data pengguna.</p>
              )}
            </div>

            {/* Announcements by Priority */}
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Prioritas Pengumuman</h3>
                  <p className="text-[10px] text-slate-500">Distribusi prioritas pengumuman aktif</p>
                </div>
              </div>
              {chartData?.announcementsByPriority && chartData.announcementsByPriority.length > 0 ? (
                renderBarChart(
                  chartData.announcementsByPriority.map((item) => ({ label: item.priority, value: item.count })),
                  'bg-blue-500'
                )
              ) : (
                <p className="text-xs text-slate-400">Belum ada data pengumuman.</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Akses Cepat</h3>
                  <p className="text-[10px] text-slate-400">Menu yang sering digunakan</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LINKS.slice(0, 4).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                  >
                    <div className={`w-7 h-7 rounded-lg ${link.bg} ${link.color} flex items-center justify-center shrink-0`}>
                      <link.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-white truncate group-hover:text-brand-300 transition-colors">{link.label}</p>
                      <p className="text-[9px] text-slate-400 truncate">{link.desc}</p>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-white ml-auto shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* All Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-brand-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${link.bg} ${link.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <link.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-brand-700 transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Buka modul <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
