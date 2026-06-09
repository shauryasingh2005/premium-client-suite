import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/Section";

export const Route = createFileRoute("/ai-coach")({
  head: () => ({
    meta: [
      { title: "AI Coach — ANYWHERE FITNESS" },
      { name: "description", content: "The adaptive engine inside ANYWHERE FITNESS: weekly check-ins, plan recalibration, progress tracking, gamified milestones, and a community that pushes you forward." },
      { property: "og:title", content: "AI Coach — ANYWHERE FITNESS" },
      { property: "og:description", content: "A coach that rewrites your plan every week." },
    ],
  }),
  component: AICoachPage,
});

const FLOW = [
  { step: "Sense", body: "Logs workouts, sleep, body weight, energy, RPE, adherence and recovery scores." },
  { step: "Score", body: "Computes weekly readiness, recovery debt, training stimulus and macro accuracy." },
  { step: "Adjust", body: "Rewrites next week: volume, intensity, exercise selection, calories, macros." },
  { step: "Coach", body: "Surfaces what changed, why, and what to focus on this week — in plain English." },
];

function AICoachPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI coaching engine"
        title="The plan rewrites itself."
        lead="Static plans break the moment life happens. ANYWHERE FITNESS’s coaching engine learns from every session, every meal, every night of sleep — and ships a fresh plan every Sunday."
      />

      {/* FLOW */}
      <Section className="!pt-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
          {FLOW.map((s, i) => (
            <div key={s.step} className="bg-surface p-8 hover:bg-surface-2 transition">
              <p className="mono-num text-primary text-sm">0{i + 1}</p>
              <h3 className="display-md mt-4">{s.step}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* WEEKLY CHECK-IN MOCK */}
      <Section className="!pt-0">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow">Weekly check-in</p>
            <h2 className="display-lg mt-4">5 questions.<br/>A new plan.</h2>
            <p className="mt-6 text-muted-foreground">
              Every Sunday, ANYWHERE FITNESS asks how the week felt — workouts, sleep, mood, weight, hunger. In under 90 seconds, your entire plan recalibrates for the week ahead.
            </p>
          </div>
          <div className="lg:col-span-7 card-surface p-6 md:p-8">
            <div className="space-y-5">
              {[
                { q: "How hard did this week’s workouts feel?", a: "8 / 10 · Hard" },
                { q: "Average sleep this week?", a: "6.4 hrs" },
                { q: "Body weight today?", a: "74.2 kg · ↓ 0.6" },
                { q: "Energy levels?", a: "Moderate" },
                { q: "How hungry between meals?", a: "Often" },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <p className="text-sm text-muted-foreground">Q{i + 1}. {row.q}</p>
                    <p className="mono-num text-sm text-primary whitespace-nowrap">{row.a}</p>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${[80, 64, 70, 55, 75][i]}%`, background: "var(--gradient-ember)" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Calibrating…</p>
              <p className="text-sm font-medium text-primary">New plan in 12s →</p>
            </div>
          </div>
        </div>
      </Section>

      {/* PROGRESS + SOCIAL */}
      <Section className="!pt-0">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 card-surface p-8">
            <p className="eyebrow">Progress tracking</p>
            <h3 className="display-md mt-4">Visual analytics, streaks, achievements.</h3>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
              {[
                "Body metric tracking (weight, BF%, measurements)",
                "PR history per lift",
                "Workout consistency calendar",
                "Macro adherence trendlines",
                "Achievement badges & milestones",
                "Exportable PDF reports for coaches",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2"><span className="text-primary mt-1">·</span>{s}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 card-surface p-8">
            <p className="eyebrow">Social & community</p>
            <h3 className="display-md mt-4">Train alone. Push together.</h3>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Community feed: workouts, meals, photos",
                "7- and 30-day challenges with leaderboards",
                "Workout buddy matching",
                "Live sessions with certified trainers (Pro)",
                "1-1 coach messaging (Pro)",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2"><span className="text-primary mt-1">·</span>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="!pt-0 text-center">
        <h2 className="display-lg">A coach in your pocket.</h2>
        <p className="mt-4 text-muted-foreground">From your first push-up to your first PR.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/pricing" className="btn-primary">See pricing</Link>
          <Link to="/programs" className="btn-ghost">Browse programs</Link>
        </div>
      </Section>
    </>
  );
}
