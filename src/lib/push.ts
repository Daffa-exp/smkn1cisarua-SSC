import webpush from 'web-push';
import { db } from '@/lib/db';

// ---------------------------------------------------------------------------
// VAPID setup
// ---------------------------------------------------------------------------
// NEXT_PUBLIC_VAPID_PUBLIC_KEY -> safe to expose to the browser (used by the
//   client to call PushManager.subscribe()).
// VAPID_PRIVATE_KEY            -> server only, NEVER sent to the client.
// VAPID_SUBJECT                -> mailto: or https: contact required by the
//   Web Push protocol.
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@smkn1cisarua-ssc.sch.id';

let vapidConfigured = false;

function ensureVapidConfigured() {
  if (vapidConfigured) return true;

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    // Don't throw — a missing VAPID config shouldn't break the in-app
    // notification flow, it should just skip the real push step.
    console.error(
      '[push] VAPID keys are not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.'
    );
    return false;
  }

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  vapidConfigured = true;
  return true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  notificationId?: string;
}

export interface PushSubscriptionRecord {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const BATCH_SIZE = 25; // concurrent sends per batch, to avoid one slow/blocking request pile-up

/**
 * Send a real Web Push notification to every subscribed device belonging to
 * the given user IDs. Safe to call even if some/all users have no
 * subscription (they simply get skipped) or if VAPID isn't configured yet.
 *
 * - Never throws: a failure here must not break the underlying feature
 *   (announcements, events, schedule, etc.) that triggered it.
 * - Invalid subscriptions (410 Gone / 404 Not Found) are removed from the DB.
 * - Sends are batched so one broadcast to hundreds of students doesn't block
 *   the request for an unbounded amount of time.
 */
export async function sendPushToUsers(userIds: string[], payload: PushPayload): Promise<void> {
  try {
    if (!userIds || userIds.length === 0) return;
    if (!ensureVapidConfigured()) return;

    const subscriptions: PushSubscriptionRecord[] = await db.pushSubscription.findMany({
      where: { userId: { in: userIds } },
    });

    if (subscriptions.length === 0) return;

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || '/notifications',
      notificationId: payload.notificationId,
    });

    const staleEndpoints: string[] = [];

    for (let i = 0; i < subscriptions.length; i += BATCH_SIZE) {
      const batch = subscriptions.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((sub) =>
          webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            notificationPayload
          )
        )
      );

      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          const statusCode = result.reason?.statusCode;
          if (statusCode === 404 || statusCode === 410) {
            staleEndpoints.push(batch[idx].endpoint);
          } else {
            console.error('[push] send failed:', statusCode || result.reason);
          }
        }
      });
    }

    // Clean up subscriptions the push service told us are gone. A single bad
    // subscription must never stop the rest of the broadcast from going out.
    if (staleEndpoints.length > 0) {
      await db.pushSubscription
        .deleteMany({ where: { endpoint: { in: staleEndpoints } } })
        .catch((err: unknown) => console.error('[push] failed to clean up stale subscriptions:', err));
    }
  } catch (error) {
    console.error('[push] sendPushToUsers error:', error);
  }
}

/** Convenience helper: send push to every user matching a role filter (or all users). */
export async function sendPushToRole(
  role: 'ALL' | 'STUDENT' | 'TEACHER' | string,
  payload: PushPayload
): Promise<void> {
  const where = role && role !== 'ALL' ? { role } : {};
  const users = await db.user.findMany({ where, select: { id: true } });
  await sendPushToUsers(
    users.map((u) => u.id),
    payload
  );
}
