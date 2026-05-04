import { useState, memo } from "react";
import type { TableColumn } from "react-data-table-component";
import Table from "@/shared/ui/Table";
import Button from "@/shared/ui/Button";
import { usePatientMedications, useDeletePatientMedication } from "../hooks";
import { Alert } from "@/shared/utils/alert";
import type { PatientMedication } from "../services";
import TableSkeleton from "@/shared/ui/skeletons/TableSkeleton";
type PatientMedicationTableProps = {
  patientId: number;
  onEditClick?: (medication: PatientMedication) => void;
};

type MedicationRow = PatientMedication & { actions: React.ReactNode };

function PatientMedicationTable({
  patientId,
  onEditClick,
}: PatientMedicationTableProps) {
  const {
    data: medicationsData,
    isLoading,
    error,
  } = usePatientMedications(patientId);
  const deleteMutation = useDeletePatientMedication();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const medications = medicationsData ?? [];

  const handleDelete = (medId: number) => {
    Alert({
      title: "Delete Medication",
      text: "Are you sure you want to remove this medication?",
      icon: "warning",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      onConfirm: () => {
        setDeletingId(medId);
        deleteMutation.mutate(
          { patientId, medId },
          {
            onSuccess: () => {
              Alert({
                title: "Deleted",
                text: "Medication removed successfully.",
                icon: "success",
                confirmButtonText: "OK",
              });
            },
            onError: (error) => {
              Alert({
                title: "Error",
                text: error.message || "Failed to delete medication",
                icon: "error",
                confirmButtonText: "OK",
              });
            },
            onSettled: () => {
              setDeletingId(null);
            },
          },
        );
      },
    });
  };

  const columns: TableColumn<MedicationRow>[] = [
    {
      name: "Medication Id",
      cell: (row) => `${row.medicationId}`,
      // width: "150px",
    },
    {
      name: "Dosage",
      cell: (row) => row.dosage || "-",
      // width: "120px",
    },
    {
      name: "Frequency",
      cell: (row) => row.frequency || "-",
      // width: "130px",
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
      // width: "120px",
    },
    {
      name: "Start Date",
      cell: (row) => new Date(row.startDate).toLocaleDateString(),
      // width: "130px",
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onEditClick?.(row)}
            disabled={deletingId === row.id}
            className="px-2 py-1 text-sm"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDelete(row.id)}
            isLoading={deletingId === row.id}
            className="px-2 py-1 text-sm"
          >
            Delete
          </Button>
        </div>
      ),
      width: "200px",
    },
  ];

  const tableData =
    medications.length > 0
      ? medications.map((med) => ({
          ...med,
          actions: null,
        }))
      : [];

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="py-4 text-center text-red-600">
        Error loading medications
      </div>
    );
  }

  return (
    <Table
      noDataText="No medications assigned to this patient yet."
      columns={columns}
      data={tableData}
    />
  );
}

export default memo(PatientMedicationTable);
