 # SMKN 1 CISARUA CONNECT — DEVELOPMENT PHASES

> **IMPORTANT:** File ini adalah **source of truth development project**.  
> Setiap AI agent yang mengerjakan repository WAJIB membaca file ini sebelum coding.
>
> Jika berpindah akun, model, AI, atau session, agent berikutnya harus **melanjutkan dari kondisi repository saat ini**, bukan memulai project dari awal.

---

# 1. PROJECT IDENTITY

**Project:** SMKN 1 CISARUA CONNECT  
**Repository:** `Daffa-exp/smkn1cisarua-SSC-`

## Tujuan

Membangun platform digital sekolah yang benar-benar berguna untuk siswa, guru/staff, dan admin.

Platform harus menjadi pusat informasi sekolah yang dapat digunakan melalui:

- Desktop
- Laptop
- Tablet
- Smartphone
- PWA / installable web app

Konsep utama:

> **One platform for school information, communication, reporting, and student services.**

Platform bukan sekadar website informasi dan bukan sekadar CRUD.

---

# 2. CORE FEATURES

Platform direncanakan memiliki:

1. Authentication
2. Student Dashboard
3. Announcement
4. Schedule
5. Event
6. Push Notification
7. Incident Reporting
8. Lost & Found
9. Emergency Alert
10. Admin Dashboard
11. Analytics
12. AI Assistant
13. Activity Log
14. PWA
15. Responsive Mobile Experience

---

# 3. USER ROLES

## STUDENT

Student dapat:

- login
- melihat informasi sekolah
- melihat pengumuman
- melihat jadwal
- melihat event
- menerima notification
- menggunakan AI assistant
- membuat laporan
- melihat status laporan
- menggunakan Lost & Found
- menerima emergency alert

---

## TEACHER / STAFF

Teacher/Staff dapat:

- melihat informasi sekolah
- melihat pengumuman
- melihat jadwal
- melihat event
- menerima notification
- menangani laporan sesuai permission
- menggunakan fitur yang diberikan oleh admin

---

## ADMIN

Admin dapat:

- mengelola student
- mengelola announcement
- mengelola schedule
- mengelola event
- mengelola notification
- mengelola incident report
- mengelola Lost & Found
- menggunakan Admin AI
- melihat analytics
- melihat activity log

---

## SUPER ADMIN

Super Admin memiliki permission tertinggi.

Dapat:

- mengelola admin
- mengelola role
- mengelola permission
- emergency broadcast
- system management
- audit activity
- konfigurasi sistem

---

# 4. DEVELOPMENT RULES

AI WAJIB mengikuti aturan berikut.

## Jangan

- jangan mengarang data sekolah
- jangan mengarang fitur yang belum dibutuhkan
- jangan menghapus fitur existing tanpa alasan
- jangan melakukan rewrite besar tanpa alasan teknis
- jangan mengganti architecture sembarangan
- jangan merusak fitur existing
- jangan menggunakan `any` hanya untuk menghilangkan TypeScript error
- jangan menggunakan `@ts-ignore` untuk menutupi error
- jangan menyimpan API key di client
- jangan memasukkan secret ke repository
- jangan menganggap task selesai hanya karena code berhasil dibuat

## Wajib

- inspect repository sebelum coding
- pahami existing architecture
- gunakan TypeScript
- gunakan reusable components
- gunakan mobile-first
- pastikan responsive
- perhatikan accessibility
- perhatikan security
- gunakan loading state
- gunakan error state
- gunakan empty state
- lakukan verification
- update file ini setelah task selesai

---

# 5. DESIGN DIRECTION

UI harus terasa seperti **produk digital sekolah modern**, bukan template dashboard AI.

Karakter visual:

- modern
- clean
- professional
- premium
- elegant
- friendly
- mobile-first
- readable
- fast

Hindari:

- terlalu banyak gradient
- glassmorphism berlebihan
- card berlebihan
- animasi tanpa fungsi
- layout terlalu padat
- dashboard generik
- horizontal overflow
- desktop-first layout yang dipaksa ke mobile

---

# 6. TECH STACK

Stack utama yang direncanakan:

### Frontend

- Next.js
- React
- TypeScript

### Styling

- Tailwind CSS
- shadcn/ui

### Animation

