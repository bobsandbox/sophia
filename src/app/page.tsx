import { format } from "date-fns";
import { getEntriesByDate, getDailySummary } from "@/lib/services/journal";
import { DagboekClient } from "@/components/dagboek/dagboek-client";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const today = format(new Date(), "yyyy-MM-dd");
  const dateStr = dateParam ?? today;

  const [entries, summary] = await Promise.all([
    getEntriesByDate(dateStr),
    getDailySummary(dateStr),
  ]);

  return (
    <DagboekClient
      initialDate={dateStr}
      initialData={{ entries: JSON.parse(JSON.stringify(entries)), summary }}
    />
  );
}
