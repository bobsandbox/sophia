"use client";

import { format } from "date-fns";
import type { JournalEntry } from "@/generated/prisma/client";

interface EntryCardProps {
  entry: JournalEntry;
  onClick: () => void;
}

export function EntryCard({ entry, onClick }: EntryCardProps) {
  const time = format(new Date(entry.timestamp), "HH:mm");

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
    >
      <span className="text-sm text-muted-foreground tabular-nums">{time}</span>

      {entry.entryType === "VOEDING" ? (
        <div className="flex items-center gap-2">
          <span>🍼</span>
          <span className="font-medium">{entry.amountMl}ml</span>
          {entry.braken && (
            <span className="text-sm text-amber-600 dark:text-amber-400">
              ⚠ braken
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>🧷</span>
          <span className="font-medium">
            {[entry.pipi && "pipi", entry.kaka && "kaka"]
              .filter(Boolean)
              .join(" + ") || "leeg"}
          </span>
        </div>
      )}
    </button>
  );
}
