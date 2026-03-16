import { initTRPC } from "@trpc/server";
import { cookies, headers } from "next/headers";
import superjson from "superjson";
import { db } from "@/db/client";

export async function createTRPCContext() {
  const requestHeaders = await headers();
  const requestCookies = await cookies();

  return {
    db,
    headers: requestHeaders,
    cookies: requestCookies,
  };
}

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
  });

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
