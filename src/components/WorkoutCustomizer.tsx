import { useState } from "react";

type Regimen = "Powerlifting" | "Bodybuilding" | "Calisthenics" | "Running";

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  notes: string;
}

export function WorkoutCustomizer() {
  const [step, setStep] = useState<"profile" | "stats" | "result">("profile");

  // Profile inputs
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [regimen, setRegimen] = useState<Regimen>("Powerlifting");

  // Powerlifting inputs
  const [squatPr, setSquatPr] = useState(100);
  const [benchPr, setBenchPr] = useState(80);
  const [deadliftPr, setDeadliftPr] = useState(120);

  // Bodybuilding inputs
  const [targetReps, setTargetReps] = useState("8-12");
  const [experience, setExperience] = useState("Intermediate");

  // Calisthenics inputs
  const [maxPullups, setMaxPullups] = useState(10);
  const [maxDips, setMaxDips] = useState(12);
  const [maxPushups, setMaxPushups] = useState(25);

  // Running inputs
  const [fivekPr, setFivekPr] = useState("25:00");
  const [weeklyMileage, setWeeklyMileage] = useState(20);

  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutExercise[]>([]);

  const handleCalculate = () => {
    const workout: WorkoutExercise[] = [];

    if (regimen === "Powerlifting") {
      workout.push({
        name: "Competition Squat",
        sets: 4,
        reps: "5",
        weight: `${Math.round(squatPr * 0.75)} kg (75% of 1RM)`,
        notes: "Focus on deep squat and explosive ascent. Rest 3-5 mins.",
      });
      workout.push({
        name: "Competition Bench Press",
        sets: 4,
        reps: "5",
        weight: `${Math.round(benchPr * 0.75)} kg (75% of 1RM)`,
        notes: "Keep shoulder blades retracted and drive from legs. Rest 3 mins.",
      });
      workout.push({
        name: "Deadlift (Conventional or Sumo)",
        sets: 3,
        reps: "5",
        weight: `${Math.round(deadliftPr * 0.7)} kg (70% of 1RM)`,
        notes: "Keep back flat and pull bar close to shins. Rest 4 mins.",
      });
    } else if (regimen === "Bodybuilding") {
      const isAdvanced = experience === "Advanced";
      const setMultiplier = isAdvanced ? 4 : 3;
      workout.push({
        name: "Incline Dumbbell Press",
        sets: setMultiplier,
        reps: targetReps,
        weight: "Moderate to Heavy",
        notes: "Targeting upper chest. Focus on contraction at the top.",
      });
      workout.push({
        name: "Lat Pulldown (Wide Grip)",
        sets: setMultiplier,
        reps: targetReps,
        weight: "Moderate",
        notes: "Pull down to upper chest, controlled eccentric.",
      });
      workout.push({
        name: "Bulgarian Split Squat",
        sets: 3,
        reps: "10-12 per leg",
        weight: "Light to Moderate",
        notes: "Deep stretch on quads and glutes.",
      });
      workout.push({
        name: "Dumbbell Lateral Raise",
        sets: 4,
        reps: "12-15",
        weight: "Light",
        notes: "Control the weight on the way down, do not swing.",
      });
    } else if (regimen === "Calisthenics") {
      workout.push({
        name: "Controlled Pull-ups",
        sets: 4,
        reps: `${Math.max(2, Math.round(maxPullups * 0.7))}`,
        weight: "Bodyweight",
        notes: "Full range of motion: chin over bar to dead hang.",
      });
      workout.push({
        name: "Parallel Bar Dips",
        sets: 4,
        reps: `${Math.max(2, Math.round(maxDips * 0.75))}`,
        weight: "Bodyweight",
        notes: "Go down to 90 degrees elbow bend.",
      });
      workout.push({
        name: "Push-ups (Diamond or Regular)",
        sets: 3,
        reps: `${Math.max(5, Math.round(maxPushups * 0.7))}`,
        weight: "Bodyweight",
        notes: "Keep body in straight line, touch chest to floor.",
      });
      workout.push({
        name: "Hanging Leg Raises",
        sets: 3,
        reps: "8-10",
        weight: "Bodyweight",
        notes: "Raise legs to bar without using momentum.",
      });
    } else if (regimen === "Running") {
      workout.push({
        name: "Threshold Interval Run",
        sets: 4,
        reps: "1000m",
        weight: "Cardio",
        notes: `Target Pace: approx ${fivekPr} 5k pace. Rest 2 mins jogging between intervals.`,
      });
      workout.push({
        name: "Easy Recovery Run",
        sets: 1,
        reps: "30 mins",
        weight: "Cardio",
        notes: "Very easy conversation pace to build aerobic capacity.",
      });
      workout.push({
        name: "Single-Leg Strength & Balance Work",
        sets: 3,
        reps: "12 reps each",
        weight: "Bodyweight",
        notes: "Single-leg glute bridges and calf raises to prevent running injuries.",
      });
    }

    setGeneratedWorkout(workout);
    setStep("result");
  };

  return (
    <div className="card-surface p-6 md:p-10 max-w-2xl mx-auto border-primary/20">
      {step === "profile" && (
        <div>
          <h3 className="display-md text-primary">1. Tell us about yourself</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Let's build a customized template adjusted for your profile.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Regimen Focus
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["Powerlifting", "Bodybuilding", "Calisthenics", "Running"] as Regimen[]).map(
                  (r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegimen(r)}
                      className={`text-xs py-3 px-2 rounded-lg border transition ${
                        regimen === r
                          ? "bg-primary border-primary text-primary-foreground font-semibold"
                          : "border-border bg-surface-2 hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("stats")}
            className="btn-primary w-full mt-8"
          >
            Next: Enter Stats →
          </button>
        </div>
      )}

      {step === "stats" && (
        <div>
          <h3 className="display-md text-primary">2. Regimen Stats ({regimen})</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Enter your current metrics so we can calculate training loads.
          </p>

          {regimen === "Powerlifting" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Current Squat 1RM (kg)
                </label>
                <input
                  type="number"
                  value={squatPr}
                  onChange={(e) => setSquatPr(Number(e.target.value))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Current Bench Press 1RM (kg)
                </label>
                <input
                  type="number"
                  value={benchPr}
                  onChange={(e) => setBenchPr(Number(e.target.value))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Current Deadlift 1RM (kg)
                </label>
                <input
                  type="number"
                  value={deadliftPr}
                  onChange={(e) => setDeadliftPr(Number(e.target.value))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {regimen === "Bodybuilding" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Preferred Target Reps
                </label>
                <select
                  value={targetReps}
                  onChange={(e) => setTargetReps(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="6-8">6 - 8 reps (Strength & Hypertrophy)</option>
                  <option value="8-12">8 - 12 reps (Classical Hypertrophy)</option>
                  <option value="12-15">12 - 15 reps (Pump & Endurance)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Experience Level
                </label>
                <div className="flex gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExperience(exp)}
                      className={`flex-1 text-xs py-3 rounded-lg border transition ${
                        experience === exp
                          ? "bg-primary border-primary text-primary-foreground font-semibold"
                          : "border-border bg-surface-2 hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {regimen === "Calisthenics" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Max Consecutive Pull-ups
                </label>
                <input
                  type="number"
                  value={maxPullups}
                  onChange={(e) => setMaxPullups(Number(e.target.value))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Max Consecutive Dips
                </label>
                <input
                  type="number"
                  value={maxDips}
                  onChange={(e) => setMaxDips(Number(e.target.value))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Max Consecutive Push-ups
                </label>
                <input
                  type="number"
                  value={maxPushups}
                  onChange={(e) => setMaxPushups(Number(e.target.value))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {regimen === "Running" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Current 5K PR (MM:SS)
                </label>
                <input
                  type="text"
                  value={fivekPr}
                  onChange={(e) => setFivekPr(e.target.value)}
                  placeholder="e.g. 24:30"
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Weekly Running Volume (km)
                </label>
                <input
                  type="number"
                  value={weeklyMileage}
                  onChange={(e) => setWeeklyMileage(Number(e.target.value))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={() => setStep("profile")} className="btn-ghost flex-1">
              ← Back
            </button>
            <button type="button" onClick={handleCalculate} className="btn-primary flex-1">
              Generate Program
            </button>
          </div>
        </div>
      )}

      {step === "result" && (
        <div>
          <h3 className="display-md text-primary">Customized Workout</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Generated for {name || "Athlete"} · {weight}kg · {regimen} Focus
          </p>

          <div className="space-y-4">
            {generatedWorkout.map((ex, i) => (
              <div
                key={i}
                className="bg-surface-2 border border-border p-4 rounded-xl hover:border-primary/30 transition"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-foreground">{ex.name}</h4>
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded font-mono">
                    {ex.sets} sets × {ex.reps} reps
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Target Load:
                  </span>
                  <span className="text-sm font-semibold text-foreground font-mono">
                    {ex.weight}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{ex.notes}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setStep("stats")}
              className="btn-ghost flex-1 text-xs"
            >
              Adjust Inputs
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-primary flex-1 text-xs"
            >
              Print Workout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
