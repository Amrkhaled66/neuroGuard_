import { useMemo, useState } from 'react';
import { getAuthErrorMessage } from '@/features/auth/api/auth.api';
import { useLogin } from '@/features/auth/hooks/useLogin';

type FormState = {
  medicalId: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function useLoginForm() {
  const loginMutation = useLogin();
  const [values, setValues] = useState<FormState>({
    medicalId: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const submitLabel = useMemo(
    () => (loginMutation.isPending ? 'Logging in...' : 'Login'),
    [loginMutation.isPending],
  );

  function handleChange(field: keyof FormState, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!values.medicalId.trim()) {
      nextErrors.medicalId = 'Please enter your medical ID.';
    }

    if (!values.password.trim()) {
      nextErrors.password = 'Please enter your password.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    loginMutation.mutate(values, {
      onError: (error) => {
        setErrors({
          medicalId: getAuthErrorMessage(error),
        });
      },
    });
  }

  return {
    values,
    errors,
    submitLabel,
    isPending: loginMutation.isPending,
    handleChange,
    handleSubmit,
  };
}
