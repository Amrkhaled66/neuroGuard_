import { useEffect, useState } from "react";
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
} from "../schemas/medicationSchema";
import {
  useMedications,
  useAddPatientMedication,
  useUpdatePatientMedication,
  usePatientMedication,
} from "../hooks";

type AddMedicationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  editingMedicationId?: number;
};

const initialValues: AddPatientMedicationFormValues = {
  medicationId: 0,
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
  editingMedicationId,
}: AddMedicationModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: medicationsData,isPending } = useMedications();
  const addMutation = useAddPatientMedication();
  const updateMutation = useUpdatePatientMedication();
  const { data: editingMedicationData } = usePatientMedication(
    patientId,
    editingMedicationId || 0,
    { enabled: isEditMode && !!editingMedicationId },
  );

  if (isPending) return
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<AddPatientMedicationFormValues>({
    resolver: zodResolver(addPatientMedicationSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setIsEditMode(false);
      return;
    }

    if (editingMedicationId && isOpen) {
      setIsEditMode(true);
      if (editingMedicationData?.data) {
        const med = editingMedicationData.data;
        setValue("medicationId", med.medicationId);
        setValue("dosage", med.dosage || "");
        setValue("frequency", med.frequency || "");
        setValue("instruction", med.instruction || "");
        setValue("startDate", med.startDate);
        setValue("endDate", med.endDate || "");
        setValue("status", med.status);
      }
    } else {
      setIsEditMode(false);
      reset();
    }
  }, [isOpen, editingMedicationId, editingMedicationData, reset, setValue]);

  console.log(medicationsData?.data)
  const medications =
    medicationsData?.data && medicationsData.data.length > 0
      ? medicationsData?.data?.map((med) => ({
          label: `${med.name} (${med.form})`,
          value: med.id.toString(),
        }))
      : [];

  const onSubmit = (data: AddPatientMedicationFormValues) => {
    if (isEditMode && editingMedicationId) {
      updateMutation.mutate(
        {
          patientId,
          medId: editingMedicationId,
          payload: data,
        },
        {
          onSuccess: () => {
            onClose();
            Alert({
              title: "Success",
              text: "Medication updated successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });
          },
          onError: (error) => {
            Alert({
              title: "Error",
              text: error.message || "Failed to update medication",
              icon: "error",
              confirmButtonText: "OK",
            });
          },
        },
      );
    } else {
      addMutation.mutate(
        { patientId, payload: data },
        {
          onSuccess: () => {
            onClose();
            Alert({
              title: "Success",
              text: "Medication added successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });
          },
          onError: (error) => {
            Alert({
              title: "Error",
              text: error.message || "Failed to add medication",
              icon: "error",
              confirmButtonText: "OK",
            });
          },
        },
      );
    }
  };

  const isLoading = addMutation.isPending || updateMutation.isPending;

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

        <Controller
          name="medicationId"
          control={control}
          render={({ field, fieldState }) => (
            <DropdownMenu
              label="Medication"
              value={field.value.toString()}
              onChange={(value) => field.onChange(parseInt(value))}
              error={fieldState.error?.message}
              items={medications}
            />
          )}
        />

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
            onClick={onClose}
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
