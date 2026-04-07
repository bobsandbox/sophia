import { prisma } from "@/lib/prisma";
import type { EntryInput } from "@/lib/validations/journal";

const TZ = "Europe/Brussels";

/** Get start/end of day in Brussels timezone, regardless of server TZ */
function dayBounds(dateStr: string) {
  const startUtc = new Date(`${dateStr}T00:00:00+${getBrusselsOffset(dateStr)}`);
  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { gte: startUtc, lte: endUtc };
}

function getBrusselsOffset(dateStr: string): string {
  // Determine if Brussels is CET (+01:00) or CEST (+02:00) on this date
  const d = new Date(`${dateStr}T12:00:00Z`);
  const utcStr = d.toLocaleString("en-US", { timeZone: "UTC", hour12: false });
  const brStr = d.toLocaleString("en-US", { timeZone: TZ, hour12: false });
  const utcHour = new Date(utcStr).getHours();
  const brHour = new Date(brStr).getHours();
  const diff = ((brHour - utcHour) + 24) % 24;
  return diff === 2 ? "02:00" : "01:00";
}

export async function getEntriesByDate(dateStr: string) {
  const bounds = dayBounds(dateStr);
  return prisma.journalEntry.findMany({
    where: { timestamp: bounds },
    orderBy: { timestamp: "desc" },
  });
}

export async function getDailySummary(dateStr: string) {
  const entries = await getEntriesByDate(dateStr);

  const voedingen = entries.filter((e) => e.entryType === "VOEDING");
  const luiers = entries.filter((e) => e.entryType === "LUIER");

  return {
    voedingCount: voedingen.length,
    totalMl: voedingen.reduce((sum, e) => sum + (e.amountMl ?? 0), 0),
    luierCount: luiers.length,
  };
}

export async function createEntry(data: EntryInput) {
  if (data.entryType === "VOEDING") {
    return prisma.journalEntry.create({
      data: {
        timestamp: data.timestamp,
        entryType: "VOEDING",
        person: data.person,
        amountMl: data.amountMl,
        braken: data.braken,
      },
    });
  }

  if (data.entryType === "LUIER") {
    return prisma.journalEntry.create({
      data: {
        timestamp: data.timestamp,
        entryType: "LUIER",
        person: data.person,
        pipi: data.pipi,
        kaka: data.kaka,
      },
    });
  }

  return prisma.journalEntry.create({
    data: {
      timestamp: data.timestamp,
      entryType: "OPMERKING",
      person: data.person,
      remark: data.remark,
    },
  });
}

export async function updateEntry(id: string, data: EntryInput) {
  if (data.entryType === "VOEDING") {
    return prisma.journalEntry.update({
      where: { id },
      data: {
        timestamp: data.timestamp,
        entryType: "VOEDING",
        person: data.person,
        amountMl: data.amountMl,
        braken: data.braken,
        pipi: null,
        kaka: null,
        remark: null,
      },
    });
  }

  if (data.entryType === "LUIER") {
    return prisma.journalEntry.update({
      where: { id },
      data: {
        timestamp: data.timestamp,
        entryType: "LUIER",
        person: data.person,
        pipi: data.pipi,
        kaka: data.kaka,
        amountMl: null,
        braken: null,
        remark: null,
      },
    });
  }

  return prisma.journalEntry.update({
    where: { id },
    data: {
      timestamp: data.timestamp,
      entryType: "OPMERKING",
      person: data.person,
      remark: data.remark,
      amountMl: null,
      braken: null,
      pipi: null,
      kaka: null,
    },
  });
}

export async function deleteEntry(id: string) {
  return prisma.journalEntry.delete({ where: { id } });
}

/** Get most-used remarks, ordered by frequency */
export async function getFrequentRemarks(limit = 10) {
  const results = await prisma.journalEntry.groupBy({
    by: ["remark"],
    where: { entryType: "OPMERKING", remark: { not: null } },
    _count: { remark: true },
    orderBy: { _count: { remark: "desc" } },
    take: limit,
  });
  return results
    .filter((r) => r.remark)
    .map((r) => ({ text: r.remark!, count: r._count.remark }));
}
