import { memo, useCallback, useMemo, useState } from "react";
import Button from "@/shared/ui/Button";
import AddEegSessionModal from "@/features/PatientEegSessionsPage/components/AddEegSessionModal";
import EegSessionsDataTable from "@/features/PatientEegSessionsPage/components/EegSessionsDataTable";
import EegSessionsFilters from "@/features/PatientEegSessionsPage/components/EegSessionsFilters";
import { usePatientSessions } from "@/features/PatientEegSessionsPage/hooks";
import { useAuth } from "@/features/auth/context/useAuth";
import type {
  SessionHistory,
  SessionStatus,
} from "@/features/PatientEegSessionsPage/types";

const MemoizedEegSessionsDataTable = memo(EegSessionsDataTable);
const MemoizedEegSessionsFilters = memo(EegSessionsFilters);

export default function PatientPortalSessionsPage() {
  const { authData } = useAuth();
  const parsedPatientId = Number(authData.user?.id ?? 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState<SessionStatus | "all">(
    "all",
  );

  const { data: patientSessions = [], isLoading } =
    usePatientSessions(parsedPatientId);

  const sessionRows = useMemo<SessionHistory[]>(
    () =>
      patientSessions.map((session) => ({
        id: session.id,
        date: session.createdAt ?? "",
        duration: session.duration,
        channels: session.channelCount,
        seizures: session.seizureCount,
        status: session.status,
        filePath: session.filePath,
        note: session.note,
      })),
    [patientSessions],
  );

  const filteredSessions = useMemo(() => {
    if (activeStatus === "all") return sessionRows;
    return sessionRows.filter((session) => session.status === activeStatus);
  }, [activeStatus, sessionRows]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleStatusChange = useCallback((status: SessionStatus | "all") => {
    setActiveStatus(status);
  }, []);

  if (!parsedPatientId) {
    return (
      <section className="app-surface rounded-3xl p-6 text-red-600">
        Session invalid. Please sign in again.
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MemoizedEegSessionsFilters
          activeStatus={activeStatus}
          onStatusChange={handleStatusChange}
        />

        <Button onClick={handleOpenModal} className="px-4 py-2.5">
          Upload New EEG
        </Button>
      </div>

      <MemoizedEegSessionsDataTable data={filteredSessions} isLoading={isLoading} />

      <AddEegSessionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        patientId={parsedPatientId}
      />
    </div>
  );
}
