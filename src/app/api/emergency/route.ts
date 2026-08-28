import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, createdById } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: 'Judul dan pesan peringatan wajib diisi.' },
        { status: 400 }
      );
    }

    const alert = await db.emergencyAlert.create({
      data: {
        title,
        message,
        createdById: createdById || 'system',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Peringatan darurat berhasil diterbitkan.',
      alert,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menerbitkan peringatan darurat.' }, { status: 500 });
  }
}
