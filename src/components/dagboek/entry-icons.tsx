import { FaBottleWater, FaBaby, FaNoteSticky } from "react-icons/fa6";
import type { EntryType } from "@/generated/prisma/client";

const config = {
  VOEDING: {
    icon: FaBottleWater,
    bg: "bg-pink-100 dark:bg-pink-900/50",
    text: "text-pink-600 dark:text-pink-300",
    border: "border-l-pink-400 dark:border-l-pink-500",
  },
  LUIER: {
    icon: FaBaby,
    bg: "bg-blue-100 dark:bg-blue-900/50",
    text: "text-blue-600 dark:text-blue-300",
    border: "border-l-blue-400 dark:border-l-blue-500",
  },
  OPMERKING: {
    icon: FaNoteSticky,
    bg: "bg-amber-100 dark:bg-amber-900/50",
    text: "text-amber-600 dark:text-amber-300",
    border: "border-l-amber-400 dark:border-l-amber-500",
  },
} as const;

export function EntryIcon({ type, size = "sm" }: { type: EntryType; size?: "sm" | "md" }) {
  const c = config[type];
  const Icon = c.icon;
  const dims = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={`inline-flex items-center justify-center rounded-full ${dims} ${c.bg} ${c.text} ${iconSize}`}>
      <Icon />
    </span>
  );
}

export function getEntryBorder(type: EntryType) {
  return config[type]?.border ?? "";
}
