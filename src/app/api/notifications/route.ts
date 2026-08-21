import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET user notifications
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, notifications: [], unreadCount: 0 }, { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    return NextResponse.json({ success: false, notifications: [], unreadCount: 0 }, { status: 500 });
  }
}

// POST create broadcast or targeted notification (Admin/Teacher only)
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN' && session.role !== 'TEACHER')
    ) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, type, targetRole } = body; // targetRole: ALL | STUDENT | TEACHER

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: 'Judul dan pesan notifikasi wajib diisi.' },
        { status: 400 }
      );
    }

    const whereCondition: any = {};
    if (targetRole && targetRole !== 'ALL') {
      whereCondition.role = targetRole;
    }

    const targetUsers = await db.user.findMany({
      where: whereCondition,
      select: { id: true },
    });

    if (targetUsers.length > 0) {
      await db.notification.createMany({
        data: targetUsers.map((u) => ({
          title,
          message,
          type: type || 'INFO',
          userId: u.id,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Notifikasi berhasil dikirimkan ke ${targetUsers.length} pengguna.`,
      count: targetUsers.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal mengirim notifikasi.' }, { status: 500 });
  }
}

// PATCH mark all as read for current user
export async function PATCH() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Harap login terlebih dahulu.' }, { status: 401 });
    }

    await db.notification.updateMany({
      where: { userId: session.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Seluruh notifikasi ditandai sebagai dibaca.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui notifikasi.' }, { status: 500 });
  }
}
