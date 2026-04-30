import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "@shared/hooks/useForm";
import PasswordInput from "@shared/ui/PasswordInput";
import FormInput from "@shared/ui/FormInput";
import Button from "@shared/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { useAuth } from "@/features/auth/context/useAuth";
import { useDoctorLogin } from "@/features/auth/hooks/authQueries";
import { getAuthErrorMessage } from "@/features/auth/services";

const SigninPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const doctorLoginMutation = useDoctorLogin();

  const { values, errors, handleChange, handleSubmit, updateError } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const newErrors: Partial<typeof values> = {};

      if (!values.email.trim()) {
        newErrors.email = "Email is required";
      }
      if (!values.password.trim()) {
        newErrors.password = "Password is required";
      }

      return newErrors;
    },
    onSubmit: (formValues) => {
      doctorLoginMutation.mutate(formValues, {
        onSuccess: ({ user, token }) => {
          login(user, token);
          navigate(routePaths.doctorDashboard, { replace: true });
        },
        onError: (error) => {
          updateError(getAuthErrorMessage(error), "email");
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
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            // className="bg-white"
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
            isLoading={doctorLoginMutation.isPending}
            className="py-2.5"
            type="submit"
          >
            Login
          </Button>

          <p
            className="mt-3 text-center text-sm"
            style={{ color: "var(--color-strokeFont)" }}
          >
            Don't have an account?
            <Link
              className="font-semibold hover:underline"
              style={{ color: "var(--color-primary)" }}
              to={routePaths.signup}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SigninPage;
