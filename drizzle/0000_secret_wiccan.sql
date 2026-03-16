CREATE TYPE "public"."diff_line_kind" AS ENUM('context', 'added', 'removed');--> statement-breakpoint
CREATE TYPE "public"."finding_severity" AS ENUM('good', 'warning', 'critical');--> statement-breakpoint
CREATE TYPE "public"."language_source" AS ENUM('auto', 'manual');--> statement-breakpoint
CREATE TYPE "public"."roast_language" AS ENUM('plaintext', 'javascript', 'typescript', 'jsx', 'tsx', 'python', 'sql', 'bash', 'json');--> statement-breakpoint
CREATE TYPE "public"."roast_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."score_tone" AS ENUM('good', 'warning', 'critical');--> statement-breakpoint
CREATE TABLE "roast_diff_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"kind" "diff_line_kind" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roast_diff_lines_roast_id_position_unique" UNIQUE("roast_id","position")
);
--> statement-breakpoint
CREATE TABLE "roast_findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"severity" "finding_severity" NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roast_findings_roast_id_position_unique" UNIQUE("roast_id","position")
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_code" text NOT NULL,
	"snippet_preview" varchar(280) NOT NULL,
	"language" "roast_language" DEFAULT 'plaintext' NOT NULL,
	"language_source" "language_source" DEFAULT 'auto' NOT NULL,
	"line_count" integer NOT NULL,
	"roast_mode_enabled" boolean DEFAULT true NOT NULL,
	"status" "roast_status" DEFAULT 'pending' NOT NULL,
	"score" numeric(4, 1),
	"score_tone" "score_tone",
	"verdict_label" varchar(64),
	"headline" text,
	"summary" text,
	"processing_error" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roast_diff_lines" ADD CONSTRAINT "roast_diff_lines_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roast_findings" ADD CONSTRAINT "roast_findings_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;