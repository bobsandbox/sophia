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
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import type { JournalEntry } from "@/generated/prisma/client";
import { PEOPLE, getLastPerson, setLastPerson } from "@/lib/person";
import { FaBottleWater } from "react-icons/fa6";

const PRESETS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

interface VoedingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    entryType: "VOEDING";
    timestamp: string;
    amountMl: number;
    braken: boolean;
    person: string;
  }) => void;
  onDelete?: () => void;
  entry?: JournalEntry | null;
  selectedDate: Date;
}

export function VoedingDialog({
  open,
  onClose,
  onSave,
  onDelete,
  entry,
  selectedDate,
}: VoedingDialogProps) {
  const [amountMl, setAmountMl] = useState(60);
  const [braken, setBraken] = useState(false);
  const [person, setPerson] = useState(getLastPerson());
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));

  useEffect(() => {
    if (open) {
      if (entry) {
        setAmountMl(entry.amountMl ?? 60);
        setBraken(entry.braken ?? false);
        setPerson(entry.person ?? getLastPerson());
        setDate(format(new Date(entry.timestamp), "yyyy-MM-dd"));
        setTime(format(new Date(entry.timestamp), "HH:mm"));
      } else {
        setAmountMl(60);
        setBraken(false);
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
      entryType: "VOEDING",
      timestamp: ts.toISOString(),
      amountMl,
      braken,
      person,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            <FaBottleWater className="text-pink-500" />
            {entry ? "Voeding bewerken" : "Voeding toevoegen"}
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
            <label className="text-sm font-medium">Hoeveelheid (ml)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((ml) => (
                <Button
                  key={ml}
                  variant={amountMl === ml ? "default" : "outline"}
                  size="sm"
                  className="min-w-[44px]"
                  onClick={() => setAmountMl(ml)}
                >
                  {ml}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="braken"
              checked={braken}
              onCheckedChange={(c) => setBraken(c === true)}
            />
            <label htmlFor="braken" className="text-sm">
              Braken
            </label>
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
