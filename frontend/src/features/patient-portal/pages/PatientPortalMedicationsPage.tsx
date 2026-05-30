import { useState } from "react";
import Button from "@/shared/ui/Button";
import {
  AddMedicationModal,
  PatientMedicationTable,
} from "@/features/medications/components";
import type { PatientMedication } from "@/features/medications/services";
import { useAuth } from "@/features/auth/context/useAuth";

export default function PatientPortalMedicationsPage() {
  const { authData } = useAuth();
  const patientId = Number(authData.user?.id ?? 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] =
    useState<PatientMedication | null>(null);

  const handleAddClick = () => {
    setEditingMedication(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (medication: PatientMedication) => {
    setEditingMedication(medication);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingMedication(null);
  };

  if (!patientId) {
    return (
      <section className="app-surface rounded-3xl p-6 text-red-600">
        Session invalid. Please sign in again.
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="app-text-primary text-2xl font-bold">Medications</h2>
        <Button variant="primary" onClick={handleAddClick}>
          Add New Medication
        </Button>
      </div>

      <PatientMedicationTable patientId={patientId} onEditClick={handleEditClick} />

      <AddMedicationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        patientId={patientId}
        editingMedication={editingMedication}
      />
    </div>
  );
}
