import type { TableColumn } from "react-data-table-component";
import { BsFileTextFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import Table from "@/shared/ui/Table";
import { IoIosArrowRoundForward } from "react-icons/io";
import statusMap from "@/shared/interfaces/PatientStatus";
import type { PatientStatus } from "@/shared/interfaces/PatientStatus";
import PatientsTableSkeleton from "../../../shared/ui/skeletons/TableSkeleton";
type Patient = {
  id: string;
  name: string;
  subtitle: string;
  age: number;
  medicalId: string;
  eegFiles: number;
  lastSession: string;
  status: PatientStatus;
  avatar: string;
};

export const patientColumns: TableColumn<Patient>[] = [
  {
    name: "Patient Name",
    grow: 2.2,
    cell: (row) => (
      <div className="flex items-center gap-3 py-1 sm:gap-4">
        <img
          src={row.avatar}
          alt={row.name}
          className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
        />
        <div className="min-w-0">
          <p className="app-text-primary truncate text-base font-semibold leading-none sm:text-[18px]">
            {row.name}
          </p>
          <p className="app-text-secondary mt-1 truncate text-sm sm:text-[15px]">
            {row.subtitle}
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
          {String(row.eegFiles).padStart(2, "0")} Files
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
    cell: (row) => (
      <div
        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] sm:px-4 sm:text-xs ${statusMap[row.status].textClass}`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${statusMap[row.status].dotClass}`}
        />
        {row.status}
      </div>
    ),
  },
  {
    name: "Profile",
    button: true,
    minWidth: "160px",
    cell: (row) => (
      <Link
        to={routePaths.patientDetails.replace(":patientId", row.id)}
        className="font-bold animate flex w-full items-center justify-center gap-x-1 rounded-2xl px-4 py-3 text-brand-primary hover:bg-brand-primary-soft/50 sm:w-auto sm:py-2"
      >
        View
        <IoIosArrowRoundForward className="text-2xl" />
      </Link>
    ),
  },
];

export const patients: Patient[] = [
  {
    id: "1",
    name: "Sarah Miller",
    subtitle: "Neuropathy Grade II",
    age: 68,
    medicalId: "#NG-99231",
    eegFiles: 12,
    lastSession: "Today, 09:45 AM",
    status: "stable",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "2",
    name: "David Chen",
    subtitle: "Post-Seizure Recovery",
    age: 45,
    medicalId: "#NG-88421",
    eegFiles: 8,
    lastSession: "Yesterday, 04:20 PM",
    status: "monitoring",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    subtitle: "Epileptic Diagnostic Study",
    age: 32,
    medicalId: "#NG-77562",
    eegFiles: 4,
    lastSession: "Oct 24, 11:00 AM",
    status: "critical",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "4",
    name: "James Wilson",
    subtitle: "Chronic Insomnia Assessment",
    age: 59,
    medicalId: "#NG-11203",
    eegFiles: 21,
    lastSession: "Oct 23, 02:15 PM",
    status: "stable",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: "5",
    name: "Linda Gray",
    subtitle: "Sleep Apnea Monitoring",
    age: 54,
    medicalId: "#NG-55410",
    eegFiles: 6,
    lastSession: "Oct 22, 09:30 AM",
    status: "stable",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "6",
    name: "Ahmed Hassan",
    subtitle: "EEG Baseline Study",
    age: 41,
    medicalId: "#NG-66789",
    eegFiles: 10,
    lastSession: "Oct 21, 01:10 PM",
    status: "monitoring",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "7",
    name: "Sophia Turner",
    subtitle: "Seizure Pattern Analysis",
    age: 29,
    medicalId: "#NG-33991",
    eegFiles: 3,
    lastSession: "Oct 20, 10:05 AM",
    status: "critical",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    id: "8",
    name: "Michael Brown",
    subtitle: "Sleep Disorder Evaluation",
    age: 63,
    medicalId: "#NG-77882",
    eegFiles: 14,
    lastSession: "Oct 19, 06:40 PM",
    status: "stable",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
  },
];

const PatientsTable = () => {
  const isLoading = true;

  if (isLoading) {
    return <PatientsTableSkeleton />;
  }

  return (
    <Table
      className="rounded-2xl sm:rounded-[28px]"
      columns={patientColumns}
      data={patients}
      pagination
      paginationPerPage={5}
      totalRows={1248}
      //   paginationServer
      onPageChange={(page) => console.log(page)}
      onRowsPerPageChange={(rowsPerPage, page) =>
        console.log({ rowsPerPage, page })
      }
    />
  );
};

export default PatientsTable;
