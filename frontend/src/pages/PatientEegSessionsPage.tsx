import { useMemo, useState } from "react";
import Button from "@/shared/ui/Button";
import EegSessionsDataTable from "@features/PatientEegSessionsPage/components/EegSessionsDataTable";
import EegSessionsFilters from "@features/PatientEegSessionsPage/components/EegSessionsFilters";
import {
  sessions,
  type SessionStatus,
} from "@features/PatientEegSessionsPage/types";

export function PatientEegSessionsPage() {
  const isLoading = false;
  const [activeStatus, setActiveStatus] = useState<SessionStatus | "all">(
    "all",
  );

  const filteredSessions = useMemo(() => {
    if (activeStatus === "all") return sessions;
    return sessions.filter((session) => session.status === activeStatus);
  }, [activeStatus]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <EegSessionsFilters
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />

        <Button onClick={() => {}} className="px-4 py-2.5">
          Upload New EEG
        </Button>
      </div>

      <EegSessionsDataTable data={filteredSessions} isLoading={isLoading} />
    </div>
  );
}
