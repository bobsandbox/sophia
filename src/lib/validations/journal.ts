import { z } from "zod";

export const voedingSchema = z.object({
  entryType: z.literal("VOEDING"),
  timestamp: z.coerce.date(),
  amountMl: z.number().int().min(1).max(500),
  braken: z.boolean().default(false),
});

export const luierSchema = z.object({
  entryType: z.literal("LUIER"),
  timestamp: z.coerce.date(),
  pipi: z.boolean().default(false),
  kaka: z.boolean().default(false),
});

export const entrySchema = z.discriminatedUnion("entryType", [
  voedingSchema,
  luierSchema,
]);

export type VoedingInput = z.infer<typeof voedingSchema>;
export type LuierInput = z.infer<typeof luierSchema>;
export type EntryInput = z.infer<typeof entrySchema>;
