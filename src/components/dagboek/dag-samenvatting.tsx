import { Card, CardContent } from "@/components/ui/card";

interface DagSamenvattingProps {
  voedingCount: number;
  totalMl: number;
  luierCount: number;
}

export function DagSamenvatting({
  voedingCount,
  totalMl,
  luierCount,
}: DagSamenvattingProps) {
  return (
    <Card className="mx-4">
      <CardContent className="flex items-center justify-around py-3 text-sm">
        <span>
          🍼 {voedingCount} voeding{voedingCount !== 1 ? "en" : ""} · {totalMl}ml
        </span>
        <span>
          🧷 {luierCount} luier{luierCount !== 1 ? "s" : ""}
        </span>
      </CardContent>
    </Card>
  );
}