- Framer Motion

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- Auth.js

### AI

- Google Gemini API

### Storage

- Cloudflare R2

### Notification

- Web Push / Firebase Cloud Messaging

### Deployment

- Vercel

> Jika repository ternyata sudah menggunakan teknologi berbeda, **inspect repository terlebih dahulu**. Jangan mengganti stack existing hanya karena daftar di atas.

---

# 7. PHASE 0 — REPOSITORY AUDIT

## Goal

Memahami kondisi repository sebelum development dilanjutkan.

### Tasks

- [ ] Inspect repository structure
- [ ] Inspect `package.json`
- [ ] Inspect existing routes
- [ ] Inspect existing components
- [ ] Inspect styling system
- [ ] Inspect environment configuration
- [ ] Inspect Prisma/database jika sudah ada
- [ ] Inspect authentication jika sudah ada
- [ ] Inspect existing UI
- [ ] Inspect existing features
- [ ] Identify completed features
- [ ] Identify incomplete features
- [ ] Identify bugs
- [ ] Identify technical debt
- [ ] Update PHASES.md berdasarkan kondisi repository sebenarnya

### Completion Criteria

Phase ini selesai jika agent sudah memahami:

- architecture
- existing features
- current UI
- database
- authentication
- dependencies
- current bugs
- development progress

**Jangan melakukan rewrite project pada phase ini.**

---

# 8. PHASE 1 — FOUNDATION

## Goal

Memastikan fondasi project stabil.

### Tasks

- [ ] Next.js configuration
- [ ] TypeScript configuration
- [ ] Tailwind configuration
- [ ] UI component system
- [ ] Environment configuration
- [ ] Database connection
- [ ] Prisma configuration
- [ ] Base layout
- [ ] Responsive layout
- [ ] Navigation
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Mobile navigation
- [ ] Accessibility foundation

### Verification

```bash
npm run build
```

Jika tersedia:

```bash
npm run lint
```

---

# 9. PHASE 2 — AUTHENTICATION

## Goal

Membangun sistem akun dan authorization.

### Tasks

- [ ] Auth.js setup
- [ ] Login
- [ ] Logout
- [ ] Session
- [ ] Protected routes
- [ ] Student role
- [ ] Teacher/Staff role
- [ ] Admin role
- [ ] Super Admin role
- [ ] Role authorization
- [ ] Permission checking
- [ ] User profile
- [ ] Unauthorized page
- [ ] Authentication testing

### Security

Authorization harus dilakukan di server.

Jangan hanya menyembunyikan tombol di frontend.

---

# 10. PHASE 3 — STUDENT APP

## Goal

Membangun pengalaman utama siswa.

### Student Dashboard

Menampilkan:

- greeting
- announcement terbaru
- jadwal hari ini
- event terdekat
- notification
- report status
- emergency alert

### Tasks

- [ ] Dashboard
- [ ] Announcement list
- [ ] Announcement detail
- [ ] Schedule
- [ ] Events
- [ ] Event detail
- [ ] Notification center
- [ ] Profile
- [ ] Mobile navigation
- [ ] Responsive optimization

---

# 11. PHASE 4 — ANNOUNCEMENT SYSTEM

## Goal

Membuat pusat pengumuman sekolah.

### Data

- title
- description
- category
- priority
- image jika diperlukan
- author
- publish date
- expiration date
- target audience

### Target Audience

- semua siswa
- kelas tertentu
- jurusan
- angkatan
- kelompok tertentu

### Tasks

- [ ] Announcement model
- [ ] CRUD
- [ ] Admin management
- [ ] Student display
- [ ] Detail page
- [ ] Category
- [ ] Priority
- [ ] Audience targeting
- [ ] Publish scheduling
- [ ] Expiration
- [ ] Notification integration

---

# 12. PHASE 5 — SCHEDULE SYSTEM

## Goal

Mengelola jadwal sekolah.

### Data

- subject
- teacher
- class
- room
- date
- start time
- end time

### Tasks

- [ ] Schedule model
- [ ] Admin CRUD
- [ ] Student schedule
- [ ] Today schedule
- [ ] Upcoming schedule
- [ ] Schedule changes
- [ ] Schedule notification

Jika jadwal berubah, siswa yang terdampak harus dapat menerima notification.

