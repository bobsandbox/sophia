"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { JournalEntry } from "@/generated/prisma/client";
import { DagHeader } from "./dag-header";
import { DagSamenvatting } from "./dag-samenvatting";
import { EntryList } from "./entry-list";
import { VoedingDialog } from "./voeding-dialog";
import { LuierDialog } from "./luier-dialog";
import { Button } from "@/components/ui/button";

interface DagboekData {
  entries: JournalEntry[];
  summary: { voedingCount: number; totalMl: number; luierCount: number };
}

interface DagboekClientProps {
  initialDate: string;
  initialData: DagboekData;
}

export function DagboekClient({ initialDate, initialData }: DagboekClientProps) {
  const [date, setDate] = useState(() => {
    const [y, m, d] = initialDate.split("-").map(Number);
    return new Date(y, m - 1, d);
  });
  const [data, setData] = useState<DagboekData>(initialData);
  const [voedingOpen, setVoedingOpen] = useState(false);
  const [luierOpen, setLuierOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);

  const fetchData = useCallback(async (d: Date) => {
    const res = await fetch(`/api/entries?date=${format(d, "yyyy-MM-dd")}`);
    const json = await res.json();
    setData(json);
  }, []);

  async function handleDateChange(d: Date) {
    setDate(d);
    await fetchData(d);
  }

  function handleEdit(entry: JournalEntry) {
    setEditEntry(entry);
    if (entry.entryType === "VOEDING") {
      setVoedingOpen(true);
    } else {
      setLuierOpen(true);
    }
  }

  async function handleSaveVoeding(body: {
    entryType: "VOEDING";
    timestamp: string;
    amountMl: number;
    braken: boolean;
  }) {
    try {
      if (editEntry) {
        await fetch(`/api/entries/${editEntry.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Voeding bijgewerkt");
      } else {
        await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Voeding toegevoegd");
      }
      setVoedingOpen(false);
      setEditEntry(null);
      await fetchData(date);
    } catch {
      toast.error("Er ging iets mis");
    }
  }

  async function handleSaveLuier(body: {
    entryType: "LUIER";
    timestamp: string;
    pipi: boolean;
    kaka: boolean;
  }) {
    try {
      if (editEntry) {
        await fetch(`/api/entries/${editEntry.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Luier bijgewerkt");
      } else {
        await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Luier toegevoegd");
      }
      setLuierOpen(false);
      setEditEntry(null);
      await fetchData(date);
    } catch {
      toast.error("Er ging iets mis");
    }
  }

  async function handleDelete() {
    if (!editEntry) return;
    try {
      await fetch(`/api/entries/${editEntry.id}`, { method: "DELETE" });
      toast.success("Verwijderd");
      setVoedingOpen(false);
      setLuierOpen(false);
      setEditEntry(null);
      await fetchData(date);
    } catch {
      toast.error("Er ging iets mis");
    }
  }

  function closeDialogs() {
    setVoedingOpen(false);
    setLuierOpen(false);
    setEditEntry(null);
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <DagHeader date={date} onDateChange={handleDateChange} />

      <DagSamenvatting
        voedingCount={data.summary.voedingCount}
        totalMl={data.summary.totalMl}
        luierCount={data.summary.luierCount}
      />

      <EntryList entries={data.entries} onEdit={handleEdit} />

      {/* Sticky bottom quick-add buttons */}
      <div className="sticky bottom-0 flex gap-3 border-t bg-background p-4">
        <Button
          className="h-12 flex-1 text-base"
          onClick={() => {
            setEditEntry(null);
            setVoedingOpen(true);
          }}
        >
          🍼 Voeding
        </Button>
        <Button
          variant="outline"
          className="h-12 flex-1 text-base"
          onClick={() => {
            setEditEntry(null);
            setLuierOpen(true);
          }}
        >
          🧷 Luier
        </Button>
      </div>

      <VoedingDialog
        open={voedingOpen}
        onClose={closeDialogs}
        onSave={handleSaveVoeding}
        onDelete={editEntry ? handleDelete : undefined}
        entry={editEntry?.entryType === "VOEDING" ? editEntry : null}
      />

      <LuierDialog
        open={luierOpen}
        onClose={closeDialogs}
        onSave={handleSaveLuier}
        onDelete={editEntry ? handleDelete : undefined}
        entry={editEntry?.entryType === "LUIER" ? editEntry : null}
      />
    </div>
  );
}
