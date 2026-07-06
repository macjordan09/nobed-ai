import { createHash } from "crypto";
import { prisma } from "./prisma";

// One-time passcode service.
// MVP: the code is returned in the API response (devCode) so the demo works
// without a live SMS gateway. In production, `requestOtp` hands the code to the
// SMS/email provider and NEVER returns it to the client.

const TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

const hashCode = (code: string) => createHash("sha256").update(code).digest("hex");

export async function requestOtp(target: string, channel = "phone", purpose = "report") {
  const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  await prisma.otpChallenge.create({
    data: {
      channel,
      target,
      purpose,
      codeHash: hashCode(code),
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });
  // In production this would be sent via the provider, not returned.
  const devCode = process.env.NODE_ENV === "production" ? undefined : code;
  return { ok: true, devCode };
}

export async function verifyOtp(target: string, code: string, purpose = "report") {
  const challenge = await prisma.otpChallenge.findFirst({
    where: { target, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!challenge) return { ok: false, reason: "No active code. Request a new one." };
  if (challenge.expiresAt.getTime() < Date.now()) return { ok: false, reason: "Code expired." };
  if (challenge.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "Too many attempts." };

  if (challenge.codeHash !== hashCode(code)) {
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: "Incorrect code." };
  }

  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });
  return { ok: true };
}
