import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const roleFilter = searchParams.get('role');
    const classFilter = searchParams.get('class');
    const majorFilter = searchParams.get('major');

    const whereCondition: any = {};
    if (roleFilter && roleFilter !== 'ALL') {
      whereCondition.role = roleFilter;
    }
    if (classFilter) {
      whereCondition.class = classFilter;
    }
    if (majorFilter) {
      whereCondition.major = majorFilter;
    }

    const users = await db.user.findMany({
      where: whereCondition,
      select: {
        name: true,
        email: true,
        nis: true,
        role: true,
        class: true,
        major: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    await db.activityLog.create({
      data: {
        action: 'EXPORT_STUDENTS',
        details: `Exported ${users.length} students in ${format} format`,
        userId: session.id,
      },
    });

    const fileName = `data-siswa-${Date.now()}`;

    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(
        users.map((u) => ({
          Nama: u.name,
          Email: u.email,
          NIS: u.nis || '-',
          Role: u.role,
          Kelas: u.class || '-',
          Jurusan: u.major || '-',
          'Terdaftar': new Date(u.createdAt).toLocaleDateString('id-ID'),
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Siswa');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${fileName}.xlsx"`,
        },
      });
    }

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Data Siswa SMKN 1 Cisarua', 14, 15);
      doc.setFontSize(10);
      doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 14, 22);

      const tableColumn = ['Nama', 'Email', 'NIS', 'Role', 'Kelas', 'Jurusan', 'Terdaftar'];
      const tableRows = users.map((u) => [
        u.name,
        u.email,
        u.nis || '-',
        u.role,
        u.class || '-',
        u.major || '-',
        new Date(u.createdAt).toLocaleDateString('id-ID'),
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 28,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 99, 235] },
      });

      const pdfBuffer = doc.output('arraybuffer');
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}.pdf"`,
        },
      });
    }

    // Default CSV
    const headers = ['Nama', 'Email', 'NIS', 'Role', 'Kelas', 'Jurusan', 'Terdaftar'];
    const csvRows = [
      headers.join(','),
      ...users.map((u) =>
        [
          `"${u.name.replace(/"/g, '""')}"`,
          `"${u.email.replace(/"/g, '""')}"`,
          u.nis || '-',
          u.role,
          u.class || '-',
          u.major || '-',
          new Date(u.createdAt).toLocaleDateString('id-ID'),
        ].join(',')
      ),
    ];
    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal export data.' }, { status: 500 });
  }
}
