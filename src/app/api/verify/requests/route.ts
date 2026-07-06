import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";

// Staff account-access requests — visible to anyone who can view analytics.
export async function GET() {
  const session = getSession();
  if (!session || !can(session.role, "view_analytics")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const requests = await prisma.verificationRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ count: requests.length, requests });
}
