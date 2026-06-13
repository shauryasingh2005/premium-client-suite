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
  | "Hybrid"
  | "Powerlifting"
  | "GymGoer"
  | "Calisthenics"
  | "Dumbbell"
  | "Cardio"
  | "Mugdal"
  | "Pehelwani"
  | "MMA"
  | "Power"
  | "Maintenance";

const REGIMENS_DATA = [
  {
    key: "Hybrid" as RegimenKey,
    name: "Hybrid Athlete",
    desc: "The best of both worlds. Concurrent training designed to build elite compound barbell strength while maintaining high-capacity endurance.",
    split: "4 - 6 Days / Week",
    focus: "Strength & Running Stamina",
    difficulty: "Advanced",
    img: runningImg,
  },
  {
    key: "Powerlifting" as RegimenKey,
    name: "Powerlifting",
    desc: "Focus on building absolute maximal force across the Big Three: Squat, Bench Press, and Deadlift. Heavy CNS-recruiting loading cycles.",
    split: "3 - 4 Days / Week",
    focus: "Max Strength & CNS Power",
    difficulty: "Advanced",
    img: heroImg,
  },
  {
    key: "GymGoer" as RegimenKey,
    name: "General Gym Goer",
    desc: "Hypertrophy and physical conditioning. Uses mechanical tension and metabolic stress to optimize muscle volume and density.",
    split: "3 - 5 Days / Week",
    focus: "Hypertrophy & Body Recomp",
    difficulty: "Intermediate",
    img: yogaImg,
  },
  {
    key: "Calisthenics" as RegimenKey,
    name: "Calisthenics Mastery",
    desc: "Gymnastic controls and relative bodyweight strength. Progression through pull-ups, dips, push-ups, and advanced holds.",
    split: "3 - 4 Days / Week",
    focus: "Bodyweight Power & Balance",
    difficulty: "Intermediate",
    img: boxingImg,
  },
  {
    key: "Dumbbell" as RegimenKey,
    name: "Dumbbell-Only Training",
    desc: "Unilateral strength and stabilizer recruitment. Excellent for correcting bilateral deficits and promoting structural balance.",
    split: "3 - 4 Days / Week",
    focus: "Stabilization & Joint Balance",
    difficulty: "All Levels",
    img: runningImg,
  },
  {
    key: "Cardio" as RegimenKey,
    name: "Cardiovascular Conditioning",
    desc: "Dual-track conditioning blending High-Intensity Interval Training (HIIT) with Low-Intensity Steady State (LISS) cardio.",
    split: "3 - 5 Days / Week",
    focus: "Vo2 Max & Aerobic Base",
    difficulty: "All Levels",
    img: runningImg,
  },
  {
    key: "Mugdal" as RegimenKey,
    name: "Mugdal (Indian Club) Training",
    desc: "Circular movement patterns using traditional heavy wooden clubs (Mugdals) to build extreme shoulder mobility, rotational core, and grip.",
    split: "2 - 3 Days / Week",
    focus: "Shoulder Health & Rotational Grip",
    difficulty: "Intermediate",
    img: heroImg,
  },
  {
    key: "Pehelwani" as RegimenKey,
    name: "Pehelwani (Traditional Wrestling)",
    desc: "Traditional Indian Akhada physical culture. Features high-volume Dands (pushups), Bethaks (squats), and wrestling-specific capacity drills.",
    split: "4 - 6 Days / Week",
    focus: "Functional Stamina & Core Power",
    difficulty: "Advanced",
    img: boxingImg,
  },
  {
    key: "MMA" as RegimenKey,
    name: "MMA Fight Readiness",
    desc: "Wrestling takedowns, clinch works, and shadowboxing circuits designed to navigate the multi-system anaerobic/aerobic demand of combat.",
    split: "3 - 5 Days / Week",
    focus: "Combat Conditioning & Resilience",
    difficulty: "Advanced",
    img: boxingImg,
  },
  {
    key: "Power" as RegimenKey,
    name: "Power & Explosiveness",
    desc: "Contrast training utilising Post-Activation Potentiation (PAP) to maximize motor-unit recruitment and vertical/horizontal force velocity.",
    split: "3 Days / Week",
    focus: "Neuromuscular Explosiveness",
    difficulty: "Advanced",
    img: heroImg,
  },
  {
    key: "Maintenance" as RegimenKey,
    name: "Basic Maintenance Training",
    desc: "General joint preservation, active mobility, and light metabolic conditioning designed for longevity and overall physical readiness.",
    split: "2 - 3 Days / Week",
    focus: "Joint Mobility & General Health",
    difficulty: "All Levels",
    img: yogaImg,
  },
];

const FILTERS = ["Duration", "Muscle group", "Equipment", "Goal", "Intensity"];

export default function WorkoutsPage() {
  const [activeRegimen, setActiveRegimen] = useState<RegimenKey>("Hybrid");

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
              <div className="px-5 pb-5 pt-2 border-t border-border/50 text-[11px] flex justify-between items-center text-muted-foreground font-mono">
                <span>{r.split}</span>
                <span className="text-primary font-bold uppercase tracking-wider">
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
