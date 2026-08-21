import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const notification = await db.notification.update({
      where: { id: params.id },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui notifikasi.' }, { status: 500 });
  }
}
