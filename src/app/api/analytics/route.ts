import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { getAnalytics } from "@/lib/analytics";

export async function GET() {
  const session = getSession();
  if (!session || !can(session.role, "view_analytics")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(await getAnalytics());
}
