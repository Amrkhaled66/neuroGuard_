import NotificationCard from "./NotificationCard";
import type { NotificationItem } from "../types";

type CommunicationLogProps = {
  items: NotificationItem[];
};

export default function CommunicationLog({ items }: CommunicationLogProps) {
  return (
    <section>
      <h3 className="app-text-primary text-3xl font-bold">Communication Log</h3>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <NotificationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
