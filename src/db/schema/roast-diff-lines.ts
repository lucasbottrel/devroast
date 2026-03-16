import {
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { diffLineKindEnum } from "./enums";
import { roasts } from "./roasts";

export const roastDiffLines = pgTable(
  "roast_diff_lines",
  {
    id: uuid().defaultRandom().primaryKey(),
    roastId: uuid()
      .notNull()
      .references(() => roasts.id, { onDelete: "cascade" }),
    position: integer().notNull(),
    kind: diffLineKindEnum().notNull(),
    content: text().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("roast_diff_lines_roast_id_position_unique").on(
      table.roastId,
      table.position,
    ),
  ],
);
