import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircleQuestion, ListChecks, FileText, Route as RouteIcon, Sparkles, ArrowRight } from "lucide-react";
import { GenieShell } from "@/components/GenieShell";
import { GenieCard } from "@/components/GenieCard";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const FEATURES = [
  {
    to: "/ask" as const,
    icon: MessageCircleQuestion,
    title: "Ask anything",
    desc: "Get accurate answers with helpful context for any subject or level.",
  },
  {
    to: "/quiz" as const,
    icon: ListChecks,
    title: "Generate quizzes",
    desc: "Turn any topic into a targeted multiple-choice self-assessment.",
  },
  {
    to: "/summarize" as const,
    icon: FileText,
    title: "Summarize notes",
    desc: "Compress long readings into revision-ready summaries and key points.",
  },
  {
    to: "/roadmap" as const,
    icon: RouteIcon,
    title: "Personalized roadmaps",
    desc: "Beginner to advanced learning paths with milestones and resources.",
  },
];

const SCENARIOS = [
  {
    q: "Which is the largest ocean?",
    tag: "Instant Q&A",
  },
  {
    q: "Generate a quiz on the Pythagoras Theorem",
    tag: "Self-assess",
  },
  {
    q: "Create a learning roadmap for SQL",
    tag: "Roadmap",
  },
];

function Home() {
  return (
    <GenieShell>
      <section className="grid items-center gap-10 pb-16 pt-8 md:grid-cols-2 md:pt-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            AI learning companion
          </span>
          <h1 className="mt-5 text-5xl leading-[1.05] md:text-6xl">
            Learn faster with your{" "}
            <span className="text-gradient-genie">personal genie</span>.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            EduGenie answers questions, explains concepts, generates quizzes,
            summarizes readings, and builds personalized roadmaps — all powered by AI.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/ask"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-genie px-6 py-3 font-medium text-primary-foreground shadow-warm transition-transform hover:-translate-y-0.5"
            >
              Start learning <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium hover:bg-secondary/40"
            >
              Build a roadmap
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <div
                key={s.q}
                className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground"
              >
                <span className="mr-2 text-primary">{s.tag}</span>
                {s.q}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-genie opacity-30 blur-3xl" />
          <img
            src={heroImg}
            alt="Glowing books and geometric symbols representing AI-assisted learning"
            width={1600}
            height={1200}
            className="relative aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-glow"
          />
        </div>
      </section>

      <section className="pb-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              What you can do
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl">Four ways to learn smarter</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className="group">
              <GenieCard className="h-full transition-transform group-hover:-translate-y-1">
                <div className="mb-4 grid size-11 place-items-center rounded-xl bg-gradient-genie shadow-warm">
                  <f.icon className="size-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                  Try it <ArrowRight className="size-3.5" />
                </div>
              </GenieCard>
            </Link>
          ))}
        </div>
      </section>
    </GenieShell>
  );
}
