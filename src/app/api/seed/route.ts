import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const userCount = await db.user.count();

    if (userCount === 0) {
      const studentPass = await hashPassword('siswa123');
      const teacherPass = await hashPassword('guru123');
      const adminPass = await hashPassword('admin123');
      const superPass = await hashPassword('super123');

      const student = await db.user.create({
        data: {
          name: 'Ahmad Siswa RPL',
          email: 'siswa@smkn1cisarua.sch.id',
          passwordHash: studentPass,
          role: 'STUDENT',
          nis: '20261001',
          class: 'XII RPL 1',
          major: 'Rekayasa Perangkat Lunak',
        },
      });

      const teacher = await db.user.create({
        data: {
          name: 'Drs. Budi Guru RPL',
          email: 'guru@smkn1cisarua.sch.id',
          passwordHash: teacherPass,
          role: 'TEACHER',
          nip: '198503152010011002',
          major: 'Rekayasa Perangkat Lunak',
        },
      });

      const admin = await db.user.create({
        data: {
          name: 'Admin Kesiswaan',
          email: 'admin@smkn1cisarua.sch.id',
          passwordHash: adminPass,
          role: 'ADMIN',
        },
      });

      await db.user.create({
        data: {
          name: 'Super Admin Utama',
          email: 'superadmin@smkn1cisarua.sch.id',
          passwordHash: superPass,
          role: 'SUPER_ADMIN',
        },
      });

      // Seed Announcements
      await db.announcement.createMany({
        data: [
          {
            title: 'Jadwal Penilaian Tengah Semester (PTS) Ganjil 2026/2027',
            content:
              'Diberitahukan kepada seluruh siswa SMKN 1 Cisarua bahwa Penilaian Tengah Semester (PTS) Ganjil akan dilaksanakan mulai tanggal 1 September 2026 sampai dengan 8 September 2026. Seluruh siswa wajib melunasi administrasi sekolah dan mencetak Kartu Ujian.',
            category: 'Akademik',
            priority: 'HIGH',
            targetAudience: 'ALL',
            authorId: admin.id,
          },
          {
            title: 'Pendaftaran Ekstrakurikuler Wajib & Pilihan T.A. 2026',
            content:
              'Pendaftaran ekstrakurikuler Pramuka (wajib) serta ekstrakurikuler pilihan (Paskibra, PMR, Web Club, Robotics) telah dibuka. Silakan mengisi formulir di bagian kesiswaan.',
            category: 'Kesiswaan',
            priority: 'MEDIUM',
            targetAudience: 'STUDENT',
            authorId: teacher.id,
          },
          {
            title: 'Pemeliharaan Jaringan Internet Server Lab Komputer',
            content:
              'Akan dilakukan maintenance rutin server lokal dan internet di Lab RPL 1 & 2 pada hari Sabtu, 22 Agustus 2026 mulai jam 09.00 WIB.',
            category: 'IT & Fasilitas',
            priority: 'LOW',
            targetAudience: 'ALL',
            authorId: admin.id,
          },
        ],
      });

      // Seed Schedules
      await db.schedule.createMany({
        data: [
          {
            subject: 'Pemrograman Web & Perangkat Bergerak',
            teacher: 'Drs. Budi Guru RPL',
            className: 'XII RPL 1',
            room: 'Lab RPL 1',
            day: 'Senin',
            startTime: '07:30',
            endTime: '11:45',
          },
          {
            subject: 'Basis Data & Pemrograman SQL',
            teacher: 'Ibu Ani S.Kom',
            className: 'XII RPL 1',
            room: 'Lab RPL 2',
            day: 'Senin',
            startTime: '12:30',
            endTime: '15:00',
          },
          {
            subject: 'Pemodelan Perangkat Lunak (UML)',
            teacher: 'Drs. Budi Guru RPL',
            className: 'XII RPL 1',
            room: 'Ruang 12 RPL',
            day: 'Selasa',
            startTime: '08:00',
            endTime: '11:30',
          },
          {
            subject: 'Bahasa Inggris Industri & Komunikasi',
            teacher: 'Pak Ahmad M.Pd',
            className: 'XII RPL 1',
            room: 'Ruang 12 RPL',
            day: 'Selasa',
            startTime: '12:30',
            endTime: '14:30',
          },
          {
            subject: 'Produk Kreatif & Kewirausahaan (PKK)',
            teacher: 'Ibu Siti S.E',
            className: 'XII RPL 1',
            room: 'Ruang Teori 4',
            day: 'Rabu',
            startTime: '07:30',
            endTime: '12:00',
          },
          {
            subject: 'Pendidikan Pancasila & Kewarganegaraan',
            teacher: 'Pak Iskandar S.Pd',
            className: 'XII RPL 1',
            room: 'Ruang Teori 4',
            day: 'Kamis',
            startTime: '08:00',
            endTime: '10:00',
          },
          {
            subject: 'Matematika Terapan & Logika Algoritma',
            teacher: 'Ibu Ratna M.Sc',
            className: 'XII RPL 1',
            room: 'Ruang Teori 4',
            day: 'Jumat',
            startTime: '07:30',
            endTime: '11:00',
          },
        ],
      });

      // Seed Events
      await db.event.createMany({
        data: [
          {
            title: 'Lomba Coding & Inovasi Aplikasi Sekolah 2026',
            description:
              'Ajang tahunan pameran dan karya cipta perangkat lunak antar siswa jurusan RPL & TKJ SMKN 1 Cisarua dengan total hadiah jutaan rupiah.',
            location: 'Aula Utama SMKN 1 Cisarua',
            date: new Date('2026-08-28T09:00:00Z'),
            startTime: '09:00',
            endTime: '15:00',
            organizer: 'OSIS & Himpunan RPL',
          },
          {
            title: 'Workshop Cloud Computing & DevOps Bersama Industri',
            description:
              'Pelatihan eksklusif persiapan Prakerin/Praktek Kerja Lapangan bagi siswa kelas XI & XII bersama Praktisi Senior IT.',
            location: 'Lab Komputer RPL 1',
            date: new Date('2026-09-05T08:30:00Z'),
            startTime: '08:30',
            endTime: '14:00',
            organizer: 'Hubungan Industri (HUBIN)',
          },
        ],
      });

      // Seed Notifications for Student
      await db.notification.createMany({
        data: [
          {
            title: 'Jadwal Penilaian Tengah Semester Terbit',
            message: 'Jadwal Penilaian Tengah Semester (PTS) Ganjil telah diterbitkan. Silakan periksa di menu Pengumuman.',
            type: 'INFO',
            userId: student.id,
            isRead: false,
          },
          {
            title: 'Pengingat Tugas PKK',
            message: 'Tugas proposal Produk Kreatif Kewirausahaan dikumpulkan paling lambat hari Rabu jam 12:00 WIB.',
            type: 'WARNING',
            userId: student.id,
            isRead: false,
          },
        ],
      });

      // Seed Incident Reports
      await db.incidentReport.create({
        data: {
          title: 'Kabel LAN kendor di Komputer #12 Lab RPL 1',
          description: 'Koneksi internet sering terputus pada unit PC 12.',
          category: 'IT & Fasilitas',
          location: 'Lab RPL 1',
          status: 'REVIEWING',
          reporterId: student.id,
        },
      });

      // Seed Lost & Found
      await db.lostFoundItem.create({
        data: {
          title: 'Flashdisk SanDisk 32GB Warna Hitam Merah',
          description: 'Tertinggal di meja Lab Komputer 2 setelah jam pelajaran Basis Data.',
          category: 'Aksesoris IT',
          type: 'FOUND',
          location: 'Lab RPL 2',
          date: new Date(),
          userId: student.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded with demo data for Student App.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to seed.' },
      { status: 500 }
    );
  }
}
