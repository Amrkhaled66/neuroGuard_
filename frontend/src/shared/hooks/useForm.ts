import { useState } from "react";

interface UseFormProps<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T>({
  initialValues,
  validate,
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e?.target || e;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((error) => error);

    if (!hasErrors) {
      await onSubmit(values);
    }
  };

  const updateError = (error: string, field: keyof T) => {
    setErrors((prev) => {
      return {
        ...prev,
        [field]: error,
      };
    });
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    updateError,
  };
}