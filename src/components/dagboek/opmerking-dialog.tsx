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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import type { JournalEntry } from "@/generated/prisma/client";
import { PEOPLE, getLastPerson, setLastPerson } from "@/lib/person";
import { FaNoteSticky } from "react-icons/fa6";

interface OpmerkingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    entryType: "OPMERKING";
    timestamp: string;
    remark: string;
    person: string;
  }) => void;
  onDelete?: () => void;
  entry?: JournalEntry | null;
  selectedDate: Date;
}

export function OpmerkingDialog({
  open,
  onClose,
  onSave,
  onDelete,
  entry,
  selectedDate,
}: OpmerkingDialogProps) {
  const [remark, setRemark] = useState("");
  const [person, setPerson] = useState(getLastPerson());
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));

  useEffect(() => {
    if (open) {
      if (entry) {
        setRemark(entry.remark ?? "");
        setPerson(entry.person ?? getLastPerson());
        setDate(format(new Date(entry.timestamp), "yyyy-MM-dd"));
        setTime(format(new Date(entry.timestamp), "HH:mm"));
      } else {
        setRemark("");
        setPerson(getLastPerson());
        setDate(format(selectedDate, "yyyy-MM-dd"));
        setTime(format(new Date(), "HH:mm"));
      }
    }
  }, [open, entry, selectedDate]);

  function handleSave() {
    if (!remark.trim()) return;
    const [y, mo, d] = date.split("-").map(Number);
    const [h, m] = time.split(":").map(Number);
    const ts = new Date(y, mo - 1, d, h, m, 0, 0);

    setLastPerson(person);

    onSave({
      entryType: "OPMERKING",
      timestamp: ts.toISOString(),
      remark: remark.trim(),
      person,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            <FaNoteSticky className="text-amber-500" />
            {entry ? "Opmerking bewerken" : "Opmerking toevoegen"}
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
            <label className="text-sm font-medium">Opmerking</label>
            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Typ een opmerking..."
              className="mt-1"
              rows={3}
            />
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
          <Button onClick={handleSave} disabled={!remark.trim()}>
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
