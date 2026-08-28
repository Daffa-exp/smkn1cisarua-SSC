import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export const revalidate = 0;

export default async function SchedulePage({
  searchParams,
}: {
  searchParams?: { day?: string; class?: string };
}) {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const selectedDay = searchParams?.day || 'Senin';
  const selectedClass = searchParams?.class || '';

  const session = await getSession();
  const userClass = session?.class || '';

  const effectiveClass = selectedClass || userClass;

  const [schedules, classOptions] = await Promise.all([
    db.schedule.findMany({
      where: {
        day: selectedDay,
        ...(effectiveClass ? { className: effectiveClass } : {}),
      },
      orderBy: { startTime: 'asc' },
    }),
    db.schedule.findMany({
      select: { className: true },
      distinct: ['className'],
      orderBy: { className: 'asc' },
    }),
  ]);

  const classList = classOptions.map((c) => c.className).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-600" />
          Jadwal Pelajaran Siswa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {effectiveClass
            ? `Jadwal pelajaran harian untuk kelas ${effectiveClass}.`
            : 'Pilih kelas untuk melihat jadwal pelajaran.'}
        </p>
      </div>

      {/* Class Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-600">Kelas:</span>
        {classList.length === 0 ? (
          <span className="text-xs text-slate-400">Belum ada data kelas.</span>
        ) : (
          classList.map((cls) => {
            const isActive = cls === effectiveClass;
            return (
              <Link
                key={cls}
                href={`/schedule?day=${selectedDay}&class=${encodeURIComponent(cls)}`}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cls}
              </Link>
            );
          })
        )}
        {effectiveClass && (
          <Link
            href={`/schedule?day=${selectedDay}`}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors text-slate-500 hover:text-slate-700"
          >
            Reset
          </Link>
        )}
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {days.map((day) => {
          const isActive = day === selectedDay;
          const href = effectiveClass
            ? `/schedule?day=${day}&class=${encodeURIComponent(effectiveClass)}`
            : `/schedule?day=${day}`;

          return (
            <Link
              key={day}
              href={href}
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
          description={
            effectiveClass
              ? `Tidak ada kegiatan KBM atau jadwal pelajaran yang terdaftar untuk kelas ${effectiveClass}.`
              : 'Pilih kelas untuk melihat jadwal pelajaran.'
          }
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
