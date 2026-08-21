import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signJWTToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, identifier, password } = body;
    const loginInput = (identifier || email || '').trim();

    if (!loginInput || !password) {
      return NextResponse.json(
        { success: false, message: 'NIS/Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // Support login via NIS or Email!
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: loginInput.toLowerCase() },
          { nis: loginInput },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'NIS/Email atau password tidak terdaftar.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'NIS/Email atau password salah.' },
        { status: 401 }
      );
    }

    const sessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nis: user.nis,
      nip: user.nip,
      class: user.class,
      major: user.major,
    };

    const token = await signJWTToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      user: sessionPayload,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server saat login.' },
      { status: 500 }
    );
  }
}
