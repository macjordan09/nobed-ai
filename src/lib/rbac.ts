// Role-based access control. Roles and permissions mirror the spec (section 7).

export type Role =
  | "PUBLIC"
  | "HOSPITAL_STAFF"
  | "HOSPITAL_ADMIN"
  | "AMBULANCE_DISPATCHER"
  | "REGIONAL_ADMIN"
  | "NATIONAL_ADMIN"
  | "SUPER_ADMIN"
  | "AUDITOR";

export const ROLE_LABELS: Record<Role, string> = {
  PUBLIC: "Public User",
  HOSPITAL_STAFF: "Hospital Staff",
  HOSPITAL_ADMIN: "Hospital Admin",
  AMBULANCE_DISPATCHER: "Ambulance Dispatcher",
  REGIONAL_ADMIN: "Regional Health Admin",
  NATIONAL_ADMIN: "National Health Admin",
  SUPER_ADMIN: "Super Admin",
  AUDITOR: "System Auditor",
};

export type Permission =
  | "view_public_beds"
  | "update_capacity"
  | "create_referral"
  | "accept_referral"
  | "manage_hospitals"
  | "manage_users"
  | "view_analytics"
  | "export_reports"
  | "view_audit_logs"
  | "configure_thresholds";

const PERMISSIONS: Record<Role, Permission[]> = {
  PUBLIC: ["view_public_beds"],
  HOSPITAL_STAFF: ["view_public_beds", "update_capacity", "accept_referral"],
  HOSPITAL_ADMIN: [
    "view_public_beds",
    "update_capacity",
    "create_referral",
    "accept_referral",
    "view_analytics",
  ],
  AMBULANCE_DISPATCHER: ["view_public_beds", "create_referral"],
  REGIONAL_ADMIN: ["view_public_beds", "view_analytics", "export_reports"],
  NATIONAL_ADMIN: [
    "view_public_beds",
    "view_analytics",
    "export_reports",
    "configure_thresholds",
  ],
  SUPER_ADMIN: [
    "view_public_beds",
    "update_capacity",
    "create_referral",
    "accept_referral",
    "manage_hospitals",
    "manage_users",
    "view_analytics",
    "export_reports",
    "view_audit_logs",
    "configure_thresholds",
  ],
  AUDITOR: ["view_public_beds", "view_analytics", "view_audit_logs"],
};

export function can(role: Role | string | undefined, perm: Permission): boolean {
  if (!role) return false;
  return PERMISSIONS[role as Role]?.includes(perm) ?? false;
}

export const ALL_ROLES = Object.keys(ROLE_LABELS) as Role[];
