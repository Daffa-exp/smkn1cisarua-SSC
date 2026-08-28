import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email wajib diisi.' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email tidak ditemukan.' },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
    const tokenHash = await hashPassword(resetToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.passwordReset.create({
      data: {
        email: user.email,
        tokenHash,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    return NextResponse.json({
      success: true,
      message: 'Link reset password telah dibuat. Cek email Anda.',
      resetUrl,
    });
  } catch (error: any) {
    console.error('[FORGOT_PASSWORD_ERROR]', error?.message, error?.stack);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses permintaan reset password.' },
      { status: 500 }
    );
  }
}
