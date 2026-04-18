// src/pages/Signin.tsx

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

const SigninPage = () => {
  // const { mutate: loginMutation, isPending } = useLogin();
  const { login } = useAuth();
  const navigate = useNavigate();

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
    onSubmit: (values) => {
      // loginMutation(values, {
      //   onSuccess: (data) => {
      //     login(data.user, data.token);

      //     Alert({
      //       title: "Success",
      //       text: "Login successful!",
      //       icon: "success",
      //       confirmButtonText: "OK",
      //       onConfirm: () => navigate("/profile"),
      //     });
      //   },

      //   onError: () => {
      //     updateError("Error in Email or Password", "email");
      //   },
      // });
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
            className="bg-white"
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button isLoading={false} className="py-2.5" type="submit">
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
