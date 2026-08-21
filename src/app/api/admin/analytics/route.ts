import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const [
      reportsByStatus,
      reportsByCategory,
      announcementsByPriority,
      lostFoundByStatus,
      usersByRole,
    ] = await Promise.all([
      db.incidentReport.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      db.incidentReport.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      db.announcement.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),
      db.lostFoundItem.groupBy({
        by: ['isResolved'],
        _count: { isResolved: true },
      }),
      db.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        reportsByStatus: reportsByStatus.map((r) => ({ status: r.status, count: r._count.status })),
        reportsByCategory: reportsByCategory.map((r) => ({ category: r.category, count: r._count.category })),
        announcementsByPriority: announcementsByPriority.map((a) => ({ priority: a.priority, count: a._count.priority })),
        lostFoundByStatus: lostFoundByStatus.map((l) => ({ isResolved: l.isResolved, count: l._count.isResolved })),
        usersByRole: usersByRole.map((u) => ({ role: u.role, count: u._count.role })),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, analytics: null }, { status: 500 });
  }
}
