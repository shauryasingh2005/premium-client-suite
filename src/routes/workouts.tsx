import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/Section";
import { WorkoutCustomizer } from "@/components/WorkoutCustomizer";
import heroImg from "@/assets/hero-athlete.jpg";
import yogaImg from "@/assets/yoga.jpg";
import boxingImg from "@/assets/boxing.jpg";
import runningImg from "@/assets/running.jpg";
import { AuthGuard } from "@/components/AuthGuard";

export const Route = createFileRoute("/workouts")({
  head: () => ({
    meta: [
      { title: "Workouts — ANYWHERE FITNESS" },
      {
        name: "description",
        content:
          "500+ guided workouts across 20+ categories: strength, HIIT, yoga, mobility, martial arts, rehab, pre/post-natal and more — every session HD-filmed with form cues.",
      },
      { property: "og:title", content: "Workouts — ANYWHERE FITNESS" },
      { property: "og:description", content: "500+ guided workouts across 20+ categories." },
    ],
  }),
  component: WorkoutsPage,
});

const CATEGORIES = [
  {
    name: "Strength Training",
    types: "Powerlifting · Hypertrophy · Functional · Olympic",
    img: heroImg,
  },
  { name: "Cardio & HIIT", types: "Tabata · Sprint intervals · LISS · EMOM", img: runningImg },
  { name: "Yoga & Mobility", types: "Vinyasa · Hatha · Mobility flow · Recovery", img: yogaImg },
  { name: "Martial Arts", types: "Boxing · Kickboxing · MMA conditioning", img: boxingImg },
  { name: "Dance & Aerobics", types: "Zumba · Bollywood Dance · Aerobic Circuits", img: yogaImg },
  { name: "Rehabilitation", types: "Back · Knee · Shoulder mobility", img: runningImg },
  { name: "Pre / Post Natal", types: "Pregnancy-safe · Postpartum recovery", img: yogaImg },
  {
    name: "Mindfulness & Breathwork",
    types: "Pranayama · Box breathing · Meditation",
    img: yogaImg,
  },
  { name: "Kids & Teen", types: "Age-appropriate · Gamified", img: runningImg },
];

const FILTERS = ["Duration", "Muscle group", "Equipment", "Goal", "Intensity"];

export default function WorkoutsPage() {
  return (
    <AuthGuard
      title="Guided Workout Library"
      description="Unlock 500+ guided HD video workouts, custom workout creation tools, and progress trackers."
    >
      <PageHeader
        eyebrow="Workout library — 500+ sessions"
        title="Train anything. Anywhere."
        lead="Every session is filmed in HD with form cues, modifications, muscle-group diagrams and calorie estimates. Filter by what you’ve got — equipment, time, intensity — and start in under 10 seconds."
      />

      <Section className="!pt-4">
        <div className="card-surface p-4 md:p-5 flex items-center gap-3 flex-wrap">
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest mr-2">
            Filter by
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              className="text-xs px-3 py-2 rounded-full border border-border hover:border-primary hover:text-primary transition"
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            Available offline once downloaded
          </span>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((c, i) => (
            <article key={c.name} className="group card-surface overflow-hidden">
              <div className="relative aspect-[5/3] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  width={800}
                  height={480}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 mono-num text-xs px-2 py-1 rounded bg-background/80 backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6">
                <h3 className="display-md">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.types}</p>
                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="text-primary font-mono uppercase tracking-wider">Browse →</span>
                  <span className="text-muted-foreground">HD · Offline-ready</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* WORKOUT CUSTOMIZER SECTION */}
      <Section className="!pt-0">
        <div className="text-center mb-10">
          <p className="eyebrow">Interactive Assessment</p>
          <h2 className="display-lg mt-4">Personalise Your Regimen</h2>
          <p className="max-w-2xl mx-auto text-sm text-muted-foreground mt-3">
            Input your current level (e.g. SBD PRs for powerlifting or max reps/mileage for other
            disciplines) and generate custom loading specifications instantly.
          </p>
        </div>
        <WorkoutCustomizer />
      </Section>

      {/* SPEC */}
      <Section className="!pt-0">
        <div className="card-surface p-8 md:p-12 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">Every workout includes</p>
            <h2 className="display-lg mt-4">No half-measures.</h2>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {[
              "HD video demonstration",
              "Step-by-step written cues",
              "Muscle group targeting diagram",
              "Beginner / Intermediate / Advanced",
              "Duration + equipment required",
              "Calorie burn estimate",
              "Form modifications & alternatives",
              "Offline download",
            ].map((s) => (
              <div key={s} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-none" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link to="/programs" className="btn-primary">
            See structured programs
          </Link>
        </div>
      </Section>
    </AuthGuard>
  );
}
