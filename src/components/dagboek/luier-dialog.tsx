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

interface LuierDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    entryType: "LUIER";
    timestamp: string;
    pipi: boolean;
    kaka: boolean;
  }) => void;
  onDelete?: () => void;
  entry?: JournalEntry | null;
}

export function LuierDialog({
  open,
  onClose,
  onSave,
  onDelete,
  entry,
}: LuierDialogProps) {
  const [pipi, setPipi] = useState(false);
  const [kaka, setKaka] = useState(false);
  const [time, setTime] = useState(format(new Date(), "HH:mm"));

  useEffect(() => {
    if (open) {
      if (entry) {
        setPipi(entry.pipi ?? false);
        setKaka(entry.kaka ?? false);
        setTime(format(new Date(entry.timestamp), "HH:mm"));
      } else {
        setPipi(false);
        setKaka(false);
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
      entryType: "LUIER",
      timestamp: ts.toISOString(),
      pipi,
      kaka,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>🧷 {entry ? "Luier bewerken" : "Luier toevoegen"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
              💧 Pipi
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
              💩 Kaka
            </button>
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
