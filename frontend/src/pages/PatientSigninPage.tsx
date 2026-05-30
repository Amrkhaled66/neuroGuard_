import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "@shared/hooks/useForm";
import PasswordInput from "@shared/ui/PasswordInput";
import FormInput from "@shared/ui/FormInput";
import Button from "@shared/ui/Button";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { useAuth } from "@/features/auth/context/useAuth";
import { usePatientLogin } from "@/features/auth/hooks/authQueries";
import { getAuthErrorMessage } from "@/features/auth/services";

export default function PatientSigninPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const patientLoginMutation = usePatientLogin();

  const { values, errors, handleChange, handleSubmit, updateError } = useForm({
    initialValues: {
      medicalId: "",
      password: "",
    },
    validate: (formValues) => {
      const newErrors: Partial<typeof formValues> = {};

      if (!formValues.medicalId.trim()) {
        newErrors.medicalId = "Medical ID is required";
      }
      if (!formValues.password.trim()) {
        newErrors.password = "Password is required";
      }

      return newErrors;
    },
    onSubmit: (formValues) => {
      patientLoginMutation.mutate(formValues, {
        onSuccess: ({ user, token }) => {
          login(user, token);
          navigate(routePaths.patientProfile, { replace: true });
        },
        onError: (error) => {
          updateError(getAuthErrorMessage(error), "medicalId");
        },
      });
    },
  });

  return (
    <AuthLayout>
      <div className="flex w-full flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="text-primary flex w-full flex-col gap-4"
        >
          <FormInput
            label="Medical ID"
            name="medicalId"
            placeholder="NG-99231"
            value={values.medicalId}
            onChange={handleChange}
            error={errors.medicalId}
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button
            isLoading={patientLoginMutation.isPending}
            className="py-2.5"
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
