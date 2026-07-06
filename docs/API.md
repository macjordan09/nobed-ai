# API reference

Base URL (dev): `http://localhost:3000`. All bodies are JSON. Auth is a signed
session cookie (`nobed_session`) set by the login endpoint.

Permissions are enforced by role (see [SECURITY.md](SECURITY.md)).

---

## Auth

### `POST /api/auth/login`
Public. Sets the session cookie on success.

```json
// request
{ "email": "staff@korlebu.gov.gh", "password": "staff123" }
// 200
{ "ok": true, "redirect": "/dashboard" }
// 401
{ "error": "Invalid credentials" }
```

### `POST /api/auth/logout`
Clears the session cookie and redirects to `/`.

---

## Hospitals (public, read-only)

### `GET /api/hospitals`
National capacity feed with computed status.

```json
{
  "count": 16,
  "hospitals": [
    {
      "id": "...", "name": "37 Military Hospital",
      "region": "Greater Accra", "district": "Ayawaso West",
      "facilityType": "Teaching", "ownershipType": "Public",
      "latitude": 5.5853, "longitude": -0.1869,
      "status": "amber", "emergencyAvailable": 2, "icuAvailable": 2,
      "ambulanceAccept": true, "theatreAvailable": true,
      "beds": { "emergency": { "total": 30, "occupied": 28, "available": 2, "status": "amber" }, "...": {} },
      "lastUpdatedAt": "2026-06-08T..."
    }
  ]
}
```

### `GET /api/hospitals/:id`
Single hospital (same shape as an element above). `404` if not found.

---

## Bed capacity

### `POST /api/beds`
**Requires** `update_capacity` + the user's `hospitalId`. Updates the caller's hospital.
Recomputes `availableBeds` and `statusColour`, bumps `lastUpdatedAt`, writes an audit log.

```json
// update one bed type
{ "bedType": "emergency", "total": 24, "occupied": 21 }
// and/or facility flags
{ "ambulanceAccept": false, "theatreAvailable": true, "referralNotes": "ED full" }
// 200
{ "ok": true }
// 403 if not authorized
```

---

## Referrals

### `GET /api/referrals`
List all referrals with facility names and event log.

### `POST /api/referrals`
**Requires** `create_referral` (ambulance dispatcher, hospital admin, super admin).
Generates a `referralCode`, anonymized `patientReference`, status `Submitted`, and a first event.

```json
// request (required: emergencyType, requiredBedType, destinationFacilityId)
{
  "emergencyType": "Road traffic accident",
  "urgencyLevel": "Critical",
  "requiredBedType": "icu",
  "destinationFacilityId": "<hospitalId>",
  "currentLocation": "Kasoa",
  "ambulanceStatus": "Dispatched",
  "eta": "18 min",
  "notes": "..."
}
// 200
{ "ok": true, "referral": { "referralCode": "REF-2026-6051", "currentStatus": "Submitted", ... } }
```

### `PATCH /api/referrals/:id`
**Requires** `accept_referral` or `create_referral`. Transitions status and appends an event.

```json
{ "status": "Accepted", "message": "Trauma team alerted" }
```
Valid statuses: `Draft, Submitted, Accepted, Declined, Redirected, InTransit, Arrived, Closed, Escalated`.

---

## SMS short code

### `POST /api/sms`
Simulates an inbound short-code message. Public for queries; hospital updates require the
sender's phone to belong to a registered hospital user with `update_capacity`.

```json
// request
{ "phone": "+233244111222", "command": "BED ACCRA" }
// 200
{ "status": "OK", "response": "Nearest facilities with emergency availability — ... Call 112 for ambulance." }
```

Commands:
| Command | Who | Effect |
|---------|-----|--------|
| `BED <city>` | anyone | top 3 facilities with emergency beds |
| `ICU <city>` | anyone | top 3 facilities with ICU beds |
| `UPDATE <hospital> EMERGENCY n ICU n …` | registered hospital number | updates capacity + audit log |
| `HELP` | anyone | command list |

Unauthorized updates return `{ "status": "UNAUTHORIZED", ... }`. Every message is persisted to `SmsLog`.

---

## Analytics

### `GET /api/analytics`
**Requires** `view_analytics`. Returns national totals, status distribution, per-region
pressure, referral funnel, emergency categories, update compliance %, stale hospitals,
referral acceptance rate, and SMS volume. Used by the admin dashboard.
