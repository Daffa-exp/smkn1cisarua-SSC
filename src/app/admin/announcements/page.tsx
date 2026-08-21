'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, Plus, Edit, Trash2, Calendar, ArrowLeft, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnnouncementFormModal } from '@/components/announcements/AnnouncementFormModal';
import { formatDate } from '@/lib/utils';

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  targetAudience: string;
  imageUrl?: string | null;
  publishedAt: string;
  expiresAt?: string | null;
  author: { name: string; role: string };
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;

    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      alert('Gagal menghapus pengumuman.');
    }
  };

  const handleEdit = (announcement: AnnouncementItem) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedAnnouncement(null);
    setIsModalOpen(true);
  };

  const priorityVariantMap: Record<string, 'info' | 'warning' | 'danger'> = {
    LOW: 'info',
    MEDIUM: 'warning',
    HIGH: 'danger',
    URGENT: 'danger',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Command Center Admin
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-brand-600" />
            Manajemen Pengumuman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola, terbitkan, dan hapus pengumuman resmi sekolah.
          </p>
        </div>

        <Button variant="primary" onClick={handleCreateNew} className="text-xs">
          <Plus className="w-4 h-4" />
          Buat Pengumuman Baru
        </Button>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat daftar pengumuman admin..." />
      ) : announcements.length === 0 ? (
        <EmptyState
          title="Belum Ada Pengumuman"
          description="Klik tombol di atas untuk menerbitkan pengumuman pertama Anda."
          action={
            <Button variant="primary" size="sm" onClick={handleCreateNew}>
              Buat Pengumuman
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {item.imageUrl && (
                <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="info">{item.category}</Badge>
                  <Badge variant={priorityVariantMap[item.priority] || 'warning'}>
                    {item.priority}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Target: {item.targetAudience}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{item.content}</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Diterbitkan oleh {item.author.name} • {formatDate(item.publishedAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="text-xs"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnnouncementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAnnouncements}
        initialData={selectedAnnouncement}
      />
    </div>
  );
}
