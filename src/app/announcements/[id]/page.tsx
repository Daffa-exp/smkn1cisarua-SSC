import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, ChevronRight, ExternalLink, User } from 'lucide-react';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default async function AnnouncementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const announcement = await db.announcement.findUnique({
    where: { id: params.id },
    include: { author: { select: { name: true, role: true } } },
  });

  if (!announcement) {
    notFound();
  }

  const priorityVariantMap: Record<string, 'info' | 'warning' | 'danger'> = {
    LOW: 'info',
    MEDIUM: 'warning',
    HIGH: 'danger',
    URGENT: 'danger',
  };

  return (
    <article className="mx-auto max-w-4xl space-y-7 sm:space-y-9">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/dashboard" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <Link href="/announcements" className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">
          Pengumuman
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <span className="max-w-[12rem] truncate font-medium text-slate-700 dark:text-slate-200 sm:max-w-sm">
          {announcement.title}
        </span>
      </nav>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">{announcement.category}</Badge>
          <Badge variant={priorityVariantMap[announcement.priority] || 'warning'}>
            Prioritas: {announcement.priority}
          </Badge>
        </div>

        <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {announcement.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" /> Diterbitkan oleh:{' '}
            <strong className="text-slate-700 dark:text-slate-300">{announcement.author.name}</strong> ({announcement.author.role})
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(announcement.publishedAt)}
          </span>
        </div>

      {/* Featured Image */}
      {announcement.imageUrl && (
        <div className="w-full overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-100 shadow-card dark:border-white/10 dark:bg-slate-900">
          <img
            src={announcement.imageUrl}
            alt={announcement.title}
            className="max-h-[520px] w-full object-contain"
          />
        </div>
      )}

      {/* External Link Banner */}
      {announcement.linkUrl && (
        <div className="flex flex-col justify-between gap-4 rounded-[1.35rem] border border-blue-200/80 bg-blue-50/70 p-5 dark:border-blue-400/15 dark:bg-blue-400/10 sm:flex-row sm:items-center">
          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-brand-900 dark:text-blue-100">
              <ExternalLink className="w-4 h-4 text-brand-600" /> Tautan Informasi & Pendaftaran
            </h3>
            <p className="mt-0.5 text-xs text-brand-700 dark:text-blue-200/80">
              Buka link eksternal pendaftaran lomba atau informasi pengumuman ini.
            </p>
          </div>
          <a
            href={announcement.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Buka Tautan <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Content */}
      <div className="rounded-[1.35rem] border border-slate-200/80 bg-white p-5 text-sm leading-7 [&>p+ p]:mt-4 text-slate-700 shadow-xs dark:border-white/10 dark:bg-surface dark:text-slate-300 sm:p-7 sm:text-base">
        {announcement.content.split('\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
