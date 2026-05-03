import { useState, memo, useCallback } from "react";
import AddPatientModal from "@/features/patients/components/AddPatientModal";
import PatientsTable from "@/features/patients/components/PatientsTable";
import PageHeader from "@/shared/components/PageHeader";
import Button from "@/shared/ui/Button";
import { IoPersonAddOutline } from "react-icons/io5";

const MemoizedPatientsTable = memo(PatientsTable);

export function PatientsPage() {
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsAddPatientOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddPatientOpen(false);
  }, []);

  return (
    <section className="space-y-5 sm:space-y-6">
      <PageHeader
        title="Patient Registry"
        description="Access clinical records, EEG diagnostics, and real-time monitoring sessions for all active
neurological cases."
      />

      <MemoizedPatientsTable />
      <Button
        className="fixed right-5 bottom-5 rounded-full! px-3 py-3"
        onClick={handleOpenModal}
      >
        <IoPersonAddOutline className="text-xl font-bold" />
        {/* Register Patient */}
      </Button>
      <AddPatientModal isOpen={isAddPatientOpen} onClose={handleCloseModal} />
    </section>
  );
}
