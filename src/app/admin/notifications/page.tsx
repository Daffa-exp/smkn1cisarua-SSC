'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Send, ArrowLeft, AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('INFO');
  const [targetRole, setTargetRole] = useState('ALL');
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          type,
          targetRole,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMsg({ success: false, text: data.message || 'Gagal mengirim siaran notifikasi.' });
        setIsLoading(false);
        return;
      }

      setStatusMsg({ success: true, text: data.message });
      setTitle('');
      setMessage('');
    } catch (err: any) {
      setStatusMsg({ success: false, text: 'Terjadi masalah koneksi server.' });
    } finally {
      setIsLoading(false);
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
          <Bell className="w-6 h-6 text-brand-600" />
          Kirim Siaran Notifikasi (Broadcast)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kirim pesan notifikasi langsung ke perangkat siswa, guru, atau staf.
        </p>
      </div>

      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border border-rose-200 text-rose-700'
            }`}
          >
            {statusMsg.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Judul Notifikasi *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pengingat Upacara Bendera / Libur Nasional"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Tipe Notifikasi *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
              >
                <option value="INFO">Informasi (INFO)</option>
                <option value="WARNING">Peringatan (WARNING)</option>
                <option value="EMERGENCY">Darurat (EMERGENCY)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Target Pengguna *
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
              >
                <option value="ALL">Semua Pengguna (Broadcast)</option>
                <option value="STUDENT">Hanya Siswa</option>
                <option value="TEACHER">Hanya Guru & Staff</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Pesan / Isi Notifikasi *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan pesan ringkas yang akan muncul pada lonceng notifikasi..."
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" isLoading={isLoading} className="text-xs">
              <Send className="w-4 h-4" /> Kirim Notifikasi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
