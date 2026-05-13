import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/shared/ui/Modal";
import Button from "@/shared/ui/Button";
import FormInput from "@/shared/ui/FormInput";
import { Alert } from "@/shared/utils/alert";
import { useCreateSession } from "../hooks";
import {
  addSessionSchema,
  type AddSessionFormValues,
} from "../schemas/sessionSchema";

type AddEegSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
};

const initialValues: Omit<AddSessionFormValues, "sessionFile"> & {
  sessionFile: AddSessionFormValues["sessionFile"];
} = {
  duration: 0,
  channelCount: 21,
  note: "",
  sessionFile: undefined as unknown as AddSessionFormValues["sessionFile"],
};

export default function AddEegSessionModal({
  isOpen,
  onClose,
  patientId,
}: AddEegSessionModalProps) {
  const createSessionMutation = useCreateSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setError,
  } = useForm<AddSessionFormValues>({
    resolver: zodResolver(addSessionSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const onSubmit = (data: AddSessionFormValues) => {
    createSessionMutation.mutate(
      {
        patientId,
        duration: data.duration,
        channelCount: data.channelCount,
        note: data.note,
        sessionFile: data.sessionFile,
      },
      {
        onSuccess: () => {
          reset(initialValues);
          onClose();
          Alert({
            title: "Session Uploaded",
            text: "The EEG session was uploaded successfully and is now being analyzed.",
            icon: "success",
            confirmButtonText: "OK",
          });
        },
        onError: (error) => {
          setError("sessionFile", {
            message: error.message || "Failed to upload session",
          });
        },
      },
    );
  };

  const handleClose = () => {
    if (!createSessionMutation.isPending) {
      reset(initialValues);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="app-surface flex max-h-[85vh] flex-col gap-5 overflow-y-auto rounded-2xl p-5 sm:p-6"
      >
        <div>
          <p className="text-brand-primary text-sm font-semibold tracking-[0.12em] uppercase">
            Upload EEG session
          </p>
        </div>

        <Controller
          name="sessionFile"
          control={control}
          render={({ field, fieldState }) => (
            <label className="flex flex-col gap-1">
              <span className="text-start text-sm font-medium">
                EEG File (EDF)
              </span>
              <input
                type="file"
                accept=".edf"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];
                  field.onChange(selectedFile);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              />
              {(fieldState.error?.message ||
                errors["sessionFile"]?.message) && (
                <span className="text-sm text-red-500">
                  {fieldState.error?.message || errors["sessionFile"]?.message}
                </span>
              )}
            </label>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Duration (minutes)"
            {...register("duration", { valueAsNumber: true })}
            type="number"
            min={1}
            error={errors["duration"]?.message}
          />
          <FormInput
            label="Channel Count"
            {...register("channelCount", { valueAsNumber: true })}
            type="number"
            min={1}
            error={errors["channelCount"]?.message}
          />
        </div>

      

        <label className="flex flex-col gap-1">
          <span className="text-start text-sm font-medium">Note</span>
          <textarea
            {...register("note")}
            rows={4}
            placeholder="Optional session note"
            className="focus:border-brand-primary w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
          />
          {errors["note"]?.message ? (
            <span className="text-sm text-red-500">
              {errors["note"]?.message}
            </span>
          ) : null}
        </label>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createSessionMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={createSessionMutation.isPending}>
            Upload Session
          </Button>
        </div>
      </form>
    </Modal>
  );
}
