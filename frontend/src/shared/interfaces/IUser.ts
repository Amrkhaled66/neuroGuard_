export const USER_ROLES = {
  DOCTOR: "doctor",
  PATIENT: "patient",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  medicalId?: string;
  role: UserRole;
}

export type { IUser };
