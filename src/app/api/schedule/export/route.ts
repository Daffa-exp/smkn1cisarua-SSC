import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN' && session.role !== 'TEACHER')
    ) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const schedules = await db.schedule.findMany({
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
    });

    const header = 'Mata Pelajaran,Guru,Kelas,Ruangan,Hari,Jam Mulai,Jam Selesai\n';
    const csvRows = schedules
      .map(
        (s) =>
          `"${s.subject}","${s.teacher}","${s.className}","${s.room}","${s.day}","${s.startTime}","${s.endTime}"`
      )
      .join('\n');

    const csvContent = header + csvRows;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="jadwal_pelajaran_smkn1cisarua.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengekspor jadwal.' }, { status: 500 });
  }
}
