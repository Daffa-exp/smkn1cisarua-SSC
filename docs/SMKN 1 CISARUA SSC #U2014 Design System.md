# SMKN 1 CISARUA SSC — DESIGN SYSTEM

> **Status:** Source of Truth  
> **Project:** SMKN 1 CISARUA Student Service & Communication  
> **Platform:** Web + Mobile Responsive / PWA  
> **Design Direction:** Modern, premium, institutional, youthful, trustworthy

---

# 1. DESIGN VISION

SMKN 1 CISARUA SSC bukan dibuat seperti website sekolah konvensional.

Produk harus terasa seperti:

- modern education platform
- student super app
- communication hub
- school information system
- professional SaaS product
- aplikasi yang benar-benar digunakan siswa setiap hari

Kesan utama:

**Modern — Trusted — Useful — Fast — Professional — Human**

Jangan membuat UI seperti:

- template dashboard admin
- template Bootstrap lama
- website sekolah generik
- terlalu banyak card
- terlalu banyak gradient
- terlalu banyak shadow
- UI penuh warna tanpa hierarchy
- desain yang terlihat dibuat AI

---

# 2. VISUAL REFERENCE

Website resmi SMKN 1 Cisarua digunakan sebagai:

- referensi identitas sekolah
- referensi karakter visual
- referensi informasi sekolah
- referensi nuansa institusi

Website resmi memiliki struktur seperti:

- Beranda
- Profil
- E-Learning
- Galeri
- Kontak
- fasilitas sekolah
- kegiatan sekolah

Namun SSC TIDAK BOLEH menyalin layout website tersebut.

SSC harus memiliki identitas visual sendiri sebagai aplikasi digital siswa.

---

# 3. BRAND CHARACTER

SSC harus terasa seperti gabungan:

**Modern Education + Technology + School Identity**

Karakter:

- profesional
- youthful
- clean
- energetic
- reliable
- accessible
- sophisticated

Hindari tampilan terlalu formal seperti sistem pemerintahan.

Hindari juga tampilan terlalu playful seperti aplikasi anak-anak.

Target visual:

**"Kalau SMKN 1 Cisarua punya aplikasi digital modern pada tahun 2026."**

---

# 4. COLOR SYSTEM

Gunakan dark navy sebagai foundation.

## Primary

```text
Primary Navy
#0B1220

Deep Navy
#111827

Surface Navy
#151F32
```

## Accent

Gunakan biru sebagai identitas teknologi.

```text
Primary Blue
#2563EB

Bright Blue
#3B82F6

Soft Blue
#60A5FA
```

Accent hanya digunakan untuk:

- CTA
- active state
- notification
- link
- interactive element
- important information

Jangan membuat seluruh halaman biru.

---

# 5. LIGHT MODE

Light mode tetap harus tersedia jika diperlukan.

Gunakan:

```text
Background
#F8FAFC

Surface
#FFFFFF

Text Primary
#0F172A

Text Secondary
#475569

Border
#E2E8F0
```

Jangan menggunakan putih murni pada seluruh area tanpa hierarchy.

---

# 6. DARK MODE

Dark mode adalah visual utama.

Gunakan:

```text
Background
#070B14

Surface
#0D1422

Elevated Surface
#111827

Border
rgba(255,255,255,0.08)

Primary Text
#F8FAFC

Secondary Text
#94A3B8
```

Dark mode harus tetap readable.

Jangan membuat background terlalu hitam sehingga semua elemen menyatu.

---

# 7. TYPOGRAPHY

Gunakan font modern dan mudah dibaca.

Recommended:

**Inter**

Alternative:

**Geist**

Hierarchy:

```text
Display
48–72px

H1
40–56px

H2
32–40px

H3
24–28px

Body
16px

Small
14px

Caption
12px
```

Mobile:

```text
Display
36–44px

H1
32–40px

H2
26–32px

Body
15–16px
```

Gunakan font weight:

```text
400
500
600
700
```

Jangan menggunakan terlalu banyak font.

---

# 8. SPACING

Gunakan spacing konsisten berbasis 4/8px.

```text
4
8
12
16
24
32
48
64
80
96
120
```

Desktop section spacing:

```text
80–120px
```

Mobile:

```text
48–72px
```

