import type { TableColumn } from "react-data-table-component";
import Table from "@/shared/ui/Table";
import { events } from "../data";
import { RecentEventsTableSkeleton } from "../skeletons";
import type { EventRow, EventTone } from "../types";

function toneClasses(tone: EventTone) {
  if (tone === "high") {
    return "bg-[var(--status-danger-soft)] text-[var(--status-danger)]";
  }
  if (tone === "medium") {
    return "bg-[var(--status-warning-soft)] text-[var(--status-warning)]";
  }
  return "bg-[var(--status-success-soft)] text-[var(--status-success)]";
}

const recentEventColumns: TableColumn<EventRow>[] = [
  {
    name: "Date/Time",
    sortable: true,
    selector: (row) => row.dateTime,
    minWidth: "180px",
    cell: (row) => (
      <span className="app-text-primary text-[15px] font-medium">
        {row.dateTime}
      </span>
    ),
  },
  {
    name: "Type",
    minWidth: "160px",
    cell: (row) => (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses(
          row.tone,
        )}`}
      >
        {row.type}
      </span>
    ),
  },
  {
    name: "Duration",
    sortable: true,
    selector: (row) => row.duration,
    minWidth: "120px",
    cell: (row) => (
      <span className="app-text-secondary text-[15px]">{row.duration}</span>
    ),
  },
  {
    name: "Triggers",
    selector: (row) => row.trigger,
    minWidth: "180px",
    cell: (row) => (
      <span className="app-text-secondary text-[15px]">{row.trigger}</span>
    ),
  },
  {
    name: "Postictal State",
    selector: (row) => row.postictalState,
    minWidth: "180px",
    cell: (row) => (
      <span className="app-text-secondary text-[15px]">
        {row.postictalState}
      </span>
    ),
  },
];

type RecentEventsTableProps = {
  isLoading?: boolean;
};

export default function RecentEventsTable({
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
          data={events}
          pagination
          paginationPerPage={5}
          totalRows={events.length}
          onPageChange={(page) => console.log(page)}
          onRowsPerPageChange={(rowsPerPage, page) =>
            console.log({ rowsPerPage, page })
          }
        />
      </div>
    </div>
  );
}
