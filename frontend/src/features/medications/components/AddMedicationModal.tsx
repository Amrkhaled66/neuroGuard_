import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/ui/Modal";
import Button from "@/shared/ui/Button";
import FormInput from "@/shared/ui/FormInput";
import DropdownMenu from "@/shared/ui/DropdownMenu";
import { Alert } from "@/shared/utils/alert";
import {
  addPatientMedicationSchema,
  type AddPatientMedicationFormValues,
  type PatientMedicationMutationPayload,
  medicationForms,
} from "../schemas/medicationSchema";
import {
  useMedications,
  useCreateMedication,
  useAddPatientMedication,
  useUpdatePatientMedication,
} from "../hooks";
import type { PatientMedication } from "../services";

type AddMedicationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  editingMedication?: PatientMedication | null;
};

const initialValues: AddPatientMedicationFormValues = {
  medicationSource: "existing",
  medicationId: undefined,
  newMedicationName: undefined,
  newMedicationForm: undefined,
  dosage: "",
  frequency: "",
  instruction: "",
  startDate: "",
  endDate: "",
  status: "active",
};

export default function AddMedicationModal({
  isOpen,
  onClose,
  patientId,
  editingMedication,
}: AddMedicationModalProps) {
  const isEditMode = !!editingMedication;
  const { data: medicationsData = [], isPending } = useMedications({
    enabled: isOpen,
  });
  const createMedicationMutation = useCreateMedication();
  const addMutation = useAddPatientMedication();
  const updateMutation = useUpdatePatientMedication();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm<AddPatientMedicationFormValues>({
    resolver: zodResolver(addPatientMedicationSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const medicationSource = watch("medicationSource");

  useEffect(() => {
    if (!isOpen) {
      reset(initialValues);
      return;
    }

    if (editingMedication) {
      reset({
        ...initialValues,
        medicationSource: "existing",
        medicationId: editingMedication.medicationId,
        dosage: editingMedication.dosage ?? "",
        frequency: editingMedication.frequency ?? "",
        instruction: editingMedication.instruction ?? "",
        startDate: editingMedication.startDate,
        endDate: editingMedication.endDate ?? "",
        status: editingMedication.status,
      });
      return;
    }

    reset(initialValues);
  }, [isOpen, editingMedication, reset]);

  useEffect(() => {
    if (
      isOpen &&
      !isEditMode &&
      medicationsData.length === 0 &&
      medicationSource !== "new"
    ) {
      setValue("medicationSource", "new");
    }
  }, [isOpen, isEditMode, medicationSource, medicationsData.length, setValue]);

  const medications = medicationsData.map((med) => ({
    label: `${med.name} (${med.form})`,
    value: med.id.toString(),
  }));

  const medicationFormItems = medicationForms.map((form) => ({
    label: form.charAt(0).toUpperCase() + form.slice(1),
    value: form,
  }));

  const buildPatientMedicationPayload = (
    data: AddPatientMedicationFormValues,
    medicationId: number,
  ): PatientMedicationMutationPayload => ({
    medicationId,
    dosage: data.dosage?.trim() ? data.dosage.trim() : undefined,
    frequency: data.frequency?.trim() ? data.frequency.trim() : undefined,
    instruction: data.instruction?.trim() ? data.instruction.trim() : undefined,
    startDate: data.startDate,
    endDate: data.endDate?.trim() ? data.endDate.trim() : undefined,
    status: data.status,
  });

  const onSubmit = async (data: AddPatientMedicationFormValues) => {
    try {
      let medicationId = data.medicationId;

      if (data.medicationSource === "new") {
        const createdMedication = await createMedicationMutation.mutateAsync({
          name: data.newMedicationName?.trim() ?? "",
          form: data.newMedicationForm!,
        });
        medicationId = createdMedication.id;
      }

      const payload = buildPatientMedicationPayload(data, medicationId!);

      if (isEditMode && editingMedication) {
        await updateMutation.mutateAsync({
          patientId,
          medId: editingMedication.id,
          payload,
        });
        Alert({
          title: "Success",
          text: "Medication updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        await addMutation.mutateAsync({ patientId, payload });
        Alert({
          title: "Success",
          text: "Medication added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }

      onClose();
      reset(initialValues);
    } catch (error) {
      Alert({
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : isEditMode
              ? "Failed to update medication"
              : "Failed to add medication",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const isLoading =
    isPending ||
    addMutation.isPending ||
    updateMutation.isPending ||
    createMedicationMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="app-surface flex max-h-[85vh] flex-col gap-5 overflow-y-auto rounded-2xl p-5 sm:p-6"
      >
        <div>
          <p className="text-brand-primary text-sm font-semibold tracking-[0.12em] uppercase">
            {isEditMode ? "Edit Medication" : "Add Medication"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setValue("medicationSource", "existing")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              medicationSource === "existing"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600"
            }`}
          >
            Use Existing
          </button>
          <button
            type="button"
            onClick={() => setValue("medicationSource", "new")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              medicationSource === "new"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600"
            }`}
          >
            Create New
          </button>
        </div>

        {medicationSource === "existing" ? (
          <Controller
            name="medicationId"
            control={control}
            render={({ field, fieldState }) => (
              <DropdownMenu
                loading={isPending}
                label="Medication"
                value={field.value?.toString()}
                onChange={(value) => field.onChange(parseInt(value, 10))}
                error={fieldState.error?.message}
                items={medications}
                placeholder={
                  medications.length === 0
                    ? "No medications available"
                    : "Select medication"
                }
              />
            )}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Medication Name"
              {...register("newMedicationName")}
              placeholder="e.g., Keppra"
              error={errors["newMedicationName"]?.message}
            />
            <Controller
              name="newMedicationForm"
              control={control}
              render={({ field, fieldState }) => (
                <DropdownMenu
                  label="Medication Form"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  items={medicationFormItems}
                  placeholder="Select form"
                />
              )}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Dosage"
            {...register("dosage")}
            placeholder="e.g., 500mg"
            error={errors["dosage"]?.message}
          />
          <FormInput
            label="Frequency"
            {...register("frequency")}
            placeholder="e.g., Twice daily"
            error={errors["frequency"]?.message}
          />
        </div>

        <FormInput
          label="Instruction"
          {...register("instruction")}
          placeholder="e.g., Take with food"
          error={errors["instruction"]?.message}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Start Date"
            {...register("startDate")}
            type="date"
            error={errors["startDate"]?.message}
          />
          <FormInput
            label="End Date"
            {...register("endDate")}
            type="date"
            error={errors["endDate"]?.message}
          />
        </div>

        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <DropdownMenu
              label="Status"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              items={[
                { label: "Active", value: "active" },
                { label: "Discontinued", value: "discontinued" },
              ]}
            />
          )}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset(initialValues);
              onClose();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditMode ? "Update Medication" : "Add Medication"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
