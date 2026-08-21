'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, ArrowLeft, Send, Power, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

interface EmergencyAlertItem {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminEmergencyPage() {
  const [alerts, setAlerts] = useState<EmergencyAlertItem[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/emergency');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('PERHATIAN: Anda akan menerbitkan SIARAN DARURAT ke seluruh siswa & staf. Lanjutkan?')) return;

    setStatusMsg(null);
    setIsPublishing(true);

    try {
      const res = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMsg({ success: false, text: data.message || 'Gagal menerbitkan siaran darurat.' });
        setIsPublishing(false);
        return;
      }

      setStatusMsg({ success: true, text: data.message });
      setTitle('');
      setMessage('');
      fetchAlerts();
    } catch (err: any) {
      setStatusMsg({ success: false, text: 'Terjadi kesalahan koneksi server.' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Matikan status siaran darurat ini?')) return;

    try {
      const res = await fetch(`/api/emergency/${id}`, { method: 'PATCH' });
      if (res.ok) {
        fetchAlerts();
      }
    } catch (err) {
      alert('Gagal menonaktifkan status darurat.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Command Center Admin
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
          Kontrol Peringatan Darurat (Emergency Alert)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Terbitkan siaran darurat bernilai prioritas tinggi ke seluruh perangkat aplikasi sekolah.
        </p>
      </div>

      {/* Broadcast Form */}
      <div className="p-6 bg-white border-2 border-rose-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          Form Terbitkan Peringatan Darurat (Otorisasi Manusia Required)
        </div>

        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border border-rose-200 text-rose-700'
            }`}
          >
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Judul Peringatan Darurat *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Evakuasi Area Workshop B / Cuaca Ekstrem"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Instruksi / Pesan Darurat *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan instruksi singkat dan jelas yang harus dilakukan seluruh siswa/staf..."
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="danger"
              isLoading={isPublishing}
              className="text-xs bg-rose-600 hover:bg-rose-700"
            >
              <ShieldAlert className="w-4 h-4" /> Terbitkan Peringatan Darurat
            </Button>
          </div>
        </form>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800">Daftar Peringatan Darurat Aktif</h2>

        {isLoading ? (
          <LoadingState message="Memuat status peringatan darurat..." />
        ) : alerts.length === 0 ? (
          <EmptyState
            title="Tidak Ada Siaran Darurat Aktif"
            description="Sistem dalam kondisi normal. Tidak ada peringatan darurat yang sedang berjalan."
          />
        ) : (
          <div className="space-y-3">
            {alerts.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="danger">AKTIF SEKARANG</Badge>
                    <span className="text-xs text-rose-700 font-medium">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-rose-950">{item.title}</h3>
                  <p className="text-xs text-rose-900">{item.message}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeactivate(item.id)}
                  className="text-xs border-rose-300 text-rose-700 hover:bg-rose-100"
                >
                  <Power className="w-3.5 h-3.5" /> Matikan Status
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
