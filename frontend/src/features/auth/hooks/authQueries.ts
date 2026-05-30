import { useMutation } from "@tanstack/react-query";
import {
  loginDoctor,
  loginPatient,
  signupDoctor,
  type DoctorLoginPayload,
  type DoctorSignupPayload,
  type PatientLoginPayload,
} from "@/features/auth/services";

export const authQueryKeys = {
  all: ["auth"] as const,
  doctor: ["auth", "doctor"] as const,
  doctorLogin: ["auth", "doctor", "login"] as const,
  doctorSignup: ["auth", "doctor", "signup"] as const,
  patientLogin: ["auth", "patient", "login"] as const,
};

export function useDoctorLogin() {
  return useMutation({
    mutationKey: authQueryKeys.doctorLogin,
    mutationFn: (payload: DoctorLoginPayload) => loginDoctor(payload),
  });
}

export function usePatientLogin() {
  return useMutation({
    mutationKey: authQueryKeys.patientLogin,
    mutationFn: (payload: PatientLoginPayload) => loginPatient(payload),
  });
}

export function useDoctorSignup() {
  return useMutation({
    mutationKey: authQueryKeys.doctorSignup,
    mutationFn: (payload: DoctorSignupPayload) => signupDoctor(payload),
  });
}
