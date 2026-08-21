import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const dbUser = await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      nis: true,
      nip: true,
      class: true,
      major: true,
      avatarUrl: true,
    },
  });

  return NextResponse.json({
    authenticated: true,
    user: dbUser || session,
  });
}
