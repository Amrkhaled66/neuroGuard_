import {
  IntensityDistributionCard,
  PatternCard,
  patternCards,
  RecentEventsTable,
  SeizureTrendChart,
  SummaryCard,
  summaryCards,
} from "@features/SeizuresPage";

export default function SeizuresPage() {
  const isLoading = false;

  return (
    <section className="min-h-screen p-6">
      <div className="mx-auto w-full grid gap-6
      grid-cols-1 xl:grid-cols-[2fr_1fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} isLoading={isLoading} />
            ))}
          </div>

          <SeizureTrendChart isLoading={isLoading} />
          <RecentEventsTable isLoading={isLoading} />
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
            </div>
          </div>

          <IntensityDistributionCard
            data={{ high: 5, med: 6, low: 7 }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
