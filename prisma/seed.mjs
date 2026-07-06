import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();
const hash = (s) => createHash("sha256").update(s).digest("hex");

// --- capacity colour logic (mirrors src/lib/status.ts) -------------------
function colourFromBeds(available, total) {
  const occ = total > 0 ? (total - available) / total : 1;
  if (available <= 0) return "full";
  if (available <= 5 || occ >= 0.7) return "limited";
  return "available";
}

// --- Ghana hospital seed data -------------------------------------------
// beds: [total, occupied] per type
const HOSPITALS = [
  {
    name: "Korle Bu Teaching Hospital", facilityType: "Teaching", ownershipType: "Public",
    region: "Greater Accra", district: "Ablekuma South", address: "Guggisberg Ave, Accra",
    latitude: 5.5366, longitude: -0.2271, emergencyContact: "0302674066", referralContact: "0302739371",
    ambulanceAccept: false, theatreAvailable: true,
    referralNotes: "Emergency unit at full capacity. Diverting non-critical cases.",
    beds: { emergency: [40, 40], icu: [25, 24], maternity: [60, 52], pediatric: [50, 45], isolation: [15, 12], general: [200, 188] },
  },
  {
    name: "37 Military Hospital", facilityType: "Teaching", ownershipType: "Public",
    region: "Greater Accra", district: "Ayawaso West", address: "Liberation Rd, Accra",
    latitude: 5.5853, longitude: -0.1869, emergencyContact: "0302776111", referralContact: "0302773906",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Accepting trauma and surgical referrals.",
    beds: { emergency: [30, 28], icu: [18, 16], maternity: [45, 38], pediatric: [40, 33], isolation: [10, 6], general: [180, 150] },
  },
  {
    name: "Greater Accra Regional Hospital (Ridge)", facilityType: "Regional", ownershipType: "Public",
    region: "Greater Accra", district: "Korle Klottey", address: "Castle Rd, Ridge, Accra",
    latitude: 5.5641, longitude: -0.1969, emergencyContact: "0302228382", referralContact: "0302228383",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "3 emergency beds open. ICU has 1 bed.",
    beds: { emergency: [24, 21], icu: [12, 11], maternity: [40, 30], pediatric: [35, 25], isolation: [8, 4], general: [150, 110] },
  },
  {
    name: "University of Ghana Medical Centre", facilityType: "Teaching", ownershipType: "Public",
    region: "Greater Accra", district: "Ayawaso West", address: "Legon, Accra",
    latitude: 5.6505, longitude: -0.1869, emergencyContact: "0303966000", referralContact: "0303966001",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Accepting emergency and surgical referrals.",
    beds: { emergency: [20, 9], icu: [10, 5], maternity: [30, 18], pediatric: [24, 12], isolation: [6, 2], general: [120, 80] },
  },
  {
    name: "Komfo Anokye Teaching Hospital", facilityType: "Teaching", ownershipType: "Public",
    region: "Ashanti", district: "Bantama", address: "Okomfo Anokye Rd, Kumasi",
    latitude: 6.6975, longitude: -1.6304, emergencyContact: "0322022301", referralContact: "0322083526",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "ICU near capacity. Emergency beds available.",
    beds: { emergency: [35, 27], icu: [20, 19], maternity: [55, 44], pediatric: [48, 40], isolation: [12, 8], general: [190, 160] },
  },
  {
    name: "Cape Coast Teaching Hospital", facilityType: "Teaching", ownershipType: "Public",
    region: "Central", district: "Cape Coast Metro", address: "Interberton Rd, Cape Coast",
    latitude: 5.1131, longitude: -1.2904, emergencyContact: "0332132440", referralContact: "0332132441",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Stable. Accepting all categories.",
    beds: { emergency: [22, 12], icu: [10, 6], maternity: [38, 22], pediatric: [30, 18], isolation: [8, 2], general: [140, 95] },
  },
  {
    name: "Tamale Teaching Hospital", facilityType: "Teaching", ownershipType: "Public",
    region: "Northern", district: "Tamale Metro", address: "Hospital Rd, Tamale",
    latitude: 9.4402, longitude: -0.8393, emergencyContact: "0372022454", referralContact: "0372022455",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Good capacity across wards.",
    beds: { emergency: [26, 14], icu: [12, 7], maternity: [42, 26], pediatric: [36, 20], isolation: [10, 3], general: [160, 100] },
  },
  {
    name: "Ho Teaching Hospital", facilityType: "Teaching", ownershipType: "Public",
    region: "Volta", district: "Ho Municipal", address: "Mawuli St, Ho",
    latitude: 6.6008, longitude: 0.4713, emergencyContact: "0362026923", referralContact: "0362026924",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Emergency moderate. ICU available.",
    beds: { emergency: [20, 15], icu: [8, 3], maternity: [32, 20], pediatric: [28, 16], isolation: [6, 2], general: [120, 80] },
  },
  {
    name: "Effia Nkwanta Regional Hospital", facilityType: "Regional", ownershipType: "Public",
    region: "Western", district: "Sekondi-Takoradi Metro", address: "Effia Nkwanta, Sekondi",
    latitude: 4.9234, longitude: -1.7603, emergencyContact: "0312046332", referralContact: "0312046333",
    ambulanceAccept: true, theatreAvailable: false,
    referralNotes: "Theatre under maintenance. Medical cases only.",
    beds: { emergency: [18, 16], icu: [6, 6], maternity: [30, 26], pediatric: [24, 21], isolation: [6, 4], general: [110, 96] },
  },
  {
    name: "Eastern Regional Hospital (Koforidua)", facilityType: "Regional", ownershipType: "Public",
    region: "Eastern", district: "New Juaben South", address: "Koforidua",
    latitude: 6.0941, longitude: -0.2591, emergencyContact: "0342022728", referralContact: "0342022729",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "1 emergency bed left.",
    beds: { emergency: [16, 15], icu: [6, 5], maternity: [28, 22], pediatric: [22, 17], isolation: [5, 2], general: [100, 78] },
  },
  {
    name: "Sunyani Regional Hospital", facilityType: "Regional", ownershipType: "Public",
    region: "Bono", district: "Sunyani Municipal", address: "Sunyani",
    latitude: 7.3349, longitude: -2.3268, emergencyContact: "0352027326", referralContact: "0352027327",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Beds available across wards.",
    beds: { emergency: [18, 8], icu: [6, 2], maternity: [26, 14], pediatric: [20, 10], isolation: [5, 1], general: [95, 60] },
  },
  {
    name: "Tema General Hospital", facilityType: "Municipal", ownershipType: "Public",
    region: "Greater Accra", district: "Tema Metro", address: "Hospital Rd, Tema",
    latitude: 5.6665, longitude: -0.0172, emergencyContact: "0303202383", referralContact: "0303202384",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "2 emergency beds. Maternity busy.",
    beds: { emergency: [20, 18], icu: [8, 7], maternity: [34, 32], pediatric: [26, 22], isolation: [6, 3], general: [120, 100] },
  },
  {
    name: "LEKMA Hospital", facilityType: "Municipal", ownershipType: "Public",
    region: "Greater Accra", district: "Ledzokuku", address: "Teshie-Nungua, Accra",
    latitude: 5.5872, longitude: -0.1086, emergencyContact: "0302717878", referralContact: null,
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Emergency stable.",
    beds: { emergency: [14, 6], icu: [4, 1], maternity: [22, 12], pediatric: [18, 9], isolation: [4, 1], general: [80, 50] },
  },
  {
    name: "Achimota Hospital", facilityType: "District", ownershipType: "Public",
    region: "Greater Accra", district: "Okaikwei North", address: "Achimota, Accra",
    latitude: 5.6151, longitude: -0.2281, emergencyContact: "0302401234", referralContact: null,
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Limited ICU.",
    beds: { emergency: [12, 9], icu: [3, 3], maternity: [20, 14], pediatric: [16, 10], isolation: [3, 1], general: [70, 48] },
  },
  {
    name: "Bolgatanga Regional Hospital", facilityType: "Regional", ownershipType: "Public",
    region: "Upper East", district: "Bolgatanga Municipal", address: "Bolgatanga",
    latitude: 10.7853, longitude: -0.8514, emergencyContact: "0382022380", referralContact: null,
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Good availability.",
    beds: { emergency: [16, 5], icu: [5, 1], maternity: [24, 12], pediatric: [18, 8], isolation: [5, 1], general: [90, 55] },
  },
  {
    name: "Wa Regional Hospital", facilityType: "Regional", ownershipType: "Public",
    region: "Upper West", district: "Wa Municipal", address: "Wa",
    latitude: 10.0601, longitude: -2.5057, emergencyContact: "0392022104", referralContact: null,
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Stable capacity.",
    beds: { emergency: [14, 4], icu: [4, 1], maternity: [22, 10], pediatric: [16, 7], isolation: [4, 1], general: [80, 46] },
  },
  {
    name: "Nyaho Medical Centre", facilityType: "Private", ownershipType: "Private",
    region: "Greater Accra", district: "Ayawaso West", address: "Airport Residential, Accra",
    latitude: 5.6075, longitude: -0.1789, emergencyContact: "0302610401", referralContact: "0302610402",
    ambulanceAccept: true, theatreAvailable: true,
    referralNotes: "Private. Confirm insurance before transfer.",
    beds: { emergency: [10, 4], icu: [6, 3], maternity: [16, 8], pediatric: [12, 5], isolation: [4, 1], general: [60, 35] },
  },
];

