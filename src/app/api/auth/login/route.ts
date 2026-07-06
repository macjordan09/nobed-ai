import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, encodeSession, SESSION_COOKIE, type Session } from "@/lib/auth";
import type { Role } from "@/lib/rbac";

function redirectFor(role: Role): string {
  switch (role) {
    case "HOSPITAL_STAFF":
    case "HOSPITAL_ADMIN":
      return "/dashboard";
    case "AMBULANCE_DISPATCHER":
      return "/ambulance";
    case "REGIONAL_ADMIN":
    case "NATIONAL_ADMIN":
    case "SUPER_ADMIN":
    case "AUDITOR":
      return "/admin";
    default:
      return "/find-beds";
  }
}

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!user || user.passwordHash !== hashPassword(String(password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const session: Session = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    hospitalId: user.hospitalId,
    region: user.region,
    isVerified: user.isVerified,
  };

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      actorLabel: user.name,
      action: "LOGIN",
      entityType: "User",
      entityId: user.id,
      ipAddress: req.headers.get("x-forwarded-for") ?? "local",
    },
  });

  const res = NextResponse.json({ ok: true, redirect: redirectFor(user.role as Role) });
  res.cookies.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
