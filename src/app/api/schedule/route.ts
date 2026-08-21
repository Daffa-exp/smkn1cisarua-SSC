import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET schedules (filtered by day or all)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get('day');

  try {
    const whereCondition = day ? { day } : {};
    const schedules = await db.schedule.findMany({
      where: whereCondition,
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json({ success: true, schedules });
  } catch (error) {
    return NextResponse.json({ success: false, schedules: [] }, { status: 500 });
  }
}

// POST create new schedule (Admin & Teacher only)
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN' && session.role !== 'TEACHER')
    ) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subject, teacher, className, room, day, startTime, endTime } = body;

    if (!subject || !teacher || !className || !room || !day || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: 'Semua bidang wajib diisi.' },
        { status: 400 }
      );
    }

    const schedule = await db.schedule.create({
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

    // Notify students about schedule update
    const students = await db.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true },
    });

    if (students.length > 0) {
      await db.notification.createMany({
        data: students.map((s) => ({
          title: `PERUBAHAN JADWAL: ${subject}`,
          message: `Jadwal baru ${subject} (${day}, ${startTime} - ${endTime} WIB) di ${room} telah ditambahkan.`,
          type: 'INFO',
          userId: s.id,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Jadwal berhasil ditambahkan.',
      schedule,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan jadwal.' },
      { status: 500 }
    );
  }
}
