import { Link } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { BiSolidLeftArrow } from "react-icons/bi";
import PatientsTable from "@/features/patients/components/PatientsTable";
import PageHeader from "@/shared/components/PageHeader";
import Button from "@/shared/ui/Button";
export function PatientsPage() {
  return (
    <section className="space-y-5 sm:space-y-6">
      <PageHeader
        title="Patient Registry"
        description="Access clinical records, EEG diagnostics, and real-time monitoring sessions for all active
neurological cases."
      />
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap">
        <Button className="rounded-2xl!" variant="primary">
          <Link
            className="flex  gap-x-2 items-center"
            to={routePaths.doctorDashboard}
          >
            <BiSolidLeftArrow /> Back to dashboard
          </Link>
        </Button>
      </div>

      <PatientsTable />
    </section>
  );
}
