import { Buffer } from 'buffer';
import { axiosInstance, type AxiosError, getAxiosErrorStatus } from '@/shared/lib/axios';
import {
  USER_ROLES,
  type AuthSession,
  type AuthUser,
  type PatientLoginPayload,
  type UserRole,
} from '@/features/auth/types/auth.types';

type PatientLoginResponse = {
  token: string;
};

export class AuthApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.details = details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUserRole(value: unknown): value is UserRole {
  return value === USER_ROLES.DOCTOR || value === USER_ROLES.PATIENT;
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

function getStringifiedId(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return getString(value);
}

function getAuthErrorMessageFromBody(body: unknown) {
  if (!isRecord(body)) {
    return 'Something went wrong. Please try again.';
  }

  const { message, error } = body;

  if (Array.isArray(message)) {
    return message.map(String).join(', ');
  }

  if (typeof message === 'string') {
    return message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Something went wrong. Please try again.';
}

export function getAuthErrorMessage(error: unknown) {
  if (isAxiosErrorWithData(error)) {
    return getAuthErrorMessageFromBody(error.response?.data) || error.message;
  }

  if (error instanceof AuthApiError || error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

function isAxiosErrorWithData(error: unknown): error is AxiosError {
  return Boolean(error && typeof error === 'object' && 'isAxiosError' in error);
}

function toAuthApiError(error: unknown) {
  if (isAxiosErrorWithData(error)) {
    const details = error.response?.data;
    return new AuthApiError(
      getAuthErrorMessageFromBody(details),
      getAxiosErrorStatus(error),
      details,
    );
  }

  if (error instanceof AuthApiError) {
    return error;
  }

  return new AuthApiError('Something went wrong. Please try again.', 0, error);
}

function decodeUserFromToken(token: string): Partial<AuthUser> {
  const payload = token.split('.')[1];

  if (!payload) {
    return {};
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const parsed = JSON.parse(Buffer.from(paddedBase64, 'base64').toString('utf8')) as unknown;

    if (!isRecord(parsed)) {
      return {};
    }

    return {
      id: getStringifiedId(parsed.id),
      firstName: getString(parsed.firstName),
      lastName: getString(parsed.lastName),
      email: getString(parsed.email),
      medicalId: getString(parsed.medicalId),
      role: isUserRole(parsed.role) ? parsed.role : undefined,
    };
  } catch {
    return {};
  }
}

function normalizePatientSession(response: PatientLoginResponse): AuthSession {
  const tokenUser = decodeUserFromToken(response.token);

  return {
    token: response.token,
    user: {
      id: tokenUser.id,
      firstName: tokenUser.firstName,
      lastName: tokenUser.lastName,
      email: tokenUser.email,
      medicalId: tokenUser.medicalId,
      role: tokenUser.role ?? USER_ROLES.PATIENT,
    },
  };
}

export function normalizeStoredAuthSession(session: AuthSession): AuthSession {
  const tokenUser = decodeUserFromToken(session.token);

  return {
    ...session,
    user: {
      ...session.user,
      id: session.user.id ?? tokenUser.id,
      firstName: session.user.firstName ?? tokenUser.firstName,
      lastName: session.user.lastName ?? tokenUser.lastName,
      email: session.user.email ?? tokenUser.email,
      medicalId: session.user.medicalId ?? tokenUser.medicalId,
      role: session.user.role ?? tokenUser.role ?? USER_ROLES.PATIENT,
    },
  };
}

export async function loginPatient(payload: PatientLoginPayload) {
  try {
    const response = await axiosInstance.post<PatientLoginResponse>('/auth/login/patients', payload);
    return normalizePatientSession(response as unknown as PatientLoginResponse);
  } catch (error) {
    throw toAuthApiError(error);
  }
}
