import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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

type RegimenKey =
  | "Powerlifting"
  | "Cardio"
  | "Pehlewani"
  | "Hyrox"
  | "Hybrid"
  | "Bodybuilding"
  | "Calisthenics"
  | "Running";

const REGIMENS_DATA = [
  {
    key: "Powerlifting" as RegimenKey,
    name: "Powerlifting",
    desc: "Focus on building absolute maximal strength across the 'Big Three' compound lifts: Squat, Bench Press, and Deadlift. Uses percentage-based training (1RM) and long rest periods.",
    split: "3 - 4 Days / Week",
    focus: "Max Strength & Core Stability",
    difficulty: "Advanced",
    img: heroImg,
  },
  {
    key: "Cardio" as RegimenKey,
    name: "Cardio & HIIT",
    desc: "High-intensity intervals, LISS, and heart-rate zone training. Designed to maximize metabolic rate, burn calories, build cardiac capacity, and improve Vo2 Max.",
    split: "3 - 5 Days / Week",
    focus: "Endurance & Calorie Burn",
    difficulty: "All Levels",
    img: runningImg,
  },
  {
    key: "Pehlewani" as RegimenKey,
    name: "Pehlewani (Traditional Indian)",
    desc: "Ancient Indian physical culture. Focuses on functional power, stamina, and deep core conditioning using Gada (maces), Jodi (wooden clubs), Dands (Hindu pushups), and Bethaks (Hindu squats). Includes high-energy recovery nutrition.",
    split: "4 - 6 Days / Week",
    focus: "Functional Power & Stamina",
    difficulty: "Intermediate",
    img: boxingImg,
  },
  {
    key: "Hyrox" as RegimenKey,
    name: "Hyrox Fitness Racing",
    desc: "Elite functional training combining running and heavy workout stations (SkiErg, Sled Push/Pull, Burpees, Rowing, Farmers Carry, Wall Balls). Tests grit and metabolic efficiency.",
    split: "4 - 5 Days / Week",
    focus: "Aerobic Capacity & Grit",
    difficulty: "Advanced",
    img: heroImg,
  },
  {
    key: "Hybrid" as RegimenKey,
    name: "Hybrid Athlete",
    desc: "The best of both worlds. Concurrent training designed to build elite squat/deadlift strength while maintaining marathon-level cardiovascular endurance.",
    split: "4 - 6 Days / Week",
    focus: "Strength & Running Stamina",
    difficulty: "Advanced",
    img: runningImg,
  },
  {
    key: "Bodybuilding" as RegimenKey,
    name: "Bodybuilding",
    desc: "Traditional hypertrophy training designed for muscle aesthetics, high-volume conditioning, and symmetrical physique development using targeted splits.",
    split: "4 - 5 Days / Week",
    focus: "Muscle Hypertrophy & Density",
    difficulty: "Intermediate",
    img: yogaImg,
  },
  {
    key: "Calisthenics" as RegimenKey,
    name: "Calisthenics",
    desc: "Bodyweight mastery focusing on strength, balance, and gymnastic control. Progresses through pull-ups, dips, push-ups, handstands, and levers.",
    split: "3 - 4 Days / Week",
    focus: "Relative Strength & Control",
    difficulty: "Intermediate",
    img: boxingImg,
  },
  {
    key: "Running" as RegimenKey,
    name: "Running & Athletics",
    desc: "Structured road and track training programs covering 5K PR building, tempo runs, active interval training, and single-leg joint health preservation.",
    split: "3 - 5 Days / Week",
    focus: "Speed, Pacing & Joint Health",
    difficulty: "All Levels",
    img: runningImg,
  },
];

const FILTERS = ["Duration", "Muscle group", "Equipment", "Goal", "Intensity"];

export default function WorkoutsPage() {
  const [activeRegimen, setActiveRegimen] = useState<RegimenKey>("Powerlifting");

  const selectRegimen = (key: RegimenKey) => {
    setActiveRegimen(key);
    const customizerEl = document.getElementById("regimen-customizer");
    if (customizerEl) {
      customizerEl.scrollIntoView({ behavior: "smooth" });
    }
  };

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

      {/* FILTER BAR */}
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

      {/* REGIMENS LIST */}
      <Section className="!pt-0">
        <div className="mb-8">
          <p className="eyebrow">Interactive Training Regimens</p>
          <h2 className="display-md mt-2">Choose Your Discipline</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Click on any regimen below to explore its parameters and generate a customized program.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REGIMENS_DATA.map((r, i) => (
            <article
              key={r.key}
              onClick={() => selectRegimen(r.key)}
              className="group card-surface overflow-hidden cursor-pointer hover:border-primary/50 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[5/3] overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.name}
                    loading="lazy"
                    width={800}
                    height={480}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 mono-num text-xs px-2 py-1 rounded bg-background/80 backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest font-mono">
                    {r.difficulty}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="display-sm text-foreground group-hover:text-primary transition">
                    {r.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2 border-t border-border/50 text-[11px] flex justify-between items-center text-muted-foreground">
                <span>{r.split}</span>
                <span className="text-primary font-mono font-medium uppercase tracking-wider">
                  Select →
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* WORKOUT CUSTOMIZER SECTION */}
      <div id="regimen-customizer">
        <Section className="!pt-0">
          <div className="text-center mb-10">
            <p className="eyebrow">Interactive Assessment</p>
            <h2 className="display-lg mt-4">Personalise Your Regimen</h2>
            <p className="max-w-2xl mx-auto text-sm text-muted-foreground mt-3">
              Input your current level (e.g. SBD PRs for powerlifting or max reps/mileage for other
              disciplines) and generate custom loading specifications instantly.
            </p>
          </div>
          <WorkoutCustomizer defaultRegimen={activeRegimen} />
        </Section>
      </div>

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
