"use client";

import { Toggle } from "@/components/ui";

export function TogglePreview() {
  return (
    <div className="flex flex-wrap gap-8 border border-border bg-surface p-5">
      <Toggle.Root defaultChecked>
        <Toggle.Track>
          <Toggle.Thumb />
        </Toggle.Track>
        <Toggle.Label>roast mode</Toggle.Label>
      </Toggle.Root>

      <Toggle.Root>
        <Toggle.Track>
          <Toggle.Thumb />
        </Toggle.Track>
        <Toggle.Label>roast mode</Toggle.Label>
      </Toggle.Root>

      <Toggle.Root disabled defaultChecked>
        <Toggle.Track>
          <Toggle.Thumb />
        </Toggle.Track>
        <Toggle.Label>disabled</Toggle.Label>
      </Toggle.Root>
    </div>
  );
}
