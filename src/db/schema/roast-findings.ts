import {
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { findingSeverityEnum } from "./enums";
import { roasts } from "./roasts";

export const roastFindings = pgTable(
  "roast_findings",
  {
    id: uuid().defaultRandom().primaryKey(),
    roastId: uuid()
      .notNull()
      .references(() => roasts.id, { onDelete: "cascade" }),
    position: integer().notNull(),
    severity: findingSeverityEnum().notNull(),
    title: varchar({ length: 160 }).notNull(),
    description: text().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("roast_findings_roast_id_position_unique").on(
      table.roastId,
      table.position,
    ),
  ],
);

export type RoastFinding = typeof roastFindings.$inferSelect;
export type NewRoastFinding = typeof roastFindings.$inferInsert;
