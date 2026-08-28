import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day') || undefined;
    const className = searchParams.get('class') || undefined;

    const schedules = await db.schedule.findMany({
      where: {
        ...(day ? { day } : {}),
        ...(className ? { className } : {}),
      },
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
    });

    return NextResponse.json({ success: true, schedules });
  } catch (error) {
    return NextResponse.json({ success: false, schedules: [] }, { status: 500 });
  }
}

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
    const { rawText, subject, teacher, className, room, day, startTime, endTime } = body;

    // Single schedule creation from form modal
    if (subject && teacher && className && room && day && startTime && endTime) {
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

      return NextResponse.json({
        success: true,
        message: 'Jadwal berhasil ditambahkan.',
        schedule,
      });
    }

    // Bulk CSV import
    if (!rawText) {
      return NextResponse.json(
        { success: false, message: 'Data CSV jadwal tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const lines = rawText.split('\n').filter((l: string) => l.trim().length > 0);
    const scheduleItems = [];

    for (const line of lines) {
      if (line.toLowerCase().includes('subject') || line.toLowerCase().includes('mata pelajaran')) {
        continue;
      }

      const parts = line.split(',').map((p: string) => p.trim());
      if (parts.length >= 7) {
        scheduleItems.push({
          subject: parts[0],
          teacher: parts[1],
          className: parts[2],
          room: parts[3],
          day: parts[4],
          startTime: parts[5],
          endTime: parts[6],
        });
      }
    }

    if (scheduleItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Format CSV tidak valid. Gunakan 7 kolom: Subject, Guru, Kelas, Ruangan, Hari, Jam Mulai, Jam Selesai.' },
        { status: 400 }
      );
    }

    await db.schedule.createMany({
      data: scheduleItems,
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil mengimpor ${scheduleItems.length} jadwal pelajaran.`,
      count: scheduleItems.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal menyimpan jadwal.' }, { status: 500 });
  }
}
