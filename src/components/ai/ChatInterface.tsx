'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowUp, Loader2 } from 'lucide-react';
import { SchoolLogoAvatar } from '@/components/ui/SchoolLogo';
import { useAuth } from '@/components/providers/AuthProvider';

export interface Message {
  role: 'user' | 'model';
  parts: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (message: string) => void;
  isLoading: boolean;
  error: string | null;
  welcomeMessage: string;
  isCompact?: boolean;
}

const suggestions = [
  'Apa informasi terbaru hari ini?',
  'Tampilkan jadwal saya',
  'Bagaimana cara membuat laporan?',
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSend,
  isLoading,
  error,
  welcomeMessage,
  isCompact = false,
}) => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      setInput('');
      onSend(trimmed);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-5 pr-1">
        {messages.length === 0 && (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <SchoolLogoAvatar />
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200">
                <p className="font-medium text-slate-900 dark:text-slate-100">{welcomeMessage}</p>
              </div>
            </div>

            <div className="pl-10">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Coba tanyakan</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => onSend(suggestion)}
                    disabled={isLoading}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-left text-[11px] font-medium text-slate-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-brand-400/30 dark:hover:bg-brand-400/10 dark:hover:text-brand-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'user' ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-slate-700">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              ) : (
                <SchoolLogoAvatar />
              )}
              <div
                className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'rounded-tr-sm bg-brand-600 text-white'
                    : 'rounded-tl-sm border border-slate-200/80 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200'
                }`}
              >
                {msg.parts}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <SchoolLogoAvatar />
              <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                <span>Menyiapkan jawaban...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-slate-200 pt-3 dark:border-white/10">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 transition-all focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/10 dark:border-white/10 dark:bg-slate-900/70">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan sesuatu tentang SSC..."
            aria-label="Pesan untuk SSC Assistant"
            className="max-h-32 min-h-[38px] flex-1 resize-none bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Kirim pesan"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-[transform,background-color] hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <p className="py-2 text-center text-[9px] leading-relaxed text-slate-400">
          AI dapat membuat kesalahan. Verifikasi informasi penting dengan guru atau staf sekolah.
        </p>
      </div>
    </div>
  );
};
