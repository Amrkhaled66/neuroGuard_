import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/ui/Button";
import Modal from "@/shared/ui/Modal";
import FormInput from "@/shared/ui/FormInput";
import { Alert } from "@/shared/utils/alert";
import {
  createNotificationSchema,
  type CreateNotificationFormValues,
} from "../schemas/notificationSchema";
import { useCreatePatientNotification } from "../hooks";

type AddNotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  onCreated?: () => void;
};

const initialValues: CreateNotificationFormValues = {
  title: "",
  message: "",
};

export default function AddNotificationModal({
  isOpen,
  onClose,
  patientId,
  onCreated,
}: AddNotificationModalProps) {
  const createNotificationMutation = useCreatePatientNotification();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNotificationFormValues>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!isOpen) {
      reset(initialValues);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateNotificationFormValues) => {
    try {
      await createNotificationMutation.mutateAsync({
        patientId,
        payload: {
          title: data.title.trim(),
          message: data.message.trim(),
        },
      });

      Alert({
        title: "Notification sent",
        text: "The notification has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      onCreated?.();
      onClose();
      reset(initialValues);
    } catch (error) {
      Alert({
        title: "Unable to send notification",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the notification.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="app-surface flex max-h-[85vh] flex-col gap-5 overflow-y-auto rounded-2xl p-5 sm:p-6"
      >
        <div>
          <p className="text-brand-primary text-sm font-semibold tracking-[0.12em] uppercase">
            Add Notification
          </p>
        </div>

        <FormInput
          label="Title"
          {...register("title")}
          placeholder="EEG headset needs adjustment"
          error={errors["title"]?.message}
        />

        <label className="flex flex-col gap-1">
          <span className="text-start text-sm font-medium">Message</span>
          <textarea
            {...register("message")}
            rows={6}
            placeholder="Write the patient-facing notification message."
            className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm transition-colors focus:outline-none ${
              errors["message"]?.message
                ? "border-red-500 hover:bg-red-500/5"
                : "border-gray-300 hover:bg-blue-500/5"
            }`}
          />
          {errors["message"]?.message ? (
            <span className="text-sm text-red-500">
              {errors["message"].message}
            </span>
          ) : null}
        </label>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createNotificationMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={createNotificationMutation.isPending}
          >
            Send Notification
          </Button>
        </div>
      </form>
    </Modal>
  );
}
