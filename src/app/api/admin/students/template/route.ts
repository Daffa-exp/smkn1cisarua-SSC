import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'xlsx';

    const headers = ['Nama', 'Email', 'NIS', 'Kelas', 'Jurusan'];
    const sampleRow = ['John Doe', 'john@example.com', '20261001', 'X RPL 1', 'Rekayasa Perangkat Lunak'];

    if (format === 'csv') {
      const csvRows = [headers.join(','), sampleRow.join(',')];
      const csv = csvRows.join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="template-import-siswa.csv"',
        },
      });
    }

    const worksheet = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Siswa');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template-import-siswa.xlsx"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Gagal generate template.' }, { status: 500 });
  }
}
