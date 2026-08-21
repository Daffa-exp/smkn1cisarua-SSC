import React from 'react';
import Link from 'next/link';
import { Megaphone, Search, ArrowRight, Calendar, User } from 'lucide-react';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q?.toLowerCase() || '';

  const announcements = await db.announcement.findMany({
    orderBy: { publishedAt: 'desc' },
    include: { author: { select: { name: true, role: true } } },
  });

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query)
  );

  const priorityVariantMap: Record<string, 'info' | 'warning' | 'danger'> = {
    LOW: 'info',
    MEDIUM: 'warning',
    HIGH: 'danger',
    URGENT: 'danger',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-brand-600" />
            Pengumuman Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Informasi resmi dan berita dari pihak pengelola SMKN 1 Cisarua.
          </p>
        </div>

        <form method="GET" className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Cari pengumuman..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
          </div>
        </form>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Pengumuman Tidak Ditemukan"
          description="Belum ada pengumuman yang sesuai dengan pencarian Anda."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/announcements/${item.id}`}
              className="block bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-brand-300 hover:shadow-sm transition-all group"
            >
              {item.imageUrl && (
                <div className="w-full h-44 sm:h-52 relative overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="info" className="shadow-xs">{item.category}</Badge>
                    <Badge variant={priorityVariantMap[item.priority] || 'warning'} className="shadow-xs">
                      {item.priority}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3">
                {!item.imageUrl && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{item.category}</Badge>
                      <Badge variant={priorityVariantMap[item.priority] || 'warning'}>
                        {item.priority}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(item.publishedAt)}
                    </span>
                  </div>
                )}

                <h2 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-brand-600 transition-colors leading-snug">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>

                <div className="flex items-center justify-between pt-3 text-xs text-slate-400 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> {item.author.name}
                    </span>
                    {item.imageUrl && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(item.publishedAt)}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-brand-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
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
