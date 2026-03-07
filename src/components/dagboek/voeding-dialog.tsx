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

const PRESETS = [30, 60, 90, 120, 150, 180];

interface VoedingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    entryType: "VOEDING";
    timestamp: string;
    amountMl: number;
    braken: boolean;
  }) => void;
  onDelete?: () => void;
  entry?: JournalEntry | null;
}

export function VoedingDialog({
  open,
  onClose,
  onSave,
  onDelete,
  entry,
}: VoedingDialogProps) {
  const [amountMl, setAmountMl] = useState(120);
  const [braken, setBraken] = useState(false);
  const [time, setTime] = useState(format(new Date(), "HH:mm"));

  useEffect(() => {
    if (open) {
      if (entry) {
        setAmountMl(entry.amountMl ?? 120);
        setBraken(entry.braken ?? false);
        setTime(format(new Date(entry.timestamp), "HH:mm"));
      } else {
        setAmountMl(120);
        setBraken(false);
        setTime(format(new Date(), "HH:mm"));
      }
    }
  }, [open, entry]);

  function handleSave() {
    const [h, m] = time.split(":").map(Number);
    const ts = new Date();
    if (entry) {
      ts.setTime(new Date(entry.timestamp).getTime());
    }
    ts.setHours(h, m, 0, 0);

    onSave({
      entryType: "VOEDING",
      timestamp: ts.toISOString(),
      amountMl,
      braken,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>🍼 {entry ? "Voeding bewerken" : "Voeding toevoegen"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Hoeveelheid (ml)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((ml) => (
                <Button
                  key={ml}
                  variant={amountMl === ml ? "default" : "outline"}
                  size="sm"
                  className="min-w-[52px]"
                  onClick={() => setAmountMl(ml)}
                >
                  {ml}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              min={1}
              max={500}
              value={amountMl}
              onChange={(e) => setAmountMl(Number(e.target.value))}
              className="mt-2"
            />
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

          <div>
            <label className="text-sm font-medium">Tijdstip</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
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
