import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { GenieShell } from "@/components/GenieShell";
import { GenieCard, SectionTitle } from "@/components/GenieCard";
import { askQuestion, explainConcept } from "@/lib/edugenie.functions";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask EduGenie — AI Q&A for any subject" },
      {
        name: "description",
        content:
          "Ask any academic question and get an accurate answer with helpful educational context.",
      },
      { property: "og:title", content: "Ask EduGenie — AI Q&A" },
      {
        property: "og:description",
        content: "Instant, accurate answers with context — powered by AI.",
      },
    ],
  }),
  component: AskPage,
});

const SAMPLES = [
  "Which is the largest ocean?",
  "What is Newton's second law?",
  "Explain photosynthesis simply",
  "Why is the sky blue?",
];

function AskPage() {
  const [mode, setMode] = useState<"ask" | "explain">("ask");
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const askFn = useServerFn(askQuestion);
  const explainFn = useServerFn(explainConcept);

  const ask = useMutation({
    mutationFn: (question: string) => askFn({ data: { question } }),
    onError: (e: Error) => toast.error(e.message),
  });
  const explain = useMutation({
    mutationFn: (concept: string) => explainFn({ data: { concept, level } }),
    onError: (e: Error) => toast.error(e.message),
  });

  const busy = ask.isPending || explain.isPending;
  const answer = mode === "ask" ? ask.data?.answer : explain.data?.explanation;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim() || busy) return;
    if (mode === "ask") ask.mutate(q.trim());
    else explain.mutate(q.trim());
  }

  return (
    <GenieShell>
      <SectionTitle
        eyebrow="Q&A"
        title="Ask EduGenie anything"
        description="Get accurate answers with educational context, or request a simplified explanation of a concept."
      />

      <GenieCard>
        <div className="mb-4 inline-flex rounded-full border border-border p-1">
          {(["ask", "explain"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
                mode === m
                  ? "bg-gradient-genie text-primary-foreground shadow-warm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "ask" ? "Ask a question" : "Explain a concept"}
            </button>
          ))}
        </div>

        {mode === "explain" && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Level:</span>
            {(["beginner", "intermediate", "advanced"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`rounded-full border px-3 py-1 capitalize ${
                  level === l
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              mode === "ask" ? "e.g. Which is the largest ocean?" : "e.g. Recursion"
            }
            className="flex-1 rounded-xl border border-border bg-input/60 px-4 py-3 outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <button
            type="submit"
            disabled={busy || !q.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-genie px-5 py-3 font-medium text-primary-foreground shadow-warm disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {busy ? "Thinking..." : mode === "ask" ? "Ask" : "Explain"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              onClick={() => setQ(s)}
              className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </GenieCard>

      {answer && (
        <GenieCard className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Answer
          </p>
          <p className="whitespace-pre-wrap leading-relaxed text-foreground/95">{answer}</p>
        </GenieCard>
      )}
    </GenieShell>
  );
}