---

# 13. PHASE 6 — EVENT SYSTEM

## Goal

Membuat pusat event sekolah.

### Data

- title
- description
- date
- time
- location
- image
- organizer
- status

### Tasks

- [ ] Event model
- [ ] Event CRUD
- [ ] Event listing
- [ ] Event detail
- [ ] Upcoming event
- [ ] Event notification
- [ ] Mobile optimization

---

# 14. PHASE 7 — INCIDENT REPORTING

## Goal

Membuat sistem pelaporan digital.

Student dapat melaporkan:

- fasilitas rusak
- kebersihan
- keamanan
- IT
- lingkungan
- kehilangan
- bullying
- masalah lainnya

### Report Data

- title
- description
- category
- location
- photo
- timestamp
- reporter

### Status

```text
SUBMITTED
    ↓
REVIEWING
    ↓
VERIFIED
    ↓
IN_PROGRESS
    ↓
RESOLVED
```

### Tasks

- [ ] Report form
- [ ] Category
- [ ] Description
- [ ] Location
- [ ] Image upload
- [ ] Submit
- [ ] Report ID
- [ ] Student history
- [ ] Admin list
- [ ] Admin detail
- [ ] Status management
- [ ] Activity log
- [ ] Notification

---

# 15. PHASE 8 — LOST & FOUND

## Goal

Membantu siswa melaporkan barang hilang atau ditemukan.

### Lost Item

Student dapat melaporkan:

- nama barang
- kategori
- deskripsi
- foto
- lokasi
- tanggal

### Found Item

Student dapat melaporkan:

- nama barang
- kategori
- deskripsi
- foto
- lokasi ditemukan
- tanggal ditemukan

### Tasks

- [ ] Lost & Found model
- [ ] Lost item form
- [ ] Found item form
- [ ] Listing
- [ ] Search
- [ ] Filter
- [ ] Detail
- [ ] Admin moderation
- [ ] Notification

---

# 16. PHASE 9 — NOTIFICATION SYSTEM

## Goal

Membuat sistem komunikasi langsung ke perangkat.

Notification dapat berasal dari:

- announcement
- schedule change
- event
- incident report
- Lost & Found
- emergency
- system information

### Tasks

- [ ] Push subscription
- [ ] Permission request
- [ ] Service worker
- [ ] Notification backend
- [ ] Targeted notification
- [ ] Broadcast notification
- [ ] Notification history
- [ ] Read/unread state
- [ ] Mobile testing

---

# 17. PHASE 10 — EMERGENCY ALERT

## Goal

Menyediakan komunikasi darurat.

Emergency alert harus berbeda secara visual dari notification normal.

Contoh:

```text
EMERGENCY ALERT

Hindari area Workshop B
sampai pemberitahuan berikutnya.
```

### Tasks

- [ ] Emergency alert model
- [ ] Emergency UI
- [ ] Admin authorization
- [ ] Super Admin authorization
- [ ] Broadcast
- [ ] Push notification
- [ ] Alert history
- [ ] Audit log

### IMPORTANT

AI tidak boleh mengirim emergency alert sendiri.

Emergency action harus memerlukan authorization manusia.

---

# 18. PHASE 11 — ADMIN DASHBOARD

## Goal

Membangun command center sekolah.

### Sections

- Overview
- Reports
- Announcements
- Events
- Schedule
- Notifications
- Students
- Classes
- Lost & Found
- Analytics
- AI Assistant
- Activity Logs

### Tasks

- [ ] Dashboard shell
- [ ] Sidebar/navigation
- [ ] Overview metrics
- [ ] Management pages
- [ ] Search
- [ ] Filtering
- [ ] Pagination
- [ ] Permission system
- [ ] Responsive admin UI

---

# 19. PHASE 12 — AI ASSISTANT

## Goal

Membangun satu AI system yang dapat digunakan oleh public/student maupun admin.

AI menggunakan **context berbeda berdasarkan role**.

---

## Student AI

AI dapat membantu:

- mencari pengumuman
- mencari jadwal
- mencari event
- menjelaskan informasi sekolah
- menjelaskan cara membuat laporan
- membantu navigasi aplikasi

AI harus memprioritaskan data dari database.

Jika informasi tidak tersedia:

