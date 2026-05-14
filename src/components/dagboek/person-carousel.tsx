"use client";

import { PEOPLE, getPersonColor } from "@/lib/person";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface PersonCarouselProps {
  value: string;
  onChange: (person: string) => void;
}

export function PersonCarousel({ value, onChange }: PersonCarouselProps) {
  const idx = PEOPLE.indexOf(value as (typeof PEOPLE)[number]);
  const currentIdx = idx === -1 ? 0 : idx;
  const color = getPersonColor(value);

  function prev() {
    const next = (currentIdx - 1 + PEOPLE.length) % PEOPLE.length;
    onChange(PEOPLE[next]);
  }

  function next() {
    const next = (currentIdx + 1) % PEOPLE.length;
    onChange(PEOPLE[next]);
  }

  return (
    <div>
      <label className="text-sm font-medium">Wie</label>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={prev}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-muted-foreground/20 transition-colors hover:bg-muted active:bg-muted/80"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        <div
          className={`flex-1 rounded-lg border-2 px-4 py-2 text-center text-sm font-semibold transition-colors ${color.bg} ${color.text} ${color.border}`}
        >
          {value}
        </div>
        <button
          type="button"
          onClick={next}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-muted-foreground/20 transition-colors hover:bg-muted active:bg-muted/80"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {PEOPLE.map((p, i) => {
          const c = getPersonColor(p);
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === currentIdx ? `${c.dot} scale-125` : "bg-muted-foreground/25"
              }`}
              aria-label={p}
            />
          );
        })}
      </div>
    </div>
  );
}
