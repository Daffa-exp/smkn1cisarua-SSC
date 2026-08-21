'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, Search, GraduationCap, UserCheck, Shield, Plus, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
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
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Bulk register state
  const [className, setClassName] = useState('X RPL 1');
  const [major, setMajor] = useState('Rekayasa Perangkat Lunak');
  const [rawText, setRawText] = useState('');
  const [bulkStatus, setBulkStatus] = useState<{ success: boolean; text: string } | null>(null);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);

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

  const handleBulkSubmit = async (e: React.FormEvent) => {
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

        <Button
          variant="primary"
          onClick={() => setIsBulkModalOpen(true)}
          className="text-xs"
        >
          <Plus className="w-4 h-4" /> Registrasi Siswa Per Kelas
        </Button>
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

      {/* Bulk Register Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-600" />
                Registrasi Siswa Per Kelas (Data Resmi NIS)
              </h3>
              <button
                onClick={() => setIsBulkModalOpen(false)}
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

            <form onSubmit={handleBulkSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nama Kelas *
                  </label>
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
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jurusan *
                  </label>
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
                <label className="font-semibold text-slate-700 block mb-1">
                  Daftar NIS & Nama Siswa (1 Baris per Siswa) *
                </label>
                <p className="text-[11px] text-slate-400 mb-1.5">
                  Format: <code>NIS, Nama Siswa, Email(Opsional)</code>
                </p>
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
                  onClick={() => setIsBulkModalOpen(false)}
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
    </div>
  );
}