```text
Saya belum menemukan informasi tersebut di sistem.
```

AI tidak boleh mengarang informasi sekolah.

---

## Admin AI

AI dapat membantu:

- merangkum laporan
- mengelompokkan laporan
- mencari data
- menganalisis laporan
- membuat draft announcement
- membuat ringkasan analytics
- memberikan insight

Contoh:

```text
Ringkas laporan fasilitas minggu ini.
```

Output dapat berupa:

- jumlah laporan
- kategori terbanyak
- laporan priority tinggi
- unresolved reports
- insight

---

# 20. AI PERMISSION MODEL

AI harus mengetahui role user.

Contoh:

```text
STUDENT
    ↓
Student AI Context

ADMIN
    ↓
Admin AI Context

SUPER ADMIN
    ↓
Extended Admin Context
```

AI tidak boleh mengakses data di luar permission user.

---

# 21. AI SECURITY

AI tidak boleh:

- mengakses data tanpa permission
- membocorkan data pribadi
- membaca secret
- mengubah database secara bebas
- mengirim emergency alert
- mem-publish announcement tanpa approval
- menjalankan destructive action tanpa authorization

Untuk aksi penting:

```text
AI Recommendation
        ↓
Human Review
        ↓
Approval
        ↓
Action
```

---

# 22. PHASE 13 — PWA & MOBILE

## Goal

Aplikasi harus nyaman digunakan dari HP karena tidak semua siswa menggunakan laptop.

### Tasks

- [ ] PWA manifest
- [ ] Service worker
- [ ] Install prompt
- [ ] Mobile navigation
- [ ] Push notification
- [ ] Offline fallback
- [ ] Responsive layouts
- [ ] Touch interaction
- [ ] Mobile forms
- [ ] Mobile testing
- [ ] Android browser testing

### RULE

Tidak boleh ada:

- horizontal overflow
- text terpotong
- button terlalu kecil
- modal keluar layar
- table menghancurkan layout
- navigation tidak dapat digunakan di mobile

---

# 23. PHASE 14 — ANALYTICS

## Goal

Membantu admin memahami kondisi platform.

### Analytics

- jumlah laporan
- kategori laporan
- status laporan
- resolution time
- event engagement
- announcement engagement
- notification delivery
- notification interaction

AI dapat membantu memberikan insight dari data analytics.

---

# 24. PHASE 15 — SECURITY & TESTING

## Security

- [ ] Authentication review
- [ ] Authorization review
- [ ] Input validation
- [ ] File upload validation
- [ ] Rate limiting
- [ ] API security
- [ ] AI security
- [ ] Sensitive data protection
- [ ] XSS protection
- [ ] CSRF considerations
- [ ] Permission testing

## Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Authentication testing
- [ ] Role testing
- [ ] Mobile testing
- [ ] Notification testing
- [ ] AI testing

---

# 25. PHASE 16 — PRODUCTION

## Goal

Menyiapkan platform untuk deployment.

### Tasks

- [ ] Production environment
- [ ] Environment variables
- [ ] Database production
- [ ] Storage production
- [ ] Push notification production
- [ ] AI production
- [ ] Build verification
- [ ] Lighthouse review
- [ ] Performance optimization
- [ ] SEO
- [ ] PWA validation
- [ ] Vercel deployment
- [ ] Production smoke test
- [ ] Error monitoring

---

# 26. DEFINITION OF DONE

Task hanya boleh dianggap selesai jika:

- [ ] Code implemented
- [ ] Feature integrated
- [ ] Existing feature tidak rusak
- [ ] Desktop tested
- [ ] Mobile tested
- [ ] Loading state tersedia jika diperlukan
- [ ] Error state tersedia jika diperlukan
- [ ] Empty state tersedia jika diperlukan
- [ ] Accessibility diperhatikan
- [ ] TypeScript berhasil
- [ ] Lint berhasil jika tersedia
- [ ] Build berhasil
- [ ] PHASES.md diperbarui

---

# 27. AI AGENT STARTUP PROTOCOL

Setiap AI agent yang masuk ke project WAJIB melakukan urutan berikut.

## STEP 1 — READ

Baca:

```text
docs/PHASES.md
README.md
package.json
```

Kemudian baca file architecture/configuration yang tersedia.

