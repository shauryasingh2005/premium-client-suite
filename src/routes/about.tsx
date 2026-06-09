import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, Stat } from "@/components/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ANYWHERE FITNESS" },
      {
        name: "description",
        content:
          "ANYWHERE FITNESS’s mission: empower every individual to achieve their personal health goals through intelligent, adaptable, science-backed fitness and nutrition guidance.",
      },
      { property: "og:title", content: "About — ANYWHERE FITNESS" },
      { property: "og:description", content: "Our mission and values." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About ANYWHERE FITNESS"
        title="We build the guidance. You build the habits."
        lead="Personal trainers and dietitians cost ₹50,000+ a month. Most people never get that guidance. ANYWHERE FITNESS puts a coach, dietitian and physio in your pocket — and prices it like a streaming subscription."
      />

      <Section className="!pt-4">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 card-surface p-10">
            <p className="eyebrow">Mission</p>
            <p className="mt-5 text-xl leading-relaxed">
              To empower every individual to achieve their personal health goals through
              intelligent, adaptable, and science-backed fitness and nutrition guidance.
            </p>
          </div>
          <div className="lg:col-span-6 card-surface p-10">
            <p className="eyebrow">Vision</p>
            <p className="mt-5 text-xl leading-relaxed">
              Become the most trusted AI fitness companion in South Asia and beyond — making
              professional-grade health coaching accessible to everyone.
            </p>
          </div>
        </div>
      </Section>

      {/* PROBLEM */}
      <Section className="!pt-0">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">The problem we’re solving</p>
            <h2 className="display-lg mt-4">Fitness apps fail 80% of users in month one.</h2>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {[
              {
                t: "Overwhelming choice",
                d: "Generic plans that don’t fit your body, schedule or experience.",
              },
              {
                t: "Disconnected nutrition",
                d: "Workouts and meals live in separate apps — adherence suffers.",
              },
              { t: "No expert access", d: "Trainers and dietitians are unaffordable for most." },
              {
                t: "Static plans",
                d: "Nothing adapts when you miss workouts, plateau or change goals.",
              },
            ].map((p) => (
              <div key={p.t} className="border-t border-border pt-5">
                <h3 className="font-display text-2xl">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* MARKET */}
      <Section className="!pt-0">
        <div className="card-surface p-10 md:p-14">
          <p className="eyebrow">Market opportunity</p>
          <h2 className="display-lg mt-4 max-w-3xl">
            A $15B market growing 25% YoY in India alone.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-2xl">
            Rising smartphone penetration, post-pandemic health awareness, and a massive underserved
            middle class hungry for affordable, personalised, culturally relevant fitness content.
          </p>
        </div>
      </Section>

      {/* KPI TARGETS */}
      <Section className="!pt-0">
        <p className="eyebrow">12-month targets</p>
        <h2 className="display-lg mt-4">Built to scale.</h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat value="500K" label="App downloads" sub="In year one" />
          <Stat value="150K" label="Monthly active users" sub="Sticky core" />
          <Stat value=">40%" label="D7 retention" sub="Industry-leading" />
          <Stat value=">3" label="Sessions / user / week" sub="Engagement target" />
        </div>
      </Section>

      {/* TECH */}
      <Section className="!pt-0">
        <p className="eyebrow">Tech stack</p>
        <h2 className="display-lg mt-4">Engineered for trust.</h2>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {[
            { k: "Mobile", v: "React Native (iOS 15+ · Android 10+)" },
            { k: "Backend", v: "Node.js + GraphQL on AWS" },
            { k: "Database", v: "PostgreSQL + Redis" },
            { k: "AI engine", v: "Fine-tuned LLM for plan generation" },
            { k: "Video", v: "CloudFront CDN + S3" },
            { k: "Security", v: "SOC 2 Type II · GDPR-ready" },
          ].map((row) => (
            <div key={row.k} className="bg-surface p-7">
              <p className="text-xs font-mono uppercase tracking-widest text-primary">{row.k}</p>
              <p className="mt-2 text-sm">{row.v}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-0 text-center">
        <h2 className="display-lg">Let’s build your best self.</h2>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/pricing" className="btn-primary">
            Start free
          </Link>
          <Link to="/ai-coach" className="btn-ghost">
            See the engine
          </Link>
        </div>
      </Section>
    </>
  );
}
