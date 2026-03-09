"use client";

import { useState, useEffect } from "react";
import { getBirthDay, getAge, formatAge } from "@/lib/birth-date";

export function AgeCounter() {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const age = getAge(getBirthDay());
    setLabel(formatAge(age));
  }, []);

  if (!label) return null;

  return (
    <p className="text-center text-xs text-muted-foreground">{label}</p>
  );
}
