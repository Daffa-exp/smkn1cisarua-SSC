import React from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await db.event.findUnique({
    where: { id: params.id },
  });

  if (!event) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <p className="text-sm text-slate-500">Event tidak ditemukan.</p>
        <Link href="/events" className="text-sm text-brand-600 hover:underline">
          Kembali ke Event Sekolah
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/dashboard" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <Link href="/events" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">
          Agenda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <span className="max-w-[12rem] truncate font-medium text-slate-700 dark:text-slate-200 sm:max-w-sm">
          {event.title}
        </span>
      </nav>

      <div>
        <Badge variant="info" className="mb-2 block w-fit">Agenda Sekolah</Badge>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          {event.title}
        </h1>
      </div>

      {event.imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-h-96 w-full bg-slate-950/5 flex items-center justify-center">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full max-h-96 object-contain rounded-2xl"
          />
        </div>
      )}

      {/* Registration / Lomba Link Banner */}
      {event.linkUrl && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-purple-600" /> Link Pendaftaran & Informasi Lomba
            </h3>
            <p className="text-xs text-purple-700 mt-0.5">
              Klik tombol untuk membuka formulir pendaftaran resmi atau halaman lomba.
            </p>
          </div>
          <a
            href={event.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors"
          >
            Buka Link Pendaftaran <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-medium">Tanggal Pelaksanaan</p>
            <p className="font-bold text-slate-800">{formatDate(event.date)}</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-medium">Waktu</p>
            <p className="font-bold text-slate-800">
              {event.startTime} - {event.endTime} WIB
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-medium">Lokasi</p>
            <p className="font-bold text-slate-800">{event.location}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pb-3 border-b border-slate-100">
          <Users className="w-4 h-4 text-slate-400" /> Penyelenggara: {event.organizer}
        </div>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {event.description}
        </p>
      </div>
    </div>
  );
}
