import { useMutation } from "@tanstack/react-query";
import {
  loginDoctor,
  signupDoctor,
  type DoctorLoginPayload,
  type DoctorSignupPayload,
} from "@/features/auth/services";

export const authQueryKeys = {
  all: ["auth"] as const,
  doctor: ["auth", "doctor"] as const,
  doctorLogin: ["auth", "doctor", "login"] as const,
  doctorSignup: ["auth", "doctor", "signup"] as const,
};

export function useDoctorLogin() {
  return useMutation({
    mutationKey: authQueryKeys.doctorLogin,
    mutationFn: (payload: DoctorLoginPayload) => loginDoctor(payload),
  });
}

export function useDoctorSignup() {
  return useMutation({
    mutationKey: authQueryKeys.doctorSignup,
    mutationFn: (payload: DoctorSignupPayload) => signupDoctor(payload),
  });
}
