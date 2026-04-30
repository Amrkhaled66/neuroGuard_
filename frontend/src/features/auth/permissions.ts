import { USER_ROLES, type IUser, type UserRole } from "@/shared/interfaces/IUser";

export const PERMISSIONS = {
  ACCESS_DOCTOR_ROUTES: "access:doctor-routes",
  ACCESS_PATIENT_ROUTES: "access:patient-routes",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const rolePermissions: Record<UserRole, readonly Permission[]> = {
  [USER_ROLES.DOCTOR]: [PERMISSIONS.ACCESS_DOCTOR_ROUTES],
  [USER_ROLES.PATIENT]: [PERMISSIONS.ACCESS_PATIENT_ROUTES],
};

export function hasPermission(
  user: IUser | null | undefined,
  permission: Permission,
) {
  if (!user?.role) {
    return false;
  }

  return rolePermissions[user.role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  user: IUser | null | undefined,
  permissions: readonly Permission[],
) {
  return permissions.some((permission) => hasPermission(user, permission));
}