Jangan membuat halaman terlalu padat.

---

# 9. BORDER RADIUS

Gunakan radius modern.

Small:

```text
8px
```

Medium:

```text
12px
```

Large:

```text
16px
```

Modal / large surface:

```text
20–24px
```

Jangan semua elemen menggunakan radius 999px.

Pill hanya untuk:

- status
- category
- badge
- filter
- notification

---

# 10. SHADOW

Shadow harus subtle.

Jangan menggunakan shadow besar seperti template dashboard.

Gunakan:

```text
0 10px 30px rgba(0,0,0,.12)
```

Untuk elevated surface:

```text
0 20px 60px rgba(0,0,0,.16)
```

---

# 11. GLASS EFFECT

Glass hanya digunakan jika memiliki fungsi visual.

Contoh:

- navbar
- floating action
- modal
- notification
- overlay

Gunakan:

```text
background:
rgba(15,23,42,.65)

backdrop-filter:
blur(16px)

border:
1px solid rgba(255,255,255,.08)
```

Jangan seluruh UI dibuat glass.

---

# 12. NAVIGATION

Mobile-first.

Desktop:

```text
Logo
Dashboard
Berita
Jadwal
Acara
Laporan
Profil
```

User menu berada di kanan.

Mobile:

Gunakan bottom navigation.

Recommended:

```text
Home
Berita
Jadwal
Laporan
Profile
```

Gunakan icon + label.

Jangan menggunakan hamburger menu untuk seluruh fungsi utama jika bottom navigation lebih efektif.

---

# 13. HOME

Home adalah pusat aktivitas siswa.

Urutan:

```text
Header
↓
Greeting
↓
Important Notification
↓
Today's Schedule
↓
Upcoming Events
↓
Latest News
↓
Quick Actions
↓
Recent Reports
```

Greeting harus personal.

Contoh:

```text
Selamat pagi, Daffa.
Ada 3 informasi baru untuk kamu.
```

Jangan terlalu banyak card.

Gunakan hierarchy berdasarkan kepentingan informasi.

---

# 14. NOTIFICATION

Notification merupakan fitur utama SSC.

Kategori:

```text
Informasi Sekolah
Perubahan Jadwal
Acara
Kehilangan
Keamanan
Pengumuman
Urgent
```

Notification urgent harus sangat jelas.

Gunakan:

- icon
- timestamp
- category
- title
- short description

User dapat:

- mark as read
- open detail
- filter
- search

---

# 15. NEWS

Berita sekolah menggunakan editorial layout.

Featured news:

Large visual + title + summary.

Other news:

Compact list.

Jangan semua berita dibuat card dengan ukuran sama.

---

# 16. SCHEDULE

Schedule harus sangat mudah dibaca di HP.

Gunakan:

```text
Hari
Jam
Mata Pelajaran
Guru
Ruangan
Status
```

Status:

```text
Normal
Changed
Cancelled
```

Perubahan jadwal harus memiliki visual emphasis.

---

# 17. EVENTS

Event dapat berupa:

- seminar
- lomba
- upacara
- kegiatan sekolah
- ekstrakurikuler
- workshop
- ujian
- kegiatan khusus

Event detail:

```text
Cover
Title
Date
Time
Location
Organizer
Description
Participants
Status
```

Jika diperlukan:

```text
Add to Calendar
```

---

# 18. REPORT SYSTEM

Laporan adalah salah satu fitur utama SSC.

Kategori:

```text
Barang Hilang
Barang Ditemukan
Fasilitas Rusak
Kebersihan
Keamanan
Bullying
Saran
Keluhan
Masalah Akademik
Masalah Teknologi
Lainnya
```

Form harus simple.

Gunakan:

```text
Category
Title
Description
Photo
Location
Optional Contact
Submit
```

Jangan membuat form terlalu panjang.

---

# 19. REPORT DETAIL

Status laporan:

```text
Submitted
Reviewed
In Progress
Resolved
Rejected
```

Gunakan timeline status.

Contoh:

```text
Submitted
    ↓
Reviewed
    ↓
Being handled
    ↓
Resolved
```

User dapat melihat perkembangan laporannya.

---

# 20. PROFILE

Profile siswa harus sederhana.

Tampilkan:

