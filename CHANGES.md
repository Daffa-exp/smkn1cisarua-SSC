# SSC Premium Upgrade — Batch 2: Foundation Layer

## Reality check first
The master prompt is a 30-phase full redesign (design tokens, dark mode, editorial dashboard,
digital ID card, streaming AI, cursor effects, pull-to-refresh, toast/modal systems, 9-breakpoint
QA...). That's genuinely multi-session work, and I still don't have a browser here to verify Phase 2's
9 breakpoints or actually look at the result. Rather than sprinkling shallow changes across all 30
phases and risking Phase 29 ("don't break existing features") without being able to check, I built the
**foundation everything else depends on** this round, verified it compiles clean, and I'm laying out
exactly what's left so you (or a live Claude Code session) can move through the rest with a real
browser in the loop.

## What shipped this batch

**Design tokens (Phase 1)** — `tailwind.config.ts` + `globals.css`
- `darkMode: 'class'` strategy enabled.
- Semantic color tokens (`surface`, `surface-raised`, `surface-sunken`, `border`, `border-subtle`,
  `status-success/warning/danger/info`) that read from CSS variables — same class works in both themes.
- Token scale for radius (`rounded-card`, `rounded-control`) and shadow (`shadow-xs/card/raised/modal`)
  so new components stop reinventing ad-hoc values.

**Dark mode infrastructure (Phase 21)**
- `ThemeProvider.tsx` — no new dependency, `localStorage`-persisted, respects system preference on
  first load, toggles a `.dark` class on `<html>`.
- `ThemeInitScript` — inline script in `<head>` that sets the class *before* React hydrates, so there's
  no flash-of-wrong-theme (same technique `next-themes` uses).
- `ThemeToggle.tsx` — sun/moon button, wired into the Header.
- Applied dark variants to the **global chrome**: Header (with new scroll-elevation treatment per
  Phase 7), Sidebar, BottomNav, AppShell background, body. This is the proof-of-infrastructure layer —
  individual page content (dashboard cards, forms, tables) still needs the same `dark:` pass, listed below.

**Toast system (Phase 20)** — `ToastProvider.tsx`
- Didn't exist before. `useToast()` hook, 4 variants, spring enter / slide-out exit, auto-dismiss,
  `aria-live` region, dark-mode aware. Purely additive — nothing calls it yet, so zero risk to existing
  flows. Next step is swapping the ad-hoc inline error banners in the form modals over to it.

**Modal system (Phase 19)**
- Found a real bug: `ConfirmLogoutModal` used `animate-in fade-in zoom-in-95` classes from the
  `tailwindcss-animate` plugin — **which was never installed or registered in the Tailwind config**, so
  that entrance animation has been silently doing nothing. Built `Modal.tsx`: portal-rendered,
  framer-motion enter/exit (project already depends on framer-motion, so no new install), real focus
  trap, ESC-to-close, backdrop click, safe-area bottom padding, `role="dialog"` + `aria-modal`.
  Refactored `ConfirmLogoutModal` onto it as the reference pattern.

## Verified
`npx next build` → exits 0, all 43 routes compile. Same pre-existing Prisma binary-target warning as
before (Windows-generated client vs. this Linux sandbox — resolves itself via `prisma generate` in your
real environment, unrelated to any UI change).

## Honest roadmap for what's left, in priority order

**Next up (high value, mechanical, low risk):**
1. Apply the same `dark:` pass to page content — dashboard cards, announcement/report/schedule pages,
   forms, admin tables. Mechanical once the token system exists, but it's ~15 files and needs visual
   verification per page, hence not rushed here blind.
2. Wire the 5 other form modals (`AnnouncementFormModal`, `EventFormModal`, `ReportFormModal`,
   `ScheduleFormModal`, `LostFoundFormModal`) onto the new `Modal` primitive instead of their own
   backdrop/close logic — removes duplicated code and gets them focus-trap + ESC for free.
3. Route the existing inline error/success messages in those same forms through `useToast()`.

**Needs a live browser to do well (Phases 2, 4, 10-12, 28):**
4. Editorial dashboard restructure, announcement-detail redesign, report timeline, profile digital-ID
   card — all visual-hierarchy work that needs to be seen to be judged, not coded blind.
5. 9-breakpoint responsive audit — genuinely needs a real viewport, not a guess.

**Bigger architectural calls worth a deliberate decision, not a silent change:**
6. AI Assistant as a floating widget (Phase 13/AI UI) — right now it's a full page (`/ai`), not a
   floating panel. Converting it means persisting chat state across route changes and re-solving
   z-index against the bottom nav. Real work, real risk to a working feature — flagging again rather
   than guessing at it.
7. Streaming AI responses (Phase 14) — depends on whether `src/lib/gemini.ts` / `/api/ai/chat` actually
   supports streaming server-side; haven't touched the AI backend, so this needs that check first.
8. Cursor glow / ambient background effects (Phases 22-23) — lowest priority per your own stated
   priority order (animation/decoration ranked last), and easiest to overdo into exactly the "AI
   generator" look the brief explicitly warns against.

If you want, tell me which of the "next up" items to do now and I'll keep going in this same
verify-as-I-go style — or if you can get this running in **Claude Code** locally, I can drive the rest
with an actual browser open, which is where Phases 2, 4, 10-12, and 28 really belong.
