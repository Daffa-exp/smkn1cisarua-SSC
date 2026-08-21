'use client';

import React, { useState } from 'react';
import { X, Search, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LostFoundFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultType?: 'LOST' | 'FOUND';
}

export const LostFoundFormModal: React.FC<LostFoundFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultType = 'LOST',
}) => {
  const [type, setType] = useState<'LOST' | 'FOUND'>(defaultType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kunci / Dompet');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await fetch('/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          type,
          location,
          date: date || new Date().toISOString(),
          imageUrl: imageUrl || null,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Gagal membuat laporan.');
        setIsLoading(false);
        return;
      }

      onSuccess();
      onClose();
      setTitle('');
      setLocation('');
      setDate('');
      setImageUrl('');
      setDescription('');
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
            <Search className="w-5 h-5 text-purple-600" />
            Lapor Barang Hilang / Ditemukan
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
              Tipe Laporan *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('LOST')}
                className={`py-2 px-3 rounded-xl font-semibold border transition-all ${
                  type === 'LOST'
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Barang Hilang (LOST)
              </button>
              <button
                type="button"
                onClick={() => setType('FOUND')}
                className={`py-2 px-3 rounded-xl font-semibold border transition-all ${
                  type === 'FOUND'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Barang Ditemukan (FOUND)
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nama Barang *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Flashdisk SanDisk 32GB / Kunci Motor Honda"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Kategori *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white font-medium"
              >
                <option value="Kunci / Dompet">Kunci / Dompet</option>
                <option value="Aksesoris IT">Aksesoris IT / Gadget</option>
                <option value="Dokumen / Kartu">Dokumen / Kartu</option>
                <option value="Pakaian / Jaket">Pakaian / Jaket</option>
                <option value="Buku / Alat Tulis">Buku / Alat Tulis</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Lokasi Terakhir / Ditemukan *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lab RPL 2 / Kantin Belakang"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Tanggal Kejadian
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
            />
          </div>

          {/* Photo Upload or URL */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" /> Foto Barang (Opsional)
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Landscape / Potret</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 font-semibold rounded-xl hover:bg-purple-100 transition-colors text-xs shrink-0">
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
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs"
              />
            </div>

            {imageUrl && (
              <div className="relative rounded-xl overflow-hidden max-h-36 w-full border border-slate-200 bg-slate-900/5 flex items-center justify-center mt-2">
                <img
                  src={imageUrl}
                  alt="Item photo preview"
                  className="w-full h-full max-h-36 object-contain rounded-xl"
                  onError={() => {}}
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-1.5 right-1.5 bg-slate-900/80 text-white p-1 rounded-md"
                  title="Hapus foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Deskripsi Barang & Ciri-Ciri *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan warna, gantungan, nomor seri, atau ciri khusus barang..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
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
              Kirim Laporan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