Jika ada:

```text
prisma/schema.prisma
.env.example
```

juga periksa.

---

## STEP 2 — INSPECT REPOSITORY

Periksa:

```bash
git status
```

Kemudian inspect:

- folder
- routes
- components
- database
- API
- authentication
- dependencies
- existing features

---

## STEP 3 — DETERMINE REAL STATUS

Jangan percaya checklist secara buta.

Jika PHASES.md mengatakan:

```text
[ ] Authentication
```

tetapi repository ternyata sudah memiliki authentication yang berfungsi, agent harus:

1. memverifikasi implementation
2. menguji
3. memperbarui checklist

---

## STEP 4 — CONTINUE

Lanjutkan dari:

```text
CURRENT PHASE
CURRENT TASK
NEXT TASK
```

Jangan mengulang fitur yang sudah selesai.

---

## STEP 5 — VERIFY

Setelah perubahan:

```bash
npm run build
```

Jika tersedia:

```bash
npm run lint
npm test
```

Gunakan test yang relevan dengan perubahan.

---

## STEP 6 — UPDATE

Setelah selesai, update bagian:

```text
CURRENT STATUS
CURRENT TASK
NEXT TASK
LAST WORKED ON
COMPLETED
FILES CHANGED
KNOWN ISSUES
BUILD STATUS
```

---

# 28. HANDOFF PROTOCOL

Jika AI berhenti karena:

- usage limit
- account limit
- model limit
- session limit
- pindah AI
- pindah account

Agent berikutnya **tidak boleh meminta user menjelaskan project dari awal** sebelum membaca repository.

Agent berikutnya harus:

1. membaca PHASES.md
2. membaca CURRENT STATUS
3. membaca CURRENT TASK
4. membaca NEXT TASK
5. menjalankan `git status`
6. memeriksa perubahan terakhir
7. memeriksa implementation
8. melanjutkan development

---

# 29. HANDOFF TEMPLATE

Setiap AI yang selesai bekerja harus memperbarui bagian ini.

```text
LAST WORKED ON:
-

COMPLETED:
-

CURRENT PHASE:
-

CURRENT TASK:
-

NEXT TASK:
-

FILES CHANGED:
-

KNOWN ISSUES:
-

BUILD STATUS:
-

TEST STATUS:
-

IMPORTANT NOTES:
-
```

---

# 30. CURRENT PROJECT STATUS

> **Bagian ini HARUS selalu diperbarui oleh AI.**

## CURRENT PHASE

PHASE 0 — REPOSITORY AUDIT

## CURRENT TASK

Audit repository `smkn1cisarua-SSC-` dan tentukan kondisi implementation sebenarnya.

## NEXT TASK

Setelah audit:

1. update status phase
2. tandai fitur yang sudah selesai
3. tandai fitur yang belum selesai
4. identifikasi bug
5. tentukan task berikutnya
6. mulai implementation dari task pertama yang belum selesai

## LAST WORKED ON

Belum ditentukan.

## COMPLETED

Belum diaudit.

## FILES CHANGED

Belum ditentukan.

## KNOWN ISSUES

Belum diaudit.

## BUILD STATUS

Belum diverifikasi oleh agent yang membaca file ini.

## TEST STATUS

Belum diverifikasi.

---

# 31. FINAL INSTRUCTION TO AI

**DO NOT START BY CODING RANDOMLY.**

Urutannya harus:

```text
READ PHASES.md
      ↓
INSPECT REPOSITORY
      ↓
UNDERSTAND CURRENT STATE
      ↓
CHECK CURRENT TASK
      ↓
IMPLEMENT
      ↓
TEST
      ↓
BUILD
      ↓
FIX
      ↓
UPDATE PHASES.md
      ↓
HANDOFF
```

Jika project sudah memiliki implementation, **lanjutkan implementation tersebut**.

Jika terdapat bug, perbaiki root cause.

Jika terdapat architecture yang sudah berjalan, jangan menggantinya tanpa alasan.

Jika informasi tidak tersedia di repository atau dokumentasi, jangan mengarang.

**PHASES.md adalah project memory dan handoff contract antar AI agent.**

**CONTINUE FROM THE CURRENT STATE. DO NOT RESTART THE PROJECT.**