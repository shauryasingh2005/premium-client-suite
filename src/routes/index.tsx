import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-athlete.jpg";
import nutritionImg from "@/assets/nutrition-bowl.jpg";
import yogaImg from "@/assets/yoga.jpg";
import boxingImg from "@/assets/boxing.jpg";
import runningImg from "@/assets/running.jpg";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";
import { Section, Stat } from "@/components/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ANYWHERE FITNESS — AI-Powered Fitness & Nutrition" },
      {
        name: "description",
        content:
          "500+ guided workouts. Custom AI plans. Integrated nutrition. The all-in-one fitness companion that adapts as you do.",
      },
      { property: "og:title", content: "ANYWHERE FITNESS — Build Your Best Self" },
      {
        property: "og:description",
        content: "AI-powered fitness & nutrition, built for every level.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-x pt-12 md:pt-20 pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1.5 text-xs">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">v1.0 launching across India</span>
            </div>
            <h1 className="display-xl mt-6">
              Build
              <br />
              Your
              <br />
              <span
                style={{
                  background: "var(--gradient-ember)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Best Self.
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              ANYWHERE FITNESS is the AI fitness companion that learns from every workout — adapting
              plans, nutrition, and recovery to <em className="text-foreground not-italic">your</em>{" "}
              body, schedule, and goals.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/pricing" className="btn-primary">
                Start free trial
              </Link>
              <Link to="/ai-coach" className="btn-ghost">
                How the AI works →
              </Link>
            </div>
            <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="mono-num text-3xl">
                  500<span className="text-primary">+</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Guided workouts</p>
              </div>
              <div>
                <p className="mono-num text-3xl">
                  20<span className="text-primary">+</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Categories</p>
              </div>
              <div>
                <p className="mono-num text-3xl">
                  1M<span className="text-primary">+</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Plan permutations</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
              <img
                src={heroImg}
                alt="Athlete training"
                className="absolute inset-0 h-full w-full object-cover"
                width={1080}
                height={1350}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, transparent 40%, var(--background) 100%)",
                }}
              />
              <div className="absolute left-5 bottom-5 right-5">
                <div className="card-surface !bg-background/70 backdrop-blur-md p-4 flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full grid place-items-center"
                    style={{ background: "var(--gradient-ember)" }}
                  >
                    <svg
                      className="h-5 w-5 text-background"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13 2L4 14h7l-2 8 10-13h-7l1-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Tonight’s session</p>
                    <p className="text-sm font-semibold">Push Day · 48 min · 6 PRs in sight</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-6 hidden md:block card-surface !bg-background/80 backdrop-blur p-3 px-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Recovery</p>
              <p className="mono-num text-xl text-primary">
                92<span className="text-sm text-muted-foreground">/100</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-border bg-surface/40 overflow-hidden">
        <div className="container-x py-5 flex items-center gap-x-12 gap-y-3 flex-wrap text-xs text-muted-foreground font-mono uppercase tracking-widest">
          <span>Featured by</span>
          {[
            "YourStory",
            "Inc42",
            "Economic Times",
            "Forbes India",
            "TechCrunch",
            "Hindu Business Line",
          ].map((p) => (
            <span key={p} className="opacity-70 hover:opacity-100 transition">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* VALUE PROPS */}
      <Section>
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Why ANYWHERE FITNESS</p>
            <h2 className="display-lg mt-4">
              One app.
              <br />
              Every goal.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Generic plans don’t work. ANYWHERE FITNESS unifies workouts, nutrition, and recovery
              in one adaptive system — the kind of guidance that used to require a personal trainer,
              a dietitian, and a physio on call.
            </p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden">
            {[
              {
                t: "Deep personalisation",
                d: "Plans built from your body type, schedule, equipment, and goals — recalibrated weekly.",
              },
              {
                t: "Fitness + nutrition",
                d: "Workouts and meals share one engine, so calories and effort always line up.",
              },
              {
                t: "Adaptive feedback loop",
                d: "Miss a session or plateau? The plan rewrites itself overnight.",
              },
              {
                t: "India-first content",
                d: "Hindi support, regional cuisines, and meal plans built for real Indian kitchens.",
              },
            ].map((v, i) => (
              <div key={i} className="bg-background p-8 hover:bg-surface transition">
                <p className="mono-num text-primary text-sm">0{i + 1}</p>
                <h3 className="display-md mt-5">{v.t}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CATEGORIES */}
      <Section className="!pt-0">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="eyebrow">Workout library</p>
            <h2 className="display-lg mt-4">
              20+ categories.
              <br />
              Always something new.
            </h2>
          </div>
          <Link to="/workouts" className="btn-ghost">
            Browse all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { img: heroImg, title: "Strength", count: "120+ workouts", tag: "Hypertrophy" },
            { img: yogaImg, title: "Yoga & Mobility", count: "85 workouts", tag: "Recovery" },
            { img: boxingImg, title: "Martial Arts", count: "60 workouts", tag: "Conditioning" },
            { img: runningImg, title: "Cardio & HIIT", count: "95 workouts", tag: "Burn" },
          ].map((c) => (
            <div
              key={c.title}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border"
            >
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                width={800}
                height={1066}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, transparent 30%, oklch(0 0 0 / 0.85) 100%)",
                }}
              />
              <div className="absolute inset-x-5 bottom-5">
                <p className="text-[10px] uppercase tracking-widest text-primary">{c.tag}</p>
                <h3 className="display-md mt-2 text-white">{c.title}</h3>
                <p className="mt-1 text-xs text-white/60 font-mono">{c.count}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* AI ENGINE */}
      <section className="border-y border-border bg-surface/30 grain">
        <div className="container-x py-24 md:py-32 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">AI coaching engine</p>
            <h2 className="display-lg mt-4">
              A coach that <br />
              rewrites your plan <br />
              every week.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Each Sunday, ANYWHERE FITNESS analyses your sessions, sleep, RPE, body weight and
              adherence — then ships a fresh plan for the week ahead. No two athletes ever run the
              same program.
            </p>
            <Link to="/ai-coach" className="btn-primary mt-8">
              Meet the engine
            </Link>
          </div>
          <div className="lg:col-span-7">
            <div className="card-surface p-6 md:p-8">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Weekly check-in · Week 06</p>
                  <p className="font-display text-2xl">Plan recalibration</p>
                </div>
                <span className="rounded-full bg-primary/15 text-primary text-xs font-mono px-3 py-1.5 uppercase tracking-wider">
                  Optimising
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { k: "Workout difficulty", v: "Hard (8/10)", action: "→ Reducing volume −12%" },
                  { k: "Sleep quality", v: "6.4 hrs avg", action: "→ Inserting deload day" },
                  { k: "Body weight trend", v: "−0.6 kg / week", action: "→ Macros holding" },
                  { k: "Adherence", v: "5/5 sessions", action: "→ Unlocking PR week" },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="grid grid-cols-12 gap-4 items-center py-3 border-t border-border first:border-t-0"
                  >
                    <p className="col-span-5 text-sm">{row.k}</p>
                    <p className="col-span-3 mono-num text-sm text-foreground">{row.v}</p>
                    <p className="col-span-4 text-xs text-primary font-mono">{row.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NUTRITION TEASE */}
      <Section>
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <p className="eyebrow">Nutrition built-in</p>
            <h2 className="display-lg mt-4">Meals that match the work.</h2>
            <p className="mt-6 text-muted-foreground max-w-lg">
              Diet plans synced with your training — Indian, Mediterranean, Western, vegetarian,
              vegan, diabetic-friendly, PCOS-aware. Auto-generated grocery lists, meal-swap with
              macro lock, and a barcode tracker that knows Indian food.
            </p>
            <ul className="mt-8 space-y-3 max-w-md">
              {[
                "Macro-locked meal swaps",
                "Weekly auto grocery list",
                "Barcode + Indian food database",
                "Cheat-meal budgeting",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/nutrition" className="btn-ghost mt-8">
              Explore nutrition →
            </Link>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
              <img
                src={nutritionImg}
                alt="Healthy meal"
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* STATS / KPIS */}
      <Section className="!pt-0">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat value="<3s" label="Cold start" sub="Even on 4G" />
          <Stat value="99.9%" label="Uptime SLA" sub="Backend services" />
          <Stat value="1M+" label="Concurrent users" sub="Scaled architecture" />
          <Stat value="SOC 2" label="Type II compliant" sub="GDPR-ready from day 1" />
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="!pt-0">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="eyebrow">Real members</p>
            <h2 className="display-lg mt-4">From the field.</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              img: t1,
              name: "Anika S.",
              role: "Beginner · Bengaluru",
              quote:
                "Lost 7 kg in 14 weeks without ever stepping into a gym. The plan adjusted every time life got in the way.",
            },
            {
              img: t2,
              name: "Rohan K.",
              role: "Gym-goer · Mumbai",
              quote:
                "Periodisation that actually makes sense. PR’d my deadlift in 6 weeks. The AI knows when to push and when to back off.",
            },
            {
              img: t3,
              name: "Vikram M.",
              role: "Busy professional · Delhi",
              quote:
                "20-minute sessions that respect my calendar. Nutrition syncs with my travel weeks. It just works.",
            },
          ].map((t) => (
            <figure key={t.name} className="card-surface p-7 flex flex-col">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h4v4H7c0 3 1 5 4 6v2C6 18 4 14 4 11V7zm9 0h4v4h-4c0 3 1 5 4 6v2c-5-1-7-5-7-8V7z" />
              </svg>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/90 flex-1">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section id="download" className="container-x pb-24">
        <div
          className="relative overflow-hidden rounded-3xl border border-border p-10 md:p-16 grain"
          style={{
            background: "linear-gradient(135deg, oklch(0.22 0.04 240), oklch(0.16 0.012 240))",
          }}
        >
          <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <p className="eyebrow">Start today</p>
              <h2 className="display-xl mt-4">
                The plan begins
                <br />
                the moment you do.
              </h2>
              <p className="mt-6 text-muted-foreground max-w-xl">
                7-day free trial. Cancel anytime. iOS & Android, with Hindi + English from launch.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <a href="#" className="btn-primary !justify-between">
                <span>Download on iOS</span>
                <span aria-hidden>↗</span>
              </a>
              <a href="#" className="btn-ghost !justify-between">
                <span>Get it on Android</span>
                <span aria-hidden>↗</span>
              </a>
              <Link
                to="/pricing"
                className="text-xs text-center text-muted-foreground hover:text-foreground mt-2"
              >
                See pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
