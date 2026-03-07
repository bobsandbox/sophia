"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addDays, subDays, isToday } from "date-fns";
import { nl } from "date-fns/locale";
import { useRef } from "react";

interface DagHeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DagHeader({ date, onDateChange }: DagHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1 px-4 pt-3 pb-0">
      <img src="/sophia-logo.png" alt="Sophia" className="mx-auto h-10" />
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDateChange(subDays(date, 1))}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <button
          className="text-center font-medium capitalize"
          onClick={() => {
            if (!isToday(date)) onDateChange(new Date());
          }}
        >
          {isToday(date)
            ? "Vandaag"
            : format(date, "EEEE d MMMM yyyy", { locale: nl })}
        </button>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => inputRef.current?.showPicker()}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <input
            ref={inputRef}
            type="date"
            className="absolute inset-0 opacity-0 cursor-pointer"
            value={format(date, "yyyy-MM-dd")}
            onChange={(e) => {
              if (e.target.value) {
                const [y, m, d] = e.target.value.split("-").map(Number);
                onDateChange(new Date(y, m - 1, d));
              }
            }}
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDateChange(addDays(date, 1))}
        disabled={isToday(date)}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
    </div>
  );
}