async function main() {
  console.log("Resetting data…");
  await prisma.referralEvent.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.smsLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.communityReport.deleteMany();
  await prisma.otpChallenge.deleteMany();
  await prisma.bedCapacity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hospital.deleteMany();

  const byName = {};
  const now = Date.now();
  let i = 0;
  for (const h of HOSPITALS) {
    const { beds, ...rest } = h;
    // Mix of verification states for a realistic data-trust picture:
    //   i%4==0 -> stale, else i%2==0 -> verified, else self-reported
    let lastUpdatedAt = new Date(now);
    let verifiedAt = null;
    if (i % 4 === 0) {
      lastUpdatedAt = new Date(now - 3 * 60 * 60 * 1000); // 3h ago => stale
    } else if (i % 2 === 0) {
      verifiedAt = new Date(now); // confirmed & fresh => verified
    }
    // Functional-capacity equipment. A few hospitals are deliberately equipment-
    // constrained (vents/oxygen below bed availability) to show "beds but no equip".
    const emAvail = beds.emergency[0] - beds.emergency[1];
    const icuAvail = beds.icu[0] - beds.icu[1];
    const matAvail = beds.maternity[0] - beds.maternity[1];
    const pedAvail = beds.pediatric[0] - beds.pediatric[1];
    let oxygenAvailable = emAvail + 8;
    let ventilatorsAvailable = icuAvail + 1;
    const incubatorsAvailable = Math.max(matAvail, pedAvail);
    if (i % 3 === 0) ventilatorsAvailable = 0; // ICU functionally full despite beds
    if (i % 5 === 0) oxygenAvailable = Math.max(0, emAvail - 2); // emergency equipment-bound

    i++;
    const hospital = await prisma.hospital.create({
      data: {
        ...rest, lastUpdatedAt, verifiedAt, verifiedBy: verifiedAt ? "Bed Manager" : null,
        oxygenAvailable, ventilatorsAvailable, incubatorsAvailable,
      },
    });
    byName[h.name] = hospital.id;

    for (const [bedType, [total, occupied]] of Object.entries(beds)) {
      const available = total - occupied;
      await prisma.bedCapacity.create({
        data: {
          hospitalId: hospital.id,
          bedType,
          totalBeds: total,
          occupiedBeds: occupied,
          availableBeds: available,
          statusColour: colourFromBeds(available, total),
        },
      });
    }
  }
  console.log(`Seeded ${HOSPITALS.length} hospitals.`);

  // --- demo users (one per role) ----------------------------------------
  const users = [
    { name: "Ama Public", email: "public@nobed.ai", phone: "+233200000001", password: "public123", role: "PUBLIC" },
    { name: "Kwame Mensah (Korle Bu)", email: "staff@korlebu.gov.gh", phone: "+233200000002", password: "staff123", role: "HOSPITAL_STAFF", hospital: "Korle Bu Teaching Hospital" },
    { name: "Akosua Boateng (Ridge)", email: "admin@ridge.gov.gh", phone: "+233200000003", password: "admin123", role: "HOSPITAL_ADMIN", hospital: "Greater Accra Regional Hospital (Ridge)" },
    { name: "Yaw Dispatch (NAS)", email: "dispatch@ambulance.gov.gh", phone: "+233200000004", password: "dispatch123", role: "AMBULANCE_DISPATCHER" },
    { name: "Efua Regional (GHS)", email: "regional@ghs.gov.gh", phone: "+233200000005", password: "regional123", role: "REGIONAL_ADMIN", region: "Greater Accra" },
    { name: "Kofi National (MoH)", email: "national@moh.gov.gh", phone: "+233200000006", password: "national123", role: "NATIONAL_ADMIN" },
    { name: "System Super Admin", email: "super@nobed.ai", phone: "+233200000007", password: "super123", role: "SUPER_ADMIN" },
    { name: "Audit Officer", email: "auditor@nobed.ai", phone: "+233200000008", password: "auditor123", role: "AUDITOR" },
  ];
  for (const u of users) {
    await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        phone: u.phone,
        passwordHash: hash(u.password),
        role: u.role,
        hospitalId: u.hospital ? byName[u.hospital] : null,
        region: u.region ?? null,
        isVerified: true,
        verifiedAt: new Date(),
      },
    });
  }

  // An UNVERIFIED staff member with a pending access request (verification demo)
  const nurse = await prisma.user.create({
    data: {
      name: "Nurse Adwoa (Tema)",
      email: "nurse@tema.gov.gh",
      phone: "+233200000009",
      passwordHash: hash("nurse123"),
      role: "HOSPITAL_STAFF",
      hospitalId: byName["Tema General Hospital"],
      isVerified: false,
    },
  });
  await prisma.verificationRequest.create({
    data: {
      userId: nurse.id,
      userName: nurse.name,
      email: nurse.email,
      hospitalId: byName["Tema General Hospital"],
      hospitalName: "Tema General Hospital",
      kind: "HOSPITAL_STAFF",
      status: "PENDING",
      note: "New emergency desk officer requesting capacity-update access.",
    },
  });
  console.log(`Seeded ${users.length + 1} demo users (1 pending verification).`);

  // Sample community reports (public verification of inputs)
  await prisma.communityReport.createMany({
    data: [
      {
        hospitalId: byName["Greater Accra Regional Hospital (Ridge)"],
        hospitalName: "Greater Accra Regional Hospital (Ridge)",
        reportType: "ACCURATE",
        reporterVerified: true,
        reporterPhone: "+233244111222",
        message: "Confirmed 3 emergency beds — matched the app.",
        status: "PENDING",
      },
      {
        hospitalId: byName["Korle Bu Teaching Hospital"],
        hospitalName: "Korle Bu Teaching Hospital",
        reportType: "NO_BED_DESPITE_GREEN",
        reporterVerified: false,
        message: "Turned away at the gate though status didn't look full.",
        status: "PENDING",
      },
    ],
  });
  console.log("Seeded community reports.");

  // --- sample referrals -------------------------------------------------
  const ref1 = await prisma.referral.create({
    data: {
      referralCode: "REF-2026-0001",
      patientReference: "ANON-7F3A2",
      patientAgeRange: "25-34", patientGender: "Female",
      emergencyType: "Road traffic accident", urgencyLevel: "Critical",
      requiredBedType: "emergency",
      bedReserved: true, reservedBedType: "emergency",
      currentLocation: "Kasoa, Central Region",
      referringFacilityId: byName["Cape Coast Teaching Hospital"],
      destinationFacilityId: byName["37 Military Hospital"],
      ambulanceStatus: "EnRoute", eta: "18 min",
      currentStatus: "Accepted",
      notes: "Polytrauma, needs trauma surgery. Theatre confirmed.",
      events: {
        create: [
          { eventType: "Submitted", message: "Referral submitted by Cape Coast ED." },
          { eventType: "Accepted", message: "37 Military accepted. Trauma team alerted." },
          { eventType: "InTransit", message: "NAS ambulance en route, ETA 18 min." },
        ],
      },
    },
  });

  await prisma.referral.create({
    data: {
      referralCode: "REF-2026-0002",
      patientReference: "ANON-9C1B8",
      patientAgeRange: "0-5", patientGender: "Male",
      emergencyType: "Severe malaria / convulsions", urgencyLevel: "Urgent",
      requiredBedType: "pediatric",
      currentLocation: "Madina, Accra",
      referringFacilityId: byName["LEKMA Hospital"],
      destinationFacilityId: byName["Greater Accra Regional Hospital (Ridge)"],
      ambulanceStatus: "Dispatched", eta: "25 min",
      currentStatus: "Submitted",
      notes: "Pediatric bed requested. Awaiting confirmation.",
      events: { create: [{ eventType: "Submitted", message: "Referral submitted, awaiting destination response." }] },
    },
  });
  console.log("Seeded sample referrals.");

  // --- sample SMS logs --------------------------------------------------
  await prisma.smsLog.createMany({
    data: [
      { phoneNumber: "+233244111222", command: "BED ACCRA", response: "Ridge: Limited, 3 beds. 37 Military: Limited, 2. Korle Bu: Full, none. Call 112.", status: "OK", direction: "outbound" },
      { phoneNumber: "+233244111222", command: "ICU KUMASI", response: "Komfo Anokye: Limited, 1 ICU bed. Call ahead 0322022301.", status: "OK", direction: "outbound" },
      { phoneNumber: "+233200000002", command: "UPDATE KORLEBU EMERGENCY 0 ICU 1", response: "Updated. Korle Bu emergency=0 (Full), icu=1.", status: "OK", direction: "outbound" },
      { phoneNumber: "+233555000999", command: "UPDATE RIDGE EMERGENCY 3", response: "Unauthorized sender. Number not registered to a hospital.", status: "UNAUTHORIZED", direction: "outbound" },
    ],
  });
  console.log("Seeded SMS logs.");

  // --- audit logs -------------------------------------------------------
  await prisma.auditLog.createMany({
    data: [
      { actorLabel: "Kwame Mensah (Korle Bu)", action: "UPDATE_CAPACITY", entityType: "BedCapacity", entityId: byName["Korle Bu Teaching Hospital"], newValue: "emergency=0", ipAddress: "41.66.x.x" },
      { actorLabel: "37 Military ED", action: "ACCEPT_REFERRAL", entityType: "Referral", entityId: ref1.id, newValue: "Accepted", ipAddress: "41.66.x.x" },
      { actorLabel: "System Super Admin", action: "LOGIN", entityType: "User", ipAddress: "154.160.x.x" },
    ],
  });
  console.log("Seeded audit logs.");
  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
