import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all lost & found items (with optional type/category/query filter)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // LOST | FOUND
  const query = searchParams.get('q');

  try {
    const whereCondition: any = {};
    if (type && (type === 'LOST' || type === 'FOUND')) {
      whereCondition.type = type;
    }

    const items = await db.lostFoundItem.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, role: true, email: true, class: true },
        },
      },
    });

    const filtered = query
      ? items.filter(
          (i) =>
            i.title.toLowerCase().includes(query.toLowerCase()) ||
            i.description.toLowerCase().includes(query.toLowerCase()) ||
            i.location.toLowerCase().includes(query.toLowerCase())
        )
      : items;

    return NextResponse.json({ success: true, items: filtered });
  } catch (error) {
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}

// POST create lost & found item
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Harap login terlebih dahulu.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, type, location, date, imageUrl } = body;

    if (!title || !description || !category || !type || !location) {
      return NextResponse.json(
        { success: false, message: 'Judul, deskripsi, kategori, tipe, dan lokasi wajib diisi.' },
        { status: 400 }
      );
    }

    const item = await db.lostFoundItem.create({
      data: {
        title,
        description,
        category,
        type, // LOST or FOUND
        location,
        date: date ? new Date(date) : new Date(),
        imageUrl: imageUrl || null,
        userId: session.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Laporan ${type === 'LOST' ? 'Barang Hilang' : 'Barang Ditemukan'} berhasil dibuat.`,
      item,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal membuat laporan.' }, { status: 500 });
  }
}
