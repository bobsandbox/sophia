export const PEOPLE = ["Bob", "Agnes", "Joselien", "Melanie"] as const;

export type PersonName = (typeof PEOPLE)[number];

export const PERSON_COLORS: Record<
  PersonName,
  { bg: string; text: string; border: string; dot: string }
> = {
  Bob: {
    bg: "bg-blue-100 dark:bg-blue-900/50",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-400 dark:border-blue-600",
    dot: "bg-blue-500",
  },
  Agnes: {
    bg: "bg-violet-100 dark:bg-violet-900/50",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-400 dark:border-violet-600",
    dot: "bg-violet-500",
  },
  Joselien: {
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-400 dark:border-emerald-600",
    dot: "bg-emerald-500",
  },
  Melanie: {
    bg: "bg-rose-100 dark:bg-rose-900/50",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-400 dark:border-rose-600",
    dot: "bg-rose-500",
  },
};

export function getPersonColor(name: string) {
  return PERSON_COLORS[name as PersonName] ?? PERSON_COLORS.Bob;
}

const STORAGE_KEY = "sophia-last-person";

export function getLastPerson(): string {
  if (typeof window === "undefined") return PEOPLE[0];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (PEOPLE as readonly string[]).includes(stored)) return stored;
  return PEOPLE[0];
}

export function setLastPerson(person: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, person);
}
