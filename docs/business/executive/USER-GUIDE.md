# User Guide / How-To

How to use noBed.ai — for every kind of user. Works on the live demo:
**https://nobed-ai.vercel.app**

> This is a demonstration environment seeded with sample data across 17 real Ghanaian
> hospitals. Log in as any role to explore — no setup needed.

---

## Demo logins (click-to-login on the Sign-in page)

On the **Sign in** page you can click any role to log in instantly, or type the credentials.

| Role | Email | Password | Lands on |
|------|-------|----------|----------|
| Public User | `public@nobed.ai` | `public123` | Find Beds |
| Hospital Staff (Korle Bu) | `staff@korlebu.gov.gh` | `staff123` | Hospital portal |
| Hospital Admin (Ridge) | `admin@ridge.gov.gh` | `admin123` | Hospital portal |
| Ambulance Dispatcher | `dispatch@ambulance.gov.gh` | `dispatch123` | Ambulance portal |
| Regional Health Admin | `regional@ghs.gov.gh` | `regional123` | Admin portal |
| National Health Admin | `national@moh.gov.gh` | `national123` | Admin portal |
| Super Admin | `super@nobed.ai` | `super123` | Admin portal |
| System Auditor | `auditor@nobed.ai` | `auditor123` | Admin portal |

*(Demo passwords are for demonstration only. A live deployment uses managed auth with MFA
and OTP — see [`docs/SECURITY.md`](../../SECURITY.md).)*

---

## For the public — find a bed

1. Open **https://nobed-ai.vercel.app** and go to **Find Beds** (or the **Map**).
2. **Read the colours.** Each hospital pin is:
   - 🟢 **Available** — beds free now.
   - 🟠 **Limited** — few beds, or high occupancy. Call ahead.
   - 🔴 **Full** — no beds of this type.
   - ⚪ **"?"** — data is stale/unverified. Treat with caution; call before you travel.
3. **Filter** by region, district, bed type (emergency, ICU, maternity, pediatric,
   isolation, general), facility type, and "accepting ambulances."
4. **Check the freshness badge** and the emergency contact before you move.
5. In a real emergency, still call **112** (National Ambulance Service). noBed.ai tells you
   *where to go*; it doesn't replace dispatch.

### No smartphone? Use SMS
Text a short code (simulated in the demo at **/sms**):

| Text | Result |
|------|--------|
| `BED ACCRA` | Facilities in Accra with emergency capacity |
| `ICU KUMASI` | ICU availability near Kumasi |
| `HELP` | The list of commands |

---

## For hospital staff — keep your capacity honest

1. Log in and open your **Hospital portal**.
2. **Update beds per type.** Enter total and occupied for each ward; the **colour status
   updates automatically.** You never pick a colour — the numbers decide it.
3. **Update equipment** — oxygen, ventilators, incubators. This is what makes capacity
   *functional*: an ICU bed with no ventilator won't show as available, and it shouldn't.
4. **Toggle** ambulance acceptance, theatre availability, and add referral notes ("theatre
   under maintenance," "3 emergency beds left").
5. **Handle incoming referrals** — Accept, Decline, or Redirect. **Accepting holds a bed**
   at your facility (you'll see a "🛏 Bed held" badge); declining releases it.

### By SMS, from the ward floor
`UPDATE KORLEBU EMERGENCY 0 ICU 1` → pushes a capacity update straight from a phone, no
dashboard needed. Only registered hospital numbers are authorised.

---

## For ambulance dispatchers — route to real capacity

1. Log in and open the **Ambulance portal**.
2. **Find the nearest facility** on the map with genuine, functional capacity for what the
   patient needs.
3. **Submit an emergency referral** — patient reference (anonymised), age range, emergency
   type, urgency, and required bed type. The system suggests destinations.
4. **Track it end-to-end** — Submitted → Accepted → In transit → Arrived. When a destination
   accepts, the bed is already **held** for you.

---

## For administrators — see the whole system

1. Log in as a regional, national, super, or auditor role → **Admin command centre**.
2. **National dashboard** — KPIs, status breakdown, regional pressure, referral funnel, and
   emergency-category mix.
3. **Watch the stale-hospital alerts** — facilities that haven't updated recently show grey.
   Chase them; a stale hospital is an invisible hospital.
4. **Review community reports** — public flags like "turned away despite a green light."
5. **Audit trail** (auditor / super admin) — every capacity change, referral, login, and SMS
   update, with actor and timestamp.

---

## Reading a status, the golden rule

If you remember one thing: **grey "?" is not green.** noBed.ai will never show a confident
free bed it can't stand behind. When data is stale, it says so — and tells you to call first.

---

*Questions? See the [FAQ](FAQ.md).*
