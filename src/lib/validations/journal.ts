import { z } from "zod";

export const voedingSchema = z.object({
  entryType: z.literal("VOEDING"),
  timestamp: z.coerce.date(),
  person: z.string().optional(),
  amountMl: z.number().int().min(1).max(500),
  braken: z.boolean().default(false),
});

export const luierSchema = z.object({
  entryType: z.literal("LUIER"),
  timestamp: z.coerce.date(),
  person: z.string().optional(),
  pipi: z.boolean().default(false),
  kaka: z.boolean().default(false),
});

export const opmerkingSchema = z.object({
  entryType: z.literal("OPMERKING"),
  timestamp: z.coerce.date(),
  person: z.string().optional(),
  remark: z.string().min(1),
});

export const entrySchema = z.discriminatedUnion("entryType", [
  voedingSchema,
  luierSchema,
  opmerkingSchema,
]);

export type VoedingInput = z.infer<typeof voedingSchema>;
export type LuierInput = z.infer<typeof luierSchema>;
export type OpmerkingInput = z.infer<typeof opmerkingSchema>;
export type EntryInput = z.infer<typeof entrySchema>;
