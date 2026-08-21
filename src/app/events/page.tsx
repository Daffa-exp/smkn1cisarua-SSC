import React from 'react';
import Link from 'next/link';
import { CalendarDays, MapPin, Clock, ArrowRight, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function EventsPage() {
  const events = await db.event.findMany({
    orderBy: { date: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-purple-600" />
          Event & Agenda Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Agenda acara, kompetisi, dan kegiatan di SMKN 1 Cisarua.
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="Belum Ada Event"
          description="Belum ada agenda event terbaru yang dijadwalkan."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-xs transition-all space-y-3 block group"
            >
              {event.imageUrl && (
                <div className="w-full h-44 sm:h-48 bg-slate-900/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info">Agenda</Badge>
                  <span className="text-xs font-semibold text-purple-600">
                    {formatDate(event.date)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {event.startTime} - {event.endTime} WIB
                  </span>
                  <span className="font-semibold text-purple-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Detail <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
