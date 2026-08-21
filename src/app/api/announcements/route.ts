import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all active/unexpired announcements for public/students
export async function GET() {
  try {
    const now = new Date();

    const announcements = await db.announcement.findMany({
      where: {
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: { name: true, role: true },
        },
      },
    });

    return NextResponse.json({ success: true, announcements });
  } catch (error) {
    return NextResponse.json({ success: false, announcements: [] }, { status: 500 });
  }
}

// POST create new announcement (Admin, Teacher, and STUDENT_LEADER / Ketos)
export async function POST(request: Request) {
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
        { success: false, message: 'Akses ditolak. Hanya Admin, Guru, atau Ketos/Waketos yang dapat membuat pengumuman.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, category, priority, imageUrl, linkUrl, targetAudience, expiresAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan isi pengumuman wajib diisi.' },
        { status: 400 }
      );
    }

    const announcement = await db.announcement.create({
      data: {
        title,
        content,
        category: category || 'Umum',
        priority: priority || 'MEDIUM',
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        targetAudience: targetAudience || 'ALL',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        authorId: session.id,
      },
    });

    // If priority is HIGH or URGENT, create notifications for users
    if (priority === 'HIGH' || priority === 'URGENT') {
      const users = await db.user.findMany({
        select: { id: true },
      });

      const notificationData = users.map((u) => ({
        title: `PENGUMUMAN PENTING: ${title}`,
        message: content.substring(0, 120) + '...',
        type: priority === 'URGENT' ? 'WARNING' : 'INFO',
        userId: u.id,
      }));

      if (notificationData.length > 0) {
        await db.notification.createMany({
          data: notificationData,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pengumuman berhasil diterbitkan.',
      announcement,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menerbitkan pengumuman.' },
      { status: 500 }
    );
  }
}
