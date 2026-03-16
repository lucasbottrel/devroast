"use client";

import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type BundledLanguage, createHighlighter } from "shiki";
import { tv, type VariantProps } from "tailwind-variants";
import styles from "@/components/ui/code-editor.module.css";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("css", css);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("go", go);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("php", php);
hljs.registerLanguage("python", python);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

const codeEditorVariants = tv({
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

type SupportedLanguageId =
  | "plaintext"
  | "javascript"
  | "typescript"
  | "tsx"
  | "jsx"
  | "json"
  | "python"
  | "sql"
  | "bash"
  | "java"
  | "go"
  | "rust"
  | "html"
  | "css"
  | "yaml"
  | "markdown"
  | "csharp"
  | "cpp"
  | "php"
  | "ruby"
  | "swift"
  | "kotlin"
  | "dockerfile"
  | "xml";

type LanguageMode = "auto" | "manual";

type SupportedLanguageOption = {
  id: SupportedLanguageId;
  label: string;
  shiki: BundledLanguage | null;
  detect: string[];
};

const LANGUAGE_OPTIONS: SupportedLanguageOption[] = [
  {
    id: "javascript",
    label: "JavaScript",
    shiki: "javascript",
    detect: ["javascript", "js"],
  },
  {
    id: "typescript",
    label: "TypeScript",
    shiki: "typescript",
    detect: ["typescript", "ts"],
  },
  { id: "tsx", label: "TSX", shiki: "tsx", detect: ["tsx"] },
  { id: "jsx", label: "JSX", shiki: "jsx", detect: ["jsx"] },
  { id: "json", label: "JSON", shiki: "json", detect: ["json"] },
  { id: "python", label: "Python", shiki: "python", detect: ["python", "py"] },
  { id: "sql", label: "SQL", shiki: "sql", detect: ["sql"] },
  {
    id: "bash",
    label: "Bash",
    shiki: "bash",
    detect: ["bash", "shell", "sh", "zsh"],
  },
  { id: "java", label: "Java", shiki: "java", detect: ["java"] },
  { id: "go", label: "Go", shiki: "go", detect: ["go", "golang"] },
  { id: "rust", label: "Rust", shiki: "rust", detect: ["rust", "rs"] },
  { id: "html", label: "HTML", shiki: "html", detect: ["html"] },
  { id: "css", label: "CSS", shiki: "css", detect: ["css"] },
  { id: "yaml", label: "YAML", shiki: "yaml", detect: ["yaml", "yml"] },
  {
    id: "markdown",
    label: "Markdown",
    shiki: "markdown",
    detect: ["markdown", "md"],
  },
  { id: "csharp", label: "C#", shiki: "csharp", detect: ["csharp", "cs"] },
  { id: "cpp", label: "C++", shiki: "cpp", detect: ["cpp", "c++"] },
  { id: "php", label: "PHP", shiki: "php", detect: ["php"] },
  { id: "ruby", label: "Ruby", shiki: "ruby", detect: ["ruby", "rb"] },
  { id: "swift", label: "Swift", shiki: "swift", detect: ["swift"] },
  { id: "kotlin", label: "Kotlin", shiki: "kotlin", detect: ["kotlin", "kt"] },
  {
    id: "dockerfile",
    label: "Dockerfile",
    shiki: "dockerfile",
    detect: ["dockerfile"],
  },
  { id: "xml", label: "XML", shiki: "xml", detect: ["xml"] },
  { id: "plaintext", label: "Plaintext", shiki: null, detect: [] },
];

const LANGUAGE_MAP = new Map(
  LANGUAGE_OPTIONS.map((language) => [language.id, language]),
);

const HIGHLIGHT_THEME = "vesper";
const MIN_LINE_COUNT = 12;
const DETECTION_DEBOUNCE_MS = 100;
const DETECTION_SUBSET = LANGUAGE_OPTIONS.flatMap(
  (language) => language.detect,
);
export const CODE_SNIPPET_MAX_LENGTH = 2000;

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [HIGHLIGHT_THEME],
      langs: LANGUAGE_OPTIONS.flatMap((language) =>
        language.shiki ? [language.shiki] : [],
      ),
    });
  }

  return highlighterPromise;
}

