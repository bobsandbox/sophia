import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";
import type { EntryInput } from "@/lib/validations/journal";

export async function getEntriesByDate(date: Date) {
  return prisma.journalEntry.findMany({
    where: {
      timestamp: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
    orderBy: { timestamp: "desc" },
  });
}

export async function getDailySummary(date: Date) {
  const entries = await getEntriesByDate(date);

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
