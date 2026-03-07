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
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  const [entries, summary] = await Promise.all([
    getEntriesByDate(date),
    getDailySummary(date),
  ]);

  return (
    <DagboekClient
      initialDate={dateStr}
      initialData={{ entries: JSON.parse(JSON.stringify(entries)), summary }}
    />
  );
}