```text
Foto
Nama
NIS
Kelas
Jurusan
Email
```

Tambahkan:

```text
Notification Settings
Privacy
Account
Help
Logout
```

Jangan membuat profile seperti dashboard admin.

---

# 21. ADMIN DASHBOARD

Admin memiliki interface berbeda dari siswa.

Admin dapat:

- membuat berita
- membuat pengumuman
- membuat event
- mengubah jadwal
- mengirim notification
- mengelola laporan
- mengelola siswa
- mengelola kategori
- upload media
- melihat statistik

Dashboard harus berorientasi pada pekerjaan.

Prioritas:

```text
Pending Reports
Unread Reports
Today's Events
Schedule Changes
Recent Notifications
```

---

# 22. ADMIN CREATE CONTENT

Editor harus nyaman digunakan.

Untuk membuat:

- News
- Announcement
- Event
- Notification

Gunakan form yang jelas.

Preview sebelum publish.

Untuk notification:

Admin harus dapat memilih:

```text
All Students
Specific Class
Specific Grade
Specific Department
```

---

# 23. NOTIFICATION UX

Ketika admin mengirim informasi penting:

Student mendapatkan:

```text
Push Notification
```

Notification harus memiliki:

```text
Title
Message
Category
Priority
Target Audience
Schedule
```

Priority:

```text
Normal
Important
Urgent
```

Urgent notification menggunakan visual berbeda.

---

# 24. AI ASSISTANT

SSC memiliki satu AI Assistant yang dapat digunakan:

**PUBLIC USER + STUDENT + ADMIN**

AI tidak boleh terasa seperti chatbot generik.

Nama AI dapat ditentukan kemudian.

AI harus berfungsi sebagai assistant sekolah.

---

# 25. PUBLIC AI

AI membantu visitor:

```text
Apa itu SMKN 1 Cisarua?
Jurusan apa saja?
Bagaimana cara daftar?
Dimana lokasi sekolah?
Apa fasilitas sekolah?
Bagaimana menghubungi sekolah?
```

AI harus menjawab berdasarkan knowledge base resmi.

Jangan mengarang informasi.

Jika tidak tahu:

```text
Saya belum menemukan informasi tersebut.
Silakan hubungi pihak sekolah.
```

---

# 26. STUDENT AI

Student AI membantu:

```text
Cari berita
Cari jadwal
Cari event
Cari informasi sekolah
Cari laporan
Membantu navigasi aplikasi
```

Contoh:

```text
"Ada perubahan jadwal hari ini?"

"Acara apa minggu ini?"

"Dimana saya bisa melaporkan barang hilang?"

"Tampilkan berita terbaru."
```

AI harus dapat memberikan link/action ke halaman terkait.

---

# 27. ADMIN AI

Admin AI harus lebih powerful.

AI dapat membantu:

```text
Membuat draft pengumuman
Meringkas laporan
Mengelompokkan laporan
Menganalisis laporan
Mencari informasi
Membantu membuat berita
Meringkas berita
Mencari laporan tertentu
Menganalisis tren laporan
```

Contoh:

```text
"Ringkas semua laporan minggu ini."

"Kategori laporan apa yang paling banyak?"

"Buat draft pengumuman tentang perubahan jadwal."

"Tampilkan laporan fasilitas yang belum selesai."
```

AI tidak boleh melakukan tindakan berbahaya secara otomatis.

Untuk action penting:

```text
AI Suggestion
↓
Admin Review
↓
Confirm
↓
Execute
```

---

# 28. AI UI

Desktop:

Floating AI button di kanan bawah.

Mobile:

Floating button tetap accessible tetapi tidak mengganggu bottom navigation.

AI panel:

```text
Header
Conversation
Suggested Actions
Input
Send
```

Suggested prompts:

```text
Cari jadwal hari ini
Berita terbaru
Buat laporan
Acara minggu ini
Tanya AI
```

---

# 29. AI PERSONALITY

AI harus:

- sopan
- cepat
- jelas
- tidak terlalu formal
- tidak terlalu banyak bicara
- memahami bahasa Indonesia
- memahami bahasa natural siswa

Jangan menggunakan emoji berlebihan.

---

# 30. RESPONSIVE DESIGN

WAJIB mobile-first.

