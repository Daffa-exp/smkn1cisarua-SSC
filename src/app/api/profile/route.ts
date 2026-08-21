import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Harap login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, avatarUrl } = body as { name?: string; avatarUrl?: string | null };

    const data: { name?: string; avatarUrl?: string | null } = {};

    if (typeof name === 'string' && name.trim().length > 0) {
      data.name = name.trim().slice(0, 80);
    }

    if (avatarUrl !== undefined) {
      if (avatarUrl === null) {
        data.avatarUrl = null;
      } else if (
        typeof avatarUrl === 'string' &&
        avatarUrl.startsWith('data:image/') &&
        avatarUrl.length < 1_500_000
      ) {
        data.avatarUrl = avatarUrl;
      } else {
        return NextResponse.json(
          { success: false, message: 'Format atau ukuran foto tidak valid (maks. ~1 MB).' },
          { status: 400 }
        );
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada perubahan yang dikirim.' },
        { status: 400 }
      );
    }

    const updated = await db.user.update({
      where: { id: session.id },
      data,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        nis: updated.nis,
        nip: updated.nip,
        class: updated.class,
        major: updated.major,
        avatarUrl: updated.avatarUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan profil.' },
      { status: 500 }
    );
  }
}
