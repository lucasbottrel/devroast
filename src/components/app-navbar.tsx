import Link from "next/link";

export function AppNavbar() {
  return (
    <header className="h-14 w-full border-b border-border bg-page px-10">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="font-mono text-xl font-bold text-accent-green">
            {">"}
          </span>
          <span className="font-mono text-lg font-medium text-fg">
            devroast
          </span>
        </Link>

        <Link
          href="/leaderboard"
          className="font-mono text-[13px] text-fg-muted transition-colors hover:text-fg"
        >
          leaderboard
        </Link>
      </div>
    </header>
  );
}
