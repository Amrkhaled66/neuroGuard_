import Modal from "@/shared/ui/Modal";
import Button from "@/shared/ui/Button";
import FormInput from "@/shared/ui/FormInput";
import PasswordInput from "@/shared/ui/PasswordInput";
// import { useForm } from "@/shared/hooks/useForm";
import { useCreatePatient } from "@/features/patients/hooks";
import {
  getPatientsErrorMessage,
  type PatientGender,
} from "@/features/patients/services";
import DropdownMenu from "@/shared/ui/DropdownMenu";
import { Alert } from "@/shared/utils/alert";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addPatientSchema,
  type AddPatientFormValues,
} from "../schemas/patientSchema";

type AddPatientModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialValues: AddPatientFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  medicalId: "",
  birthDate: "",
  gender: "male" as PatientGender,
  password: "",
};

export default function AddPatientModal({
  isOpen,
  onClose,
}: AddPatientModalProps) {
  const createPatientMutation = useCreatePatient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError
  } = useForm<AddPatientFormValues>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const onSubmit = (data: AddPatientFormValues) => {
    createPatientMutation.mutate(
      {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        medicalId: data.medicalId.trim(),
        birthDate: data.birthDate,
        gender: data.gender,
        password: data.password,
      },
      {
        onSuccess: () => {
          onClose();
          Alert({
            title: "Patient Added",
            text: "The patient record has been created successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        },
        onError: (error) => {
          const message = getPatientsErrorMessage(error);
          setError("email", { message });
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="app-surface flex max-h-[85vh] flex-col gap-5 overflow-y-auto rounded-2xl p-5 sm:p-6"
      >
        <div>
          <p className="text-brand-primary text-sm font-semibold tracking-[0.12em] uppercase">
            Add patient record
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="First Name"
            {...register("firstName")}
            placeholder="Sarah"
            error={errors["firstName"]?.message}
          />
          <FormInput
            label="Last Name"
            {...register("lastName")}
            placeholder="Miller"
            error={errors["lastName"]?.message}
          />
        </div>

        <FormInput
          label="Email"
          {...register("email")}
          type="email"
          placeholder="patient@example.com"
          error={errors["email"]?.message}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Medical ID"
            {...register("medicalId")}
            placeholder="NG-99231"
            error={errors["medicalId"]?.message}
          />
          <FormInput
            label="Birth Date"
            {...register("birthDate")}
            type="date"
            error={errors["birthDate"]?.message}
          />
        </div>

        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState }) => (
            <DropdownMenu
              label="Gender"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              items={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
            />
          )}
        />

        <PasswordInput
          label="Password"
          {...register("password")}
          placeholder="Set patient password"
          error={errors["password"]?.message}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createPatientMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={createPatientMutation.isPending}>
            Add Patient
          </Button>
        </div>
      </form>
    </Modal>
  );
}
