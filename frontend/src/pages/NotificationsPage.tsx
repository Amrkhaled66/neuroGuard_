import CommunicationHealthCard from "@features/NotificationPage/components/CommunicationHealthCard";
import CommunicationLog from "@features/NotificationPage/components/CommunicationLog";
import {
  communicationHealthData,
  notificationsData,
} from "@features/NotificationPage/data";

export default function NotificationsPage() {
  return (
    <section className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.85fr)]">
          <div className="min-w-0">
            <CommunicationLog items={notificationsData} />
          </div>

          <div className="min-w-0">
            <CommunicationHealthCard metrics={communicationHealthData} />
          </div>
        </div>
      </div>
    </section>
  );
}