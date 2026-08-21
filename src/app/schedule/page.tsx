import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export const revalidate = 0;

export default async function SchedulePage({
  searchParams,
}: {
  searchParams?: { day?: string };
}) {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const selectedDay = searchParams?.day || 'Senin';

  const schedules = await db.schedule.findMany({
    where: { day: selectedDay },
    orderBy: { startTime: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-600" />
          Jadwal Pelajaran Siswa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Jadwal pelajaran harian untuk kelas XII Rekayasa Perangkat Lunak.
        </p>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {days.map((day) => {
          const isActive = day === selectedDay;

          return (
            <Link
              key={day}
              href={`/schedule?day=${day}`}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {day}
            </Link>
          );
        })}
      </div>

      {/* Schedule Items */}
      {schedules.length === 0 ? (
        <EmptyState
          title={`Tidak Ada Mata Pelajaran di Hari ${selectedDay}`}
          description="Tidak ada kegiatan KBM atau jadwal pelajaran yang terdaftar."
        />
      ) : (
        <div className="space-y-3">
          {schedules.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="success">
                    {item.startTime} - {item.endTime} WIB
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.className}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {item.subject}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {item.teacher}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.room}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
