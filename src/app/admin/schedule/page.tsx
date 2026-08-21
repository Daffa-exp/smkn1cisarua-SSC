'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Plus, Edit, Trash2, ArrowLeft, User, MapPin, Download, Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScheduleFormModal } from '@/components/schedule/ScheduleFormModal';
import { formatDate } from '@/lib/utils';

interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  className: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Senin');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

  // Import CSV state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; text: string } | null>(null);
  const [isSubmittingImport, setIsSubmittingImport] = useState(false);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        setSchedules(data.schedules || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;

    try {
      const res = await fetch(`/api/schedule/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSchedules((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert('Gagal menghapus jadwal.');
    }
  };

  const handleEdit = (schedule: ScheduleItem) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    window.open('/api/schedule/export', '_blank');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCsvText(reader.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportStatus(null);
    setIsSubmittingImport(true);

    try {
      const res = await fetch('/api/schedule/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: csvText }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setImportStatus({ success: false, text: data.message || 'Gagal mengimpor jadwal.' });
        setIsSubmittingImport(false);
        return;
      }

      setImportStatus({ success: true, text: data.message });
      setCsvText('');
      fetchSchedules();
    } catch (err) {
      setImportStatus({ success: false, text: 'Terjadi masalah koneksi server.' });
    } finally {
      setIsSubmittingImport(false);
    }
  };

  const filtered = schedules.filter((s) => s.day === selectedDay);

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
            <Calendar className="w-6 h-6 text-emerald-600" />
            Manajemen Jadwal Pelajaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola jadwal KBM, mata pelajaran, guru pengampu, dan kelas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
            className="text-xs"
          >
            <Upload className="w-4 h-4 text-emerald-600" /> Import CSV
          </Button>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="text-xs"
          >
            <Download className="w-4 h-4 text-brand-600" /> Export CSV
          </Button>

          <Button variant="primary" onClick={handleCreateNew} className="text-xs">
            <Plus className="w-4 h-4" />
            Tambah Jadwal
          </Button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              day === selectedDay
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState message="Memuat jadwal pelajaran..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`Belum Ada Jadwal di Hari ${selectedDay}`}
          description="Klik tombol di atas untuk menambahkan jadwal pelajaran baru atau lakukan Import CSV."
          action={
            <Button variant="primary" size="sm" onClick={handleCreateNew}>
              Tambah Jadwal
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="success">
                    {item.startTime} - {item.endTime} WIB
                  </Badge>
                  <span className="text-xs text-slate-400 font-semibold">
                    {item.className}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">{item.subject}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {item.teacher}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.room}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="text-xs"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Form Modal */}
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSchedules}
        initialData={selectedSchedule}
      />

      {/* Import CSV Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                Import Jadwal Pelajaran (File CSV)
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {importStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  importStatus.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}
              >
                {importStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{importStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleImportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Upload File CSV dari Komputer
                </label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Atau Tempel Teks CSV di Sini
                </label>
                <p className="text-[11px] text-slate-400 mb-1.5">
                  Format: <code>Mata Pelajaran, Guru, Kelas, Ruangan, Hari, Jam Mulai, Jam Selesai</code>
                </p>
                <textarea
                  required
                  rows={6}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`Pemrograman Web, Drs. Budi, X RPL 1, Lab 1, Senin, 07:30, 09:30\nBasis Data, Bu Anita, X RPL 1, Lab 2, Senin, 09:45, 11:45`}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportModalOpen(false)}
                  disabled={isSubmittingImport}
                >
                  Tutup
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingImport}>
                  Impor Jadwal Sekarang
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
