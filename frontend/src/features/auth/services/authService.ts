import { USER_ROLES, type IUser, type UserRole } from "@/shared/interfaces/IUser";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";
const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

type BackendDoctor = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  clinicName?: string;
  role?: UserRole;
};

type DoctorLoginResponse = {
  token: string;
  user?: BackendDoctor;
};

export type DoctorLoginPayload = {
  email: string;
  password: string;
};

export type DoctorSignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  clinicName: string;
};

export type DoctorUser = IUser & {
  clinicName?: string;
};

export type AuthSession = {
  user: IUser;
  token: string;
};

export class AuthApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.details = details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return isRecord(value) && "success" in value && "data" in value;
}

function isUserRole(value: unknown): value is UserRole {
  return value === USER_ROLES.DOCTOR || value === USER_ROLES.PATIENT;
}

function getString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function getAuthErrorMessageFromBody(body: unknown) {
  if (!isRecord(body)) {
    return "Request failed";
  }

  const { message, error } = body;

  if (Array.isArray(message)) {
    return message.map(String).join(", ");
  }

  if (typeof message === "string") {
    return message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Request failed";
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof AuthApiError || error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const body = await parseResponse(response);

  if (!response.ok) {
    throw new AuthApiError(
      getAuthErrorMessageFromBody(body),
      response.status,
      body,
    );
  }

  const payload = isApiEnvelope(body) ? body.data : body;
  return payload as T;
}

function decodeUserFromToken(token: string): Partial<IUser> {
  const payload = token.split(".")[1];

  if (!payload) {
    return {};
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const parsed = JSON.parse(atob(paddedBase64)) as unknown;

    if (!isRecord(parsed)) {
      return {};
    }

    return {
      id: getString(parsed.id),
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

function normalizeDoctorSession(response: DoctorLoginResponse): AuthSession {
  const tokenUser = decodeUserFromToken(response.token);
  const responseUser = response.user ?? {};

  return {
    token: response.token,
    user: {
      id: responseUser.id ?? tokenUser.id,
      firstName: responseUser.firstName ?? tokenUser.firstName,
      lastName: responseUser.lastName ?? tokenUser.lastName,
      email: responseUser.email ?? tokenUser.email,
      medicalId: tokenUser.medicalId,
      role: responseUser.role ?? tokenUser.role ?? USER_ROLES.DOCTOR,
    },
  };
}

export async function loginDoctor(payload: DoctorLoginPayload) {
  const response = await request<DoctorLoginResponse>("/auth/login/doctors", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizeDoctorSession(response);
}

export async function signupDoctor(payload: DoctorSignupPayload) {
  const response = await request<BackendDoctor>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    ...response,
    role: response.role ?? USER_ROLES.DOCTOR,
  } satisfies DoctorUser;
}
