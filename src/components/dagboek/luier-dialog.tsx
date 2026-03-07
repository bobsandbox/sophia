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
import { FaBaby, FaDroplet, FaPoo } from "react-icons/fa6";

interface LuierDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    entryType: "LUIER";
    timestamp: string;
    pipi: boolean;
    kaka: boolean;
    person: string;
  }) => void;
  onDelete?: () => void;
  entry?: JournalEntry | null;
  selectedDate: Date;
}

export function LuierDialog({
  open,
  onClose,
  onSave,
  onDelete,
  entry,
  selectedDate,
}: LuierDialogProps) {
  const [pipi, setPipi] = useState(false);
  const [kaka, setKaka] = useState(false);
  const [person, setPerson] = useState(getLastPerson());
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));

  useEffect(() => {
    if (open) {
      if (entry) {
        setPipi(entry.pipi ?? false);
        setKaka(entry.kaka ?? false);
        setPerson(entry.person ?? getLastPerson());
        setDate(format(new Date(entry.timestamp), "yyyy-MM-dd"));
        setTime(format(new Date(entry.timestamp), "HH:mm"));
      } else {
        setPipi(false);
        setKaka(false);
        setPerson(getLastPerson());
        setDate(format(selectedDate, "yyyy-MM-dd"));
        setTime(format(new Date(), "HH:mm"));
      }
    }
  }, [open, entry, selectedDate]);

  function handleSave() {
    const [y, mo, d] = date.split("-").map(Number);
    const [h, m] = time.split(":").map(Number);
    const ts = new Date(y, mo - 1, d, h, m, 0, 0);

    setLastPerson(person);

    onSave({
      entryType: "LUIER",
      timestamp: ts.toISOString(),
      pipi,
      kaka,
      person,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            <FaBaby className="text-blue-500" />
            {entry ? "Luier bewerken" : "Luier toevoegen"}
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPipi(!pipi)}
              className={`flex-1 rounded-lg border-2 py-4 text-center text-lg font-medium transition-colors ${
                pipi
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "border-muted hover:border-muted-foreground/30"
              }`}
            >
              <FaDroplet className="inline mr-1.5" /> Pipi
            </button>
            <button
              type="button"
              onClick={() => setKaka(!kaka)}
              className={`flex-1 rounded-lg border-2 py-4 text-center text-lg font-medium transition-colors ${
                kaka
                  ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  : "border-muted hover:border-muted-foreground/30"
              }`}
            >
              <FaPoo className="inline mr-1.5" /> Kaka
            </button>
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
          <Button onClick={handleSave}>Opslaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
