'use client';

import React, { useState } from 'react';
import { SchoolLogo, SchoolLogoAvatar } from '@/components/ui/SchoolLogo';
import { useAuth } from '@/components/providers/AuthProvider';
import { Badge } from '@/components/ui/Badge';
import { ChatInterface, Message } from '@/components/ai/ChatInterface';
import { Megaphone, BarChart3, FileText, Lightbulb } from 'lucide-react';

const roleBadgeMap: Record<string, string> = {
  STUDENT: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  TEACHER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  ADMIN: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  SUPER_ADMIN: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

const welcomeMessage: Record<string, string> = {
  STUDENT:
    'Halo! Saya adalah asisten AI SMKN 1 Cisarua Connect. Saya bisa membantu kamu tentang jadwal pelajaran, pengumuman sekolah, materi belajar, atau tugas-tugasmu. Ada yang bisa saya bantu hari ini?',
  TEACHER:
    'Selamat datang! Saya adalah asisten AI untuk Guru & Staf SMKN 1 Cisarua. Saya dapat membantu membuat materi ajar, menyusun soal, atau menganalisis data kelas. Ada yang bisa saya bantu?',
  ADMIN:
    'Halo, Admin! Saya adalah asisten AI operasional SMKN 1 Cisarua Connect. Saya siap membantu analisis data, menyusun laporan, dan membuat draft pengumuman. Silakan ajukan pertanyaan Anda.',
  SUPER_ADMIN:
    'Selamat datang, Super Admin! Saya adalah asisten AI sistem SMKN 1 Cisarua Connect. Saya dapat membantu analisis teknis, manajemen sistem, dan perencanaan platform ke depan.',
};

const adminQuickActions = [
  {
    label: 'Buat Pengumuman',
    icon: Megaphone,
    prompt: 'Buatkan draft pengumuman sekolah yang profesional, jelas, dan siap diterbitkan. Format: Judul, Isi, Target Audience, Prioritas.',
  },
  {
    label: 'Analisis Data',
    icon: BarChart3,
    prompt: 'Analisis data operasional sekolah saat ini dan berikan ringkasan dalam bahasa Indonesia.',
  },
  {
    label: 'Draft Laporan',
    icon: FileText,
    prompt: 'Buatkan draft laporan kegiatan sekolah yang terstruktur dan formal.',
  },
  {
    label: 'Rekomendasi',
    icon: Lightbulb,
    prompt: 'Berikan rekomendasi untuk peningkatan layanan dan pengalaman pengguna platform SSC.',
  },
];

export default function AIPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const welcome = user ? (welcomeMessage[user.role] || welcomeMessage.STUDENT) : '';

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Gagal mendapatkan respons dari AI.');
        setIsLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: 'model', parts: data.reply }]);
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Coba lagi sebentar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
            <SchoolLogo size="sm" />
            SSC Assistant
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">Didukung Google Gemini</p>
            {user && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBadgeMap[user.role] || 'bg-slate-100 text-slate-700'}`}>
                {user.role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      {isAdmin && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {adminQuickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.prompt)}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-surface dark:text-slate-200 dark:hover:border-brand-400"
            >
              <action.icon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Chat Body */}
      <div className="flex-1 min-h-0 rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-white/10 dark:bg-surface">
        <ChatInterface
          messages={messages}
          onSend={handleSend}
          isLoading={isLoading}
          error={error}
          welcomeMessage={welcome}
        />
      </div>
    </div>
  );
}
