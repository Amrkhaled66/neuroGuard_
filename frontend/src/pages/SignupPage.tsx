// import signupValidation from "src/utils/validators/signupValidators";

// import { useSignup } from "src/hooks/queries/auth.queries";


// import { getErrorMessage } from "@/utils/getErrorMessage";


import React from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useForm } from "@shared/hooks/useForm";
import PasswordInput from "@shared/ui/PasswordInput";
import FormInput from "@shared/ui/FormInput";
// import { useLogin } from "src/hooks/queries/auth.queries";
import { Alert } from "@shared/utils/alert";
import Button from "@shared/ui/Button";
import { useAuth } from "@/features/auth/context/authContext";
import { Link } from "react-router-dom";
import { routePaths } from "@/app/router/paths";


const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  // const { mutate, isPending } = useSignup();
  const { login } = useAuth();
  const { values, errors, handleChange, handleSubmit, updateError } = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    // validate: signupValidation,
    onSubmit: async (values) => {
      // mutate(values, {
      //   onSuccess: (data) => {
      //     login(data.user, data.token);
      //     Alert({
      //       title: "Success",
      //       text: "Signup successful!",
      //       icon: "success",
      //       confirmButtonText: "OK",
      //       onConfirm: () => navigate("/profile"),
      //     });
      //     navigate("/profile");
      //   },
      //   onError: (error: any) => {
      //     const {
      //       status,
      //       data,
      //     } = error.response || {};
      //     if (status === 400) {
      //       updateError(getErrorMessage(error), "email");
      //     }
      //   },
      // });
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
              className="bg-white"
            />
            <FormInput
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={values.lastName}
              onChange={handleChange}
              error={errors.lastName}
              className="bg-white"
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
            className="bg-white"
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

          <Button isLoading={false} type="submit" className="py-2.5">
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