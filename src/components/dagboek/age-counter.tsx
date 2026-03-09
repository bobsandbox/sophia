"use client";

import { useState, useEffect } from "react";
import { getBirthDateTime, getAge, formatAge } from "@/lib/birth-date";
import Link from "next/link";
import { Settings } from "lucide-react";

export function AgeCounter() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const birth = getBirthDateTime();
      if (!birth) {
        setLabel(null);
        return;
      }
      const age = getAge(birth);
      setLabel(formatAge(age));
    }

    update();
    // Update every minute
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      {label ? (
        <Link
          href="/settings"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {label}
        </Link>
      ) : (
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          <Settings className="h-3 w-3" />
          Geboortedatum instellen
        </Link>
      )}
    </div>
  );
}
