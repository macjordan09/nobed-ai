# Database

The MVP uses **SQLite** via **Prisma** so it runs with no external services. The schema is
written to map cleanly onto **PostgreSQL + PostGIS** for production. Source of truth:
[`prisma/schema.prisma`](../prisma/schema.prisma).

## Tables

### `User`
Platform users with role-based access.

| Column | Type | Notes |
|--------|------|-------|
| id | string (cuid) | PK |
| name | string | |
| email | string | unique |
| phone | string? | unique; used for SMS sender verification |
| passwordHash | string | sha256 in MVP → **argon2/bcrypt + MFA** in prod |
| role | string | one of 8 roles (see SECURITY.md) |
| hospitalId | string? | FK → Hospital (for hospital staff) |
| region | string? | for regional admins |
| isVerified | bool | |
| lastLogin | datetime? | login audit |
| createdAt | datetime | |

### `Hospital`
Facilities shown on the map.

| Column | Type | Notes |
|--------|------|-------|
| id | string | PK |
| name | string | |
| facilityType | string | Teaching, Regional, Municipal, District, Polyclinic, Private |
| ownershipType | string | Public, Private, Mission/CHAG |
| region, district, address | string | |
| latitude, longitude | float | → `geography(Point,4326)` in PostGIS |
| emergencyContact, referralContact | string | |
| ambulanceAccept | bool | drives red override when false |
| theatreAvailable, staffAvailable | bool | |
| referralNotes | string? | |
| activeStatus | bool | soft-delete / deactivate |
| lastUpdatedAt, createdAt | datetime | |

### `BedCapacity`
One row per `(hospital, bedType)`. Unique on `[hospitalId, bedType]`.

| Column | Type | Notes |
|--------|------|-------|
| id | string | PK |
| hospitalId | string | FK → Hospital (cascade delete) |
| bedType | string | emergency, icu, maternity, pediatric, isolation, general |
| totalBeds, occupiedBeds, availableBeds | int | available is derived & stored |
| statusColour | string | red/amber/yellow/green, recomputed on write |
| lastUpdatedBy | string? | FK → User |
| lastUpdatedAt | datetime | |

### `Referral`
Emergency referrals. **No identifiable patient data** — `patientReference` is anonymized.

| Column | Type | Notes |
|--------|------|-------|
| id | string | PK |
| referralCode | string | unique, human-readable (REF-YYYY-NNNN) |
| patientReference | string | anonymized id |
| patientAgeRange, patientGender | string | non-identifying |
| emergencyType | string | |
| urgencyLevel | string | Critical, Urgent, Stable |
| requiredBedType | string | |
| currentLocation | string? | |
| referringFacilityId, destinationFacilityId | string? | FK → Hospital |
| ambulanceStatus | string? | Dispatched, EnRoute, Arrived, None |
| eta | string? | |
| currentStatus | string | Draft → Submitted → Accepted/Declined/Redirected → InTransit → Arrived → Closed / Escalated |
| notes | string? | |
| createdBy | string? | |
| createdAt, updatedAt | datetime | |

### `ReferralEvent`
Timestamped communication log per referral (cascade delete with referral).

| id | referralId (FK) | eventType | message | createdBy | createdAt |

### `SmsLog`
Every inbound/outbound short-code message.

| id | phoneNumber | command | response | status (OK/UNAUTHORIZED/ERROR) | direction | userId? | createdAt |

### `AuditLog`
Immutable audit trail for compliance.

| id | userId? | actorLabel | action | entityType | entityId? | oldValue? | newValue? | ipAddress? | createdAt |

## Relationships

```
User    ─┬─< (staff)        Hospital ─┬─< BedCapacity
         └─< AuditLog                 ├─< Referral (as referring)
Hospital ─< Referral (as destination) └─< User
Referral ─< ReferralEvent
```

## Migrating to PostgreSQL + PostGIS

1. Change the datasource in `schema.prisma`:
   ```prisma
   datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
   ```
2. Convert string status fields to native `enum`s (Postgres supports them).
3. Replace `latitude`/`longitude` floats with a PostGIS `geography(Point, 4326)` column and
   add a GiST index. Nearest-facility SMS/ambulance queries then become
   `ORDER BY location <-> :point` instead of in-app distance math.
4. `npx prisma migrate deploy` (use migrations, not `db push`, in production).
5. Add a read replica + Redis cache for the public map feed.
