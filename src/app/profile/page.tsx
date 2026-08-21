'use client';

import React, { useRef, useState, useEffect } from 'react';
import { User, Shield, BookOpen, Hash, Mail, ShieldCheck, Camera, Trash2, Loader2, Save } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingState } from '@/components/ui/LoadingState';
import { ConfirmLogoutModal } from '@/components/ui/ConfirmLogoutModal';

function resizeImage(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(max / img.width, max / img.height, 1);
        const canvas = document.createElement('canvas');
        const size = Math.max(128, Math.round(Math.max(img.width, img.height) * scale));
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { user, isLoading, logout, refetchSession } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [avatar, setAvatar] = useState<string | null | undefined>(user?.avatarUrl);
  const [name, setName] = useState(user?.name || '');
  const [originalName, setOriginalName] = useState(user?.name || '');
  const [originalAvatar, setOriginalAvatar] = useState<string | null | undefined>(user?.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const hasChanges = name.trim() !== originalName || avatar !== originalAvatar;

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [avatar, name]);

  if (isLoading) {
    return <LoadingState message="Memuat profil Anda..." />;
  }

  if (!user) {
    return null;
  }

  const initial = (user.name || 'U').charAt(0).toUpperCase();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) fileRef.current && (fileRef.current.value = '');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2 MB.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const dataUrl = await resizeImage(file, 256);
      setAvatar(dataUrl);
    } catch {
      setError('Gagal memproses gambar.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    setAvatar(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const body: { name?: string; avatarUrl?: string | null } = {};
      if (name.trim() !== originalName) {
        body.name = name.trim();
      }
      if (avatar !== originalAvatar) {
        body.avatarUrl = avatar;
      }
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Gagal menyimpan perubahan.');
      } else {
        setOriginalName(name.trim());
        setOriginalAvatar(avatar);
        await refetchSession();
        setSuccess('Perubahan berhasil disimpan.');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch {
      setError('Terjadi kesalahan saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const roleVariantMap: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
    STUDENT: 'info',
    TEACHER: 'success',
    ADMIN: 'warning',
    SUPER_ADMIN: 'danger',
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
          <User className="h-6 w-6 text-brand-600" />
          Profil Pengguna
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          Kelola foto dan identitas akun Anda di platform SMKN 1 Cisarua.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-white/10 dark:bg-surface">
        {/* Identity header */}
        <div className="flex flex-col items-center gap-5 border-b border-slate-100 p-6 text-center sm:flex-row sm:items-center sm:p-8 sm:text-left dark:border-white/5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-slate-800 sm:h-28 sm:w-28">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-4xl font-bold text-slate-400 dark:text-slate-500 sm:text-5xl">{initial}</span>
              )}
            </div>
            {avatar && (
              <button
                type="button"
                onClick={removePhoto}
                disabled={uploading || saving}
                aria-label="Hapus foto"
                className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow ring-2 ring-white transition-colors hover:bg-rose-700 disabled:opacity-60 dark:ring-surface"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading || saving}
              aria-label="Ubah foto profil"
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white shadow ring-2 ring-white transition-colors hover:bg-brand-700 disabled:opacity-60 dark:ring-surface"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">{user.name}</span>
              <Badge variant={roleVariantMap[user.role] || 'info'}>{user.role}</Badge>
            </div>
            <p className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400 sm:justify-start">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Klik kamera untuk mengganti foto profil</p>
          </div>
        </div>

        {/* Status */}
        {(error || success) && (
          <div
            className={`border-t px-6 py-3 text-xs ${
              error
                ? 'border-slate-100 text-rose-600 dark:border-white/5'
                : 'border-slate-100 text-emerald-600 dark:border-white/5'
            }`}
          >
            {error || success}
          </div>
        )}

        {/* Editable fields */}
        <div className="space-y-4 p-6 sm:p-8">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
            />
          </div>

          {user.role === 'STUDENT' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kelas</label>
                <p className="rounded-xl border border-slate-200/60 bg-slate-50 px-3.5 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  {user.class || 'N/A'}
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Jurusan</label>
                <p className="rounded-xl border border-slate-200/60 bg-slate-50 px-3.5 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  {user.major || 'N/A'}
                </p>
              </div>
            </div>
          )}

          {user.role === 'TEACHER' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bidang Studi / Jurusan</label>
                <p className="rounded-xl border border-slate-200/60 bg-slate-50 px-3.5 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  {user.major || 'N/A'}
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">NIP</label>
                <p className="rounded-xl border border-slate-200/60 bg-slate-50 px-3.5 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  {user.nip || 'N/A'}
                </p>
              </div>
            </div>
          )}

          {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hak Akses Sistem</label>
              <p className="rounded-xl border border-slate-200/60 bg-slate-50 px-3.5 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                Akses Penuh Pengelolaan Sekolah & Sistem
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-slate-100 p-6 sm:flex-row sm:p-8 dark:border-white/5">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Ubah Password
          </Button>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || saving || uploading}
              className="flex-1 sm:flex-none"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
            <Button variant="danger" size="sm" onClick={() => setIsLogoutModalOpen(true)} className="flex-1 sm:flex-none">
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </div>
  );
}
