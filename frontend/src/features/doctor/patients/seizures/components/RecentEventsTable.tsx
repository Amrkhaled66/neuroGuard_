import type { TableColumn } from "react-data-table-component";
import Table from "@/shared/ui/Table";
import { RecentEventsTableSkeleton } from "../skeletons";
import type {
  SeizureAnalyticsPagination,
  SeizureEventRow,
} from "../types";
import {
  formatDateTime,
  formatDurationFromSeconds,
  formatOffsetSeconds,
} from "../types";

const recentEventColumns: TableColumn<SeizureEventRow>[] = [
  {
    name: "Session Date",
    sortable: true,
    selector: (row) => row.sessionDate ?? "",
    minWidth: "180px",
    cell: (row) => (
      <span className="app-text-primary text-[15px] font-medium">
        {formatDateTime(row.sessionDate)}
      </span>
    ),
  },
  {
    name: "File",
    minWidth: "180px",
    cell: (row) => (
      <span className="app-text-secondary text-[15px]">{row.fileName}</span>
    ),
  },
  {
    name: "Start Offset",
    sortable: true,
    selector: (row) => row.startTimeSeconds,
    minWidth: "120px",
    cell: (row) => (
      <span className="app-text-secondary text-[15px]">
        {formatOffsetSeconds(row.startTimeSeconds)}
      </span>
    ),
  },
  {
    name: "End Offset",
    selector: (row) => row.endTimeSeconds,
    minWidth: "120px",
    cell: (row) => (
      <span className="app-text-secondary text-[15px]">
        {formatOffsetSeconds(row.endTimeSeconds)}
      </span>
    ),
  },
  {
    name: "Duration",
    sortable: true,
    selector: (row) => row.durationSeconds,
    minWidth: "120px",
    cell: (row) => (
      <span className="app-text-secondary text-[15px]">
        {formatDurationFromSeconds(row.durationSeconds)}
      </span>
    ),
  },
];

type RecentEventsTableProps = {
  data: SeizureEventRow[];
  pagination: SeizureAnalyticsPagination | null;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

export default function RecentEventsTable({
  data,
  pagination,
  onPageChange,
  isLoading = false,
}: RecentEventsTableProps) {
  if (isLoading) return <RecentEventsTableSkeleton />;

  return (
    <div className="app-surface rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="app-text-primary text-3xl font-bold">Recent Events</h3>
      </div>

      <div className="mt-6">
        <Table
          className="rounded-2xl sm:rounded-[28px]"
          columns={recentEventColumns}
          data={data}
          pagination
          paginationServer
          paginationPerPage={pagination?.limit ?? 10}
          totalRows={pagination?.total ?? 0}
          onPageChange={onPageChange}
          noDataText="No recent seizure events found"
        />
      </div>
    </div>
  );
}
