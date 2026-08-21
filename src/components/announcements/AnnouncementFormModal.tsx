'use client';

import React, { useState, useEffect } from 'react';
import { X, Megaphone, AlertCircle, Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AnnouncementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id?: string;
    title: string;
    content: string;
    category: string;
    priority: string;
    imageUrl?: string | null;
    linkUrl?: string | null;
    targetAudience: string;
    expiresAt?: string | null;
  } | null;
}

const bannerPresets = [
  {
    label: '🎓 Ujian & Akademik',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  },
  {
    label: '📢 Informasi Umum',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
  },
  {
    label: '💻 Lab IT & Bengkel',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  },
  {
    label: '🏆 Lomba & Kegiatan',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  },
];

export const AnnouncementFormModal: React.FC<AnnouncementFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Akademik');
  const [priority, setPriority] = useState('MEDIUM');
  const [targetAudience, setTargetAudience] = useState('ALL');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setCategory(initialData.category || 'Akademik');
      setPriority(initialData.priority || 'MEDIUM');
      setTargetAudience(initialData.targetAudience || 'ALL');
      setImageUrl(initialData.imageUrl || '');
      setLinkUrl(initialData.linkUrl || '');
      setExpiresAt(
        initialData.expiresAt
          ? new Date(initialData.expiresAt).toISOString().split('T')[0]
          : ''
      );
    } else {
      setTitle('');
      setContent('');
      setCategory('Akademik');
      setPriority('MEDIUM');
      setTargetAudience('ALL');
      setImageUrl('');
      setLinkUrl('');
      setExpiresAt('');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError('Ukuran foto terlalu besar (maksimal 4MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const url = initialData?.id
        ? `/api/announcements/${initialData.id}`
        : '/api/announcements';
      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          priority,
          targetAudience,
          imageUrl: imageUrl || null,
          linkUrl: linkUrl || null,
          expiresAt: expiresAt || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Gagal menyimpan pengumuman.');
        setIsLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError('Terjadi masalah koneksi server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-brand-600" />
            {initialData?.id ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Judul Pengumuman *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pendaftaran Lomba Inovasi Digital 2026"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
              >
                <option value="Akademik">Akademik</option>
                <option value="Kesiswaan">Kesiswaan</option>
                <option value="IT & Fasilitas">IT & Fasilitas</option>
                <option value="Event & Kegiatan">Event & Kegiatan</option>
                <option value="Umum">Umum</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
              >
                <option value="LOW">Rendah (LOW)</option>
                <option value="MEDIUM">Sedang (MEDIUM)</option>
                <option value="HIGH">Tinggi (HIGH)</option>
                <option value="URGENT">Darurat (URGENT)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
              >
                <option value="ALL">Semua Pengguna</option>
                <option value="STUDENT">Siswa</option>
                <option value="TEACHER">Guru & Staff</option>
                <optgroup label="Kelas">
                  <option value="CLASS_X">Kelas X</option>
                  <option value="CLASS_XI">Kelas XI</option>
                  <option value="CLASS_XII">Kelas XII</option>
                </optgroup>
                <optgroup label="Jurusan">
                  <option value="MAJOR_PPLG">PPLG / RPL</option>
                  <option value="MAJOR_MP">MP / MPLB</option>
                  <option value="MAJOR_TO">TO / TKRO / PH</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Tanggal Kadaluarsa (Optional)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Registration Link Field */}
          <div>
            <label className="font-semibold text-slate-700 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-brand-600" /> Tautan Pendaftaran / Info Lomba (Opsional)
              </span>
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://forms.google.com/... atau https://lomba.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          {/* Banner Preset & Upload Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-brand-600" /> Foto / Banner Desain Pengumuman
              </span>
            </label>

            {/* Banner Presets */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {bannerPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all ${
                    imageUrl === preset.url
                      ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-700 font-semibold rounded-xl hover:bg-brand-100 transition-colors text-xs shrink-0">
                <Upload className="w-3.5 h-3.5" /> Upload Foto HP
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400">atau</span>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Tempel URL gambar (Pinterest, Imgur, dll)"
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Isi Pengumuman *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan isi pengumuman secara lengkap di sini..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              {initialData?.id ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
