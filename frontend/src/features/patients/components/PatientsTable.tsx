import { memo, useCallback, useMemo, useState } from "react";
import type { TableColumn } from "react-data-table-component";
import { BsFileTextFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import Table from "@/shared/ui/Table";
import { IoIosArrowRoundForward } from "react-icons/io";
import statusMap from "@/shared/interfaces/PatientStatus";
import type { PatientStatus } from "@/shared/interfaces/PatientStatus";
import PatientsTableSkeleton from "@/shared/ui/skeletons/TableSkeleton";
import PatientsStatusFilters from "./PatientsStatusFilters";
import PatientsTableSearch from "./PatientsTableSearch";
import { usePatientsQuery } from "../hooks";
import type { PatientsListItem } from "../services/patientsListService";

type PatientRow = PatientsListItem & {
  lastSession: string;
};

const formatLastSession = (lastSessionDate: string | null) => {
  if (!lastSessionDate) {
    return "No sessions yet";
  }

  const parsedDate = new Date(lastSessionDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return lastSessionDate;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
};

const patientColumns: TableColumn<PatientRow>[] = [
  {
    name: "Patient Name",
    grow: 2.2,
    cell: (row) => (
      <div className="flex items-center gap-3 py-1 sm:gap-4">
        <div className="bg-brand-primary-soft size-10 rounded-full" />
        <div className="min-w-0">
          <p className="app-text-primary truncate text-base leading-none font-semibold sm:text-[18px]">
            {row.name}
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Age",
    sortable: true,
    selector: (row) => row.age,
    width: "110px",
    cell: (row) => (
      <span className="app-text-primary text-[15px]">{row.age}</span>
    ),
  },
  {
    name: "Medical ID",
    selector: (row) => row.medicalId,
    minWidth: "150px",
    cell: (row) => (
      <span className="app-text-secondary font-medium tracking-[0.02em]">
        {row.medicalId}
      </span>
    ),
  },
  {
    name: "EEG Files",
    minWidth: "150px",
    cell: (row) => (
      <div className="flex items-center gap-2 whitespace-nowrap text-emerald-600">
        <BsFileTextFill size={16} />
        <span className="app-text-primary font-medium">
          {String(row.sessionFilesNumber).padStart(2, "0")} Files
        </span>
      </div>
    ),
  },
  {
    name: "Last Session",
    sortable: true,
    selector: (row) => row.lastSession,
    minWidth: "180px",
    cell: (row) => (
      <span className="app-text-secondary text-[15px]">{row.lastSession}</span>
    ),
  },
  {
    name: "Status",
    right: true,
    minWidth: "160px",
    cell: (row) => {
      const status = statusMap[row.status];

      return (
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase sm:px-4 sm:text-xs ${status.textClass}`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${status.dotClass}`} />
          {status.label}
        </div>
      );
    },
  },
  {
    name: "Profile",
    button: true,
    minWidth: "160px",
    cell: (row) => (
      <Link
        to={routePaths.patientDetails.replace(":patientId", row.id)}
        className="animate text-brand-primary hover:bg-brand-primary-soft/50 flex w-full items-center justify-center gap-x-1 rounded-2xl px-4 py-3 font-bold sm:w-auto sm:py-2"
      >
        View
        <IoIosArrowRoundForward className="text-2xl" />
      </Link>
    ),
  },
];

const PatientsTable = () => {
  const [activeStatus, setActiveStatus] = useState<PatientStatus | "all">(
    "all",
  );
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data, isLoading } = usePatientsQuery({ page, limit });

  const handleStatusChange = useCallback((status: PatientStatus | "all") => {
    setPage(1);
    setActiveStatus(status);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setPage(1);
    setSearchValue(value);
  }, []);

  const filteredPatients = useMemo<PatientRow[]>(() => {
    if (isLoading) return [];
    const patients = data?.items ?? [];
    const normalizedSearch = searchValue.trim().toLowerCase();

    return patients
      .filter((patient) => {
        if (activeStatus !== "all" && patient.status !== activeStatus) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        return (
          patient.name.toLowerCase().includes(normalizedSearch) ||
          String(patient.medicalId).toLowerCase().includes(normalizedSearch) ||
          patient.status.toLowerCase().includes(normalizedSearch)
        );
      })
      .map((patient) => ({
        ...patient,
        lastSession: formatLastSession(patient.lastSessionDate),
      }));
  }, [activeStatus, data?.items, searchValue, isLoading]);

  if (isLoading) {
    return <PatientsTableSkeleton />;
  }
  console.log(data);
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <PatientsTableSearch
          value={searchValue}
          onChange={handleSearchChange}
        />
        <PatientsStatusFilters
          handleStatusChange={handleStatusChange}
          activeStatus={activeStatus || "all"}
        />
      </div>
      <Table
        className="rounded-2xl sm:rounded-[28px]"
        columns={patientColumns}
        data={filteredPatients}
        pagination
        paginationServer
        paginationPerPage={limit}
        totalRows={data?.pagination?.total ?? 0}
        onPageChange={(nextPage) => setPage(nextPage)}
        onRowsPerPageChange={(rowsPerPage) => {
          setLimit(rowsPerPage);
          setPage(1);
        }}
      />
    </div>
  );
};

export default memo(PatientsTable);