Target:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px+
```

Tidak boleh:

- horizontal overflow
- text keluar layar
- button terlalu kecil
- modal keluar viewport
- navbar rusak
- image gepeng
- card melebar tidak terkendali

Semua interaction harus dapat digunakan dengan touch.

---

# 31. MOBILE PRIORITY

Mobile bukan versi desktop yang diperkecil.

Mobile harus memiliki layout khusus.

Prioritas:

```text
Bottom Navigation
Quick Actions
Notification
Schedule
News
Events
AI
```

Touch target minimum:

```text
44 × 44px
```

---

# 32. ANIMATION

Animation harus subtle.

Gunakan:

- fade
- slide
- scale
- layout transition
- hover
- page transition

Duration:

```text
150–250ms
```

Large transition:

```text
300–500ms
```

Jangan menggunakan animasi berlebihan.

Respect:

```text
prefers-reduced-motion
```

---

# 33. MICRO INTERACTION

Gunakan micro interaction untuk:

- button
- notification
- status
- navigation
- form
- AI
- modal

Contoh:

Button:

```text
hover → slight lift
active → slight press
```

Notification:

```text
new → subtle highlight
read → normal
```

---

# 34. ICONOGRAPHY

Gunakan:

**Lucide Icons**

Jangan menggunakan emoji sebagai icon UI.

Icon harus konsisten.

Contoh:

```text
Bell
Calendar
Newspaper
MapPin
FileText
Search
User
Settings
AlertTriangle
MessageCircle
Bot
```

---

# 35. IMAGE SYSTEM

Image harus:

- responsive
- optimized
- lazy loaded
- tidak gepeng
- menggunakan object-fit yang sesuai

Untuk foto:

```text
object-fit: cover
```

Untuk dokumentasi:

gunakan aspect ratio yang sesuai dengan sumber.

Jangan memaksa semua image ke ratio yang sama jika menyebabkan crop penting.

---

# 36. ACCESSIBILITY

Wajib:

```text
Semantic HTML
ARIA labels
Keyboard navigation
Visible focus state
Alt text
Color contrast
Reduced motion
Accessible forms
Accessible modal
```

---

# 37. EMPTY STATES

Jangan menampilkan halaman kosong.

Contoh:

```text
Belum ada laporan

Belum ada berita

Belum ada acara

Belum ada notifikasi
```

Berikan explanation dan action jika diperlukan.

---

# 38. LOADING STATES

Gunakan skeleton.

Jangan membuat spinner besar di tengah layar untuk setiap loading.

Skeleton harus menyerupai layout sebenarnya.

---

# 39. ERROR STATES

Error harus human-friendly.

Jangan:

```text
Something went wrong.
```

Lebih baik:

```text
Data belum berhasil dimuat.

Coba lagi dalam beberapa saat.
```

Berikan tombol:

```text
Coba Lagi
```

---

# 40. DESIGN RULES

WAJIB:

- mobile-first
- clean hierarchy
- readable typography
- consistent spacing
- subtle animation
- premium appearance
- fast interaction
- accessible UI
- responsive layout

DILARANG:

- emoji sebagai UI icon
- gradient berlebihan
- glassmorphism berlebihan
- shadow berlebihan
- card berlebihan
- progress bar tidak diperlukan
- dashboard template generik
- horizontal overflow
- desktop-only design
- animasi tanpa tujuan
- informasi palsu

---

# 41. SOURCE OF TRUTH

Urutan sumber informasi:

```text
1. requirements.md
2. features.md
3. database.md
4. architecture.md
5. design.md
6. PHASES.md
```

Untuk UI/UX:

**design.md adalah SOURCE OF TRUTH.**

AI agent wajib membaca `design.md` sebelum melakukan perubahan UI.

Jika ada konflik antara implementasi lama dan `design.md`, ikuti `design.md`.

Jangan membuat design system baru tanpa alasan.

---

# 42. FINAL DESIGN GOAL

Ketika siswa membuka SSC, mereka harus merasa:

> "Ini aplikasi resmi sekolah saya, tapi dibuat seperti produk teknologi modern."

Bukan:

> "Ini website sekolah biasa."

SSC harus terlihat cukup profesional untuk digunakan sekolah secara nyata, tetapi tetap terasa modern dan nyaman bagi siswa.