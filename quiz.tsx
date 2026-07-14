import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, RotateCcw, Wand2 } from "lucide-react";
import { GenieShell } from "@/components/GenieShell";
import { GenieCard, SectionTitle } from "@/components/GenieCard";
import { generateQuiz } from "@/lib/edugenie.functions";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "AI Quiz Generator — EduGenie" },
      {
        name: "description",
        content:
          "Generate topic-specific multiple-choice quizzes to test your understanding of any subject.",
      },
      { property: "og:title", content: "AI Quiz Generator — EduGenie" },
      {
        property: "og:description",
        content: "Turn any topic into a self-assessment in seconds.",
      },
    ],
  }),
  component: QuizPage,
});

type Q = { question: string; options: string[]; correctIndex: number; explanation: string };

function QuizPage() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);

  const fn = useServerFn(generateQuiz);
  const mut = useMutation({
    mutationFn: () => fn({ data: { topic: topic.trim(), count } }),
    onSuccess: () => {
      setAnswers({});
      setRevealed(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const questions: Q[] = mut.data?.questions ?? [];
  const score = questions.reduce(
    (s, q, i) => (answers[i] === q.correctIndex ? s + 1 : s),
    0,
  );

  return (
    <GenieShell>
      <SectionTitle
        eyebrow="Quiz"
        title="Test your knowledge"
        description="Pick a topic. EduGenie will generate multiple-choice questions with explanations."
      />

      <GenieCard>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Pythagoras Theorem"
            className="rounded-xl border border-border bg-input/60 px-4 py-3 outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl border border-border bg-input/60 px-4 py-3 outline-none focus:border-primary"
          >
            {[3, 5, 7, 10].map((n) => (
              <option key={n} value={n}>
                {n} questions
              </option>
            ))}
          </select>
          <button
            onClick={() => topic.trim() && mut.mutate()}
            disabled={mut.isPending || !topic.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-genie px-5 py-3 font-medium text-primary-foreground shadow-warm disabled:opacity-60"
          >
            {mut.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            {mut.isPending ? "Generating..." : "Generate quiz"}
          </button>
        </div>
      </GenieCard>

      {questions.length > 0 && (
        <div className="mt-6 space-y-4">
          {questions.map((q, i) => {
            const picked = answers[i];
            return (
              <GenieCard key={i}>
                <div className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-genie text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-lg">{q.question}</p>
                    <div className="mt-4 grid gap-2">
                      {q.options.map((opt, oi) => {
                        const isPicked = picked === oi;
                        const isCorrect = q.correctIndex === oi;
                        const show = revealed;
                        const cls = show
                          ? isCorrect
                            ? "border-primary bg-primary/15 text-foreground"
                            : isPicked
                              ? "border-destructive/60 bg-destructive/10 text-foreground"
                              : "border-border text-muted-foreground"
                          : isPicked
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50";
                        return (
                          <button
                            key={oi}
                            onClick={() => !revealed && setAnswers({ ...answers, [i]: oi })}
                            disabled={revealed}
                            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${cls}`}
                          >
                            <span>{opt}</span>
                            {revealed && isCorrect && (
                              <CheckCircle2 className="size-5 text-primary" />
                            )}
                            {revealed && isPicked && !isCorrect && (
                              <XCircle className="size-5 text-destructive" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {revealed && (
                      <p className="mt-3 rounded-xl bg-secondary/40 p-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Why: </span>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </GenieCard>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-gradient-card p-4">
            <p className="text-sm text-muted-foreground">
              {revealed ? (
                <>
                  Score:{" "}
                  <span className="text-lg font-semibold text-gradient-genie">
                    {score} / {questions.length}
                  </span>
                </>
              ) : (
                <>Answer all questions, then reveal your score.</>
              )}
            </p>
            <div className="flex gap-2">
              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  disabled={Object.keys(answers).length < questions.length}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-genie px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-warm disabled:opacity-50"
                >
                  Reveal answers
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAnswers({});
                    setRevealed(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm"
                >
                  <RotateCcw className="size-4" /> Retake
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </GenieShell>
  );
}
