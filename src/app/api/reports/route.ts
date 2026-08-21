import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET reports (Student gets own reports, Admin/Teacher gets all)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, reports: [] }, { status: 401 });
    }

    const isAdmin =
      session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' || session.role === 'TEACHER';

    const whereCondition = isAdmin ? {} : { reporterId: session.id };

    const reports = await db.incidentReport.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: { name: true, role: true, email: true, class: true },
        },
      },
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    return NextResponse.json({ success: false, reports: [] }, { status: 500 });
  }
}

// POST submit new report
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Harap login terlebih dahulu.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, location, photoUrl } = body;

    if (!title || !description || !category || !location) {
      return NextResponse.json(
        { success: false, message: 'Judul, deskripsi, kategori, dan lokasi wajib diisi.' },
        { status: 400 }
      );
    }

    const report = await db.incidentReport.create({
      data: {
        title,
        description,
        category,
        location,
        photoUrl: photoUrl || null,
        status: 'SUBMITTED',
        reporterId: session.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Laporan berhasil terkirim dan akan ditinjau oleh pihak sekolah.',
      report,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal membuat laporan.' }, { status: 500 });
  }
}
