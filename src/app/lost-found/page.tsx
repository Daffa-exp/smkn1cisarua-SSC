'use client';

'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { LostFoundFormModal } from '@/components/lost-found/LostFoundFormModal';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'LOST' | 'FOUND' | string;
  location: string;
  date: string;
  imageUrl?: string | null;
  isResolved: boolean;
  user: { name: string; email: string; class?: string | null };
}

export default function LostFoundPage() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<'LOST' | 'FOUND'>('LOST');
  const { user: currentUser } = useAuth();

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/lost-found');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (type: 'LOST' | 'FOUND') => {
    setModalDefaultType(type);
    setIsModalOpen(true);
  };

  const handleToggleResolve = async (id: string) => {
    try {
      const res = await fetch(`/api/lost-found/${id}`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isResolved: data.item.isResolved } : item))
        );
      }
    } catch (err) {
      alert('Gagal mengedit status resolusi.');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === 'ALL' || item.type === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-purple-600" />
            Lost & Found (Barang Hilang / Ditemukan)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pusat informasi dan pengembalian barang hilang di lingkungan sekolah.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenModal('LOST')}
            className="flex-1 sm:flex-initial text-xs"
          >
            Lapor Hilang
          </Button>
          <Button
            variant="primary"
            onClick={() => handleOpenModal('FOUND')}
            className="flex-1 sm:flex-initial text-xs"
          >
            Lapor Ditemukan
          </Button>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab('LOST')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'LOST'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Barang Hilang (LOST)
          </button>
          <button
            onClick={() => setActiveTab('FOUND')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'FOUND'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Barang Ditemukan (FOUND)
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama barang..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Memuat daftar barang hilang & ditemukan..." />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="Tidak Ada Barang Ditemukan"
          description="Belum ada entri barang yang sesuai dengan filter atau pencarian Anda."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-5 bg-white border rounded-2xl shadow-xs space-y-3 transition-all ${
                item.isResolved
                  ? 'border-slate-200 opacity-75'
                  : item.type === 'LOST'
                  ? 'border-rose-200 hover:border-rose-300'
                  : 'border-emerald-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={item.type === 'LOST' ? 'danger' : 'success'}>
                    {item.type === 'LOST' ? 'BARANG HILANG' : 'BARANG DITEMUKAN'}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.category}
                  </span>
                </div>
                {item.isResolved ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                    SELESAI / DIKLAIM
                  </Badge>
                ) : (
                  <span className="text-xs text-slate-400">
                    {formatDate(item.date)}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
              <p className="text-xs text-slate-600">{item.description}</p>

              {item.imageUrl && (
                <div className="rounded-xl overflow-hidden h-36 w-full border border-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                </span>
                {currentUser && (
                  <button
                    onClick={() => handleToggleResolve(item.id)}
                    className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.isResolved ? 'Buka Kembali' : 'Tandai Selesai / Diklaim'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <LostFoundFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchItems}
        defaultType={modalDefaultType}
      />
    </div>
  );
}
