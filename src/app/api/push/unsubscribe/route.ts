import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// POST remove a push subscription (user turned notifications off on this device).
// Only the owning user can delete their own subscription — never trust a
// client-supplied userId.
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Harap login terlebih dahulu.' }, { status: 401 });
    }

    const body = await request.json();
    const endpoint: string | undefined = body?.endpoint;

    if (!endpoint) {
      return NextResponse.json({ success: false, message: 'Endpoint tidak ditemukan.' }, { status: 400 });
    }

    await db.pushSubscription.deleteMany({
      where: { endpoint, userId: session.id },
    });

    return NextResponse.json({ success: true, message: 'Notifikasi berhasil dinonaktifkan.' });
  } catch (error) {
    console.error('[push/unsubscribe] error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menonaktifkan notifikasi.' },
      { status: 500 }
    );
  }
}
