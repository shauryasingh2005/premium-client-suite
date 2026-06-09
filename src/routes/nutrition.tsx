import { createFileRoute, Link } from "@tanstack/react-router";
import nutritionImg from "@/assets/nutrition-bowl.jpg";
import { PageHeader, Section } from "@/components/Section";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Nutrition — ANYWHERE FITNESS" },
      {
        name: "description",
        content:
          "AI-built meal plans that match your training. Indian, Mediterranean, Western, vegetarian, vegan, diabetic-friendly and PCOS-aware. Auto grocery lists, macro-locked swaps, barcode tracker.",
      },
      { property: "og:title", content: "Nutrition — ANYWHERE FITNESS" },
      { property: "og:description", content: "Meals that match the work." },
    ],
  }),
  component: NutritionPage,
});

function NutritionPage() {
  return (
    <AuthGuard
      title="Intelligent Nutrition Engine"
      description="Unlock macro-balanced, Indian-localised customized meal planners, barcode scanners, and calorie trackers."
    >
      <PageHeader
        eyebrow="Nutrition system"
        title="Eat for the plan you’re running."
        lead="ANYWHERE FITNESS is the only app where workouts and meals share an engine. Macros recalibrate with your training block. Cuisine adapts to your kitchen. Cheat meals don’t derail you — they’re budgeted in."
      />

      <Section className="!pt-4">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
              <img
                src={nutritionImg}
                alt="Healthy meal plan"
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6">
            <h2 className="display-md">Diet types built in.</h2>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {[
                "Vegetarian",
                "Vegan",
                "Non-Vegetarian",
                "High-Protein",
                "Keto",
                "Low-Carb",
                "Intermittent Fasting",
                "Mediterranean",
              ].map((d) => (
                <div key={d} className="card-surface px-4 py-3 text-sm">
                  {d}
                </div>
              ))}
            </div>

            <h3 className="display-md mt-12">Cuisine localisation.</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              North Indian · South Indian · Bengali · Gujarati · Mediterranean · Western — recipes
              calibrated to real Indian kitchens and seasonal produce.
            </p>

            <h3 className="display-md mt-12">Medical-aware plans.</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Diabetic-friendly",
                "PCOS support",
                "Thyroid-friendly",
                "Lactose-free",
                "Gluten-free",
              ].map((m) => (
                <span
                  key={m}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-foreground/80"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FEATURES */}
      <Section className="!pt-0">
        <p className="eyebrow">What you get</p>
        <h2 className="display-lg mt-4 max-w-3xl">Every meal — engineered.</h2>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              t: "Macro breakdown",
              d: "Protein, carbs, fat and calories per meal, with ingredient-level tracking.",
            },
            {
              t: "Weekly meal plans",
              d: "Breakfast, lunch, dinner and snacks — auto-built for the week.",
            },
            {
              t: "Recipes & prep time",
              d: "Step-by-step recipes with prep time, difficulty and pantry needs.",
            },
            {
              t: "Macro-locked swaps",
              d: "Swap any meal — system finds alternatives that hit the same macros.",
            },
            { t: "Auto grocery list", d: "One-tap shopping list pulled from your week’s plan." },
            {
              t: "Water intake tracker",
              d: "Smart reminders calibrated to your training load and climate.",
            },
            {
              t: "Barcode + Indian DB",
              d: "Scan packaged food or search a vast Indian food database.",
            },
            {
              t: "Cheat meal budgeting",
              d: "Plan indulgences in — the AI rebalances the rest of the week.",
            },
            {
              t: "Macros sync to training",
              d: "Surplus on lift days, deficit on rest days — automatically.",
            },
          ].map((f, i) => (
            <div key={f.t} className="card-surface p-7">
              <p className="mono-num text-xs text-primary">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-display text-2xl mt-3">{f.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="card-surface p-10 md:p-14 text-center">
          <p className="eyebrow">Ready when you are</p>
          <h2 className="display-lg mt-4">
            Stop guessing.
            <br />
            Start eating to win.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/pricing" className="btn-primary">
              Start free trial
            </Link>
            <Link to="/ai-coach" className="btn-ghost">
              How the AI builds it →
            </Link>
          </div>
        </div>
      </Section>
    </AuthGuard>
  );
}
