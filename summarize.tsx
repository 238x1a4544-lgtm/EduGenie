import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, FileText } from "lucide-react";
import { GenieShell } from "@/components/GenieShell";
import { GenieCard, SectionTitle } from "@/components/GenieCard";
import { summarizeText } from "@/lib/edugenie.functions";

export const Route = createFileRoute("/summarize")({
  head: () => ({
    meta: [
      { title: "AI Text Summarizer — EduGenie" },
      {
        name: "description",
        content:
          "Paste any educational text and get a concise summary plus key takeaways for revision.",
      },
      { property: "og:title", content: "AI Text Summarizer — EduGenie" },
      {
        property: "og:description",
        content: "Turn long readings into revision-ready summaries.",
      },
    ],
  }),
  component: SummarizePage,
});

function SummarizePage() {
  const [text, setText] = useState("");
  const fn = useServerFn(summarizeText);
  const mut = useMutation({
    mutationFn: () => fn({ data: { text: text.trim() } }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <GenieShell>
      <SectionTitle
        eyebrow="Summarize"
        title="Compress reading into revision notes"
        description="Paste an article, textbook excerpt, or notes. EduGenie returns a summary and key points."
      />

      <GenieCard>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Paste educational text here (min 20 characters)..."
          className="w-full resize-y rounded-xl border border-border bg-input/60 px-4 py-3 outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{text.length.toLocaleString()} chars</span>
          <button
            onClick={() => text.trim().length >= 20 && mut.mutate()}
            disabled={mut.isPending || text.trim().length < 20}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-genie px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-warm disabled:opacity-60"
          >
            {mut.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileText className="size-4" />
            )}
            {mut.isPending ? "Summarizing..." : "Summarize"}
          </button>
        </div>
      </GenieCard>

      {mut.data && (
        <div className="mt-6 grid gap-5 md:grid-cols-5">
          <GenieCard className="md:col-span-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Summary
            </p>
            <p className="leading-relaxed">{mut.data.summary}</p>
          </GenieCard>
          <GenieCard className="md:col-span-2">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Key points
            </p>
            <ul className="space-y-2 text-sm">
              {mut.data.keyPoints.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-gradient-genie" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </GenieCard>
        </div>
      )}
    </GenieShell>
  );
}
