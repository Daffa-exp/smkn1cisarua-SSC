'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, User, MapPin, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  photoUrl?: string | null;
  status: string;
  createdAt: string;
  reporter: { name: string; email: string; class?: string | null };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      alert('Gagal memperbarui status laporan.');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusVariantMap: Record<string, 'warning' | 'info' | 'success' | 'danger'> = {
    SUBMITTED: 'warning',
    REVIEWING: 'info',
    VERIFIED: 'info',
    IN_PROGRESS: 'warning',
    RESOLVED: 'success',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Command Center Admin
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-rose-600" />
            Manajemen Laporan Fasilitas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tinjau dan perbarui status aduan kerusakan dari siswa/guru.
          </p>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat seluruh laporan masuk..." />
      ) : reports.length === 0 ? (
        <EmptyState
          title="Belum Ada Laporan Masuk"
          description="Belum ada aduan fasilitas yang dikirimkan oleh pengguna."
        />
      ) : (
        <div className="space-y-3">
          {reports.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3 hover:border-rose-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariantMap[item.status] || 'warning'}>
                      {item.status}
                    </Badge>
                    <span className="text-xs text-slate-400 font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">
                    Ubah Status:
                  </span>
                  <select
                    value={item.status}
                    disabled={updatingId === item.id}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white font-medium"
                  >
                    <option value="SUBMITTED">SUBMITTED (Diterima)</option>
                    <option value="REVIEWING">REVIEWING (Sedang Ditinjau)</option>
                    <option value="VERIFIED">VERIFIED (Terverifikasi)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Sedang Ditangani)</option>
                    <option value="RESOLVED">RESOLVED (Selesai)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Pelapor: {item.reporter.name} (
                  {item.reporter.class || 'Siswa'})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Lokasi: {item.location}
                </span>
                <span className="text-slate-400">
                  Tanggal: {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
