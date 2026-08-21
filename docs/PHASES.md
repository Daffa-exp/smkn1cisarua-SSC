# SMKN 1 CISARUA CONNECT — DEVELOPMENT PHASES

> **IMPORTANT:** File ini adalah **source of truth development project**.  
> Setiap AI agent yang mengerjakan repository WAJIB membaca file ini sebelum coding.
>
> Jika berpindah akun, model, AI, atau session, agent berikutnya harus **melanjutkan dari kondisi repository saat ini**, bukan memulai project dari awal.

---

# 1. PROJECT IDENTITY

**Project:** SMKN 1 CISARUA CONNECT  
**Repository:** `Daffa-exp/smkn1cisarua-SSC`

## Tujuan

Membangun platform digital sekolah yang benar-benar berguna untuk siswa, guru/staff, dan admin.

Platform dapat digunakan melalui:

- Desktop
- Laptop
- Tablet
- Smartphone
- PWA / installable web app (Google Chrome)

Konsep utama:

> **One platform for school information, communication, reporting, and student services.**

---

# 2. CORE FEATURES & IMPLEMENTATION STATUS

1. **Authentication & Security** ✅ — JWT Cookie (`ssc_auth_token`), Edge Middleware role protection, NIS & Email login support, forced password change on first login.
2. **Student Dashboard & Dynamic Welcome Banner** ✅ — Real-time clock, time-of-day greeting (Pagi, Siang, Sore, Malam) with period scenery backgrounds (`/public/img_time/`).
3. **Announcement System** ✅ — CRUD API, photo banner presets & device file uploads, link Pendaftaran/Lomba (`linkUrl`), auto-publish from events.
4. **Schedule System** ✅ — KBM schedule manager, CSV Export (`/api/schedule/export`) & CSV Bulk Import (`/api/schedule/import`).
5. **Event System** ✅ — Agenda events with responsive landscape/portrait photo banners, link Pendaftaran/Lomba, and auto-publishing to Announcement Board.
6. **Incident Reporting** ✅ — Facility report tracker (`SUBMITTED` -> `RESOLVED`), status timeline, photo proof upload from device/URL, admin response.
7. **Lost & Found** ✅ — Items lost/found feed, status toggle (`isResolved`), search bar, device photo upload.
8. **Notification & Web Push** ✅ — Service Worker (`public/sw.js`), push notification handler, broadcast API, unread count badge.
9. **Emergency Alert** ✅ — High-visibility pulsing red/amber banner, human-authorized control panel.
10. **Admin Command Center** ✅ — Live metrics API (`/api/admin/metrics`), student & user management per class (`/api/admin/students/bulk`).
11. **Admin Analytics Dashboard** ✅ — Aggregated metrics & percentage distribution charts (`/admin/analytics`).
12. **AI Assistant (Google Gemini)** ✅ — Gemini API integration (`@google/generative-ai`), fallback models (`gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`), role-aware system prompts (Student, Teacher, Admin, Super Admin), typing indicator, error handling.
13. **PWA & Mobile Ready** ✅ — Web App Manifest (`public/manifest.json`), icons (192x192, 512x512 maskable), Service Worker caching static assets, offline fallback state, standalone Chrome installability.
14. **Production Build Validation** ✅ — Next.js 14 production build compiled 44 static & dynamic pages cleanly without errors.

---

# 3. ENVIRONMENT VARIABLES FOR VERCEL DEPLOYMENT

Configure the following environment variables in Vercel Dashboard (**Settings -> Environment Variables**):

```text
GEMINI_API_KEY=AIzaSy... (Server-side Google Gemini API Key)
DATABASE_URL="file:./dev.db" (or PostgreSQL connection string in production)
NEXTAUTH_SECRET="dev-secret-smkn1cisarua-connect"
NEXTAUTH_URL="https://your-vercel-deployment-url.vercel.app"
```

---

# 4. DEFINITION OF DONE

- [x] Code implemented & verified
- [x] Gemini AI Assistant fixed with model fallbacks & server-side API key handling
- [x] PWA manifest & Service Worker caching verified
- [x] Production build validation passed (`npm run build` compiled 44 routes cleanly)
- [x] PHASES.md updated
