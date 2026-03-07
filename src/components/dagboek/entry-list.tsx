"use client";

import type { JournalEntry } from "@/generated/prisma/client";
import { EntryCard } from "./entry-card";
import { Separator } from "@/components/ui/separator";

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
    <div className="flex-1 overflow-y-auto">
      {entries.map((entry, i) => (
        <div key={entry.id}>
          {i > 0 && <Separator className="mx-4" />}
          <EntryCard entry={entry} onClick={() => onEdit(entry)} />
        </div>
      ))}
    </div>
  );
}
