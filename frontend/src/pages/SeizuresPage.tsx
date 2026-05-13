import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MdOutlineAnalytics } from "react-icons/md";
import { FiActivity, FiLayers } from "react-icons/fi";
import {
  IntensityDistributionCard,
  PatternCard,
  RecentEventsTable,
  SeizureTrendChart,
  SummaryCard,
  usePatientSeizureAnalytics,
  type PatternCardItem,
  type SummaryCardItem,
  formatDateTime,
  formatDurationFromSeconds,
} from "@features/SeizuresPage";

const PAGE_SIZE = 10;

export default function SeizuresPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const parsedPatientId = Number.parseInt(patientId || "0", 10);
  const [page, setPage] = useState(1);

  const analyticsQuery = usePatientSeizureAnalytics(parsedPatientId, {
    days: 90,
    page,
    limit: PAGE_SIZE,
  });

  const isLoading = analyticsQuery.isLoading;
  const analytics = analyticsQuery.data;

  const summaryCards = useMemo<SummaryCardItem[]>(() => {
    if (!analytics) {
      return [];
    }

    return [
      {
        title: "Total Seizures",
        value: String(analytics.summary.totalSeizures),
        subtitle: "Last 90 days",
      },
      {
        title: "Avg Duration",
        value: formatDurationFromSeconds(analytics.summary.avgDurationSeconds),
        subtitle: "Average seizure duration",
      },
      {
        title: "Seizure Sessions",
        value: String(analytics.summary.sessionsWithSeizures),
        subtitle: "Analyzed sessions with events",
      },
      {
        title: "Peak Day Count",
        value: String(analytics.summary.maxDailySeizures),
        subtitle: "Highest daily seizure total",
      },
      {
        title: "Analyzed Sessions",
        value: String(analytics.summary.analyzedSessions),
        subtitle: `${analytics.summary.processingSessions} processing / ${analytics.summary.failedSessions} failed`,
      },
    ];
  }, [analytics]);

  const patternCards = useMemo<PatternCardItem[]>(() => {
    if (!analytics) {
      return [];
    }

    return [
      {
        title: "Busiest Session",
        subtitle: analytics.patterns.busiestSession
          ? `${analytics.patterns.busiestSession.fileName} | ${analytics.patterns.busiestSession.seizureCount} seizures | ${formatDateTime(analytics.patterns.busiestSession.sessionDate)}`
          : "No analyzed seizure sessions yet",
        icon: <FiLayers className="h-5 w-5" />,
      },
      {
        title: "Longest Event",
        subtitle: analytics.patterns.longestEvent
          ? `${analytics.patterns.longestEvent.fileName} | ${formatDurationFromSeconds(analytics.patterns.longestEvent.durationSeconds)} | ${formatDateTime(analytics.patterns.longestEvent.sessionDate)}`
          : "No analyzed seizure events yet",
        icon: <FaClockRotateLeft className="h-5 w-5" />,
      },
    ];
  }, [analytics]);

  if (!parsedPatientId) {
    return (
      <section className="min-h-screen p-6">
        <div className="app-surface rounded-3xl p-6 text-red-600">
          Invalid patient id.
        </div>
      </section>
    );
  }

  if (analyticsQuery.error) {
    return (
      <section className="min-h-screen p-6">
        <div className="app-surface rounded-3xl p-6 text-red-600">
          {analyticsQuery.error.message || "Failed to load seizure analytics."}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen p-6">
      <div className="mx-auto grid w-full grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} isLoading={isLoading} />
            ))}
            {isLoading && summaryCards.length === 0
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SummaryCard
                    key={index}
                    title=""
                    value=""
                    subtitle=""
                    isLoading
                  />
                ))
              : null}
          </div>

          <SeizureTrendChart
            data={analytics?.trend ?? []}
            isLoading={isLoading}
          />

          <RecentEventsTable
            data={analytics?.recentEvents ?? []}
            pagination={analytics?.pagination ?? null}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="app-surface rounded-3xl p-6">
            <h3 className="app-text-primary text-2xl font-bold">
              Pattern Analysis
            </h3>

            <div className="mt-6 space-y-4">
              {patternCards.map((card) => (
                <PatternCard key={card.title} {...card} isLoading={isLoading} />
              ))}
              {isLoading && patternCards.length === 0
                ? Array.from({ length: 2 }).map((_, index) => (
                    <PatternCard
                      key={index}
                      title=""
                      subtitle=""
                      icon={
                        index === 0 ? (
                          <MdOutlineAnalytics className="h-5 w-5" />
                        ) : (
                          <FiActivity className="h-5 w-5" />
                        )
                      }
                      isLoading
                    />
                  ))
                : null}
            </div>
          </div>

          <IntensityDistributionCard
            data={
              analytics?.durationDistribution ?? { high: 0, med: 0, low: 0 }
            }
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
