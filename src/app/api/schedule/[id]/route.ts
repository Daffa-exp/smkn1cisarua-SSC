import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// PUT update schedule
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN' && session.role !== 'TEACHER')
    ) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await request.json();
    const { subject, teacher, className, room, day, startTime, endTime } = body;

    const updated = await db.schedule.update({
      where: { id: params.id },
      data: {
        subject,
        teacher,
        className,
        room,
        day,
        startTime,
        endTime,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Jadwal berhasil diperbarui.',
      schedule: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui jadwal.' }, { status: 500 });
  }
}

// DELETE schedule
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN' && session.role !== 'TEACHER')
    ) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    await db.schedule.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Jadwal berhasil dihapus.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus jadwal.' }, { status: 500 });
  }
}
