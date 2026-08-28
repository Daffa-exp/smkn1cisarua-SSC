import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'ALL';
    const search = searchParams.get('search') || '';
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') || 50)));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role && role !== 'ALL') {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { nis: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          nis: true,
          class: true,
          major: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, users: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await request.json();
    const { className, major, rawText } = body;

    if (!className || !major || !rawText) {
      return NextResponse.json({ success: false, message: 'Semua field wajib diisi.' }, { status: 400 });
    }

    const lines = rawText.split('\n').filter((line: string) => line.trim());
    const created: string[] = [];
    const skipped: string[] = [];

    for (const line of lines) {
      const parts = line.split(',').map((part: string) => part.trim());
      const nis = parts[0];
      const name = parts[1];
      const email = parts[2] || `${nis}@siswa.smkn1cisarua.sch.id`;

      if (!nis || !name) {
        skipped.push(`${line} - NIS/Nama tidak valid`);
        continue;
      }

      const existing = await db.user.findFirst({
        where: { OR: [{ nis }, { email }] },
      });

      if (existing) {
        skipped.push(`${line} - sudah terdaftar`);
        continue;
      }

      const passwordHash = await hashPassword(nis);

      await db.user.create({
        data: {
          name,
          email,
          nis,
          class: className,
          major,
          role: 'STUDENT',
          passwordHash,
        },
      });

      created.push(`${name} (${nis})`);
    }

    return NextResponse.json({
      success: true,
      message: `${created.length} siswa berhasil didaftarkan.${skipped.length > 0 ? ` ${skipped.length} dilewati.` : ''}`,
      created,
      skipped,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal mendaftarkan siswa.' }, { status: 500 });
  }
}
