"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { JournalEntry } from "@/generated/prisma/client";
import { FaBottleWater, FaBaby, FaNoteSticky, FaTags } from "react-icons/fa6";
import { DagHeader } from "./dag-header";
import { DagSamenvatting } from "./dag-samenvatting";
import { EntryList } from "./entry-list";
import { VoedingDialog } from "./voeding-dialog";
import { LuierDialog } from "./luier-dialog";
import { OpmerkingDialog } from "./opmerking-dialog";
import { NotitieDialog } from "./notitie-dialog";
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
  const [opmerkingOpen, setOpmerkingOpen] = useState(false);
  const [notitieOpen, setNotitieOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);
  const saving = useRef(false);

  const anyDialogOpen = voedingOpen || luierOpen || opmerkingOpen || notitieOpen;

  const fetchData = useCallback(async (d: Date) => {
    const res = await fetch(`/api/entries?date=${format(d, "yyyy-MM-dd")}`);
    const json = await res.json();
    setData(json);
  }, []);

  // Poll for live updates every 5s (skip when a dialog is open)
  useEffect(() => {
    if (anyDialogOpen) return;
    const id = setInterval(() => fetchData(date), 5000);
    return () => clearInterval(id);
  }, [date, anyDialogOpen, fetchData]);

  async function handleDateChange(d: Date) {
    setDate(d);
    await fetchData(d);
  }

  function handleEdit(entry: JournalEntry) {
    setEditEntry(entry);
    if (entry.entryType === "VOEDING") setVoedingOpen(true);
    else if (entry.entryType === "LUIER") setLuierOpen(true);
    else if (entry.entryType === "OPMERKING") setOpmerkingOpen(true);
    else setNotitieOpen(true);
  }

  async function handleSaveEntry(body: { entryType: string; timestamp: string; [key: string]: unknown }) {
    if (saving.current) return;
    saving.current = true;
    try {
      const labels: Record<string, string> = {
        VOEDING: "Voeding", LUIER: "Luier", OPMERKING: "Opmerking", NOTITIE: "Notitie",
      };
      const typeName = labels[body.entryType] ?? "Entry";

      if (editEntry) {
        await fetch(`/api/entries/${editEntry.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success(`${typeName} bijgewerkt`);
      } else {
        await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success(`${typeName} toegevoegd`);
      }
      closeDialogs();

      const entryDate = new Date(body.timestamp);
      const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
      const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (entryDay.getTime() !== currentDay.getTime()) {
        setDate(entryDay);
        await fetchData(entryDay);
      } else {
        await fetchData(date);
      }
    } catch {
      toast.error("Er ging iets mis");
    } finally {
      saving.current = false;
    }
  }

  async function handleDelete() {
    if (!editEntry) return;
    try {
      await fetch(`/api/entries/${editEntry.id}`, { method: "DELETE" });
      toast.success("Verwijderd");
      closeDialogs();
      await fetchData(date);
    } catch {
      toast.error("Er ging iets mis");
    }
  }

  function closeDialogs() {
    setVoedingOpen(false);
    setLuierOpen(false);
    setOpmerkingOpen(false);
    setNotitieOpen(false);
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
          className="h-12 flex-1 gap-2 text-base"
          onClick={() => { setEditEntry(null); setVoedingOpen(true); }}
        >
          <FaBottleWater /> Voeding
        </Button>
        <Button
          variant="outline"
          className="h-12 flex-1 gap-2 text-base"
          onClick={() => { setEditEntry(null); setLuierOpen(true); }}
        >
          <FaBaby /> Luier
        </Button>
        <Button
          variant="outline"
          className="h-12 w-12 shrink-0 text-base"
          size="icon"
          onClick={() => { setEditEntry(null); setNotitieOpen(true); }}
        >
          <FaTags />
        </Button>
        <Button
          variant="outline"
          className="h-12 w-12 shrink-0 text-base"
          size="icon"
          onClick={() => { setEditEntry(null); setOpmerkingOpen(true); }}
        >
          <FaNoteSticky />
        </Button>
      </div>

      <VoedingDialog
        open={voedingOpen}
        onClose={closeDialogs}
        onSave={handleSaveEntry}
        onDelete={editEntry ? handleDelete : undefined}
        entry={editEntry?.entryType === "VOEDING" ? editEntry : null}
        selectedDate={date}
      />

      <LuierDialog
        open={luierOpen}
        onClose={closeDialogs}
        onSave={handleSaveEntry}
        onDelete={editEntry ? handleDelete : undefined}
        entry={editEntry?.entryType === "LUIER" ? editEntry : null}
        selectedDate={date}
      />

      <OpmerkingDialog
        open={opmerkingOpen}
        onClose={closeDialogs}
        onSave={handleSaveEntry}
        onDelete={editEntry ? handleDelete : undefined}
        entry={editEntry?.entryType === "OPMERKING" ? editEntry : null}
        selectedDate={date}
      />

      <NotitieDialog
        open={notitieOpen}
        onClose={closeDialogs}
        onSave={handleSaveEntry}
        onDelete={editEntry ? handleDelete : undefined}
        entry={editEntry?.entryType === "NOTITIE" ? editEntry : null}
        selectedDate={date}
      />
    </div>
  );
}
