import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET event detail
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await db.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

// PUT edit event (Admin, Teacher, and STUDENT_LEADER / Ketos)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' &&
        session.role !== 'SUPER_ADMIN' &&
        session.role !== 'TEACHER' &&
        session.role !== 'STUDENT_LEADER')
    ) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, location, date, startTime, endTime, organizer, imageUrl, linkUrl } = body;

    const updated = await db.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        location,
        date: new Date(date),
        startTime,
        endTime,
        organizer,
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Event sekolah berhasil diperbarui.',
      event: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui event.' }, { status: 500 });
  }
}

// DELETE event (Admin, Teacher, and STUDENT_LEADER / Ketos)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' &&
        session.role !== 'SUPER_ADMIN' &&
        session.role !== 'TEACHER' &&
        session.role !== 'STUDENT_LEADER')
    ) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    await db.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Event berhasil dihapus.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus event.' }, { status: 500 });
  }
}
