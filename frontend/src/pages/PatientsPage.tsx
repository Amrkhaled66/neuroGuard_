import { Link } from "react-router-dom";
import { routePaths } from "@/app/router/paths";
import { BiSolidLeftArrow } from "react-icons/bi";
import PatientsTable from "@/features/patients/components/PatientsTable";
import PageHeader from "@/shared/components/PageHeader";
import Button from "@/shared/ui/Button";
import { IoPersonAddOutline } from "react-icons/io5";
export function PatientsPage() {
  return (
    <section className="space-y-5 sm:space-y-6">
      <PageHeader
        title="Patient Registry"
        description="Access clinical records, EEG diagnostics, and real-time monitoring sessions for all active
neurological cases."
      />

      <PatientsTable />
      <Button className="fixed right-5 bottom-5 !rounded-full px-3 py-3">
        <IoPersonAddOutline className="text-xl font-bold" />
        {/* Register Patient */}
      </Button>
    </section>
  );
}
