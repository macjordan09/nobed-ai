import { prisma } from "./prisma";

// Push notifications via the Expo Push API. In the MVP, capacity-critical and
// referral alerts broadcast to all registered devices. Production would target
// by role/region/hospital (e.g. referral alerts only to the destination hospital).

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default";
  priority?: "high";
}

function isExpoToken(t: string) {
  return t.startsWith("ExponentPushToken[") || t.startsWith("ExpoPushToken[");
}

async function send(messages: PushMessage[]) {
  if (!messages.length) return;
  // Expo accepts up to 100 messages per request.
  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100);
    try {
      await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(chunk),
      });
    } catch (e) {
      console.warn("Expo push send failed:", (e as Error).message);
    }
  }
}

export async function broadcast(payload: { title: string; body: string; data?: Record<string, unknown> }) {
  const tokens = await prisma.pushToken.findMany();
  const valid = tokens.filter((t) => isExpoToken(t.token));
  if (!valid.length) return { sent: 0 };
  await send(
    valid.map((t) => ({
      to: t.token,
      sound: "default",
      priority: "high",
      title: payload.title,
      body: payload.body,
      data: payload.data,
    })),
  );
  return { sent: valid.length };
}

export function notifyCapacityCritical(hospitalName: string, hospitalId: string) {
  return broadcast({
    title: "🔴 Capacity critical",
    body: `${hospitalName} is now FULL / not accepting emergencies.`,
    data: { type: "capacity_red", hospitalId },
  });
}

export function notifyNewReferral(opts: {
  referralCode: string;
  destinationName: string;
  urgency: string;
  referralId: string;
}) {
  return broadcast({
    title: `🚑 New referral · ${opts.urgency}`,
    body: `${opts.referralCode} incoming to ${opts.destinationName}.`,
    data: { type: "referral", referralId: opts.referralId },
  });
}
