export const PEOPLE = ["Bob", "Agnes"];

const STORAGE_KEY = "sophia-last-person";

export function getLastPerson(): string {
  if (typeof window === "undefined") return PEOPLE[0];
  return localStorage.getItem(STORAGE_KEY) ?? PEOPLE[0];
}

export function setLastPerson(person: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, person);
}
