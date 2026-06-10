export const USER_ROLES = {
  DOCTOR: 'doctor',
  PATIENT: 'patient',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type AuthUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  medicalId?: string;
  role: UserRole;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};

export type PatientLoginPayload = {
  medicalId: string;
  password: string;
};
