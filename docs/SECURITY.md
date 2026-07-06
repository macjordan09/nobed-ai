# Security & privacy

NoBed.ai handles emergency health-system data, so security and privacy are first-class.
This document covers what the **MVP** implements, what is **mocked**, and the production
controls required before any real deployment.

> ⚠️ **The MVP auth and SMS layers are for demonstration only.** Mock auth (signed cookies,
> sha256 passwords) and the SMS simulator MUST be replaced before handling real data.

---

## Roles & permissions (RBAC)

Defined in [`src/lib/rbac.ts`](../src/lib/rbac.ts). Eight roles, ten permissions.

| Permission | PUBLIC | HOSP. STAFF | HOSP. ADMIN | AMBULANCE | REGIONAL | NATIONAL | SUPER | AUDITOR |
|------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| view_public_beds | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| update_capacity | | ✓ | ✓ | | | | ✓ | |
| create_referral | | | ✓ | ✓ | | | ✓ | |
| accept_referral | | ✓ | ✓ | | | | ✓ | |
| manage_hospitals | | | | | | | ✓ | |
| manage_users | | | | | | | ✓ | |
| view_analytics | | | ✓ | | ✓ | ✓ | ✓ | ✓ |
| export_reports | | | | | ✓ | ✓ | ✓ | |
| view_audit_logs | | | | | | | ✓ | ✓ |
| configure_thresholds | | | | | | ✓ | ✓ | |

Enforced server-side in every protected API route and admin/portal page via `can(role, perm)`.

---

## MVP controls (implemented)

- **RBAC** enforced on every write endpoint and portal route.
- **Signed sessions** — HMAC-SHA256 signed, `httpOnly`, `sameSite=lax`, 8h expiry.
- **Password hashing** — passwords are never stored in plaintext.
- **SMS sender verification** — hospital `UPDATE` commands only accepted from a phone number
  registered to a hospital user with `update_capacity`; unauthorized attempts are logged.
- **Audit logging** — capacity updates, referrals, logins and SMS updates write to `AuditLog`
  with actor, before/after values and IP. Audit log view is restricted to auditor/super.
- **No identifiable patient data** — referrals use anonymized references only.
- **Input handling** — Prisma parameterizes all queries (no SQL injection); React escapes
  output by default (XSS); bed counts are clamped server-side.

---

## Production controls (required before launch)

| Area | Requirement |
|------|-------------|
| Auth | Replace mock auth with **Supabase Auth / Clerk / Auth0**. MFA for hospital admins & system admins; OTP for SMS users; magic-link/password for web. |
| Passwords | argon2id or bcrypt (handled by the managed auth provider). |
| Transport | HTTPS everywhere; HSTS. Terminate TLS at Cloudflare/load balancer. |
| At rest | Encrypted database volumes (managed Postgres) + encrypted backups. |
| Sessions | Rotate secrets, short-lived access + refresh tokens, device tracking, suspicious-login alerts. |
| API | Rate limiting + WAF (Cloudflare). Per-route throttles on auth and SMS endpoints. |
| CSRF | Anti-CSRF tokens for cookie-authenticated mutations (or token-based auth headers). |
| Validation | Add **Zod** schemas at every API boundary. |
| Admin | IP allow-listing for super-admin actions; least-privilege service accounts. |
| Retention | Data retention & deletion policies (see Privacy below). |
| Monitoring | Sentry, OpenTelemetry, uptime checks, audit-log alerting. |

---

## Privacy & compliance

Designed to align with the **Ghana Data Protection Act, 2012**, Ghana Health Service data
governance, and HIPAA-style best practices.

- **Data minimization** — collect only what's needed to route an emergency. No full medical
  records are stored.
- **Anonymized referrals** — `patientReference` is a random opaque id; age is a *range*,
  not a date of birth.
- **Role-restricted sensitive data** — referral detail and audit logs are gated by permission.
- **Access logging** — every access/change to sensitive records is auditable.
- **Right to deletion** — support data deletion where legally permitted (retention policy).
- **Consent-aware referrals** — capture consent context in the referral workflow.
- **Transparency** — publish a privacy policy and terms of use before launch.

---

## Threat notes

- **SMS spoofing** — sender ID can be spoofed on SMS; production must verify via the
  provider's verified shortcode + OTP enrollment, not phone number alone.
- **Data trust** — capacity is self-reported by hospitals. The AI layer flags stale/anomalous
  updates (see ARCHITECTURE.md) but humans must verify before acting clinically.
- **Availability** — this is emergency infrastructure; design for high availability,
  graceful degradation, and an SMS fallback when the web is unreachable.
