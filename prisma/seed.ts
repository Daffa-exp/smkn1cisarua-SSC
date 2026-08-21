import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const studentPass = await bcrypt.hash('siswa123', 10);
  const teacherPass = await bcrypt.hash('guru123', 10);
  const adminPass = await bcrypt.hash('admin123', 10);
  const superPass = await bcrypt.hash('super123', 10);

  const demoUsers = [
    {
      name: 'Ahmad Siswa RPL',
      email: 'siswa@smkn1cisarua.sch.id',
      passwordHash: studentPass,
      role: 'STUDENT',
      nis: '2026101928',
      class: 'XII RPL 1',
      major: 'Rekayasa Perangkat Lunak',
    },
    {
      name: 'Drs. Budi Guru RPL',
      email: 'guru@smkn1cisarua.sch.id',
      passwordHash: teacherPass,
      role: 'TEACHER',
      nip: '198503152010011002',
      major: 'Rekayasa Perangkat Lunak',
    },
    {
      name: 'Admin Kesiswaan',
      email: 'admin@smkn1cisarua.sch.id',
      passwordHash: adminPass,
      role: 'ADMIN',
    },
    {
      name: 'Super Admin Utama',
      email: 'superadmin@smkn1cisarua.sch.id',
      passwordHash: superPass,
      role: 'SUPER_ADMIN',
    },
  ];

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
