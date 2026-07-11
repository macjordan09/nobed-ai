import { prisma } from "./prisma";
import { getHospitalViews } from "./hospitals";
import { colourFromBeds } from "./status";
import { can } from "./rbac";

// SMS short-code interpreter. Production swaps the transport for Africa's
// Talking / Hubtel / Arkesel webhooks; the parsing + verification logic here
// stays the same. English only for the MVP (Twi/Ga/Ewe planned).

export interface SmsResult {
  response: string;
  status: "OK" | "UNAUTHORIZED" | "ERROR";
}

const TITLE = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

function matchHospitals(views: Awaited<ReturnType<typeof getHospitalViews>>, place: string) {
  const q = place.trim().toLowerCase();
  if (!q) return views;
  const hits = views.filter(
    (h) =>
      h.region.toLowerCase().includes(q) ||
      h.district.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.name.toLowerCase().includes(q),
  );
  return hits.length ? hits : views; // fall back to national list
}

export async function processSms(rawPhone: string, rawCommand: string): Promise<SmsResult> {
  const phone = rawPhone.trim();
  const command = rawCommand.trim().replace(/\s+/g, " ");
  const parts = command.split(" ");
  const verb = (parts[0] || "").toUpperCase();

  if (verb === "HELP" || !verb) {
    return {
      status: "OK",
      response:
        "NoBed.ai commands: BED <city> | ICU <city> | UPDATE <hospital> EMERGENCY n ICU n. In an emergency call 112.",
    };
  }

  // --- Public / dispatcher queries: BED <city>, ICU <city> ---------------
  if (verb === "BED" || verb === "ICU") {
    const place = parts.slice(1).join(" ");
    const views = await getHospitalViews();
    const wantIcu = verb === "ICU";
    const candidates = matchHospitals(views, place)
      .map((h) => ({
        h,
        avail: wantIcu ? h.icuAvailable : h.emergencyAvailable,
        status: wantIcu
          ? h.beds.icu?.status ?? "full"
          : h.status,
      }))
      .sort((a, b) => b.avail - a.avail)
      .slice(0, 3);

    if (!candidates.length) {
      return { status: "OK", response: `No registered facilities found for "${place}". Call 112.` };
    }
    const label = wantIcu ? "ICU" : "emergency";
    const lines = candidates.map((c) => {
      const colour = TITLE(c.status);
      const beds = c.avail === 0 ? "no beds" : `${c.avail} ${c.avail === 1 ? "bed" : "beds"}`;
      return `${c.h.name.replace(/ \(.*\)/, "")}: ${colour}, ${beds}`;
    });
    return {
      status: "OK",
      response: `Nearest facilities with ${label} availability: ${lines.join("; ")}. Call 112 for ambulance.`,
    };
  }

  // --- Hospital update: UPDATE <hospital> EMERGENCY 3 ICU 1 MATERNITY 4 ---
  if (verb === "UPDATE") {
    // Verify sender is a registered hospital user with update rights.
    const user = await prisma.user.findFirst({ where: { phone }, include: { hospital: true } });
    if (!user || !user.hospitalId || !can(user.role, "update_capacity")) {
      return {
        status: "UNAUTHORIZED",
        response: "Unauthorized sender. Number not registered to a hospital with update rights.",
      };
    }

    // tokens after UPDATE: <hospitalKey...> then pairs of TYPE n
    const rest = parts.slice(1);
    const firstNumIdx = rest.findIndex((t) => /^\d+$/.test(t));
    // the bed type keyword immediately precedes the first number
    const typeStart = rest.findIndex((t) => BED_KEYS.includes(t.toUpperCase()));
    if (typeStart < 0 || firstNumIdx < 0) {
      return { status: "ERROR", response: "Format: UPDATE <hospital> EMERGENCY n ICU n" };
    }
    const pairs = rest.slice(typeStart);

    const updates: { bedType: string; available: number }[] = [];
    for (let i = 0; i < pairs.length - 1; i += 2) {
      const key = pairs[i].toUpperCase();
      const n = parseInt(pairs[i + 1], 10);
      if (BED_KEYS.includes(key) && !Number.isNaN(n)) {
        updates.push({ bedType: key.toLowerCase(), available: n });
      }
    }
    if (!updates.length) {
      return { status: "ERROR", response: "No valid bed updates found. Try: UPDATE <hospital> EMERGENCY 3" };
    }

    const applied: string[] = [];
    for (const u of updates) {
      const bed = await prisma.bedCapacity.findUnique({
        where: { hospitalId_bedType: { hospitalId: user.hospitalId, bedType: u.bedType } },
      });
      if (!bed) continue;
      const available = Math.min(Math.max(0, u.available), bed.totalBeds);
      const occupied = bed.totalBeds - available;
      await prisma.bedCapacity.update({
        where: { id: bed.id },
        data: {
          availableBeds: available,
          occupiedBeds: occupied,
          statusColour: colourFromBeds(available, bed.totalBeds),
          lastUpdatedBy: user.id,
          lastUpdatedAt: new Date(),
        },
      });
      applied.push(`${u.bedType}=${available}`);
    }
    await prisma.hospital.update({ where: { id: user.hospitalId }, data: { lastUpdatedAt: new Date() } });
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        actorLabel: `${user.name} (SMS)`,
        action: "UPDATE_CAPACITY_SMS",
        entityType: "Hospital",
        entityId: user.hospitalId,
        newValue: applied.join(", "),
      },
    });

    return {
      status: "OK",
      response: `Updated ${user.hospital?.name}: ${applied.join(", ")}. Thank you.`,
    };
  }

  return { status: "ERROR", response: "Unknown command. Send HELP for options." };
}

const BED_KEYS = ["EMERGENCY", "ICU", "MATERNITY", "PEDIATRIC", "ISOLATION", "GENERAL"];

/** Process + persist an SMS exchange in one call. */
export async function handleSms(phone: string, command: string, userId?: string) {
  const result = await processSms(phone, command);
  await prisma.smsLog.create({
    data: {
      phoneNumber: phone,
      command,
      response: result.response,
      status: result.status,
      direction: "outbound",
      userId: userId ?? null,
    },
  });
  return result;
}
