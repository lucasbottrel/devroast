import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  languageSourceEnum,
  roastLanguageEnum,
  roastStatusEnum,
  scoreToneEnum,
} from "./enums";

export const roasts = pgTable("roasts", {
  id: uuid().defaultRandom().primaryKey(),
  sourceCode: text().notNull(),
  snippetPreview: varchar({ length: 280 }).notNull(),
  language: roastLanguageEnum().default("plaintext").notNull(),
  languageSource: languageSourceEnum().default("auto").notNull(),
  lineCount: integer().notNull(),
  roastModeEnabled: boolean().default(true).notNull(),
  status: roastStatusEnum().default("pending").notNull(),
  score: numeric({ precision: 4, scale: 1 }),
  scoreTone: scoreToneEnum(),
  verdictLabel: varchar({ length: 64 }),
  headline: text(),
  summary: text(),
  processingError: text(),
  completedAt: timestamp({ withTimezone: true, mode: "date" }),
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
