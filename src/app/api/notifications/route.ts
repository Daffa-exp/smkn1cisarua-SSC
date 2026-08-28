import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendPushToRole } from '@/lib/push';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, notifications: [], unreadCount: 0 }, { status: 401 });
    }

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: 'desc' },
      }),
      db.notification.count({ where: { userId: session.id, isRead: false } }),
    ]);

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    return NextResponse.json({ success: false, notifications: [], unreadCount: 0 }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Harap login terlebih dahulu.' }, { status: 401 });
    }

    await db.notification.updateMany({
      where: { userId: session.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, message: 'Semua notifikasi telah dibaca.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui notifikasi.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN' && session.role !== 'TEACHER')) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, type = 'INFO', targetRole = 'ALL' } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: 'Judul dan pesan notifikasi wajib diisi.' },
        { status: 400 }
      );
    }

    const where: any = {};
    if (targetRole && targetRole !== 'ALL') {
      where.role = targetRole;
    }

    const targetUsers = await db.user.findMany({
      where,
      select: { id: true },
    });

    if (targetUsers.length === 0) {
      return NextResponse.json({ success: false, message: 'Tidak ada pengguna yang menerima notifikasi ini.' }, { status: 400 });
    }

    await db.notification.createMany({
      data: targetUsers.map((user) => ({
        title,
        message,
        type,
        userId: user.id,
      })),
    });

    const targetRoleForPush = targetRole === 'ALL' ? 'ALL' : targetRole;
    sendPushToRole(targetRoleForPush, {
      title,
      body: message,
      url: '/notifications',
    }).catch((err) => console.error('[push] notification broadcast failed:', err));

    return NextResponse.json({
      success: true,
      message: `Notifikasi berhasil dikirim ke ${targetUsers.length} pengguna.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengirim notifikasi.' }, { status: 500 });
  }
}
