import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Token dan password baru wajib diisi.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password baru minimal 6 karakter.' },
        { status: 400 }
      );
    }

    const record = await db.passwordReset.findFirst({
      where: { token, used: false },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid atau sudah digunakan.' },
        { status: 400 }
      );
    }

    if (new Date(record.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Token sudah expired.' },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);

    await db.$transaction([
      db.user.update({
        where: { email: record.email },
        data: { passwordHash: newHash },
      }),
      db.passwordReset.update({
        where: { id: record.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah. Silakan login dengan password baru.',
    });
  } catch (error: any) {
    console.error('[RESET_PASSWORD_ERROR]', error?.message, error?.stack);
    return NextResponse.json(
      { success: false, message: 'Gagal mereset password.' },
      { status: 500 }
    );
  }
}
