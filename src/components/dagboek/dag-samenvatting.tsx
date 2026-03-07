import { Card, CardContent } from "@/components/ui/card";
import { FaBottleWater, FaBaby } from "react-icons/fa6";

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
        <span className="inline-flex items-center gap-1.5">
          <FaBottleWater className="text-pink-500" />
          {voedingCount} voeding{voedingCount !== 1 ? "en" : ""} · {totalMl}ml
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FaBaby className="text-blue-500" />
          {luierCount} luier{luierCount !== 1 ? "s" : ""}
        </span>
      </CardContent>
    </Card>
  );
}
