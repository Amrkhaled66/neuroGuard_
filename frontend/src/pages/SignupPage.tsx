import React from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "@shared/hooks/useForm";
import PasswordInput from "@shared/ui/PasswordInput";
import FormInput from "@shared/ui/FormInput";
import Button from "@shared/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { useDoctorSignup } from "@/features/auth/hooks/authQueries";
import { getAuthErrorMessage } from "@/features/auth/services";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const doctorSignupMutation = useDoctorSignup();
  const { values, errors, handleChange, handleSubmit, updateError } = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      clinicName: "",
      password: "",
      confirmPassword: "",
    },
    validate: (formValues) => {
      const newErrors: Partial<typeof formValues> = {};

      if (!formValues.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formValues.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formValues.email.trim()) {
        newErrors.email = "Email is required";
      }
      if (!formValues.clinicName.trim()) {
        newErrors.clinicName = "Clinic name is required";
      }
      if (formValues.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formValues.confirmPassword !== formValues.password) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      return newErrors;
    },
    onSubmit: async (formValues) => {
      doctorSignupMutation.mutate(
        {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          clinicName: formValues.clinicName,
          password: formValues.password,
        },
        {
          onSuccess: () => {
            navigate(routePaths.signin, { replace: true });
          },
          onError: (error) => {
            updateError(getAuthErrorMessage(error), "email");
          },
        },
      );
    },
  });

  return (
    <AuthLayout>
      <div className="flex h-auto w-full flex-col items-center overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2.5 text-primary"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            <FormInput
              label="First Name"
              name="firstName"
              placeholder="John"
              value={values.firstName}
              onChange={handleChange}
              error={errors.firstName}
              
            />
            <FormInput
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={values.lastName}
              onChange={handleChange}
              error={errors.lastName}
              
            />
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            
          />

          <FormInput
            label="Clinic Name"
            name="clinicName"
            placeholder="NeuroGuard Clinic"
            value={values.clinicName}
            onChange={handleChange}
            error={errors.clinicName}
            
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-2">
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <Button
            isLoading={doctorSignupMutation.isPending}
            type="submit"
            className="py-2.5"
          >
            Sign Up
          </Button>
          <p className="text-center text-strokeFont text-sm">
            Already have an account?
            <Link
              to={routePaths.signin}
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
