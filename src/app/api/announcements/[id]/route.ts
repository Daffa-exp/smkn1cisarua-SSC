import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET detail
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const announcement = await db.announcement.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { name: true, role: true },
        },
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { success: false, message: 'Pengumuman tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

// PUT edit announcement
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
      return NextResponse.json(
        { success: false, message: 'Akses ditolak.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, category, priority, imageUrl, linkUrl, targetAudience, expiresAt } = body;

    const updated = await db.announcement.update({
      where: { id: params.id },
      data: {
        title,
        content,
        category,
        priority,
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        targetAudience,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengumuman berhasil diperbarui.',
      announcement: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui pengumuman.' },
      { status: 500 }
    );
  }
}

// DELETE announcement
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
      return NextResponse.json(
        { success: false, message: 'Akses ditolak.' },
        { status: 403 }
      );
    }

    await db.announcement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengumuman berhasil dihapus.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus pengumuman.' },
      { status: 500 }
    );
  }
}
