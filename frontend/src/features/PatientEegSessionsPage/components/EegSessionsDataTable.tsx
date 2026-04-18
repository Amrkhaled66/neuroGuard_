import type { TableColumn } from "react-data-table-component";
import { FiCalendar, FiDownload } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";

import Table from "@/shared/ui/Table";
import TableSkeleton from "@/shared/ui/skeletons/TableSkeleton";

import { sessionStatusMap, type SessionHistory } from "../types";

type EegSessionsDataTableProps = {
  data: SessionHistory[];
  isLoading?: boolean;
};

const sessionHistoryColumns: TableColumn<SessionHistory>[] = [
  {
    name: "DATE",
    grow: 1.6,
    sortable: true,
    selector: (row) => row.date,
    cell: (row) => (
      <div className="flex items-center gap-3 py-2">
        <FiCalendar size={18} />
        <span className="text-[15px] font-semibold">{row.date}</span>
      </div>
    ),
  },
  {
    name: "DURATION",
    sortable: true,
    selector: (row) => row.duration,
    center: true,
    cell: (row) => (
      <span className="text-[15px] font-medium">{row.duration}</span>
    ),
  },
  {
    name: "CHANNELS",
    sortable: true,
    selector: (row) => row.channels,
    center: true,
    cell: (row) => (
      <span className="text-[15px] font-medium">{row.channels}</span>
    ),
  },
  {
    name: "SEIZURES",
    sortable: true,
    selector: (row) => row.seizures,
    center: true,
    cell: (row) => {
      const isDanger = row.seizures !== 0;

      return (
        <span
          className={`inline-flex min-w-9 items-center justify-center rounded-lg px-3 py-1 text-sm font-bold ${
            isDanger && "bg-status-danger text-white"
          }`}
        >
          {row.seizures}
        </span>
      );
    },
  },
  {
    name: "STATUS",
    center: true,
    cell: (row) => {
      const status = sessionStatusMap[row.status];

      return (
        <div
          className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold ${status.bgClass} ${status.textClass}`}
        >
          {status.label}
        </div>
      );
    },
  },
  {
    name: "ACTIONS",
    right: true,
    minWidth: "120px",
    cell: (row) => (
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => console.log("view session", row.id)}
          className="transition"
          aria-label={`View session ${row.date}`}
        >
          <IoEyeOutline size={20} />
        </button>

        <button
          type="button"
          onClick={() => console.log("download report", row.id)}
          className="transition"
          aria-label={`Download session ${row.date}`}
        >
          <FiDownload size={18} />
        </button>
      </div>
    ),
  },
];

export default function EegSessionsDataTable({
  data,
  isLoading = false,
}: EegSessionsDataTableProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <Table
      columns={sessionHistoryColumns}
      data={data}
      pagination
      paginationPerPage={5}
      totalRows={data.length}
      onPageChange={(page) => console.log(page)}
      onRowsPerPageChange={(rowsPerPage, page) =>
        console.log({ rowsPerPage, page })
      }
    />
  );
}
