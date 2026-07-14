import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, MapPin, BookOpen, Target, Route as RouteIcon } from "lucide-react";
import { GenieShell } from "@/components/GenieShell";
import { GenieCard, SectionTitle } from "@/components/GenieCard";
import { generateRoadmap } from "@/lib/edugenie.functions";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Personalized Learning Roadmap — EduGenie" },
      {
        name: "description",
        content:
          "Generate a beginner-to-advanced learning roadmap for any topic with milestones and resources.",
      },
      { property: "og:title", content: "Personalized Learning Roadmap — EduGenie" },
      {
        property: "og:description",
        content: "Beginner → Advanced roadmaps with real milestones.",
      },
    ],
  }),
  component: RoadmapPage,
});

const STAGE_STYLES: Record<string, string> = {
  Beginner: "from-emerald-400/80 to-teal-400/80",
  Intermediate: "from-amber-400/80 to-orange-400/80",
  Advanced: "from-fuchsia-400/80 to-violet-400/80",
};

function RoadmapPage() {
  const [topic, setTopic] = useState("");
  const fn = useServerFn(generateRoadmap);
  const mut = useMutation({
    mutationFn: () => fn({ data: { topic: topic.trim() } }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <GenieShell>
      <SectionTitle
        eyebrow="Roadmap"
        title="Your personalized learning path"
        description="Tell EduGenie what you want to learn. Get a 3-stage plan with milestones, topics, and resources."
      />

      <GenieCard>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. SQL, Machine Learning, French A1..."
            className="flex-1 rounded-xl border border-border bg-input/60 px-4 py-3 outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <button
            onClick={() => topic.trim() && mut.mutate()}
            disabled={mut.isPending || !topic.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-genie px-5 py-3 font-medium text-primary-foreground shadow-warm disabled:opacity-60"
          >
            {mut.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RouteIcon className="size-4" />
            )}
            {mut.isPending ? "Building..." : "Build roadmap"}
          </button>
        </div>
      </GenieCard>

      {mut.data && (
        <div className="mt-8">
          <h2 className="mb-6 text-2xl">
            Roadmap for <span className="text-gradient-genie">{mut.data.topic}</span>
          </h2>
          <div className="relative space-y-6">
            <div className="absolute left-4 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-primary/60 via-accent/60 to-transparent md:block" />
            {mut.data.stages.map((s, i) => (
              <div key={i} className="relative md:pl-14">
                <div
                  className={`absolute left-0 top-1 hidden size-9 place-items-center rounded-full bg-gradient-to-br shadow-warm md:grid ${
                    STAGE_STYLES[s.level] ?? ""
                  }`}
                >
                  <MapPin className="size-4 text-primary-foreground" />
                </div>
                <GenieCard>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                        Stage {i + 1} · {s.level}
                      </span>
                      <h3 className="mt-1 text-xl">{s.title}</h3>
                    </div>
                    <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
                      ~{s.durationWeeks} weeks
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        <BookOpen className="size-3.5" /> Topics
                      </p>
                      <ul className="space-y-1.5 text-sm">
                        {s.topics.map((t, ti) => (
                          <li key={ti} className="flex gap-2">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        <Target className="size-3.5" /> Resources
                      </p>
                      <ul className="space-y-1.5 text-sm">
                        {s.resources.map((r, ri) => (
                          <li key={ri} className="flex gap-2">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
                    <span className="font-medium text-primary">Milestone: </span>
                    {s.milestone}
                  </div>
                </GenieCard>
              </div>
            ))}
          </div>
        </div>
      )}
    </GenieShell>
  );
}
