import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@/shared/ui/Button";
import { AddMedicationModal, PatientMedicationTable } from "@/features/medications/components";
import type { PatientMedication } from "@/features/medications/services";

export default function MedicationsPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<PatientMedication | null>(null);

  const numPatientId = parseInt(patientId || "0", 10);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patient Medications</h1>
        <Button variant="primary" onClick={handleAddClick}>
          Add New Medication
        </Button>
      </div>

      <PatientMedicationTable patientId={numPatientId} onEditClick={handleEditClick} />

      <AddMedicationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        patientId={numPatientId}
        editingMedicationId={editingMedication?.id}
      />
    </div>
  );
}
