import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// PATCH deactivate emergency alert
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const updated = await db.emergencyAlert.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Status peringatan darurat berhasil dinonaktifkan.',
      alert: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui siaran darurat.' }, { status: 500 });
  }
}

// DELETE emergency alert record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    await db.emergencyAlert.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Rekaman peringatan darurat dihapus.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus rekaman.' }, { status: 500 });
  }
}
