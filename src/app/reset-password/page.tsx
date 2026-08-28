'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SchoolLogo } from '@/components/ui/SchoolLogo';
import { APP_NAME } from '@/lib/branding';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ success: boolean; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!token) {
      setStatus({ success: false, text: 'Token reset tidak valid.' });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ success: false, text: 'Password baru minimal 6 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ success: false, text: 'Konfirmasi password tidak cocok.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus({ success: false, text: data.message || 'Gagal mereset password.' });
      } else {
        setStatus({
          success: true,
          text: 'Password berhasil diubah. Anda akan diarahkan ke halaman login.',
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setStatus({ success: false, text: 'Terjadi masalah jaringan atau server.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-2">
            <SchoolLogo size="md" animated priority />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {APP_NAME}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Masuk ke portal layanan digital siswa, guru, dan staf sekolah.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-800">Reset Password</h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan password baru untuk akun Anda.
            </p>
          </div>

          {status && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                status.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}
            >
              {status.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{status.text}</span>
            </div>
          )}

          {!token && !status?.success && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              Token reset tidak ditemukan. Pastikan Anda mengklik link dari email.
            </div>
          )}

          {token && !status?.success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full py-2.5 text-sm font-semibold"
              >
                Reset Password
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
