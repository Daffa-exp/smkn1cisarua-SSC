'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { SchoolLogo } from '@/components/ui/SchoolLogo';
import { useAuth } from '@/components/providers/AuthProvider';
import { ChatInterface, Message } from '@/components/ai/ChatInterface';

export const AIChatPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const welcomeMessage =
    user?.role === 'TEACHER'
      ? 'Selamat datang. Saya SSC Assistant untuk Guru & Staf. Saya bisa membantu mencari informasi yang tersedia di platform, merangkum data, dan membantu menyiapkan konten.'
      : user?.role === 'ADMIN'
        ? 'Halo, Admin. Saya SSC Assistant untuk membantu pekerjaan operasional, mencari informasi platform, merangkum data, dan menyiapkan konten.'
        : user?.role === 'SUPER_ADMIN'
          ? 'Selamat datang, Super Admin. Saya siap membantu analisis platform, data yang tersedia, dan pekerjaan administratif SSC.'
          : 'Halo. Saya SSC Assistant. Saya bisa membantu mencari informasi sekolah, jadwal, pengumuman, dan cara menggunakan SSC.';

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
        return;
      }

      setMessages((prev) => [...prev, { role: 'model', parts: data.reply }]);
    } catch {
      setError('Terjadi kesalahan koneksi. Coba lagi sebentar.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[3px] dark:bg-black/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            className="relative flex h-[min(88vh,720px)] w-full flex-col overflow-hidden rounded-t-[1.5rem] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-surface-raised sm:h-[min(82vh,720px)] sm:max-w-xl sm:rounded-[1.5rem]"
            initial={{ y: 36, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 px-4 py-3.5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-blue-50 dark:border-blue-400/20 dark:bg-blue-400/10">
                  <SchoolLogo size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">SSC Assistant</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Asisten digital SMKN 1 Cisarua</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup SSC Assistant"
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 px-3 sm:px-4">
              <ChatInterface
                messages={messages}
                onSend={handleSend}
                isLoading={isLoading}
                error={error}
                welcomeMessage={welcomeMessage}
                isCompact
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
