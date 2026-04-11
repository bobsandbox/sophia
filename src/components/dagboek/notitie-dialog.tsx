"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import type { JournalEntry } from "@/generated/prisma/client";
import { PEOPLE, getLastPerson, setLastPerson } from "@/lib/person";
import { FaTags, FaGear } from "react-icons/fa6";
import Link from "next/link";

interface Label {
  id: string;
  name: string;
}

interface NotitieDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    entryType: "NOTITIE";
    timestamp: string;
    labels: string[];
    person: string;
  }) => void;
  onDelete?: () => void;
  entry?: JournalEntry | null;
  selectedDate: Date;
}

export function NotitieDialog({
  open,
  onClose,
  onSave,
  onDelete,
  entry,
  selectedDate,
}: NotitieDialogProps) {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [person, setPerson] = useState(getLastPerson());
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));

  useEffect(() => {
    if (open) {
      if (entry) {
        setSelectedLabels(entry.labels ?? []);
        setPerson(entry.person ?? getLastPerson());
        setDate(format(new Date(entry.timestamp), "yyyy-MM-dd"));
        setTime(format(new Date(entry.timestamp), "HH:mm"));
      } else {
        setSelectedLabels([]);
        setPerson(getLastPerson());
        setDate(format(selectedDate, "yyyy-MM-dd"));
        setTime(format(new Date(), "HH:mm"));
      }

      fetch("/api/labels")
        .then((r) => r.json())
        .then((data) => setAvailableLabels(data))
        .catch(() => {});
    }
  }, [open, entry, selectedDate]);

  function toggleLabel(name: string) {
    setSelectedLabels((prev) =>
      prev.includes(name) ? prev.filter((l) => l !== name) : [...prev, name]
    );
  }

  function handleSave() {
    if (selectedLabels.length === 0) return;
    const [y, mo, d] = date.split("-").map(Number);
    const [h, m] = time.split(":").map(Number);
    const ts = new Date(y, mo - 1, d, h, m, 0, 0);

    setLastPerson(person);

    onSave({
      entryType: "NOTITIE",
      timestamp: ts.toISOString(),
      labels: selectedLabels,
      person,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            <FaTags className="text-teal-500" />
            {entry ? "Notitie bewerken" : "Notitie toevoegen"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Wie</label>
            <div className="mt-2 flex gap-2">
              {PEOPLE.map((p) => (
                <Button
                  key={p}
                  variant={person === p ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setPerson(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Labels</label>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={onClose}
              >
                <FaGear className="text-[10px]" /> Beheren
              </Link>
            </div>
            {availableLabels.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Nog geen labels.{" "}
                <Link href="/settings" className="underline" onClick={onClose}>
                  Voeg er een toe
                </Link>
              </p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {availableLabels.map((label) => {
                  const selected = selectedLabels.includes(label.name);
                  return (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => toggleLabel(label.name)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        selected
                          ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-600"
                          : "border-muted-foreground/20 hover:border-teal-400/50 hover:bg-muted"
                      }`}
                    >
                      {label.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium sm:text-sm">Datum</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium sm:text-sm">Tijdstip</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2">
          {entry && onDelete && (
            <Button variant="destructive" onClick={onDelete} className="mr-auto">
              Verwijderen
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
          <Button onClick={handleSave} disabled={selectedLabels.length === 0}>
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
