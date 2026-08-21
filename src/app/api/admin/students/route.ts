import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, users: [] }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const query = searchParams.get('q');

    const whereCondition: any = {};
    if (roleFilter && roleFilter !== 'ALL') {
      whereCondition.role = roleFilter;
    }

    const users = await db.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        class: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const filtered = query
      ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
        )
      : users;

    return NextResponse.json({ success: true, users: filtered });
  } catch (error) {
    return NextResponse.json({ success: false, users: [] }, { status: 500 });
  }
}
