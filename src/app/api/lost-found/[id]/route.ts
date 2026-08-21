import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// PATCH mark as resolved/claimed
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Harap login terlebih dahulu.' }, { status: 401 });
    }

    const item = await db.lostFoundItem.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json({ success: false, message: 'Laporan tidak ditemukan.' }, { status: 404 });
    }

    const isOwner = item.userId === session.id;
    const isAdmin = session.role === 'ADMIN' || session.role === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const updated = await db.lostFoundItem.update({
      where: { id: params.id },
      data: { isResolved: !item.isResolved },
    });

    return NextResponse.json({
      success: true,
      message: updated.isResolved ? 'Status ditandai Selesai / Diklaim.' : 'Status dibuka kembali.',
      item: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui status.' }, { status: 500 });
  }
}

// DELETE item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 401 });
    }

    const item = await db.lostFoundItem.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json({ success: false, message: 'Laporan tidak ditemukan.' }, { status: 404 });
    }

    const isOwner = item.userId === session.id;
    const isAdmin = session.role === 'ADMIN' || session.role === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    await db.lostFoundItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Laporan berhasil dihapus.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus laporan.' }, { status: 500 });
  }
}
