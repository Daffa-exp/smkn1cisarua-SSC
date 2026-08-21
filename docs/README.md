# SMKN 1 CISARUA SSC

SMKN 1 CISARUA SSC adalah platform digital sekolah yang dirancang untuk menjadi pusat informasi, komunikasi, layanan siswa, pelaporan, jadwal, event, dan bantuan AI dalam satu aplikasi.

Project ini ditujukan untuk penggunaan melalui:

- Web
- Mobile browser
- PWA
- Perangkat smartphone siswa

## Tujuan

SSC dibuat agar komunikasi sekolah tidak hanya bergantung pada grup WhatsApp.

Informasi seperti:

- pengumuman
- perubahan jadwal
- acara sekolah
- berita
- barang hilang
- barang ditemukan
- kerusakan fasilitas
- laporan siswa
- informasi penting

dapat disampaikan melalui satu platform.

## Target User

### Public Visitor

Pengunjung yang belum login.

Dapat:

- melihat informasi publik
- membaca berita
- melihat event
- melihat informasi sekolah
- menggunakan public AI assistant

### Student

Siswa yang sudah login.

Dapat:

- melihat dashboard
- menerima notification
- melihat berita
- melihat jadwal
- melihat event
- membuat laporan
- melihat status laporan
- menggunakan student AI assistant
- mengelola profile

### Admin

Admin sekolah.

Dapat:

- mengelola berita
- mengelola pengumuman
- mengelola event
- mengelola jadwal
- mengirim notification
- mengelola laporan
- mengelola user
- mengelola media
- menggunakan admin AI assistant
- melihat statistik

## Dokumentasi

Dokumentasi project:

- `PHASES.md` — roadmap pengerjaan
- `design.md` — source of truth UI/UX
- `features.md` — seluruh fitur
- `architecture.md` — arsitektur sistem
- `database.md` — struktur database
- `api.md` — API contract
- `ai-system.md` — sistem AI
- `notification-system.md` — notification system
- `security.md` — security rules
- `deployment.md` — deployment dan production

## Aturan AI Agent

Sebelum melakukan perubahan:

1. Baca `README.md`.
2. Baca `PHASES.md`.
3. Identifikasi phase aktif.
4. Baca dokumentasi yang berkaitan dengan phase tersebut.
5. Baca `design.md` sebelum mengubah UI.
6. Jangan mengerjakan phase berikutnya sebelum phase aktif selesai.
7. Jangan mengubah architecture tanpa alasan.
8. Jangan mengarang data sekolah.
9. Jangan membuat fitur yang tidak tercantum tanpa persetujuan.
10. Setelah coding, jalankan lint/typecheck/build jika tersedia.

## Prinsip Utama

SSC harus terasa seperti aplikasi digital sekolah modern, bukan template website sekolah.

Prioritas:

- mobile-first
- responsive
- accessible
- secure
- maintainable
- fast
- professional
- modern
- easy to use