# FEATURES

## 1. Public

Public user tidak membutuhkan login.

### Public Pages

- Home
- News
- News Detail
- Events
- Event Detail
- School Information
- Contact
- Public AI

### Public AI

Public AI dapat membantu menjawab pertanyaan mengenai informasi sekolah yang tersedia di knowledge base.

AI tidak boleh mengarang informasi.

---

# 2. Authentication

Sistem authentication digunakan untuk membedakan:

- Student
- Admin

Fitur:

- Login
- Logout
- Session
- Protected routes
- Role-based access

---

# 3. Student Dashboard

Dashboard siswa menjadi pusat aktivitas.

Menampilkan:

- greeting
- notification penting
- jadwal hari ini
- event mendatang
- berita terbaru
- quick actions
- laporan terbaru

---

# 4. News

Admin dapat membuat dan mengelola berita.

Field minimal:

- title
- slug
- summary
- content
- cover image
- category
- author
- published status
- published date

Student/public dapat:

- melihat berita
- mencari berita
- membuka detail berita
- membaca berita

---

# 5. Announcement

Pengumuman digunakan untuk informasi yang membutuhkan perhatian siswa.

Admin dapat:

- membuat
- edit
- publish
- unpublish
- delete

Pengumuman dapat memiliki priority:

- normal
- important
- urgent

---

# 6. Schedule

Sistem jadwal sekolah.

Informasi:

- date
- start time
- end time
- subject
- teacher
- room
- class
- status

Status:

- normal
- changed
- cancelled

Perubahan jadwal harus terlihat jelas bagi siswa.

---

# 7. Events

Event dapat digunakan untuk:

- lomba
- seminar
- workshop
- upacara
- kegiatan sekolah
- ujian
- ekstrakurikuler
- kegiatan khusus

Data event:

- title
- description
- date
- time
- location
- organizer
- cover
- status

---

# 8. Report System

Siswa dapat membuat laporan.

Kategori:

- barang hilang
- barang ditemukan
- fasilitas rusak
- kebersihan
- keamanan
- bullying
- saran
- keluhan
- akademik
- teknologi
- lainnya

Report memiliki:

- title
- description
- category
- image
- location
- reporter
- created date
- status

Status:

- submitted
- reviewed
- in_progress
- resolved
- rejected

Siswa dapat melihat progress laporan.

---

# 9. Notification

Notification digunakan untuk informasi langsung.

Jenis:

- news
- announcement
- schedule
- event
- report
- security
- lost_found
- system

Target:

- semua siswa
- kelas tertentu
- tingkat tertentu
- jurusan tertentu
- user tertentu

Priority:

- normal
- important
- urgent

---

# 10. Student Profile

Data:

- name
- photo
- student ID
- class
- department
- email

Pengaturan:

- notification
- account
- privacy
- logout

---

# 11. Admin Dashboard

Admin dashboard memiliki:

- overview
- report management
- news management
- announcement management
- schedule management
- event management
- notification management
- user management
- media management
- AI assistant
- statistics

---

# 12. Admin Report Management

Admin dapat:

- melihat semua laporan
- filter
- search
- membuka detail
- mengubah status
- memberikan response
- melihat attachment
- mencatat resolution

---

# 13. Admin Content Management

Admin dapat mengelola:

- news
- announcement
- event
- schedule

Sebelum publish, content dapat dipreview.

---

# 14. AI Assistant

Satu AI assistant digunakan pada:

- public
- student
- admin

Kemampuan berbeda berdasarkan role.

Detail ada di `ai-system.md`.

---

# 15. PWA

Aplikasi harus dirancang agar dapat digunakan seperti aplikasi mobile.

Target:

- installable
- responsive
- mobile navigation
- offline fallback jika memungkinkan
- push notification

---

# 16. Search

Search digunakan untuk mencari:

- berita
- event
- pengumuman
- informasi sekolah
- laporan milik user

---

# 17. Accessibility

Wajib:

- keyboard navigation
- focus state
- semantic HTML
- aria label
- readable contrast
- reduced motion
- accessible form