import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { supabase } from "../lib/supabase";
import { SubscriptionModal } from "./SubscriptionModal";
import {
  Check,
  Clipboard,
  Dumbbell,
  Flame,
  Heart,
  Sparkles,
  Trophy,
  Plus,
  Calendar,
  BicepsFlexed,
  ChevronRight,
  User,
  ShieldCheck,
  Zap,
  CheckCircle,
  Play,
  RotateCw
} from "lucide-react";

export type Regimen =
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

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  notes: string;
  rest?: string;
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

export function WorkoutCustomizer({ defaultRegimen = "Hybrid" }: { defaultRegimen?: Regimen }) {
  const [step, setStep] = useState<"splash" | "profile" | "stats" | "result" | "logs">("splash");

  // Onboarding biometrics
  const [name, setName] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [regimen, setRegimen] = useState<Regimen>(defaultRegimen);
  const [experience, setExperience] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");

  // Sync with prop
  useEffect(() => {
    setRegimen(defaultRegimen);
  }, [defaultRegimen]);

  // Dietary and budget considerations
  const [dietaryPref, setDietaryPref] = useState("Balanced");
  const [dietBudget, setDietBudget] = useState("Standard");
  const [medicalNotes, setMedicalNotes] = useState("");

  // Regimen-specific baseline stats
  const [squatPr, setSquatPr] = useState(100);
  const [benchPr, setBenchPr] = useState(80);
  const [deadliftPr, setDeadliftPr] = useState(120);
  const [maxPullups, setMaxPullups] = useState(10);
  const [maxPushups, setMaxPushups] = useState(25);
  const [fivekPr, setFivekPr] = useState("25:00");
  const [restingHr, setRestingHr] = useState(65);
  const [maxDands, setMaxDands] = useState(30);
  const [maxBethaks, setMaxBethaks] = useState(50);
  const [gadaWeight, setGadaWeight] = useState(10);

  // Subscriptions & Elite intake
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [eliteIntakeAnswers, setEliteIntakeAnswers] = useState<any>(null);

  // Outputs
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [activeWeek, setActiveWeek] = useState(1);
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Progress Logging & Daily Warrior Checklist
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [logWeight, setLogWeight] = useState(75);
  const [logSteps, setLogSteps] = useState(8000);
  const [logWorkoutDone, setLogWorkoutDone] = useState(false);
  const [logNotes, setLogNotes] = useState("");
  const [newPrMovement, setNewPrMovement] = useState("");
  const [newPrValue, setNewPrValue] = useState("");
  const [prList, setPrList] = useState<{ movement: string; value: string }[]>([]);

  // Checklist states (saved daily in localstorage)
  const [chkHrv, setChkHrv] = useState(false);
  const [chkMobility, setChkMobility] = useState(false);
  const [chkTraining, setChkTraining] = useState(false);
  const [chkMacros, setChkMacros] = useState(false);
  const [chkSleep, setChkSleep] = useState(false);

  // Load state from localStorage on init
  useEffect(() => {
    const guestKey = user?.id || "guest";
    const savedLogs = localStorage.getItem(`fitforge_logs_${guestKey}`);
    if (savedLogs) setLogs(JSON.parse(savedLogs));

    const savedSub = localStorage.getItem(`fitforge_subscribed_${guestKey}`);
    if (savedSub === "true") setIsSubscribed(true);

    const savedIntake = localStorage.getItem(`fitforge_intake_${guestKey}`);
    if (savedIntake) setEliteIntakeAnswers(JSON.parse(savedIntake));

    const savedProfile = localStorage.getItem(`fitforge_profile_${guestKey}`);
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setName(p.name || "");
      setWeight(p.weight || 75);
      setHeight(p.height || 175);
      setWeightInput(String(p.weight || ""));
      setHeightInput(String(p.height || ""));
      setExperience(p.experience || "Intermediate");
      setStep("result"); // Skip splash if profile exists
    }
  }, [user]);

  // Calculate consistency score based on checked boxes
  const getConsistencyScore = () => {
    const checks = [chkHrv, chkMobility, chkTraining, chkMacros, chkSleep];
    const checkedCount = checks.filter(Boolean).length;
    return Math.round((checkedCount / checks.length) * 100);
  };

  const handleStartOnboarding = () => {
    setStep("profile");
  };

  const handleProfileSubmit = () => {
    const wVal = Number(weightInput);
    const hVal = Number(heightInput);

    if (!weightInput || isNaN(wVal) || wVal <= 0) {
      alert("Please enter a valid bodyweight in kilograms.");
      return;
    }
    if (!heightInput || isNaN(hVal) || hVal <= 0) {
      alert("Please enter a valid height in centimeters.");
      return;
    }

    setWeight(wVal);
    setHeight(hVal);
    setLogWeight(wVal);

    // Save profile locally
    const guestKey = user?.id || "guest";
    localStorage.setItem(
      `fitforge_profile_${guestKey}`,
      JSON.stringify({ name, weight: wVal, height: hVal, experience })
    );

    setStep("stats");
  };

  const handleSubscribeSuccess = (intake: any) => {
    setIsSubscribed(true);
    setEliteIntakeAnswers(intake);
    const guestKey = user?.id || "guest";
    localStorage.setItem(`fitforge_subscribed_${guestKey}`, "true");
    localStorage.setItem(`fitforge_intake_${guestKey}`, JSON.stringify(intake));
    alert("Elite Membership Active! Advanced plans are unlocked.");
    handleCalculate();
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
    alert("Daily Warrior Log recorded!");
  };

  const saveWorkout = async () => {
    if (!user) {
      alert("Progress saved locally in Guest Mode. Sign in to save to the database.");
      return;
    }
    setSaveStatus("saving");
    try {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: name || undefined,
        weight: weight,
        height: height,
        regimen: regimen,
        updated_at: new Date().toISOString(),
      });

      await supabase.from("workouts").insert({
        user_id: user.id,
        name: `${regimen} Custom Routine`,
        regimen: regimen,
        exercises: weeklyPlans as any,
      });

      setSaveStatus("saved");
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  };

  const handleCalculate = () => {
    const plans: WeeklyPlan[] = [];

    // Food macros generator
    const getFoodPlan = (slot: string, weekIndex: number) => {
      const isLow = dietBudget === "Low-budget";
      const isPremium = dietBudget === "Premium";
      let food = "";
      let macros = "";

      if (dietaryPref === "Vegan" || eliteIntakeAnswers?.diet === "Advanced Vegan") {
        if (slot === "Breakfast") {
          food = isLow ? "Sprouted Moong & peanut butter sandwich + soy milk" : "Organic Tofu scramble with spinach + pea protein isolate shake";
          macros = "420 kcal | P: 28g, C: 48g, F: 12g";
        } else if (slot === "Lunch") {
          food = isLow ? "Brown rice thali with dense Dal Fry + cucumber salad" : "Tofu quinoa bowl with organic edamame + walnuts";
          macros = "610 kcal | P: 32g, C: 80g, F: 15g";
        } else if (slot === "Snacks") {
          food = "Roasted Chana + pumpkin seeds";
          macros = "200 kcal | P: 14g, C: 22g, F: 6g";
        } else {
          food = isLow ? "Besan Chilla with sprouted Dal + mix vegetable sabzi" : "Tempeh stir-fry with broccoli, seeds & avocado";
          macros = "510 kcal | P: 26g, C: 50g, F: 18g";
        }
      } else if (dietaryPref === "Carnivore" || eliteIntakeAnswers?.diet === "Advanced Carnivore") {
        if (slot === "Breakfast") {
          food = isLow ? "4 Whole eggs scrambled in butter" : "Aged Ribeye steak + 3 eggs cooked in tallow";
          macros = "550 kcal | P: 40g, C: 0g, F: 42g";
        } else if (slot === "Lunch") {
          food = isLow ? "Boiled chicken legs in ghee" : "Mutton chops + scrambled brain or bone marrow thali";
          macros = "680 kcal | P: 48g, C: 0g, F: 54g";
        } else if (slot === "Snacks") {
          food = "Beef or lamb jerky cubes";
          macros = "180 kcal | P: 20g, C: 0g, F: 10g";
        } else {
          food = isLow ? "Fatty fish steak in butter" : "Salmon fillet + butter pan-seared chicken thighs";
          macros = "590 kcal | P: 46g, C: 0g, F: 45g";
        }
      } else {
        // Balanced / Vegetarian thali combinations
        if (slot === "Breakfast") {
          food = "Besan chilla with curd / Double boiled eggs with sprouted moong";
          macros = "450 kcal | P: 25g, C: 45g, F: 15g";
        } else if (slot === "Lunch") {
          food = "Brown Rice + Dal + Curd (EAA matched complete thali profile)";
          macros = "620 kcal | P: 30g, C: 85g, F: 12g";
        } else if (slot === "Snacks") {
          food = "Whey protein shake + handful of almonds";
          macros = "240 kcal | P: 26g, C: 10g, F: 8g";
        } else {
          food = "Roti + paneer/egg curry + cucumber salad";
          macros = "530 kcal | P: 32g, C: 55g, F: 16g";
        }
      }

      return { mealSlot: slot, food, macros };
    };

    // Calculate workouts based on selected regimen with progressive overload and deload week
    for (let w = 1; w <= 4; w++) {
      const workouts: WeeklyPlan["workouts"] = [];
      const isDeload = w === 4;
      const loadFactor = isDeload ? 0.6 : 0.7 + w * 0.05;

      if (regimen === "Powerlifting") {
        workouts.push({
          day: "Monday",
          focus: "Squat Volume & Bench Setup",
          exercises: [
            {
              name: "Back Squat",
              sets: isDeload ? 2 : 4,
              reps: isDeload ? "8" : "5",
              weight: `${Math.round(squatPr * loadFactor)} kg`,
              notes: isDeload ? "Deload Week: Focus on active recovery." : `Overload: Target 1RM percentage. Rest 3 mins.`,
            },
            {
              name: "Bench Press",
              sets: 3,
              reps: "8",
              weight: `${Math.round(benchPr * 0.65)} kg`,
              notes: "Pause 1s on chest.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Deadlift Intensity",
          exercises: [
            {
              name: "Barbell Deadlift",
              sets: isDeload ? 2 : 3,
              reps: "3",
              weight: `${Math.round(deadliftPr * loadFactor)} kg`,
              notes: "Brace lats, pull raw.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Bench Press Intensity",
          exercises: [
            {
              name: "Bench Press",
              sets: isDeload ? 2 : 4,
              reps: "3",
              weight: `${Math.round(benchPr * loadFactor)} kg`,
              notes: "Drive legs, pull shoulder blades.",
            },
          ],
        });
      } else if (regimen === "Pehelwani") {
        workouts.push({
          day: "Monday",
          focus: "Akhada Vardi (Hindu movements)",
          exercises: [
            {
              name: "Hindu Pushups (Dand)",
              sets: 5,
              reps: `${Math.round((maxDands + w * 5) * (isDeload ? 0.6 : 1))}`,
              weight: "Bodyweight",
              notes: "Engage lower back cobra stretches.",
            },
            {
              name: "Gada Swing (Macebell)",
              sets: 4,
              reps: "20 swings per side",
              weight: `${gadaWeight} kg`,
              notes: "Full shoulder rotation.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Leg Endurance (Bethak)",
          exercises: [
            {
              name: "Hindu Squats (Bethak)",
              sets: 5,
              reps: `${Math.round((maxBethaks + w * 10) * (isDeload ? 0.6 : 1))}`,
              weight: "Bodyweight",
              notes: "Rhythmic squatting. Keep heels off the ground.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Jodi & Wrestling Entry",
          exercises: [
            {
              name: "Circular Jodi Swings",
              sets: 4,
              reps: "15 swings",
              weight: "Moderate",
              notes: "Indian club swings for wrist mobility.",
            },
          ],
        });
      } else if (regimen === "Mugdal") {
        workouts.push({
          day: "Tuesday",
          focus: "Rotational Mobility & Grip",
          exercises: [
            {
              name: "Circular Mugdal Swings",
              sets: 5,
              reps: "25",
              weight: `${Math.round(weight * 0.1)} kg (Calculated)`,
              notes: "Keep posture upright. Control the centrifugal force.",
            },
            {
              name: "Grip Squeeze Rotations",
              sets: 4,
              reps: "15",
              weight: "Light",
              notes: "Build forearm stability.",
            },
          ],
        });
      } else if (regimen === "Hybrid") {
        workouts.push({
          day: "Monday",
          focus: "Heavy Squat & Core",
          exercises: [
            {
              name: "Barbell Back Squat",
              sets: 4,
              reps: "6",
              weight: `${Math.round(weight * 1.2)} kg (Calculated)`,
              notes: "1.2x Bodyweight loading target.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Aerobic Capacity",
          exercises: [
            {
              name: "Zone 2 LISS Run",
              sets: 1,
              reps: `${isDeload ? "30" : 45 + w * 5} mins`,
              weight: "Cardio",
              notes: "Keep heart rate low. Conversational pace.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Overhead Pressing",
          exercises: [
            {
              name: "Barbell Overhead Press",
              sets: 3,
              reps: "8",
              weight: `${Math.round(weight * 0.6)} kg (Calculated)`,
              notes: "0.6x Bodyweight loading target.",
            },
          ],
        });
      } else if (regimen === "Calisthenics") {
        workouts.push({
          day: "Monday",
          focus: "Upper Body Pulling",
          exercises: [
            {
              name: "Strict Pull-ups",
              sets: 4,
              reps: `${Math.round(maxPullups * loadFactor)}`,
              weight: "Bodyweight",
              notes: "Control descent, chin above bar.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Upper Body Pushing",
          exercises: [
            {
              name: "Parallel Bar Dips",
              sets: 4,
              reps: "10",
              weight: "Bodyweight",
              notes: "Go down to 90 degrees.",
            },
            {
              name: "Diamond Pushups",
              sets: 3,
              reps: "15",
              weight: "Bodyweight",
              notes: "Keep hands close in diamond shape.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "Calisthenics Core",
          exercises: [
            {
              name: "Hanging Leg Raises",
              sets: 3,
              reps: "12",
              weight: "Bodyweight",
              notes: "Strict form, no swinging.",
            },
          ],
        });
      } else if (regimen === "MMA") {
        workouts.push({
          day: "Monday",
          focus: "Striking Round Simulation",
          exercises: [
            {
              name: "Shadowboxing / Heavy Bag",
              sets: 3,
              reps: "5 min rounds",
              weight: "Aerobic/Anaerobic",
              notes: "Work striking combinations. 1 min rest between rounds.",
            },
          ],
        });
        workouts.push({
          day: "Wednesday",
          focus: "Takedown Drills",
          exercises: [
            {
              name: "Takedown Entry Drills",
              sets: 3,
              reps: "5 min rounds",
              weight: "Grappling",
              notes: "Double leg and single leg entries.",
            },
          ],
        });
        workouts.push({
          day: "Friday",
          focus: "MMA Scrambles",
          exercises: [
            {
              name: "Scramble & Clinch Work",
              sets: 2,
              reps: "5 min rounds",
              weight: "Anaerobic",
              notes: "Underhook drills, cage walks.",
            },
          ],
        });
      } else if (regimen === "Power") {
        workouts.push({
          day: "Monday",
          focus: "Contrast Contrast PAP",
          exercises: [
            {
              name: "Back Squat (@90% max)",
              sets: 3,
              reps: "3",
              weight: `${Math.round(weight * 1.2)} kg (Calculated)`,
              notes: "CNS priming. Move into jumps in 10s.",
            },
            {
              name: "Squat Jumps",
              sets: 3,
              reps: "3",
              weight: "Bodyweight",
              notes: "Explode up immediately.",
            },
          ],
        });
      } else if (regimen === "Dumbbell") {
        workouts.push({
          day: "Monday",
          focus: "Unilateral Strength",
          exercises: [
            {
              name: "Dumbbell Goblet Squat",
              sets: 4,
              reps: "12",
              weight: `${Math.round(weight * 0.4)} kg (Calculated)`,
              notes: "Keep chest upright. Hold DB under chin.",
            },
            {
              name: "Unilateral DB Shoulder Press",
              sets: 3,
              reps: "10 per side",
              weight: `${Math.round(weight * 0.2)} kg (Calculated)`,
              notes: "Corrects bilateral shoulder imbalances.",
            },
          ],
        });
      } else {
        // GymGoer & Maintenance & Cardio
        workouts.push({
          day: "Monday",
          focus: "LISS Cardio / Maintenance Split",
          exercises: [
            {
              name: "Steady State Cardio (Zone 2)",
              sets: 1,
              reps: "30 mins",
              weight: "Cardio",
              notes: "Conversational breathing. Target HR ~125 bpm.",
            },
          ],
        });
      }

      plans.push({
        week: w,
        workouts,
        diet: [
          getFoodPlan("Breakfast", w),
          getFoodPlan("Lunch", w),
          getFoodPlan("Snacks", w),
          getFoodPlan("Dinner", w),
        ],
      });
    }

    setWeeklyPlans(plans);
    setStep("result");
  };

  return (
    <div className="card-surface p-6 md:p-10 max-w-4xl mx-auto border-primary/20 bg-surface/80 backdrop-blur-md">
      {/* SUBSCRIPTION MODAL */}
      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        onSuccess={handleSubscribeSuccess}
      />

      {/* TABS HEADER */}
      <div className="flex gap-2 border-b border-border pb-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setStep("splash")}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition whitespace-nowrap ${
            step === "splash"
              ? "bg-primary border-primary text-background font-bold"
              : "border-border hover:border-primary/50 text-muted-foreground"
          }`}
        >
          Welcome
        </button>
        <button
          onClick={() => setStep("profile")}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition whitespace-nowrap ${
            step === "profile" || step === "stats"
              ? "bg-primary border-primary text-background font-bold"
              : "border-border hover:border-primary/50 text-muted-foreground"
          }`}
        >
          1. Biometrics & Onboarding
        </button>
        <button
          disabled={weeklyPlans.length === 0}
          onClick={() => setStep("result")}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition whitespace-nowrap ${
            weeklyPlans.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${
            step === "result"
              ? "bg-primary border-primary text-background font-bold"
              : "border-border hover:border-primary/50 text-muted-foreground"
          }`}
        >
          2. Weekly Schedule
        </button>
        <button
          onClick={() => setStep("logs")}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition whitespace-nowrap ${
            step === "logs"
              ? "bg-primary border-primary text-background font-bold"
              : "border-border hover:border-primary/50 text-muted-foreground"
          }`}
        >
          3. Daily Warrior OS
        </button>

        {/* SUBSCRIPTION INDICATOR */}
        <button
          onClick={() => {
            if (!isSubscribed) setSubscriptionModalOpen(true);
          }}
          className={`ml-auto px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition flex items-center gap-1.5 whitespace-nowrap ${
            isSubscribed
              ? "bg-green-600/10 border-green-600 text-green-500 font-bold"
              : "bg-ember/10 border-ember text-ember font-bold hover:bg-ember/20"
          }`}
        >
          <Zap className="h-4 w-4" /> {isSubscribed ? "Elite Active" : "Upgrade to Elite"}
        </button>
      </div>

      {step === "splash" && (
        <div className="text-center py-12 space-y-8 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-primary/20 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl" />
            <BicepsFlexed className="w-12 h-12 text-primary relative z-10" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter text-foreground">
              Athlete <span className="text-primary">Compass</span>
            </h1>
            <p className="text-sm text-muted-foreground uppercase tracking-widest max-w-sm mx-auto">
              Your Ultimate Training OS
            </p>
          </div>

          <button
            onClick={handleStartOnboarding}
            className="btn-primary inline-flex items-center gap-2 group cursor-pointer"
          >
            Start Journey
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      )}

      {step === "profile" && (
        <div>
          <h3 className="display-md text-primary flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Athlete Profiling
          </h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Input your parameters. Suggestion ratios & macros will dynamically scale to your bodyweight.
          </p>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Name / Call Sign
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
                  Experience Tier
                </label>
                <div className="flex gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExperience(exp as any)}
                      className={`flex-1 text-[10px] uppercase font-mono py-3.5 rounded-lg border transition ${
                        experience === exp
                          ? "bg-primary border-primary text-background font-bold"
                          : "border-border bg-surface-2 hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Bodyweight (kg)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 75"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 175"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Regimen Target
                </label>
                <select
                  value={regimen}
                  onChange={(e) => setRegimen(e.target.value as Regimen)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Hybrid">Hybrid Athlete</option>
                  <option value="Powerlifting">Powerlifting</option>
                  <option value="GymGoer">General Gym Goer</option>
                  <option value="Calisthenics">Calisthenics</option>
                  <option value="Dumbbell">Dumbbell Training</option>
                  <option value="Cardio">Cardio & HIIT</option>
                  <option value="Mugdal">Mugdal Training</option>
                  <option value="Pehelwani">Pehelwani Wrestling</option>
                  <option value="MMA">MMA Readiness</option>
                  <option value="Power">Power Training</option>
                  <option value="Maintenance">Basic Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Diet Choice
                </label>
                <select
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Vegan">Vegan (Plant-Based)</option>
                  <option value="Carnivore">Carnivore Diet</option>
                  <option value="Keto">Ketogenic (Keto)</option>
                  <option value="Intermittent">Intermittent Fasting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Diet Budget
                </label>
                <select
                  value={dietBudget}
                  onChange={(e) => setDietBudget(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Low-budget">Low Budget (Staples)</option>
                  <option value="Standard">Standard (Supplements)</option>
                  <option value="Premium">Premium (Imported/Organic)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Medical Notes / Allergies / Limitations
              </label>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="List injuries, PCOS support requirements, lactose intolerance..."
                className="w-full h-16 bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground resize-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleProfileSubmit}
            className="btn-primary w-full mt-8"
          >
            Next: Core Regimen baselines →
          </button>
        </div>
      )}

      {step === "stats" && (
        <div className="space-y-6">
          <h3 className="display-md text-primary flex items-center gap-2">
            <Dumbbell className="h-5 w-5" /> Regimen Stats ({regimen})
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Declare your current baselines so the OS can calibrate week-by-week loading variables.
          </p>

          <div className="space-y-4">
            {regimen === "Powerlifting" && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Squat 1RM (kg)</label>
                  <input type="number" value={squatPr} onChange={(e) => setSquatPr(Number(e.target.value))} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Bench 1RM (kg)</label>
                  <input type="number" value={benchPr} onChange={(e) => setBenchPr(Number(e.target.value))} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Deadlift 1RM (kg)</label>
                  <input type="number" value={deadliftPr} onChange={(e) => setDeadliftPr(Number(e.target.value))} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
              </div>
            )}

            {regimen === "Calisthenics" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Max Strict Pull-ups</label>
                  <input type="number" value={maxPullups} onChange={(e) => setMaxPullups(Number(e.target.value))} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Max Push-ups</label>
                  <input type="number" value={maxPushups} onChange={(e) => setMaxPushups(Number(e.target.value))} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
              </div>
            )}

            {regimen === "Pehelwani" && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Max Dands (Pushups)</label>
                  <input type="number" value={maxDands} onChange={(e) => setMaxDands(Number(e.target.value))} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Max Bethaks (Squats)</label>
                  <input type="number" value={maxBethaks} onChange={(e) => setMaxBethaks(Number(e.target.value))} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Mace (Gada) Weight (kg)</label>
                  <input type="number" value={gadaWeight} onChange={(e) => setGadaWeight(Number(e.target.value))} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
              </div>
            )}

            {regimen === "Cardio" || regimen === "Hybrid" ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Current 5K PR (MM:SS)</label>
                  <input type="text" value={fivekPr} onChange={(e) => setFivekPr(e.target.value)} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Resting Heart Rate (BPM)</label>
                  <input type="number" value={restingHr} onChange={(e) => setRestingHr(Number(e.target.value))} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none text-foreground" />
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={() => setStep("profile")} className="btn-ghost flex-1">
              ← Back
            </button>
            <button type="button" onClick={handleCalculate} className="btn-primary flex-1">
              Generate Custom Plan
            </button>
          </div>
        </div>
      )}

      {step === "result" && weeklyPlans.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h3 className="display-md text-primary">{regimen} 4-Week Custom Plan</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Calibrated for {name || "Athlete"} · {weight}kg · {experience} Tier
              </p>
            </div>
            <button
              onClick={saveWorkout}
              disabled={saveStatus === "saving" || saveStatus === "saved"}
              className={`text-xs px-4 py-2.5 rounded-lg border transition font-mono uppercase font-bold tracking-wider ${
                saveStatus === "saved"
                  ? "bg-green-600 border-green-600 text-white"
                  : "btn-primary"
              }`}
            >
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "saved" ? "✓ Saved Locally" : "Save Plan"}
            </button>
          </div>

          {/* ADVANCED PLAN ACCESS BLOCKED BANNER */}
          {!isSubscribed && (
            <div className="bg-ember/15 border border-ember/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" /> Advanced Diet Plan & Analytics Locked
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Subscribe to the Elite Tier (₹599/yr) to unlock custom micro-nutrient logs, complete thali EAA targets, and advanced progressive overload algorithms.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubscriptionModalOpen(true)}
                className="btn-primary !py-2 !px-4 text-[10px] font-mono tracking-widest flex-shrink-0"
              >
                Unlock Elite OS
              </button>
            </div>
          )}

          {/* WEEK SELECTOR */}
          <div className="flex justify-center gap-2">
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

          <div className="grid md:grid-cols-12 gap-6">
            {/* WORKOUTS COLUMN */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="font-display text-xl border-b border-border pb-2 flex items-center gap-2 uppercase">
                <Dumbbell className="h-5 w-5 text-primary" /> Training Split
              </h4>
              {weeklyPlans[activeWeek - 1].workouts.map((w, idx) => (
                <div key={idx} className="bg-surface-2 border border-border p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-widest text-primary font-mono font-bold">
                      {w.day}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold font-mono">{w.focus}</span>
                  </div>
                  <div className="space-y-3">
                    {w.exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="bg-surface p-3 rounded-lg border border-border/40">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-xs text-foreground font-mono">{ex.name}</p>
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                            {ex.sets} sets × {ex.reps}
                          </span>
                        </div>
                        <p className="text-[11px] text-primary/80 font-mono mt-1">
                          Rest: {ex.rest}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          Suggested Weight: {ex.weight}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed italic">
                          "{ex.notes}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* DIET COLUMN */}
            <div className="md:col-span-5 space-y-4">
              <h4 className="font-display text-xl border-b border-border pb-2 flex items-center gap-2 uppercase">
                <Clipboard className="h-5 w-5 text-primary" /> Nutrition Plan
              </h4>
              <div className="bg-surface-2 border border-border p-5 rounded-xl space-y-4">
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

                {/* ADVANCED DIET OPTIONS */}
                {isSubscribed && (
                  <div className="border-t border-primary/20 pt-4 mt-4 bg-primary/5 p-3 rounded-xl border border-primary/10 space-y-2">
                    <p className="text-xs font-bold text-primary font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" /> Elite Nutrient Analysis
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong>EAA Profile</strong>: Fermented Urad dal + rice thali matching verified complete amino profiles.
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong>Electrolytes</strong>: 1.5L water replacement per kg weight lost during heavy Pehelwani/wrestling sessions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "logs" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-12 gap-6">
            {/* DAILY WARRIOR CHECKLIST (5 cols) */}
            <div className="md:col-span-5 bg-surface-2 border border-border p-5 rounded-xl space-y-4">
              <div className="text-center space-y-2 pb-4 border-b border-border/40">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  {/* PROGRESS RING */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-muted" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      className="stroke-primary transition-all duration-500"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * getConsistencyScore()) / 100}
                    />
                  </svg>
                  <span className="absolute text-sm font-mono text-foreground font-black">
                    {getConsistencyScore()}%
                  </span>
                </div>
                <h4 className="text-xs uppercase font-mono tracking-widest text-muted-foreground">Daily Warrior Score</h4>
              </div>

              {/* CHECKLIST ITEMS */}
              <div className="space-y-3">
                <div onClick={() => setChkHrv(!chkHrv)} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:border-primary/50 transition">
                  <span className="text-xs font-mono text-foreground">1. HRV Readiness Measured</span>
                  {chkHrv ? <CheckCircle className="h-4 w-4 text-primary" /> : <div className="h-4 w-4 rounded-full border border-border" />}
                </div>
                <div onClick={() => setChkMobility(!chkMobility)} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:border-primary/50 transition">
                  <span className="text-xs font-mono text-foreground">2. 10 Min Morning Mobility</span>
                  {chkMobility ? <CheckCircle className="h-4 w-4 text-primary" /> : <div className="h-4 w-4 rounded-full border border-border" />}
                </div>
                <div onClick={() => setChkTraining(!chkTraining)} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:border-primary/50 transition">
                  <span className="text-xs font-mono text-foreground">3. Programmed Training Done</span>
                  {chkTraining ? <CheckCircle className="h-4 w-4 text-primary" /> : <div className="h-4 w-4 rounded-full border border-border" />}
                </div>
                <div onClick={() => setChkMacros(!chkMacros)} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:border-primary/50 transition">
                  <span className="text-xs font-mono text-foreground">4. Nutrition Target Met</span>
                  {chkMacros ? <CheckCircle className="h-4 w-4 text-primary" /> : <div className="h-4 w-4 rounded-full border border-border" />}
                </div>
                <div onClick={() => setChkSleep(!chkSleep)} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:border-primary/50 transition">
                  <span className="text-xs font-mono text-foreground">5. 8 Hours Recovery Sleep</span>
                  {chkSleep ? <CheckCircle className="h-4 w-4 text-primary" /> : <div className="h-4 w-4 rounded-full border border-border" />}
                </div>
              </div>
            </div>

            {/* WEIGHT LOGS & PR PROGRESS GRAPH MOCK (7 cols) */}
            <div className="md:col-span-7 bg-surface-2 border border-border p-5 rounded-xl space-y-4">
              <h4 className="font-display text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" /> Warrior Progression Logs
              </h4>

              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-1 uppercase text-[10px]">Weight Today (kg)</label>
                    <input
                      type="number"
                      value={logWeight}
                      onChange={(e) => setLogWeight(Number(e.target.value))}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 uppercase text-[10px]">Daily Steps</label>
                    <input
                      type="number"
                      value={logSteps}
                      onChange={(e) => setLogSteps(Number(e.target.value))}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New PR lift"
                    value={newPrMovement}
                    onChange={(e) => setNewPrMovement(e.target.value)}
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Weight/Reps"
                    value={newPrValue}
                    onChange={(e) => setNewPrValue(e.target.value)}
                    className="w-24 bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPrMovement.trim() && newPrValue.trim()) {
                        setPrList([...prList, { movement: newPrMovement, value: newPrValue }]);
                        setNewPrMovement("");
                        setNewPrValue("");
                      }
                    }}
                    className="btn-primary !p-2 rounded-lg flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 text-background" />
                  </button>
                </div>

                {prList.length > 0 && (
                  <div className="bg-surface p-2 rounded-lg border border-border space-y-1">
                    {prList.map((pr, idx) => (
                      <div key={idx} className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>{pr.movement}</span>
                        <span className="text-primary font-bold">{pr.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLogProgress}
                  className="btn-primary w-full py-2.5 text-xs font-mono uppercase tracking-wider"
                >
                  Save Log Entry
                </button>
              </div>

              {/* LOGS HISTORY */}
              <div className="space-y-2 pt-2">
                <h5 className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Log History</h5>
                {logs.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">No logs recorded yet.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {logs.map((l, idx) => (
                      <div key={idx} className="bg-surface border border-border p-3 rounded-lg text-[10px] font-mono flex justify-between items-center">
                        <div>
                          <p className="text-primary font-bold">{l.date}</p>
                          <p className="text-muted-foreground">W: {l.weight}kg · S: {l.steps}</p>
                        </div>
                        {l.prUpdates && l.prUpdates.length > 0 && (
                          <div className="text-right">
                            {l.prUpdates.map((pr, pIdx) => (
                              <p key={pIdx} className="text-foreground">{pr.movement}: <span className="text-primary font-bold">{pr.value}</span></p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