function escapeHtml(code: string) {
  return code
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stripShikiBackground(html: string) {
  return html.replace(/background-color:[^;"]+;?/g, "");
}

function isLikelyJson(code: string) {
  const trimmed = code.trim();

  if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) {
    return false;
  }

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

function mapDetectedLanguage(language: string): SupportedLanguageId | null {
  for (const option of LANGUAGE_OPTIONS) {
    if (option.detect.includes(language)) {
      return option.id;
    }
  }

  return null;
}

function detectFromHeuristics(code: string): SupportedLanguageId | null {
  const trimmed = code.trim();

  if (!trimmed) {
    return "plaintext";
  }

  if (isLikelyJson(trimmed)) {
    return "json";
  }

  if (/^#!\/(usr\/bin\/env\s+)?(ba)?sh/m.test(trimmed)) {
    return "bash";
  }

  if (/^\s*FROM\s+.+$/im.test(code) || /^\s*RUN\s+.+$/im.test(code)) {
    return "dockerfile";
  }

  if (/^\s*SELECT\b[\s\S]*\bFROM\b/im.test(code)) {
    return "sql";
  }

  if (/^\s*(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/im.test(code)) {
    return "sql";
  }

  if (
    /\bpublic\s+class\s+\w+/.test(code) ||
    /\bSystem\.out\.println\s*\(/.test(code)
  ) {
    return "java";
  }

  if (/\bpackage\s+main\b/.test(code) || /\bfunc\s+main\s*\(/.test(code)) {
    return "go";
  }

  if (/\bfn\s+main\s*\(/.test(code) || /\blet\s+mut\b/.test(code)) {
    return "rust";
  }

  if (/^\s*<\?xml\b/i.test(trimmed)) {
    return "xml";
  }

  if (/^\s*<!DOCTYPE\s+html>/i.test(trimmed) || /<html[\s>]/i.test(code)) {
    return "html";
  }

  if (/^\s*[.#]?[\w-]+\s*\{[\s\S]*:\s*[^;]+;/m.test(code)) {
    return "css";
  }

  if (/^\s*[-\w"']+\s*:\s*.+$/m.test(code) && !/[;{}()]/.test(code)) {
    return "yaml";
  }

  if (/^#{1,6}\s+/m.test(code) || /^```/m.test(code)) {
    return "markdown";
  }

  if (
    /\bnamespace\s+\w+/.test(code) ||
    /\bConsole\.WriteLine\s*\(/.test(code)
  ) {
    return "csharp";
  }

  if (/\bstd::\w+/.test(code) || /#include\s+<\w+/.test(code)) {
    return "cpp";
  }

  if (/^\s*<\?php/.test(trimmed) || /\$\w+\s*=/.test(code)) {
    return "php";
  }

  if (/\bdef\s+\w+/.test(code) && /\bend\b/.test(code)) {
    return "ruby";
  }

  if (
    /\bimport\s+SwiftUI\b/.test(code) ||
    /\bstruct\s+\w+\s*:\s*View\b/.test(code)
  ) {
    return "swift";
  }

  if (/\bfun\s+main\s*\(/.test(code) || /\bval\s+\w+\s*=/.test(code)) {
    return "kotlin";
  }

  const hasJsxSyntax = /<([A-Z][\w]*)\b[^>]*>|<\/[A-Z][\w]*>|<>|<\/>/.test(
    code,
  );
  const hasTsSyntax =
    /\binterface\b|\btype\b|\benum\b|\bas\s+const\b/.test(code) ||
    /:\s*[A-Z_a-z][\w<>,\s[\]|]*/.test(code);

  if (hasJsxSyntax && hasTsSyntax) {
    return "tsx";
  }

  if (hasJsxSyntax) {
    return "jsx";
  }

  return null;
}

function detectLanguage(code: string): SupportedLanguageId {
  const trimmed = code.trim();

  if (!trimmed) {
    return "plaintext";
  }

  const heuristicLanguage = detectFromHeuristics(code);
  if (heuristicLanguage) {
    return heuristicLanguage;
  }

  const result = hljs.highlightAuto(code, DETECTION_SUBSET);
  const mappedPrimary = result.language
    ? mapDetectedLanguage(result.language)
    : null;
  const mappedSecondary = result.secondBest?.language
    ? mapDetectedLanguage(result.secondBest.language)
    : null;

  if (!mappedPrimary) {
    return "plaintext";
  }

  if (result.relevance <= 1) {
    return mappedPrimary;
  }

  if (
    mappedSecondary &&
    mappedSecondary !== mappedPrimary &&
    result.secondBest &&
    result.relevance - result.secondBest.relevance <= 1
  ) {
    return mappedPrimary;
  }

  return mappedPrimary;
}

function getSelectionValue(
  languageMode: LanguageMode,
  manualLanguage: SupportedLanguageId,
) {
  return languageMode === "auto" ? "auto" : manualLanguage;
}

export interface CodeEditorProps
  extends VariantProps<typeof codeEditorVariants> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  textareaLabel?: string;
  maxLength?: number;
}

export function CodeEditor({
  value,
  onChange,
  placeholder = "// paste your code here",
  className,
  size,
  textareaLabel = "Code editor",
  maxLength = CODE_SNIPPET_MAX_LENGTH,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const detectImmediatelyRef = useRef(false);
  const deferredValue = useDeferredValue(value);
  const [languageMode, setLanguageMode] = useState<LanguageMode>("auto");
  const [manualLanguage, setManualLanguage] =
    useState<SupportedLanguageId>("plaintext");
  const [detectedLanguage, setDetectedLanguage] =
    useState<SupportedLanguageId>("plaintext");
  const [highlightHtml, setHighlightHtml] = useState("");
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false);
  const [isHighlightReady, setIsHighlightReady] = useState(false);

  const resolvedLanguage =
    languageMode === "manual" ? manualLanguage : detectedLanguage;
  const resolvedLabel =
    LANGUAGE_MAP.get(resolvedLanguage)?.label ?? "Plaintext";
  const currentLength = value.length;
  const isOverLimit = currentLength > maxLength;
  const helperMessage = isOverLimit
    ? `Snippet muito grande. Reduza para no maximo ${maxLength.toLocaleString("pt-BR")} caracteres para enviar.`
    : null;

  const lineCount = useMemo(() => {
    if (!value) {
      return MIN_LINE_COUNT;
    }

    return Math.max(MIN_LINE_COUNT, value.split("\n").length);
  }, [value]);

  useEffect(() => {
    if (!value.trim()) {
      setLanguageMode("auto");
      setManualLanguage("plaintext");
      setDetectedLanguage("plaintext");
      setIsDetectingLanguage(false);
      return;
    }

    if (languageMode !== "auto") {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setDetectedLanguage(detectLanguage(value));
        setIsDetectingLanguage(false);
        detectImmediatelyRef.current = false;
      },
      detectImmediatelyRef.current ? 0 : DETECTION_DEBOUNCE_MS,
    );

    setIsDetectingLanguage(true);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [languageMode, value]);

  useEffect(() => {
    let isMounted = true;

    async function highlightCode() {
      if (!deferredValue) {
        if (isMounted) {
          setHighlightHtml("");
          setIsHighlightReady(true);
        }
        return;
      }

      setIsHighlightReady(false);

      try {
        if (resolvedLanguage === "plaintext") {
          if (isMounted) {
            setHighlightHtml(
              `<pre><code>${escapeHtml(deferredValue)}</code></pre>`,
            );
            setIsHighlightReady(true);
          }
          return;
        }

        const highlighter = await getHighlighter();
        const language = LANGUAGE_MAP.get(resolvedLanguage);
        const html = highlighter.codeToHtml(deferredValue, {
          lang: language?.shiki ?? "javascript",
          theme: HIGHLIGHT_THEME,
        });

        if (isMounted) {
          setHighlightHtml(stripShikiBackground(html));
          setIsHighlightReady(true);
        }
      } catch {
        if (isMounted) {
          setHighlightHtml(
            `<pre><code>${escapeHtml(deferredValue)}</code></pre>`,
          );
          setIsHighlightReady(true);
        }
      }
    }

    void highlightCode();

    return () => {
      isMounted = false;
    };
  }, [deferredValue, resolvedLanguage]);

  function syncScroll() {
    const textarea = textareaRef.current;
    const gutter = gutterRef.current;
    const highlight = highlightRef.current;

    if (!textarea) {
      return;
    }

    if (gutter) {
      gutter.scrollTop = textarea.scrollTop;
    }

    if (highlight) {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    }
  }

  function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  function handleLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextValue = event.target.value as SupportedLanguageId | "auto";

    if (nextValue === "auto") {
      setLanguageMode("auto");
      setDetectedLanguage(detectLanguage(value));
      return;
    }

    setLanguageMode("manual");
    setManualLanguage(nextValue);
  }

  function updateValueWithSelection(nextValue: string, nextSelection: number) {
    onChange(nextValue);
    window.requestAnimationFrame(() => {
      textareaRef.current?.setSelectionRange(nextSelection, nextSelection);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();

    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`;

    updateValueWithSelection(nextValue, start + 2);
  }

  const selectionValue = getSelectionValue(languageMode, manualLanguage);

  return (
    <section className={codeEditorVariants({ size, className })}>
      <div className="flex h-10 items-center gap-3 border-b border-border px-4">
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
        <div className="ml-auto flex items-center gap-3">
          <span className={styles.status}>
            {languageMode === "auto"
              ? `${resolvedLabel} (auto${isDetectingLanguage ? "..." : ""})`
              : resolvedLabel}
          </span>
          <label className={styles.selectWrap}>
            <span className="sr-only">Select code language</span>
            <select
              className={styles.select}
              value={selectionValue}
              onChange={handleLanguageChange}
            >
              <option value="auto">Auto detect</option>
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.label}
                </option>
              ))}
            </select>
            <span className={styles.selectIcon} aria-hidden="true" />
          </label>
        </div>
      </div>

      <div className={styles.body}>
        <div ref={gutterRef} className={styles.gutter} aria-hidden="true">
          <div className={styles.gutterContent}>
            {Array.from({ length: lineCount }, (_, index) => index + 1).map(
              (line) => (
                <span key={line} className={styles.lineNumber}>
                  {line}
                </span>
              ),
            )}
          </div>
        </div>

        <div className={styles.editor}>
          {!value && <div className={styles.placeholder}>{placeholder}</div>}

          <div
            ref={highlightRef}
            className={styles.highlight}
            aria-hidden="true"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Highlighted HTML is generated locally from trusted libraries.
            dangerouslySetInnerHTML={{
              __html:
                isHighlightReady && highlightHtml
                  ? highlightHtml
                  : `<pre><code>${escapeHtml(deferredValue)}</code></pre>`,
            }}
          />

          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={value}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onPaste={() => {
              detectImmediatelyRef.current = true;
            }}
            onScroll={syncScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            aria-label={textareaLabel}
            aria-invalid={isOverLimit}
            aria-describedby={
              helperMessage ? "code-editor-limit-error" : undefined
            }
          />
        </div>
      </div>

      <div className={styles.footer}>
        <div
          id={helperMessage ? "code-editor-limit-error" : undefined}
          className={styles.error}
          role={helperMessage ? "alert" : undefined}
        >
          {helperMessage}
        </div>
        <div
          className={styles.counter}
          data-over-limit={isOverLimit || undefined}
        >
          {currentLength.toLocaleString("pt-BR")} /{" "}
          {maxLength.toLocaleString("pt-BR")} caracteres
        </div>
      </div>
    </section>
  );
}

export { codeEditorVariants };
