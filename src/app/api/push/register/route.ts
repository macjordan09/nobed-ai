import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mobile app registers its Expo push token here.
export async function POST(req: Request) {
  const { token, platform } = await req.json().catch(() => ({}));
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }
  await prisma.pushToken.upsert({
    where: { token },
    update: { platform: platform ?? "unknown" },
    create: { token, platform: platform ?? "unknown" },
  });
  return NextResponse.json({ ok: true });
}
