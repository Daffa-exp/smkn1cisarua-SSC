import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const [totalStudents, totalTeachers, activeAnnouncements, totalSchedules, upcomingEvents, pendingReports, lostFoundActive, totalNotifications] = await Promise.all([
      db.user.count({ where: { role: 'STUDENT' } }),
      db.user.count({ where: { role: 'TEACHER' } }),
      db.announcement.count({
        where: {
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      }),
      db.schedule.count(),
      db.event.count({ where: { date: { gte: new Date() } } }),
      db.incidentReport.count({ where: { status: 'SUBMITTED' } }),
      db.lostFoundItem.count({ where: { isResolved: false } }),
      db.notification.count(),
    ]);

    const usersByRole = await db.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    const reportsByStatus = await db.incidentReport.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const announcementsByPriority = await db.announcement.groupBy({
      by: ['priority'],
      _count: { priority: true },
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalStudents,
        totalTeachers,
        activeAnnouncements,
        totalSchedules,
        upcomingEvents,
        pendingReports,
        lostFoundActive,
        totalNotifications,
      },
      charts: {
        usersByRole: usersByRole.map((item) => ({ label: item.role, value: item._count.role })),
        reportsByStatus: reportsByStatus.map((item) => ({ label: item.status, value: item._count.status })),
        announcementsByPriority: announcementsByPriority.map((item) => ({ label: item.priority, value: item._count.priority })),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, metrics: null, charts: null }, { status: 500 });
  }
}
