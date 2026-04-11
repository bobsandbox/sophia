import { FaBottleWater, FaBaby, FaNoteSticky, FaTags } from "react-icons/fa6";
import type { EntryType } from "@/generated/prisma/client";

const config = {
  VOEDING: {
    icon: FaBottleWater,
    bg: "bg-pink-100 dark:bg-pink-900/50",
    text: "text-pink-600 dark:text-pink-300",
  },
  LUIER: {
    icon: FaBaby,
    bg: "bg-blue-100 dark:bg-blue-900/50",
    text: "text-blue-600 dark:text-blue-300",
  },
  OPMERKING: {
    icon: FaNoteSticky,
    bg: "bg-amber-100 dark:bg-amber-900/50",
    text: "text-amber-600 dark:text-amber-300",
  },
  NOTITIE: {
    icon: FaTags,
    bg: "bg-teal-100 dark:bg-teal-900/50",
    text: "text-teal-600 dark:text-teal-300",
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
