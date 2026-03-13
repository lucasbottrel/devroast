import type {
  HTMLAttributes,
  PropsWithChildren,
  TextareaHTMLAttributes,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const codeInputVariants = tv({
  base: "w-full overflow-hidden border border-border bg-input",
  variants: {
    size: {
      md: "max-w-[780px]",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface CodeInputRootProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeInputVariants> {}

function CodeInputRoot({
  className,
  size,
  children,
  ...props
}: PropsWithChildren<CodeInputRootProps>) {
  return (
    <section className={codeInputVariants({ size, className })} {...props}>
      {children}
    </section>
  );
}

export interface CodeInputHeaderProps extends HTMLAttributes<HTMLDivElement> {}

function CodeInputHeader({ className, ...props }: CodeInputHeaderProps) {
  return (
    <div
      className={`flex h-10 items-center border-b border-border px-4 ${className ?? ""}`}
      {...props}
    >
      <div className="inline-flex items-center gap-2">
        <span
          className="size-3 rounded-full bg-accent-red"
          aria-hidden="true"
        />
        <span
          className="size-3 rounded-full bg-accent-amber"
          aria-hidden="true"
        />
        <span
          className="size-3 rounded-full bg-accent-green"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export interface CodeInputBodyProps extends HTMLAttributes<HTMLDivElement> {}

function CodeInputBody({ className, ...props }: CodeInputBodyProps) {
  return (
    <div
      className={`grid h-[332px] grid-cols-[48px_1fr] ${className ?? ""}`}
      {...props}
    />
  );
}

export interface CodeInputGutterProps extends HTMLAttributes<HTMLDivElement> {
  lineCount?: number;
}

function CodeInputGutter({
  className,
  lineCount = 15,
  ...props
}: CodeInputGutterProps) {
  const lines = Array.from(
    { length: lineCount },
    (_, lineNumber) => lineNumber + 1,
  );

  return (
    <div
      className={`flex flex-col items-end border-r border-border bg-surface px-3 py-4 ${className ?? ""}`}
      {...props}
    >
      {lines.map((line) => (
        <span
          key={line}
          className="h-5 font-mono text-xs leading-5 text-fg-subtle"
        >
          {line}
        </span>
      ))}
    </div>
  );
}

export interface CodeInputTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

function CodeInputTextarea({ className, ...props }: CodeInputTextareaProps) {
  return (
    <textarea
      className={`h-full w-full resize-none bg-transparent p-4 font-mono text-xs leading-5 text-fg outline-none placeholder:text-fg-subtle ${className ?? ""}`}
      spellCheck={false}
      {...props}
    />
  );
}

export const CodeInput = {
  Root: CodeInputRoot,
  Header: CodeInputHeader,
  Body: CodeInputBody,
  Gutter: CodeInputGutter,
  Textarea: CodeInputTextarea,
};
