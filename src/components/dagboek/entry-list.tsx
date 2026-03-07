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
            <th className="pb-2 text-center font-medium">🍼 Voeding</th>
            <th className="pb-2 text-center font-medium">💧 Plas</th>
            <th className="pb-2 text-center font-medium">💩 Kaka</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              onClick={() => onEdit(entry)}
              className="border-b border-muted/50 cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted"
            >
              <td className="py-3 text-sm tabular-nums text-muted-foreground">
                {format(new Date(entry.timestamp), "HH:mm")}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
