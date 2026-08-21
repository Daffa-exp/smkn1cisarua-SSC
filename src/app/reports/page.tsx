'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Plus, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ReportFormModal } from '@/components/reports/ReportFormModal';
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
}

const STATUS_FLOW = ['SUBMITTED', 'REVIEWING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED'] as const;

const statusLabels: Record<string, string> = {
  SUBMITTED: 'Dikirim',
  REVIEWING: 'Ditinjau',
  VERIFIED: 'Terverifikasi',
  IN_PROGRESS: 'Sedang Diproses',
  RESOLVED: 'Selesai',
};

const statusVariantMap: Record<string, 'warning' | 'info' | 'success' | 'danger'> = {
  SUBMITTED: 'warning',
  REVIEWING: 'info',
  VERIFIED: 'info',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
};

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getStatusIndex = (status: string) => STATUS_FLOW.indexOf(status as typeof STATUS_FLOW[number]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-rose-600" />
            Laporan Fasilitas & Masalah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Laporkan kerusakan sarana prasarana sekolah untuk penanganan cepat.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto text-xs"
        >
          <Plus className="w-4 h-4" />
          Buat Laporan Baru
        </Button>
      </div>

      {/* Global status flow */}
      <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-600 overflow-x-auto no-scrollbar">
          {STATUS_FLOW.map((status, idx) => (
            <React.Fragment key={status}>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`font-semibold ${status === 'RESOLVED' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {idx + 1}. {statusLabels[status] || status}
                </span>
              </div>
              {idx < STATUS_FLOW.length - 1 && (
                <span className="text-slate-300 shrink-0">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat riwayat laporan Anda..." />
      ) : reports.length === 0 ? (
        <EmptyState
          title="Belum Ada Laporan Ditambahkan"
          description="Jika menemukan kerusakan fasilitas di lingkungan sekolah, silakan buat aduan di sini."
          action={
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Buat Laporan
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {reports.map((item) => {
            const currentIdx = getStatusIndex(item.status);
            return (
              <div
                key={item.id}
                className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3 hover:border-rose-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariantMap[item.status] || 'warning'}>
                      {statusLabels[item.status] || item.status}
                    </Badge>
                    <span className="text-xs text-slate-400 font-medium">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Mini timeline */}
                <div className="flex items-center gap-1">
                  {STATUS_FLOW.map((step, idx) => (
                    <React.Fragment key={step}>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${idx <= currentIdx ? 'bg-brand-500' : 'bg-slate-200'}`} />
                        <span className={`text-[10px] ${idx <= currentIdx ? 'text-brand-700 font-semibold' : 'text-slate-400'}`}>
                          {statusLabels[step]}
                        </span>
                      </div>
                      {idx < STATUS_FLOW.length - 1 && (
                        <div className={`flex-1 h-px mx-1 ${idx < currentIdx ? 'bg-brand-300' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600">{item.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Lokasi: {item.location}
                  </span>
                  {item.status === 'RESOLVED' && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai Ditangani
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ReportFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchReports}
      />
    </div>
  );
}
