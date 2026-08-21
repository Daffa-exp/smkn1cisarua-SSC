import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all events
export async function GET() {
  try {
    const events = await db.event.findMany({
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ success: true, events });
  } catch (error) {
    return NextResponse.json({ success: false, events: [] }, { status: 500 });
  }
}

// POST create event (Admin, Teacher, STUDENT_LEADER / Ketos) -> Automatically publishes on Announcement Board!
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== 'ADMIN' &&
        session.role !== 'SUPER_ADMIN' &&
        session.role !== 'TEACHER' &&
        session.role !== 'STUDENT_LEADER')
    ) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, location, date, startTime, endTime, organizer, imageUrl, linkUrl } = body;

    if (!title || !description || !location || !date || !startTime || !endTime || !organizer) {
      return NextResponse.json(
        { success: false, message: 'Semua bidang utama wajib diisi.' },
        { status: 400 }
      );
    }

    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // 1. Create Event Record
    const event = await db.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        startTime,
        endTime,
        organizer,
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
      },
    });

    // 2. Automatically Publish to Announcement Board WITHOUT EMOJIS (clean text formatting)
    const announcementContent = `${description}\n\nLokasi: ${location}\nTanggal: ${formattedDate}\nWaktu: ${startTime} - ${endTime} WIB\nPenyelenggara: ${organizer}${
      linkUrl ? `\n\nLink Pendaftaran / Informasi: ${linkUrl}` : ''
    }`;

    await db.announcement.create({
      data: {
        title: `[AGENDA EVENT] ${title}`,
        content: announcementContent,
        category: 'Event & Kegiatan',
        priority: 'MEDIUM',
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        targetAudience: 'ALL',
        authorId: session.id,
      },
    });

    // 3. Notify students about new event
    const students = await db.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true },
    });

    if (students.length > 0) {
      await db.notification.createMany({
        data: students.map((s) => ({
          title: `EVENT BARU: ${title}`,
          message: `${description.substring(0, 100)}... Tanggal: ${formattedDate} di ${location}.`,
          type: 'INFO',
          userId: s.id,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Event sekolah berhasil ditambahkan dan otomatis dipublikasikan ke Papan Pengumuman.',
      event,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal membuat event.' }, { status: 500 });
  }
}
