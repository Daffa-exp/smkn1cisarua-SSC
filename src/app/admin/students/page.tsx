'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  ArrowLeft,
  Search,
  GraduationCap,
  Plus,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Download,
  FileSpreadsheet,
  FileType2,
  File,
  Trash2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  nis?: string | null;
  class?: string | null;
  createdAt: string;
}

interface PreviewRow {
  row: number;
  name: string;
  email: string;
  nis: string;
  class: string;
  major: string;
  status: 'valid' | 'error' | 'duplicate';
  errors: string[];
}

const roleVariantMap: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  STUDENT: 'info',
  STUDENT_LEADER: 'warning',
  TEACHER: 'success',
  ADMIN: 'warning',
  SUPER_ADMIN: 'danger',
};

export default function AdminStudentsPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBulkTextModalOpen, setIsBulkTextModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

  // Text bulk register state
  const [className, setClassName] = useState('X RPL 1');
  const [major, setMajor] = useState('Rekayasa Perangkat Lunak');
  const [rawText, setRawText] = useState('');
  const [bulkStatus, setBulkStatus] = useState<{ success: boolean; text: string } | null>(null);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);

  // File import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [previewSummary, setPreviewSummary] = useState<{ total: number; valid: number; error: number; duplicate: number } | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; text: string } | null>(null);
  const [errorReport, setErrorReport] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/students');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBulkTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkStatus(null);
    setIsSubmittingBulk(true);

    try {
      const res = await fetch('/api/admin/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className, major, rawText }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setBulkStatus({ success: false, text: data.message || 'Gagal mendaftarkan siswa.' });
        setIsSubmittingBulk(false);
        return;
      }

      setBulkStatus({ success: true, text: data.message });
      setRawText('');
      fetchUsers();
    } catch (err) {
      setBulkStatus({ success: false, text: 'Masalah koneksi server.' });
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setPreviewRows([]);
      setPreviewSummary(null);
      setImportResult(null);
      setErrorReport(null);
    }
  };

  const handlePreview = async () => {
    if (!importFile) return;

    setIsPreviewLoading(true);
    setPreviewRows([]);
    setPreviewSummary(null);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', importFile);
      formData.append('action', 'preview');

      const res = await fetch('/api/admin/students/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || 'Gagal memproses file.');
        setIsPreviewLoading(false);
        return;
      }

      setPreviewRows(data.preview);
      setPreviewSummary(data.summary);
    } catch (err) {
      alert('Masalah koneksi server.');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewRows.length) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('action', 'confirm');
      formData.append('previewData', JSON.stringify(previewRows));

      const res = await fetch('/api/admin/students/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setImportResult({ success: false, text: data.message || 'Gagal import data.' });
      } else {
        setImportResult({ success: true, text: data.message });
        setErrorReport(
          data.errors?.length
            ? data.errors.join('\n')
            : null
        );
        fetchUsers();
      }
    } catch (err) {
      setImportResult({ success: false, text: 'Masalah koneksi server.' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadErrorReport = () => {
    if (!errorReport) return;
    const blob = new Blob([errorReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    const params = new URLSearchParams();
    params.set('format', format);
    if (activeRole !== 'ALL') params.set('role', activeRole);
    window.open(`/api/admin/students/export?${params.toString()}`, '_blank');
    setIsExportMenuOpen(false);
  };

  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    window.open(`/api/admin/students/template?format=${format}`, '_blank');
    setIsTemplateMenuOpen(false);
  };

  const resetImport = () => {
    setImportFile(null);
    setPreviewRows([]);
    setPreviewSummary(null);
    setImportResult(null);
    setErrorReport(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = activeRole === 'ALL' || u.role === activeRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.nis && u.nis.includes(searchQuery));
    return matchesRole && matchesSearch;
  });

  const roleTabs = ['ALL', 'STUDENT', 'STUDENT_LEADER', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'];

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
            <Users className="w-6 h-6 text-brand-600" />
            Manajemen Pengguna & Registrasi Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar seluruh siswa, Ketos/Waketos, guru, dan admin yang terdaftar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
              className="text-xs"
            >
              <Download className="w-4 h-4" /> Template
            </Button>
            {isTemplateMenuOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => handleDownloadTemplate('xlsx')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Excel (.xlsx)
                </button>
                <button
                  onClick={() => handleDownloadTemplate('csv')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileType2 className="w-3.5 h-3.5" /> CSV (.csv)
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="text-xs"
            >
              <Upload className="w-4 h-4" /> Export
            </Button>
            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileType2 className="w-3.5 h-3.5" /> CSV
                </button>
                <button
                  onClick={() => handleExport('xlsx')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Excel (.xlsx)
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  <File className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            )}
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsImportModalOpen(true)} className="text-xs">
            <Upload className="w-4 h-4" /> Import Data Siswa
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsBulkTextModalOpen(true)} className="text-xs">
            <Plus className="w-4 h-4" /> Registrasi Teks
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto">
          {roleTabs.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeRole === role
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {role === 'ALL' ? 'Semua' : role === 'STUDENT_LEADER' ? 'Ketos/Waketos' : role}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari NIS, nama, email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat daftar pengguna..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="Tidak Ada Pengguna Ditemukan"
          description="Tidak ada pengguna yang sesuai dengan filter atau pencarian Anda."
        />
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left p-3.5 font-semibold text-slate-600">NIS / ID</th>
                  <th className="text-left p-3.5 font-semibold text-slate-600">Nama Lengkap</th>
                  <th className="text-left p-3.5 font-semibold text-slate-600">Email</th>
                  <th className="text-left p-3.5 font-semibold text-slate-600">Role</th>
                  <th className="text-left p-3.5 font-semibold text-slate-600">Kelas</th>
                  <th className="text-left p-3.5 font-semibold text-slate-600">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-semibold text-slate-700">
                      {user.nis || '-'}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500">{user.email}</td>
                    <td className="p-3.5">
                      <Badge variant={roleVariantMap[user.role] || 'info'}>
                        {user.role === 'STUDENT_LEADER' ? 'KETOS / WAKETOS' : user.role}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-slate-500">{user.class || '-'}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3.5 border-t border-slate-100 text-xs text-slate-400">
            Menampilkan {filteredUsers.length} dari {users.length} pengguna
          </div>
        </div>
      )}

      {/* Text Bulk Register Modal */}
      {isBulkTextModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-600" />
                Registrasi Siswa Per Kelas (Data Resmi NIS)
              </h3>
              <button
                onClick={() => setIsBulkTextModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bulkStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  bulkStatus.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}
              >
                {bulkStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{bulkStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleBulkTextSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Kelas *</label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Contoh: X RPL 1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jurusan *</label>
                  <input
                    type="text"
                    required
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="Rekayasa Perangkat Lunak"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Daftar NIS & Nama Siswa (1 Baris per Siswa) *</label>
                <p className="text-[11px] text-slate-400 mb-1.5">Format: <code>NIS, Nama Siswa, Email(Opsional)</code></p>
                <textarea
                  required
                  rows={6}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`20261001, Daffa Alamsyah\n20261002, Budi Santoso\n20261003, Siti Aminah`}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                Password awal siswa otomatis dibuat sama dengan NIS (atau <code>siswa123</code>). Siswa dapat menggunakan NIS mereka untuk login.
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkTextModalOpen(false)}
                  disabled={isSubmittingBulk}
                >
                  Tutup
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingBulk}>
                  Daftarkan Siswa Kelas Ini
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-brand-600" />
                Import Data Siswa
              </h3>
              <button
                onClick={() => { setIsImportModalOpen(false); resetImport(); }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!previewRows.length ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">Upload File Excel atau CSV</p>
                  <p className="text-xs text-slate-400 mb-4">Format yang didukung: .xlsx, .csv</p>
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileChange}
                    className="block mx-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  />
                  {importFile && (
                    <p className="text-xs text-slate-500 mt-2">File: {importFile.name}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handlePreview}
                    disabled={!importFile || isPreviewLoading}
                    isLoading={isPreviewLoading}
                  >
                    Preview Data
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {previewSummary && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                      <p className="text-lg font-bold text-emerald-700">{previewSummary.valid}</p>
                      <p className="text-[10px] text-emerald-600">Valid</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                      <p className="text-lg font-bold text-amber-700">{previewSummary.duplicate}</p>
                      <p className="text-[10px] text-amber-600">Duplicate</p>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                      <p className="text-lg font-bold text-rose-700">{previewSummary.error}</p>
                      <p className="text-[10px] text-rose-600">Error</p>
                    </div>
                  </div>
                )}

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="text-left p-2.5 font-semibold text-slate-600">No</th>
                        <th className="text-left p-2.5 font-semibold text-slate-600">Nama</th>
                        <th className="text-left p-2.5 font-semibold text-slate-600">Email</th>
                        <th className="text-left p-2.5 font-semibold text-slate-600">NIS</th>
                        <th className="text-left p-2.5 font-semibold text-slate-600">Kelas</th>
                        <th className="text-left p-2.5 font-semibold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewRows.map((row) => (
                        <tr key={row.row} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-500">{row.row}</td>
                          <td className="p-2.5 font-medium text-slate-800">{row.name}</td>
                          <td className="p-2.5 text-slate-500">{row.email}</td>
                          <td className="p-2.5 font-mono text-slate-700">{row.nis}</td>
                          <td className="p-2.5 text-slate-500">{row.class}</td>
                          <td className="p-2.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                                row.status === 'valid'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : row.status === 'duplicate'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {row.status === 'valid' ? 'Valid' : row.status === 'duplicate' ? 'Duplicate' : 'Error'}
                            </span>
                            {row.errors.length > 0 && (
                              <p className="text-[10px] text-rose-600 mt-0.5">{row.errors[0]}</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {importResult && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      importResult.success
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : 'bg-rose-50 border border-rose-200 text-rose-700'
                    }`}
                  >
                    {importResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{importResult.text}</span>
                  </div>
                )}

                {errorReport && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-700">Detail Error</p>
                      <Button variant="ghost" size="sm" onClick={handleDownloadErrorReport} className="text-xs h-7">
                        <Download className="w-3 h-3" /> Download Report
                      </Button>
                    </div>
                    <pre className="text-[10px] text-slate-600 whitespace-pre-wrap max-h-32 overflow-y-auto">{errorReport}</pre>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <Button variant="outline" size="sm" onClick={resetImport} disabled={isImporting}>
                    <RefreshCw className="w-4 h-4" /> Upload Ulang
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(false)} disabled={isImporting}>
                      Tutup
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleConfirmImport}
                      disabled={isImporting || previewSummary?.valid === 0}
                      isLoading={isImporting}
                    >
                      Import {previewSummary?.valid || 0} Siswa
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
