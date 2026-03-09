"use client";

import type { JournalEntry } from "@/generated/prisma/client";
import { format } from "date-fns";
import { FaDroplet, FaPoo, FaTriangleExclamation } from "react-icons/fa6";
import { EntryIcon } from "./entry-icons";

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
            <th className="pb-2 pl-1 pr-2 text-left font-medium w-10"></th>
            <th className="pb-2 px-2 text-left font-medium min-w-14">Tijd</th>
            <th className="pb-2 px-2 text-left font-medium">Wie</th>
            <th className="pb-2 px-2 text-center font-medium">Voeding</th>
            <th className="pb-2 px-2 text-center font-medium"><FaDroplet className="inline" /></th>
            <th className="pb-2 px-2 text-center font-medium"><FaPoo className="inline" /></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) =>
            entry.entryType === "OPMERKING" ? (
              <tr
                key={entry.id}
                onClick={() => onEdit(entry)}
                className="border-b border-muted/50 cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted"
              >
                <td className="py-2.5 pl-1 pr-2">
                  <EntryIcon type="OPMERKING" />
                </td>
                <td className="py-2.5 px-2 text-sm tabular-nums text-muted-foreground">
                  {format(new Date(entry.timestamp), "HH:mm")}
                </td>
                <td colSpan={4} className="py-2.5 px-2 text-xs italic text-primary">
                  {entry.remark}
                </td>
              </tr>
            ) : (
              <tr
                key={entry.id}
                onClick={() => onEdit(entry)}
                className="border-b border-muted/50 cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted"
              >
                <td className="py-2.5 pl-1 pr-2">
                  <EntryIcon type={entry.entryType} />
                </td>
                <td className="py-2.5 px-2 text-sm tabular-nums text-muted-foreground">
                  {format(new Date(entry.timestamp), "HH:mm")}
                </td>
                <td className="py-2.5 px-2 text-sm text-muted-foreground">
                  {entry.person ?? "-"}
                </td>
                <td className="py-2.5 px-2 text-center">
                  {entry.entryType === "VOEDING" ? (
                    <span className="text-sm font-medium">
                      {entry.amountMl}ml
                      {entry.braken && (
                        <span className="ml-1 text-amber-600 dark:text-amber-400">
                          <FaTriangleExclamation className="inline text-xs" />
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/30">-</span>
                  )}
                </td>
                <td className="py-2.5 px-2 text-center">
                  {entry.entryType === "LUIER" && entry.pipi ? (
                    <span className="text-blue-500 dark:text-blue-400">
                      <FaDroplet className="inline" />
                    </span>
                  ) : (
                    <span className="text-muted-foreground/30">-</span>
                  )}
                </td>
                <td className="py-2.5 px-2 text-center">
                  {entry.entryType === "LUIER" && entry.kaka ? (
                    <span className="text-amber-600 dark:text-amber-400">
                      <FaPoo className="inline" />
                    </span>
                  ) : (
                    <span className="text-muted-foreground/30">-</span>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
