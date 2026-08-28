import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// POST register (or refresh) a push subscription for the logged in user.
// A user can have multiple subscriptions (one per browser/device) — we
// upsert by endpoint so registering the same device twice just updates keys.
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Harap login terlebih dahulu.' }, { status: 401 });
    }

    const body = await request.json();
    const subscription = body?.subscription;
    const endpoint: string | undefined = subscription?.endpoint;
    const p256dh: string | undefined = subscription?.keys?.p256dh;
    const auth: string | undefined = subscription?.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json(
        { success: false, message: 'Data subscription tidak lengkap.' },
        { status: 400 }
      );
    }

    // A push subscription's endpoint is globally unique. If it already
    // exists (e.g. re-subscribing, or the same browser logged in as a
    // different account previously), reassign it to the current user
    // instead of failing — this never touches other users' subscriptions.
    await db.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId: session.id,
        p256dh,
        auth,
        userAgent: request.headers.get('user-agent') || undefined,
      },
      create: {
        userId: session.id,
        endpoint,
        p256dh,
        auth,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    return NextResponse.json({ success: true, message: 'Notifikasi berhasil diaktifkan.' });
  } catch (error) {
    console.error('[push/subscribe] error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengaktifkan notifikasi.' },
      { status: 500 }
    );
  }
}
