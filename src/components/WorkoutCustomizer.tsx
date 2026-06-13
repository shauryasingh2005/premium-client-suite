import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { supabase } from "../lib/supabase";
import { Check, Clipboard, Dumbbell, Flame, Heart, Sparkles, Trophy, Plus, Calendar } from "lucide-react";

export type Regimen =
  | "Powerlifting"
  | "Cardio"
  | "Pehlewani"
  | "Hyrox"
  | "Hybrid"
  | "Bodybuilding"
  | "Calisthenics"
  | "Running";

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  notes: string;
}

interface WeeklyPlan {
  week: number;
  workouts: {
    day: string;
    focus: string;
    exercises: WorkoutExercise[];
  }[];
  diet: {
    mealSlot: string;
    food: string;
    macros: string;
  }[];
}

interface ProgressLog {
  date: string;
  weight: number;
  steps: number;
  workoutCompleted: boolean;
  notes: string;
  prUpdates: { movement: string; value: string }[];
}

export function WorkoutCustomizer({ defaultRegimen = "Powerlifting" }: { defaultRegimen?: Regimen }) {
  const [step, setStep] = useState<"profile" | "stats" | "result" | "logs">("profile");

  // Profile inputs
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [regimen, setRegimen] = useState<Regimen>(defaultRegimen);

  // Sync with prop
  useEffect(() => {
    setRegimen(defaultRegimen);
  }, [defaultRegimen]);

  // Dietary and budget considerations
  const [dietaryPref, setDietaryPref] = useState("Balanced");
  const [dietBudget, setDietBudget] = useState("Standard");
  const [medicalNotes, setMedicalNotes] = useState("");

  // Regimen-specific inputs
  // Powerlifting
  const [squatPr, setSquatPr] = useState(100);
  const [benchPr, setBenchPr] = useState(80);
  const [deadliftPr, setDeadliftPr] = useState(120);

  // Bodybuilding
  const [targetReps, setTargetReps] = useState("8-12");
  const [experience, setExperience] = useState("Intermediate");

  // Calisthenics
  const [maxPullups, setMaxPullups] = useState(10);
  const [maxDips, setMaxDips] = useState(12);
  const [maxPushups, setMaxPushups] = useState(25);

  // Running & Cardio
  const [fivekPr, setFivekPr] = useState("25:00");
  const [weeklyMileage, setWeeklyMileage] = useState(20);
  const [restingHr, setRestingHr] = useState(65);
  const [cardioPreference, setCardioPreference] = useState("HIIT");

  // Pehlewani
  const [maxDands, setMaxDands] = useState(30);
  const [maxBethaks, setMaxBethaks] = useState(50);
  const [gadaWeight, setGadaWeight] = useState(10);

  // Hyrox
  const [onekRunTime, setOnekRunTime] = useState("5:00");
  const [wallBallsPr, setWallBallsPr] = useState(30);
  const [sledPushLoad, setSledPushLoad] = useState(100);

  // Hybrid
  const [hybridRatio, setHybridRatio] = useState("50/50");

  // Plan outputs
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [activeWeek, setActiveWeek] = useState(1);
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Progress Logging State
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [logWeight, setLogWeight] = useState(75);
  const [logSteps, setLogSteps] = useState(8000);
  const [logWorkoutDone, setLogWorkoutDone] = useState(false);
  const [logNotes, setLogNotes] = useState("");
  const [newPrMovement, setNewPrMovement] = useState("");
  const [newPrValue, setNewPrValue] = useState("");
  const [prList, setPrList] = useState<{ movement: string; value: string }[]>([]);

  // Load logs from localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem(`fitforge_logs_${user?.id || "guest"}`);
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, [user]);

  const saveWorkout = async () => {
    if (!user) return;
    setSaveStatus("saving");
    try {
      // First update profile
      const { error: profileErr } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: name || undefined,
        weight: weight || undefined,
        height: height || undefined,
        regimen: regimen,
        updated_at: new Date().toISOString(),
      });
      if (profileErr) throw profileErr;

      // Insert/Upsert program to database
      const { error } = await supabase.from("workouts").insert({
        user_id: user.id,
        name: `${regimen} 4-Week Custom Plan`,
        regimen: regimen,
        exercises: weeklyPlans as any,
      });

      if (error) throw error;
      setSaveStatus("saved");
    } catch (err) {
      console.error("Error saving workout:", err);
      setSaveStatus("error");
    }
  };

  const handleLogProgress = () => {
    const newLog: ProgressLog = {
      date: logDate,
      weight: logWeight,
      steps: logSteps,
      workoutCompleted: logWorkoutDone,
      notes: logNotes,
      prUpdates: prList,
    };
    const updated = [newLog, ...logs.filter((l) => l.date !== logDate)].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setLogs(updated);
    localStorage.setItem(`fitforge_logs_${user?.id || "guest"}`, JSON.stringify(updated));
    setLogNotes("");
    setPrList([]);
    alert("Progress logged successfully!");
  };

  const addPrUpdate = () => {
    if (newPrMovement.trim() && newPrValue.trim()) {
      setPrList([...prList, { movement: newPrMovement, value: newPrValue }]);
      setNewPrMovement("");
      setNewPrValue("");
    }
  };

  const handleCalculate = () => {
    const weeks: WeeklyPlan[] = [];

    // Base diet items adjusted by dietary preference and budget
    const getDietSlot = (slot: string, weekIndex: number) => {
      const isLowBudget = dietBudget === "Low-budget";
      const isHighBudget = dietBudget === "Premium";
      
      let food = "";
      let macros = "";

      if (dietaryPref === "Vegan") {
        if (slot === "Breakfast") {
          food = isLowBudget ? "Oatmeal with soy milk & bananas" : "Chia pudding with berries, pea protein shake & almonds";
          macros = "350 kcal | P: 22g, C: 50g, F: 8g";
        } else if (slot === "Lunch") {
          food = isLowBudget ? "Brown rice, dal makhani (vegan style) & salad" : "Tofu stir-fry with quinoa, broccoli & seeds";
          macros = "550 kcal | P: 28g, C: 70g, F: 15g";
        } else if (slot === "Snacks") {
          food = isLowBudget ? "Roasted chickpeas (Chana)" : "Protein bar (plant-based) & walnuts";
          macros = "200 kcal | P: 12g, C: 25g, F: 6g";
        } else {
          food = isLowBudget ? "Roti, mixed vegetable curry & steamed edamame" : "Tempeh bowls with avocado, brown rice & spinach";
          macros = "480 kcal | P: 26g, C: 45g, F: 18g";
        }
      } else if (dietaryPref === "Carnivore") {
        if (slot === "Breakfast") {
          food = isLowBudget ? "4 whole eggs cooked in butter" : "Ribeye steak & 3 eggs scrambled in beef tallow";
          macros = "520 kcal | P: 36g, C: 2g, F: 40g";
        } else if (slot === "Lunch") {
          food = isLowBudget ? "Chicken thighs with butter" : "Ground beef patties (80/20) with butter & bone broth";
          macros = "650 kcal | P: 45g, C: 0g, F: 52g";
        } else if (slot === "Snacks") {
          food = isLowBudget ? "Hard-boiled eggs" : "Beef jerky & pork rinds";
          macros = "180 kcal | P: 18g, C: 0g, F: 12g";
        } else {
          food = isLowBudget ? "Minced mutton or pork chops" : "Salmon fillets cooked in ghee or buttered steak";
          macros = "580 kcal | P: 48g, C: 0g, F: 42g";
        }
      } else if (dietaryPref === "Keto") {
        if (slot === "Breakfast") {
          food = isLowBudget ? "Scrambled eggs with cheese & spinach" : "Avocado, bulletproof coffee, eggs & heavy cream";
          macros = "450 kcal | P: 25g, C: 4g, F: 38g";
        } else if (slot === "Lunch") {
          food = isLowBudget ? "Paneer bhurji or chicken stir-fry with ghee" : "Grilled salmon with asparagus & butter sauce";
          macros = "580 kcal | P: 35g, C: 6g, F: 48g";
        } else if (slot === "Snacks") {
          food = isLowBudget ? "Salted peanuts or almonds" : "Macadamia nuts & string cheese";
          macros = "220 kcal | P: 8g, C: 5g, F: 20g";
        } else {
          food = isLowBudget ? "Palak paneer or butter chicken (no rice/roti)" : "Heavy cream mutton curry with broccoli rice";
          macros = "500 kcal | P: 38g, C: 7g, F: 38g";
        }
      } else {
        // Balanced/Vegetarian/Standard
        if (slot === "Breakfast") {
          food = isLowBudget ? "Poha with peanuts & double boiled eggs/sprouted moong" : "Paneer stuffed paratha, curd & whey protein";
          macros = "420 kcal | P: 24g, C: 55g, F: 12g";
        } else if (slot === "Lunch") {
          food = isLowBudget ? "2 Rotis, dal fry, mix sabzi & curd" : "Chicken breast/Tofu breast rice bowl with broccoli & avocado";
          macros = "600 kcal | P: 35g, C: 75g, F: 14g";
        } else if (slot === "Snacks") {
          food = isLowBudget ? "Roasted Chana & tea/coffee" : "Whey protein shake, almonds & an apple";
          macros = "210 kcal | P: 15g, C: 22g, F: 7g";
        } else {
          food = isLowBudget ? "Roti, egg curry/paneer curry & cucumber salad" : "Grilled fish/mutton with sweet potato & green beans";
          macros = "510 kcal | P: 32g, C: 50g, F: 16g";
        }
      }

      // Add variation based on week index
      if (weekIndex > 1) {
        food += ` (Calibrated for progressive loading +${10 * weekIndex}g Protein)`;
      }

      return { mealSlot: slot, food, macros };
    };

    // Build plans for 4 weeks
    for (let w = 1; w <= 4; w++) {
      const workouts: WeeklyPlan["workouts"] = [];
      const intensityFactor = 0.70 + w * 0.03; // Progressive overload factor

      if (regimen === "Powerlifting") {
        workouts.push({
          day: "Monday",
          focus: "Squat Intensity + Bench Volume",
          exercises: [
            {
              name: "Competition Squat",
              sets: 4,
              reps: `${6 - w}`,
              weight: `${Math.round(squatPr * intensityFactor)} kg`,
              notes: `Week ${w} overload: Rest 3-5 mins between sets. Maintain upright chest.`,
            },
            {
              name: "Pause Bench Press",
              sets: 3,
              reps: "8",
              weight: `${Math.round(benchPr * 0.65)} kg`,
              notes: "Pause 1 second on chest before press.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Deadlift Intensity",
          exercises: [
            {
              name: "Conventional/Sumo Deadlift",
              sets: 3,
              reps: "5",
              weight: `${Math.round(deadliftPr * (intensityFactor - 0.02))} kg`,
              notes: "Maintain flat back, lock out hips fully.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Bench Intensity + Squat Volume",
          exercises: [
            {
              name: "Competition Bench Press",
              sets: 4,
              reps: `${6 - w}`,
              weight: `${Math.round(benchPr * intensityFactor)} kg`,
              notes: "Retract scapula, leg drive.",
            },
            {
              name: "Safety Bar Squat or Leg Press",
              sets: 3,
              reps: "10",
              weight: "Moderate",
              notes: "Focused quad hypertrophy.",
            },
          ],
        });
      } else if (regimen === "Cardio") {
        const hertzMax = 220 - (25); // estimate age 25
        const targetBpm = Math.round((hertzMax - restingHr) * (0.6 + w * 0.05) + restingHr);
        
        workouts.push({
          day: "Monday",
          focus: "HIIT Intervals",
          exercises: [
            {
              name: "Tabata Sprint Intervals",
              sets: 4,
              reps: "8 rounds (20s on / 10s off)",
              weight: "Bodyweight",
              notes: `Keep heart rate close to ${targetBpm} bpm on active sprints. Row, run, or bike.`,
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "LISS Endurance",
          exercises: [
            {
              name: "Steady State Cardio (Zone 2)",
              sets: 1,
              reps: `${30 + w * 5} mins`,
              weight: "Cardio",
              notes: `Steady pace, easy breathing. Target HR: ~${Math.round(targetBpm * 0.75)} bpm.`,
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Metabolic Circuit",
          exercises: [
            {
              name: "Kettlebell swings + Burpees + Jump Ropes",
              sets: 3,
              reps: "12-15 reps each",
              weight: "Light",
              notes: "Move continuously, 90 seconds rest between sets.",
            },
          ],
        });
      } else if (regimen === "Pehlewani") {
        const repOverload = w * 5;
        workouts.push({
          day: "Monday",
          focus: "Gada Power & Chest",
          exercises: [
            {
              name: "Gada Swing (Macebell)",
              sets: 4,
              reps: `${20 + repOverload}`,
              weight: `${gadaWeight} kg`,
              notes: "Full shoulder rotation. Engage your core fully.",
            },
            {
              name: "Hindu Pushups (Dand)",
              sets: 4,
              reps: `${Math.round(maxDands * 0.7) + w * 2}`,
              weight: "Bodyweight",
              notes: "Swoop down and push up into cobra position.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Leg Stamina (Bethak)",
          exercises: [
            {
              name: "Hindu Squats (Bethak)",
              sets: 5,
              reps: `${Math.round(maxBethaks * 0.8) + w * 5}`,
              weight: "Bodyweight",
              notes: "Fast, rhythmic squats on toes with arm sweeps.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Jodi Power & Wrestling Stamina",
          exercises: [
            {
              name: "Jodi Swing (Indian Clubs)",
              sets: 4,
              reps: "15 swings per arm",
              weight: "Moderate",
              notes: "Builds rotational wrist and grip strength.",
            },
            {
              name: "Bridge & Core neck rolls",
              sets: 3,
              reps: "2 mins hold",
              weight: "Bodyweight",
              notes: "Wrestler bridge posture to build neck strength.",
            },
          ],
        });
      } else if (regimen === "Hyrox") {
        workouts.push({
          day: "Monday",
          focus: "Hyrox Run & Sled",
          exercises: [
            {
              name: "Interval Run",
              sets: 3,
              reps: "1 km run",
              weight: `${onekRunTime} pace`,
              notes: "Focus on maintaining even splits.",
            },
            {
              name: "Sled Push",
              sets: 4,
              reps: "50m",
              weight: `${sledPushLoad + w * 10} kg`,
              notes: "Drive low with legs.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Engine Capacity",
          exercises: [
            {
              name: "SkiErg Interval",
              sets: 5,
              reps: "500m",
              weight: "Medium",
              notes: "Rest 1 min between sets.",
            },
            {
              name: "Burpee Broad Jumps",
              sets: 3,
              reps: "80m",
              weight: "Bodyweight",
              notes: "Broad jump immediately upon landing burpee.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Wall Balls & Sled Pull",
          exercises: [
            {
              name: "Wall Balls",
              sets: 4,
              reps: `${wallBallsPr + w * 3}`,
              weight: "9 kg (20 lb)",
              notes: "Throw to 10-foot target. Deep squat every rep.",
            },
            {
              name: "Farmers Carry",
              sets: 3,
              reps: "100m",
              weight: "Heavy",
              notes: "Keep chest tall, short fast steps.",
            },
          ],
        });
      } else if (regimen === "Hybrid") {
        workouts.push({
          day: "Monday",
          focus: "Heavy Compound Lift",
          exercises: [
            {
              name: "Back Squat",
              sets: 4,
              reps: "5",
              weight: `${Math.round(squatPr * (0.7 + w * 0.02))} kg`,
              notes: "High tension, full powerlifting range.",
            },
            {
              name: "Overhead Barbell Press",
              sets: 3,
              reps: "8",
              weight: "Moderate",
              notes: "Keep spine stable, brace glutes.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Endurance Run",
          exercises: [
            {
              name: "Zone 2 Long Run",
              sets: 1,
              reps: `${45 + w * 5} mins`,
              weight: "Aerobic",
              notes: "Keep heart rate low. Should be able to hold a full conversation.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Deadlift & Work Capacity",
          exercises: [
            {
              name: "Deadlift",
              sets: 3,
              reps: "5",
              weight: `${Math.round(deadliftPr * (0.7 + w * 0.02))} kg`,
              notes: "Pull raw without straps.",
            },
            {
              name: "Tempo Run intervals",
              sets: 4,
              reps: "800m",
              weight: "High Pace",
              notes: "Sprint fast with 90s rest.",
            },
          ],
        });
      } else if (regimen === "Bodybuilding") {
        const isAdvanced = experience === "Advanced";
        const setMultiplier = isAdvanced ? 4 : 3;
        workouts.push({
          day: "Monday",
          focus: "Push (Chest, Shoulders, Triceps)",
          exercises: [
            {
              name: "Incline Dumbbell Press",
              sets: setMultiplier,
              reps: targetReps,
              weight: "Moderate-Heavy",
              notes: "Focus on upper chest squeeze.",
            },
            {
              name: "Dumbbell Lateral Raise",
              sets: 4,
              reps: "12-15",
              weight: "Light",
              notes: "Control the eccentric.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Pull (Back, Biceps)",
          exercises: [
            {
              name: "Lat Pulldown (Wide)",
              sets: setMultiplier,
              reps: targetReps,
              weight: "Moderate",
              notes: "Squeeze lats at the bottom.",
            },
            {
              name: "Incline Hammer Curl",
              sets: 3,
              reps: "10-12",
              weight: "Moderate",
              notes: "Target brachialis and forearm.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Legs (Quads, Hamstrings, Calves)",
          exercises: [
            {
              name: "Bulgarian Split Squat",
              sets: 3,
              reps: "10-12",
              weight: "Moderate",
              notes: "Elevate back leg, go deep.",
            },
            {
              name: "Romanian Deadlift",
              sets: 3,
              reps: "10",
              weight: "Heavy-Moderate",
              notes: "Hinge at hips, stretch hamstrings.",
            },
          ],
        });
      } else if (regimen === "Calisthenics") {
        workouts.push({
          day: "Monday",
          focus: "Upper Body Pull",
          exercises: [
            {
              name: "Strict Pull-ups",
              sets: 4,
              reps: `${Math.max(2, Math.round(maxPullups * 0.7))}`,
              weight: "Bodyweight",
              notes: "Dead hang to chin-over-bar.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Upper Body Push",
          exercises: [
            {
              name: "Parallel Bar Dips",
              sets: 4,
              reps: `${Math.max(2, Math.round(maxDips * 0.75))}`,
              weight: "Bodyweight",
              notes: "Go down to 90 degrees.",
            },
            {
              name: "Diamond Pushups",
              sets: 3,
              reps: `${Math.max(5, Math.round(maxPushups * 0.7))}`,
              weight: "Bodyweight",
              notes: "Focus on triceps and inner chest.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Core & Skills",
          exercises: [
            {
              name: "Hanging Leg Raises",
              sets: 3,
              reps: "8-10",
              weight: "Bodyweight",
              notes: "No swinging. Touch toes to bar if possible.",
            },
          ],
        });
      } else if (regimen === "Running") {
        workouts.push({
          day: "Monday",
          focus: "Interval Speedwork",
          exercises: [
            {
              name: "Threshold Interval Run",
              sets: 4,
              reps: "1000m",
              weight: "5k Pace",
              notes: `Target Pace: ${fivekPr} pace. 2 mins recovery walk between sets.`,
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Recovery Run & Single-Leg Strength",
          exercises: [
            {
              name: "Easy Recovery Run",
              sets: 1,
              reps: "30 mins",
              weight: "Cardio",
              notes: "Very easy conversation pace.",
            },
            {
              name: "Single-Leg Glute Bridges",
              sets: 3,
              reps: "12 per leg",
              weight: "Bodyweight",
              notes: "Prevents runner's knee.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Long Run Volume",
          exercises: [
            {
              name: "Weekly Long Run",
              sets: 1,
              reps: `${weeklyMileage * 0.4 + w * 2} km`,
              weight: "Steady",
              notes: "Build cardiovascular volume slowly.",
            },
          ],
        });
      }

      // 4 meals per week
      const diet = [
        getDietSlot("Breakfast", w),
        getDietSlot("Lunch", w),
        getDietSlot("Snacks", w),
        getDietSlot("Dinner", w),
      ];

      weeks.push({
        week: w,
        workouts,
        diet,
      });
    }

    setWeeklyPlans(weeks);
    setStep("result");
  };

  return (
    <div className="card-surface p-6 md:p-10 max-w-4xl mx-auto border-primary/20 bg-surface/80 backdrop-blur-md">
      {/* TABS HEADER */}
      <div className="flex gap-2 border-b border-border pb-4 mb-6">
        <button
          onClick={() => setStep("profile")}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition ${
            step === "profile" || step === "stats"
              ? "bg-primary border-primary text-background font-bold"
              : "border-border hover:border-primary/50 text-muted-foreground"
          }`}
        >
          1. Assessment Form
        </button>
        <button
          disabled={weeklyPlans.length === 0}
          onClick={() => setStep("result")}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition ${
            weeklyPlans.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${
            step === "result"
              ? "bg-primary border-primary text-background font-bold"
              : "border-border hover:border-primary/50 text-muted-foreground"
          }`}
        >
          2. Generated 4-Week Plan
        </button>
        <button
          onClick={() => setStep("logs")}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition ${
            step === "logs"
              ? "bg-primary border-primary text-background font-bold"
              : "border-border hover:border-primary/50 text-muted-foreground"
          }`}
        >
          3. Progress Log Tracker
        </button>
      </div>

      {step === "profile" && (
        <div>
          <h3 className="display-md text-primary flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Tell us about yourself
          </h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Configure your lifestyle, budget, dietary choice and fitness regimen goals.
          </p>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Regimen Focus
                </label>
                <select
                  value={regimen}
                  onChange={(e) => setRegimen(e.target.value as Regimen)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Powerlifting">Powerlifting</option>
                  <option value="Cardio">Cardio & HIIT</option>
                  <option value="Pehlewani">Pehlewani (Traditional Indian)</option>
                  <option value="Hyrox">Hyrox Fitness Racing</option>
                  <option value="Hybrid">Hybrid Athlete</option>
                  <option value="Bodybuilding">Bodybuilding</option>
                  <option value="Calisthenics">Calisthenics</option>
                  <option value="Running">Running & Athletics</option>
                </select>
              </div>
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Dietary Preference
                </label>
                <select
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Balanced">Balanced (Vegetarian/Non-veg)</option>
                  <option value="Vegan">Vegan (Plant-Based)</option>
                  <option value="Vegetarian">Strict Vegetarian</option>
                  <option value="Carnivore">Carnivore Diet</option>
                  <option value="Keto">Ketogenic (Keto)</option>
                  <option value="Intermittent">Intermittent Fasting Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Dietary Budget / Expense Level
                </label>
                <select
                  value={dietBudget}
                  onChange={(e) => setDietBudget(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Low-budget">Low Budget (Staples & Local Produce)</option>
                  <option value="Standard">Standard (Includes basic health supplements)</option>
                  <option value="Premium">Premium (Imported goods, supplements & organic)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Medical Notes / Injuries / Allergies (e.g. Lactose Intolerance, PCOS)
              </label>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="No injuries, lactose intolerant etc."
                className="w-full h-20 bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground resize-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("stats")}
            className="btn-primary w-full mt-8"
          >
            Next: Enter Regimen Stats →
          </button>
        </div>
      )}

      {step === "stats" && (
        <div>
          <h3 className="display-md text-primary flex items-center gap-2">
            <Dumbbell className="h-5 w-5" /> Regimen Stats ({regimen})
          </h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Input your specific PRs and thresholds so we can custom-program weights and volumes.
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
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
                          ? "bg-primary border-primary text-background font-semibold"
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>
          )}

          {regimen === "Cardio" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Resting Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    value={restingHr}
                    onChange={(e) => setRestingHr(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Cardio Style Pref.
                  </label>
                  <select
                    value={cardioPreference}
                    onChange={(e) => setCardioPreference(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  >
                    <option value="HIIT">HIIT (Intervals)</option>
                    <option value="LISS">LISS (Steady Cardio)</option>
                    <option value="Both">Both (Hybrid Cardio)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {regimen === "Pehlewani" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Max Hindu Pushups (Dand)
                  </label>
                  <input
                    type="number"
                    value={maxDands}
                    onChange={(e) => setMaxDands(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Max Hindu Squats (Bethak)
                  </label>
                  <input
                    type="number"
                    value={maxBethaks}
                    onChange={(e) => setMaxBethaks(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Gada Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={gadaWeight}
                    onChange={(e) => setGadaWeight(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {regimen === "Hyrox" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    1k Run PR (MM:SS)
                  </label>
                  <input
                    type="text"
                    value={onekRunTime}
                    onChange={(e) => setOnekRunTime(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Wall Balls PR Reps
                  </label>
                  <input
                    type="number"
                    value={wallBallsPr}
                    onChange={(e) => setWallBallsPr(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Sled Push 50m Max (kg)
                  </label>
                  <input
                    type="number"
                    value={sledPushLoad}
                    onChange={(e) => setSledPushLoad(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {regimen === "Hybrid" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    5K Run PR
                  </label>
                  <input
                    type="text"
                    value={fivekPr}
                    onChange={(e) => setFivekPr(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Squat 1RM (kg)
                  </label>
                  <input
                    type="number"
                    value={squatPr}
                    onChange={(e) => setSquatPr(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Strength/Cardio Ratio
                  </label>
                  <select
                    value={hybridRatio}
                    onChange={(e) => setHybridRatio(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                  >
                    <option value="50/50">Balanced (50% Strength / 50% Cardio)</option>
                    <option value="70/30">Strength Focus (70% Lift / 30% Run)</option>
                    <option value="30/70">Cardio Focus (30% Lift / 70% Run)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={() => setStep("profile")} className="btn-ghost flex-1">
              ← Back
            </button>
            <button type="button" onClick={handleCalculate} className="btn-primary flex-1">
              Generate 4-Week Program
            </button>
          </div>
        </div>
      )}

      {step === "result" && weeklyPlans.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="display-md text-primary">Generated 4-Week Custom Plan</h3>
              <p className="text-xs text-muted-foreground mt-1">
                For {name || "Athlete"} · {weight}kg · {regimen} Focus
              </p>
            </div>
            {user && (
              <button
                type="button"
                onClick={saveWorkout}
                disabled={saveStatus === "saving" || saveStatus === "saved"}
                className={`text-xs px-4 py-2 rounded-lg border transition font-mono uppercase tracking-wider font-semibold ${
                  saveStatus === "saved"
                    ? "bg-green-600 border-green-600 text-white cursor-default"
                    : saveStatus === "saving"
                      ? "bg-primary/50 border-primary/50 text-white cursor-not-allowed"
                      : "btn-primary"
                }`}
              >
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "✓ Saved to Profile"}
                {saveStatus === "idle" && "Save Plan"}
              </button>
            )}
          </div>

          {/* WEEK SELECTOR */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((w) => (
              <button
                key={w}
                onClick={() => setActiveWeek(w)}
                className={`px-4 py-2 text-xs rounded-lg border transition ${
                  activeWeek === w
                    ? "bg-primary border-primary text-background font-bold"
                    : "border-border hover:border-primary/50 text-muted-foreground"
                }`}
              >
                Week 0{w}
              </button>
            ))}
          </div>

          {/* WEEKLY CONTENT */}
          <div className="grid md:grid-cols-12 gap-6">
            {/* WORKOUTS COLUMN */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="font-display text-xl border-b border-border pb-2 flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" /> Training Split
              </h4>
              {weeklyPlans[activeWeek - 1].workouts.map((w, idx) => (
                <div
                  key={idx}
                  className="bg-surface-2 border border-border p-4 rounded-xl hover:border-primary/20 transition"
                >
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">
                      {w.day}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">{w.focus}</span>
                  </div>
                  <div className="space-y-3">
                    {w.exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="bg-surface p-3 rounded-lg border border-border/50">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-xs text-foreground">{ex.name}</p>
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                            {ex.sets} sets × {ex.reps}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                          Target Load: {ex.weight}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                          {ex.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* DIET COLUMN */}
            <div className="md:col-span-5 space-y-4">
              <h4 className="font-display text-xl border-b border-border pb-2 flex items-center gap-2">
                <Clipboard className="h-5 w-5 text-primary" /> Nutrition Plan
              </h4>
              <div className="bg-surface-2 border border-border p-5 rounded-xl space-y-4">
                <div className="flex justify-between items-center text-xs text-muted-foreground font-mono uppercase">
                  <span>Meal Slot</span>
                  <span>Custom Menu Details</span>
                </div>
                {weeklyPlans[activeWeek - 1].diet.map((item, idx) => (
                  <div key={idx} className="border-t border-border/50 pt-3 first:border-0 first:pt-0">
                    <p className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                      {item.mealSlot}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.food}
                    </p>
                    <p className="text-[10px] text-primary/80 font-mono mt-1">
                      {item.macros}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "logs" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h3 className="display-md text-primary flex items-center gap-2">
                <Trophy className="h-5 w-5" /> Progress Log Tracker
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Log your weight, steps, PR breakthroughs, and mark training completions.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* LOG FORM */}
            <div className="md:col-span-5 bg-surface-2 border border-border p-5 rounded-xl space-y-4">
              <h4 className="font-display text-lg">Log Today's Entry</h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1 uppercase tracking-wider">Weight (kg)</label>
                    <input
                      type="number"
                      value={logWeight}
                      onChange={(e) => setLogWeight(Number(e.target.value))}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 uppercase tracking-wider">Steps Count</label>
                    <input
                      type="number"
                      value={logSteps}
                      onChange={(e) => setLogSteps(Number(e.target.value))}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="workoutDone"
                    checked={logWorkoutDone}
                    onChange={(e) => setLogWorkoutDone(e.target.checked)}
                    className="h-4 w-4 bg-surface border-border text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="workoutDone" className="text-muted-foreground uppercase tracking-wider">
                    Workout Completed Today
                  </label>
                </div>

                {/* PR TRACKER */}
                <div className="border-t border-border/50 pt-3">
                  <label className="block text-muted-foreground mb-2 uppercase tracking-wider font-bold">
                    Log a New Personal Record (PR)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Squat 1RM"
                      value={newPrMovement}
                      onChange={(e) => setNewPrMovement(e.target.value)}
                      className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 110 kg"
                      value={newPrValue}
                      onChange={(e) => setNewPrValue(e.target.value)}
                      className="w-24 bg-surface border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addPrUpdate}
                      className="btn-primary !p-2 rounded-lg flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 text-background" />
                    </button>
                  </div>
                  {prList.length > 0 && (
                    <div className="mt-2 space-y-1 bg-surface p-2 rounded-lg border border-border/40">
                      {prList.map((pr, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                          <span>{pr.movement}</span>
                          <span className="text-primary font-bold">{pr.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider">Workout/Diet Notes</label>
                  <textarea
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="How did you feel? Energy levels, nutrition adherence..."
                    className="w-full h-16 bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogProgress}
                className="btn-primary w-full mt-4 !py-2.5 text-xs font-mono uppercase tracking-wider"
              >
                Save Log Entry
              </button>
            </div>

            {/* LOG HISTORY */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="font-display text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Log Entry History
              </h4>

              {logs.length === 0 ? (
                <div className="text-center py-10 bg-surface-2 border border-dashed border-border rounded-xl">
                  <p className="text-xs text-muted-foreground">No logs captured yet. Save your first daily log on the left!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {logs.map((l, idx) => (
                    <div key={idx} className="bg-surface-2 border border-border p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-primary font-bold">{l.date}</span>
                        <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {l.workoutCompleted ? "✓ WORKOUT DONE" : "REST DAY"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono py-1 border-y border-border/40">
                        <div>
                          <span className="text-muted-foreground">Weight: </span>
                          <span className="text-foreground font-bold">{l.weight} kg</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Steps: </span>
                          <span className="text-foreground font-bold">{l.steps.toLocaleString()}</span>
                        </div>
                      </div>
                      {l.prUpdates && l.prUpdates.length > 0 && (
                        <div className="bg-surface p-2 rounded-lg border border-primary/20 space-y-1">
                          <p className="text-[10px] text-primary uppercase font-bold tracking-wider font-mono flex items-center gap-1">
                            <Trophy className="h-3 w-3" /> PR Achieved:
                          </p>
                          {l.prUpdates.map((pr, prIdx) => (
                            <div key={prIdx} className="flex justify-between text-[11px] font-mono">
                              <span className="text-muted-foreground">{pr.movement}</span>
                              <span className="text-foreground font-bold">{pr.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {l.notes && (
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                          "{l.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
