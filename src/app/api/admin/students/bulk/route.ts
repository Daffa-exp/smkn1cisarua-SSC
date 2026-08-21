import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN' && session.role !== 'STUDENT_LEADER')
    ) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await request.json();
    const { className, major, rawText } = body;

    if (!className || !rawText) {
      return NextResponse.json(
        { success: false, message: 'Nama kelas dan daftar NIS/Siswa wajib diisi.' },
        { status: 400 }
      );
    }

    // Parse input lines (Format: "NIS, Nama, Email" or "NIS, Nama")
    const lines = rawText.split('\n').filter((l: string) => l.trim().length > 0);
    const createdUsers = [];
    const errors = [];

    const defaultPasswordHash = await hashPassword('siswa123');

    for (const line of lines) {
      const parts = line.split(',').map((p: string) => p.trim());
      if (parts.length < 2) {
        errors.push(`Baris tidak valid: "${line}"`);
        continue;
      }

      const nis = parts[0];
      const name = parts[1];
      const email = parts[2] || `nis.${nis}@smkn1cisarua.sch.id`;

      try {
        const user = await db.user.upsert({
          where: { nis },
          update: {
            name,
            email,
            class: className,
            major: major || 'Kejuruan',
            role: 'STUDENT',
          },
          create: {
            name,
            email,
            passwordHash: defaultPasswordHash,
            role: 'STUDENT',
            nis,
            class: className,
            major: major || 'Kejuruan',
          },
        });
        createdUsers.push(user);
      } catch (err: any) {
        errors.push(`Gagal mendaftarkan NIS ${nis}: ${err?.message || 'NIS/Email terduplikasi'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil mendaftarkan ${createdUsers.length} siswa untuk kelas ${className}.`,
      count: createdUsers.length,
      errors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal melakukan pendaftaran massal siswa.' },
      { status: 500 }
    );
  }
}
