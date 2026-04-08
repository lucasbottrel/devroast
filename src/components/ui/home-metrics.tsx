"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";

function useAnimatedMetric(value: number) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    setAnimatedValue(value);
  }, [value]);

  return animatedValue;
}

export function HomeMetrics() {
  const trpc = useTRPC();
  const { data } = useQuery({
    ...trpc.metrics.home.queryOptions(),
    staleTime: 60 * 60 * 1000,
  });
  const totalCompletedRoasts = useAnimatedMetric(
    data?.totalCompletedRoasts ?? 0,
  );
  const averageScore = useAnimatedMetric(data?.averageScore ?? 0);

  return (
    <section className="mx-auto flex w-full max-w-[780px] items-center justify-center gap-6 pb-6 pt-1">
      <span className="text-xs text-fg-subtle">
        <NumberFlow value={totalCompletedRoasts} /> codes roasted
      </span>
      <span className="font-mono text-xs text-fg-subtle">.</span>
      <span className="text-xs text-fg-subtle">
        avg score:{" "}
        <NumberFlow
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          value={averageScore}
        />
        /10
      </span>
    </section>
  );
}
