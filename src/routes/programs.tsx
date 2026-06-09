import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/Section";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — ANYWHERE FITNESS" },
      {
        name: "description",
        content:
          "Structured multi-week programs: shred, strength foundation, hypertrophy, mobility resets and more. Every program adapts as you progress.",
      },
      { property: "og:title", content: "Programs — ANYWHERE FITNESS" },
      {
        property: "og:description",
        content: "Structured multi-week programs built around your goals.",
      },
    ],
  }),
  component: ProgramsPage,
});

const PROGRAMS = [
  {
    name: "Shred Sprint",
    weeks: 6,
    goal: "Aggressive fat loss with muscle retention",
    level: "Intermediate",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "Strength Foundation",
    weeks: 8,
    goal: "Build raw strength — squat, bench, deadlift",
    level: "Intermediate",
    color: "from-amber-400 to-orange-600",
  },
  {
    name: "First 30 Days",
    weeks: 4,
    goal: "Build the daily habit from scratch",
    level: "Beginner",
    color: "from-yellow-400 to-amber-500",
  },
  {
    name: "Home Hero",
    weeks: 8,
    goal: "Zero-equipment muscle and conditioning",
    level: "Beginner → Int.",
    color: "from-amber-500 to-red-500",
  },
  {
    name: "Hypertrophy Block",
    weeks: 12,
    goal: "Aesthetic muscle growth, progressive overload",
    level: "Advanced",
    color: "from-orange-400 to-rose-600",
  },
  {
    name: "Mobility Reset",
    weeks: 4,
    goal: "Fix posture, restore range, prevent injury",
    level: "All levels",
  },
  {
    name: "Post-Injury Return",
    weeks: 6,
    goal: "Rebuild strength safely after a setback",
    level: "Rehab",
  },
  {
    name: "Bridal Glow",
    weeks: 10,
    goal: "Tone, definition, glow on a deadline",
    level: "All levels",
  },
];

function ProgramsPage() {
  return (
    <AuthGuard
      title="Structured Training Programs"
      description="Unlock 12-week powerlifting tracks, hypertrophy blocks, home zero-equipment routines, and guided post-injury rehab blocks."
    >
      <PageHeader
        eyebrow="Structured programs"
        title="Pick a goal. We’ll build the path."
        lead="Every program is a multi-week roadmap with progressive overload, deload weeks, and check-ins baked in. Your plan recalibrates around real-life adherence — not a static PDF."
      />

      <Section className="!pt-0">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROGRAMS.map((p, i) => (
            <article key={p.name} className="group card-surface p-7 flex flex-col">
              <div className="flex items-start justify-between">
                <span className="mono-num text-xs text-muted-foreground">
                  PRG / {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                  {p.level}
                </span>
              </div>
              <h3 className="display-md mt-6">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{p.goal}</p>
              <div className="mt-7 pt-5 border-t border-border flex items-center justify-between">
                <div>
                  <p className="mono-num text-3xl text-primary leading-none">
                    {p.weeks}
                    <span className="text-sm text-muted-foreground"> wk</span>
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wider text-primary font-mono group-hover:translate-x-1 transition">
                  View plan →
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-surface p-8 md:p-10">
            <p className="eyebrow">Custom plan generator</p>
            <h2 className="display-md mt-4">Or build your own in 90 seconds.</h2>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              Tell us your goal, equipment, schedule and experience. The AI generates a periodised
              plan unique to your body. Swap exercises, adjust frequency, confirm — and it syncs
              straight to your calendar.
            </p>
            <Link to="/ai-coach" className="btn-primary mt-7">
              Generate my plan
            </Link>
          </div>
          <div className="card-surface p-8 md:p-10">
            <p className="eyebrow">Inside every program</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Periodised weekly structure with deloads",
                "Substitutions for missing equipment",
                "Synced nutrition macro targets",
                "Calendar + reminder integration",
                "Progress dashboard & PR tracking",
                "Pause / resume without losing context",
              ].map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 py-3 border-t border-border first:border-t-0 first:pt-0"
                >
                  <span className="text-primary mono-num text-sm mt-0.5">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </AuthGuard>
  );
}
