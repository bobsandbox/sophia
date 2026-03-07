"use client";

import type { JournalEntry } from "@/generated/prisma/client";
import { format } from "date-fns";

interface EntryListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
}

export function EntryList({ entries, onEdit }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p>Nog geen entries vandaag</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 mt-3">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-muted-foreground border-b">
            <th className="pb-2 text-left font-medium">Tijd</th>
            <th className="pb-2 text-left font-medium">Wie</th>
            <th className="pb-2 text-center font-medium">🍼 Voeding</th>
            <th className="pb-2 text-center font-medium">💧 Plas</th>
            <th className="pb-2 text-center font-medium">💩 Kaka</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const rowColors = {
              VOEDING: "bg-pink-50/50 dark:bg-pink-950/20",
              LUIER: "bg-blue-50/50 dark:bg-blue-950/20",
              OPMERKING: "bg-amber-50/50 dark:bg-amber-950/20",
            };
            const colorClass = rowColors[entry.entryType] ?? "";

            return entry.entryType === "OPMERKING" ? (
              <tr
                key={entry.id}
                onClick={() => onEdit(entry)}
                className={`border-b border-muted/50 cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted ${colorClass}`}
              >
                <td className="py-3 text-sm tabular-nums text-muted-foreground">
                  {format(new Date(entry.timestamp), "HH:mm")}
                </td>
                <td colSpan={4} className="py-3 text-sm italic text-muted-foreground">
                  📝 {entry.remark}
                </td>
              </tr>
            ) : (
              <tr
                key={entry.id}
                onClick={() => onEdit(entry)}
                className={`border-b border-muted/50 cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted ${colorClass}`}
              >
                <td className="py-3 text-sm tabular-nums text-muted-foreground">
                  {format(new Date(entry.timestamp), "HH:mm")}
                </td>
                <td className="py-3 text-sm text-muted-foreground">
                  {entry.person ?? "-"}
                </td>
                <td className="py-3 text-center">
                  {entry.entryType === "VOEDING" ? (
                    <span className="text-sm font-medium">
                      {entry.amountMl}ml
                      {entry.braken && <span className="ml-1 text-amber-600 dark:text-amber-400">⚠</span>}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/30">-</span>
                  )}
                </td>
                <td className="py-3 text-center">
                  {entry.entryType === "LUIER" && entry.pipi ? (
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                  ) : (
                    <span className="text-muted-foreground/30">-</span>
                  )}
                </td>
                <td className="py-3 text-center">
                  {entry.entryType === "LUIER" && entry.kaka ? (
                    <span className="text-amber-600 dark:text-amber-400">✓</span>
                  ) : (
                    <span className="text-muted-foreground/30">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
