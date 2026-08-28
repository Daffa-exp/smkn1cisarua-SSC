import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendPushToUsers } from '@/lib/push';

// GET detail
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const report = await db.incidentReport.findUnique({
      where: { id: params.id },
      include: {
        reporter: {
          select: { name: true, role: true, email: true, class: true },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ success: false, message: 'Laporan tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

// PATCH status update by Admin/Teacher
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN' && session.role !== 'TEACHER')
    ) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    const existingReport = await db.incidentReport.findUnique({
      where: { id: params.id },
    });

    if (!existingReport) {
      return NextResponse.json({ success: false, message: 'Laporan tidak ditemukan.' }, { status: 404 });
    }

    const updated = await db.incidentReport.update({
      where: { id: params.id },
      data: { status },
    });

    // Notify reporter about status update
    const statusLabels: Record<string, string> = {
      SUBMITTED: 'Diterima',
      REVIEWING: 'Sedang Ditinjau',
      VERIFIED: 'Terverifikasi',
      IN_PROGRESS: 'Sedang Ditangani (In Progress)',
      RESOLVED: 'Selesai (Resolved)',
    };

    await db.notification.create({
      data: {
        title: `UPDATE LAPORAN: ${existingReport.title}`,
        message: `Status laporan Anda telah diperbarui menjadi: "${statusLabels[status] || status}".`,
        type: status === 'RESOLVED' ? 'INFO' : 'WARNING',
        userId: existingReport.reporterId,
      },
    });

    await sendPushToUsers([existingReport.reporterId], {
      title: `UPDATE LAPORAN: ${existingReport.title}`,
      body: `Status laporan Anda telah diperbarui menjadi: "${statusLabels[status] || status}".`,
      url: `/reports`,
      notificationId: existingReport.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Status laporan berhasil diperbarui.',
      report: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui laporan.' }, { status: 500 });
  }
}
