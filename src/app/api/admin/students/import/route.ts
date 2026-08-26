import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

interface PreviewRow {
  row: number;
  name: string;
  email: string;
  nis: string;
  class: string;
  major: string;
  status: 'valid' | 'error' | 'duplicate';
  errors: string[];
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRow(row: any, rowNumber: number, existingNis: Set<string>, existingEmails: Set<string>): PreviewRow {
  const errors: string[] = [];
  const name = String(row.name || row.Nama || row['Nama Lengkap'] || '').trim();
  const email = String(row.email || row.Email || '').trim().toLowerCase();
  const nis = String(row.nis || row.NIS || row.Nis || '').trim();
  const className = String(row.class || row.Kelas || row.kelas || '').trim();
  const major = String(row.major || row.Jurusan || row.jurusan || '').trim();

  if (!name) errors.push('Nama wajib diisi');
  if (!email) {
    errors.push('Email wajib diisi');
  } else if (!validateEmail(email)) {
    errors.push('Format email tidak valid');
  } else if (existingEmails.has(email)) {
    errors.push('Email sudah terdaftar');
  }
  if (!nis) {
    errors.push('NIS wajib diisi');
  } else if (existingNis.has(nis)) {
    errors.push('NIS sudah terdaftar');
  }
  if (!className) errors.push('Kelas wajib diisi');

  let status: PreviewRow['status'] = 'valid';
  if (errors.length > 0) {
    status = 'error';
  } else if (existingNis.has(nis) || existingEmails.has(email)) {
    status = 'duplicate';
  }

  return {
    row: rowNumber,
    name: name || '-',
    email: email || '-',
    nis: nis || '-',
    class: className || '-',
    major: major || '-',
    status,
    errors,
  };
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    const contentType = request.headers.get('content-type') || '';
    const formData = contentType.includes('multipart/form-data')
      ? await request.formData()
      : null;

    const action = formData?.get('action')?.toString() || 'preview';

    if (action === 'confirm') {
      const previewDataJson = formData?.get('previewData')?.toString();
      if (!previewDataJson) {
        return NextResponse.json({ success: false, message: 'Data preview tidak ditemukan.' }, { status: 400 });
      }

      const previewRows: PreviewRow[] = JSON.parse(previewDataJson);
      const validRows = previewRows.filter((r) => r.status === 'valid');

      if (validRows.length === 0) {
        return NextResponse.json({ success: false, message: 'Tidak ada data valid untuk diimport.' }, { status: 400 });
      }

      const defaultPasswordHash = await hashPassword('siswa123');
      let created = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const row of validRows) {
        try {
          await db.user.create({
            data: {
              name: row.name,
              email: row.email,
              nis: row.nis,
              class: row.class,
              major: row.major || 'Kejuruan',
              role: 'STUDENT',
              passwordHash: defaultPasswordHash,
            },
          });
          created++;
        } catch (err: any) {
          failed++;
          errors.push(`Baris ${row.row}: ${err?.message || 'Gagal membuat akun'}`);
        }
      }

      await db.activityLog.create({
        data: {
          action: 'IMPORT_STUDENTS',
          details: `Imported ${created} students, ${failed} failed, ${validRows.length} processed`,
          userId: session.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Import selesai. ${created} berhasil, ${failed} gagal.`,
        created,
        failed,
        errors,
      });
    }

    // Preview action
    if (!formData?.get('file')) {
      return NextResponse.json({ success: false, message: 'File wajib diupload.' }, { status: 400 });
    }

    const file = formData.get('file') as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (!data.length) {
      return NextResponse.json({ success: false, message: 'File kosong atau format tidak didukung.' }, { status: 400 });
    }

    const existingUsers = await db.user.findMany({
      where: { role: 'STUDENT' },
      select: { nis: true, email: true },
    });
    const existingNis = new Set(existingUsers.map((u) => u.nis).filter((nis): nis is string => Boolean(nis)));
    const existingEmails = new Set(existingUsers.map((u) => u.email).filter((email): email is string => Boolean(email)));

    const previewRows: PreviewRow[] = data.map((row: any, index: number) =>
      validateRow(row, index + 2, existingNis, existingEmails)
    );

    const validCount = previewRows.filter((r) => r.status === 'valid').length;
    const errorCount = previewRows.filter((r) => r.status === 'error').length;
    const duplicateCount = previewRows.filter((r) => r.status === 'duplicate').length;

    return NextResponse.json({
      success: true,
      preview: previewRows,
      summary: {
        total: previewRows.length,
        valid: validCount,
        error: errorCount,
        duplicate: duplicateCount,
      },
    });
  } catch (error: any) {
    console.error('[IMPORT_ERROR]', error?.message, error?.stack);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses file import.' },
      { status: 500 }
    );
  }
}
