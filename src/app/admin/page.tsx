'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, ArrowLeft, PieChart, TrendingUp, AlertCircle, Users, Megaphone, CheckCircle2 } from 'lucide-react';
import { LoadingState } from '@/components/ui/LoadingState';

interface AnalyticsData {
  reportsByStatus: { status: string; count: number }[];
  reportsByCategory: { category: string; count: number }[];
  announcementsByPriority: { priority: string; count: number }[];
  lostFoundByStatus: { isResolved: boolean; count: number }[];
  usersByRole: { role: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setData(resData.analytics);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const calculateTotal = (arr: { count: number }[]) =>
    arr.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Command Center Admin
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-600" />
          Analitik & Laporan Operasional
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Visualisasi data layanan sekolah, status aduan, pengumuman, dan demografi pengguna.
        </p>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat analitik platform..." />
      ) : !data ? (
        <div className="p-8 text-center text-slate-500 text-sm">Gagal memuat data analitik.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Reports Distribution */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" /> Status Aduan & Laporan Kerusakan
            </h3>
            {data.reportsByStatus.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada data laporan.</p>
            ) : (
              <div className="space-y-3">
                {data.reportsByStatus.map((item) => {
                  const total = calculateTotal(data.reportsByStatus);
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{item.status}</span>
                        <span>{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Report Category Distribution */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" /> Kategori Aduan Fasilitas
            </h3>
            {data.reportsByCategory.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada data kategori aduan.</p>
            ) : (
              <div className="space-y-3">
                {data.reportsByCategory.map((item) => {
                  const total = calculateTotal(data.reportsByCategory);
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{item.category}</span>
                        <span>{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Announcement Priority */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" /> Prioritas Pengumuman Sekolah
            </h3>
            {data.announcementsByPriority.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada data pengumuman.</p>
            ) : (
              <div className="space-y-3">
                {data.announcementsByPriority.map((item) => {
                  const total = calculateTotal(data.announcementsByPriority);
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  return (
                    <div key={item.priority} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{item.priority}</span>
                        <span>{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Demografi Pengguna */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> Demografi Peran Pengguna
            </h3>
            {data.usersByRole.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada data pengguna.</p>
            ) : (
              <div className="space-y-3">
                {data.usersByRole.map((item) => {
                  const total = calculateTotal(data.usersByRole);
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  return (
                    <div key={item.role} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{item.role}</span>
                        <span>{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
