import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET active emergency alerts
export async function GET() {
  try {
    const alerts = await db.emergencyAlert.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    return NextResponse.json({ success: false, alerts: [] }, { status: 500 });
  }
}

// POST create emergency alert (Admin & Super Admin only)
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Hanya Admin / Super Admin yang berhak menerbitkan siaran darurat.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, message } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: 'Judul dan pesan siaran darurat wajib diisi.' },
        { status: 400 }
      );
    }

    const alert = await db.emergencyAlert.create({
      data: {
        title,
        message,
        isActive: true,
        createdById: session.id,
      },
    });

    // Create high-priority emergency notifications for all users
    const allUsers = await db.user.findMany({ select: { id: true } });
    if (allUsers.length > 0) {
      await db.notification.createMany({
        data: allUsers.map((u) => ({
          title: `EMERGENCY ALERT: ${title}`,
          message,
          type: 'EMERGENCY',
          userId: u.id,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Siaran darurat berhasil diterbitkan.',
      alert,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal membuat siaran darurat.' }, { status: 500 });
  }
}
