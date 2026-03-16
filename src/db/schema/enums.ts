import { pgEnum } from "drizzle-orm/pg-core";

export const roastStatusEnum = pgEnum("roast_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const roastLanguageEnum = pgEnum("roast_language", [
  "plaintext",
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "sql",
  "bash",
  "json",
]);

export const languageSourceEnum = pgEnum("language_source", ["auto", "manual"]);

export const scoreToneEnum = pgEnum("score_tone", [
  "good",
  "warning",
  "critical",
]);

export const findingSeverityEnum = pgEnum("finding_severity", [
  "good",
  "warning",
  "critical",
]);

export const diffLineKindEnum = pgEnum("diff_line_kind", [
  "context",
  "added",
  "removed",
]);

export type RoastStatus = (typeof roastStatusEnum.enumValues)[number];
export type RoastLanguage = (typeof roastLanguageEnum.enumValues)[number];
export type LanguageSource = (typeof languageSourceEnum.enumValues)[number];
export type ScoreTone = (typeof scoreToneEnum.enumValues)[number];
export type FindingSeverity = (typeof findingSeverityEnum.enumValues)[number];
export type DiffLineKind = (typeof diffLineKindEnum.enumValues)[number];
