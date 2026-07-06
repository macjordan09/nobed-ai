import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { Role } from "./rbac";

// ---------------------------------------------------------------------------
// MOCK AUTH for the MVP demo.
// Sessions are signed (HMAC-SHA256) cookies — enough to demonstrate RBAC and
// audit trails. Production swaps this for Supabase Auth / Clerk with MFA + OTP
// (see SECURITY.md). Do not ship this implementation to production.
// ---------------------------------------------------------------------------

export const SESSION_COOKIE = "nobed_session";
const SECRET = process.env.AUTH_SECRET || "dev-secret";

export interface Session {
  userId: string;
  name: string;
  email: string;
  role: Role;
  hospitalId: string | null;
  region: string | null;
  isVerified: boolean;
}

export function hashPassword(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function encodeSession(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
}

/** Read the current session in a Server Component or Route Handler. */
export function getSession(): Session | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return decodeSession(token);
}
