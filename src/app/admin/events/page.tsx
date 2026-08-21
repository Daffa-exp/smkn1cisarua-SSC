'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Plus, Edit, Trash2, ArrowLeft, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { EventFormModal } from '@/components/events/EventFormModal';
import { formatDate } from '@/lib/utils';

interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  organizer: string;
  imageUrl?: string | null;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus agenda event ini?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      alert('Gagal menghapus event.');
    }
  };

  const handleEdit = (event: EventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
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
            <CalendarDays className="w-6 h-6 text-purple-600" />
            Manajemen Event Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola agenda kegiatan, perlombaan, workshop, dan seminar sekolah.
          </p>
        </div>

        <Button variant="primary" onClick={handleCreateNew} className="text-xs">
          <Plus className="w-4 h-4" />
          Tambah Event Baru
        </Button>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat agenda event sekolah..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="Belum Ada Agenda Event"
          description="Klik tombol di atas untuk membuat event pertama Anda."
          action={
            <Button variant="primary" size="sm" onClick={handleCreateNew}>
              Buat Event
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {events.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="info">Agenda</Badge>
                  <span className="text-xs font-semibold text-purple-600">
                    {formatDate(item.date)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.startTime} - {item.endTime} WIB
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {item.organizer}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
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

      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
        initialData={selectedEvent}
      />
    </div>
  );
}
