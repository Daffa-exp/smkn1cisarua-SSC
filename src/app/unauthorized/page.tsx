import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Akses Tidak Diizinkan</h1>
      <p className="text-sm text-slate-600 max-w-md mb-6">
        Anda tidak memiliki hak akses (role permissions) yang cukup untuk membuka halaman ini. Silakan hubungi Administrator sekolah jika Anda memerlukan akses.
      </p>
      <Link href="/dashboard">
        <Button variant="primary" className="text-xs">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Button>
      </Link>
    </div>
  );
}
