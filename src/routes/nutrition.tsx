import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import nutritionImg from "@/assets/nutrition-bowl.jpg";
import { PageHeader, Section } from "@/components/Section";
import { AuthGuard } from "@/components/AuthGuard";
import { Sparkles, ArrowRight, Apple, Flame, ChevronRight } from "lucide-react";

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

interface DietDetail {
  name: string;
  focus: string;
  macros: { protein: number; carbs: number; fat: number };
  staples: string[];
  sampleMenu: { meal: string; item: string }[];
  description: string;
}

const DIETS_DATA: DietDetail[] = [
  {
    name: "Carnivore Diet",
    focus: "Zero-carb, pure animal-based nutrition for maximum inflammation control & insulin resets.",
    macros: { protein: 35, carbs: 0, fat: 65 },
    staples: ["Grass-fed ribeye steak", "Scrambled eggs in butter", "Salmon fillets", "Ghee & Bone broth"],
    sampleMenu: [
      { meal: "Breakfast", item: "4 scrambled eggs in ghee + bacon slices" },
      { meal: "Lunch", item: "Pan-seared chicken thighs + butter broth" },
      { meal: "Snacks", item: "Hard-boiled eggs or beef jerky" },
      { meal: "Dinner", item: "Grilled ribeye steak with marrow butter" },
    ],
    description: "Focuses exclusively on meat, fish, eggs, and healthy animal fats. Eliminates all plant materials.",
  },
  {
    name: "Vegan Diet",
    focus: "100% plant-based meal plan structured to hit body building protein targets without soy-reliance.",
    macros: { protein: 25, carbs: 55, fat: 20 },
    staples: ["Tempeh & Organic Tofu", "Quinoa & Brown Rice", "Edamame & Chickpeas", "Pea protein isolates"],
    sampleMenu: [
      { meal: "Breakfast", item: "Oatmeal with soy milk, berries & scoop of pea protein" },
      { meal: "Lunch", item: "Tofu stir-fry with quinoa, broccoli & pumpkin seeds" },
      { meal: "Snacks", item: "Hummus with carrots + handful of almonds" },
      { meal: "Dinner", item: "Tempeh curry with brown rice, edamame & spinach" },
    ],
    description: "Excludes all animal products. Heavy emphasis on clean grains, legumes, tofu, and seeds.",
  },
  {
    name: "Ketogenic (Keto)",
    focus: "High-fat, low-carb state triggering ketosis for accelerated fat utilization & mental clarity.",
    macros: { protein: 20, carbs: 5, fat: 75 },
    staples: ["Avocados", "Heavy cream & Cheese", "Butter & Olive Oil", "Fatty cuts of meat & paneer"],
    sampleMenu: [
      { meal: "Breakfast", item: "Bulletproof coffee + avocado scrambled eggs" },
      { meal: "Lunch", item: "Grilled salmon with asparagus in lemon butter sauce" },
      { meal: "Snacks", item: "Celery sticks with cream cheese + walnuts" },
      { meal: "Dinner", item: "Paneer butter masala cooked in heavy cream & cauliflower rice" },
    ],
    description: "Forces the body into burning fats rather than carbohydrates for fuel.",
  },
  {
    name: "Intermittent Fasting",
    focus: "Timed feeding window (typically 16/8) designed to maximize human growth hormone and insulin sensitivity.",
    macros: { protein: 30, carbs: 40, fat: 30 },
    staples: ["Black coffee/Green tea (fasting)", "High-volume whole foods", "Nuts & Avocado", "Lean proteins"],
    sampleMenu: [
      { meal: "Breakfast", item: "Fasting window - water, black coffee or green tea only" },
      { meal: "Lunch (1 PM)", item: "Grilled chicken breast, sweet potato & green beans" },
      { meal: "Snacks (4 PM)", item: "Whey protein shake + banana + almond butter" },
      { meal: "Dinner (8 PM)", item: "Roti with paneer curry, dal & greek yogurt" },
    ],
    description: "Cycles between periods of fasting and eating. Promotes cellular repair.",
  },
  {
    name: "Strict Vegetarian",
    focus: "Dairy-friendly plant-rich eating maximizing nutrient diversity with high-grade dairy proteins.",
    macros: { protein: 25, carbs: 45, fat: 30 },
    staples: ["Paneer & Greek Yogurt", "Lentils, Rajma & Chana", "Green vegetables", "Whey isolate"],
    sampleMenu: [
      { meal: "Breakfast", item: "Paneer bhurji + whole wheat toast + green tea" },
      { meal: "Lunch", item: "2 Rotis, dal makhani, bhindi sabzi & curd" },
      { meal: "Snacks", item: "Sprouted moong salad + handful of peanuts" },
      { meal: "Dinner", item: "Tofu/Paneer tikka wrap + mixed vegetable soup" },
    ],
    description: "Excludes meat and fish but includes dairy products like paneer, milk, and curd.",
  },
  {
    name: "Mediterranean",
    focus: "Heart-healthy fats and antioxidant-rich ingredients emphasizing cardiovascular longevity.",
    macros: { protein: 25, carbs: 45, fat: 30 },
    staples: ["Extra virgin olive oil", "Salmon, sardines & mackerel", "Hummus & Feta cheese", "Whole grains"],
    sampleMenu: [
      { meal: "Breakfast", item: "Greek yogurt with honey, walnuts & chia seeds" },
      { meal: "Lunch", item: "Quinoa salad with olives, feta cheese, cucumber & grilled chicken" },
      { meal: "Snacks", item: "Whole wheat pita bread with hummus" },
      { meal: "Dinner", item: "Baked cod fillet with olive oil, sweet potatoes & roasted vegetables" },
    ],
    description: "Rich in olive oil, fish, nuts, fruits, and vegetables. Excellent for heart health.",
  },
  {
    name: "High-Protein (Balanced)",
    focus: "The classical athletic diet built to sustain muscle gains and accelerate exercise recovery.",
    macros: { protein: 40, carbs: 35, fat: 25 },
    staples: ["Chicken breast & eggs", "Lean beef or mutton", "Whey protein & cottage cheese", "White rice & sweet potato"],
    sampleMenu: [
      { meal: "Breakfast", item: "Egg white omelette + oatmeal with whey protein" },
      { meal: "Lunch", item: "Grilled chicken breast with white rice & steamed broccoli" },
      { meal: "Snacks", item: "Low-fat cottage cheese/paneer + apple slices" },
      { meal: "Dinner", item: "Salmon steak with sweet potato mash & green beans" },
    ],
    description: "Standard body-recomposition diet. Highly prioritized protein intake.",
  },
  {
    name: "Paleo Diet",
    focus: "Modern adaptation of ancestral eating habits, avoiding all processed foods, sugars, grains & legumes.",
    macros: { protein: 30, carbs: 30, fat: 40 },
    staples: ["Free-range poultry", "Sweet potatoes", "Almond flour", "Fresh berries & seeds"],
    sampleMenu: [
      { meal: "Breakfast", item: "Sweet potato hash with ground beef + eggs" },
      { meal: "Lunch", item: "Turkey lettuce wraps with avocado slices + berries" },
      { meal: "Snacks", item: "Handful of almonds & pumpkin seeds" },
      { meal: "Dinner", item: "Lemon herb chicken wings + grilled asparagus & zucchini" },
    ],
    description: "Only includes foods that were available to our hunter-gatherer ancestors.",
  },
  {
    name: "Low-Carb High-Fat (LCHF)",
    focus: "Mild carb restriction allowing sustained energy levels without the strictness of keto.",
    macros: { protein: 30, carbs: 15, fat: 55 },
    staples: ["Whole eggs", "Avocado oil & Coconut oil", "Almonds & Macadamia", "Fatty fish & chicken thighs"],
    sampleMenu: [
      { meal: "Breakfast", item: "Omelette with cheddar cheese, mushrooms & spinach" },
      { meal: "Lunch", item: "Tuna salad made with olive oil mayonnaise + celery sticks" },
      { meal: "Snacks", item: "String cheese + handful of almonds" },
      { meal: "Dinner", item: "Mutton seekh kebab with butter-braised cabbage" },
    ],
    description: "Restricts carbohydrates while encouraging healthy fats and high protein.",
  },
  {
    name: "Dash / Medical-Aware",
    focus: "Clinically structured diet built to support insulin sensitivity, diabetic balance, and PCOS health.",
    macros: { protein: 30, carbs: 40, fat: 30 },
    staples: ["Low glycemic index grains (Oats, Barley)", "Spinach, Kale & Broccoli", "Low-fat dairy", "Walnuts & flaxseeds"],
    sampleMenu: [
      { meal: "Breakfast", item: "Steel-cut oats with flaxseed, berries & egg whites" },
      { meal: "Lunch", item: "Grilled tofu salad with chickpeas, spinach, seeds & olive oil dressing" },
      { meal: "Snacks", item: "Greek yogurt with raw walnuts" },
      { meal: "Dinner", item: "Stir-fried chicken breast with broccoli, garlic & brown rice" },
    ],
    description: "Low-sodium, low-glycemic eating emphasizing fiber, lean protein, and magnesium.",
  },
];

function NutritionPage() {
  const [activeDiet, setActiveDiet] = useState<DietDetail>(DIETS_DATA[0]);

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

      {/* DIET SELECTOR SECTION */}
      <Section className="!pt-4">
        <div className="text-center mb-10">
          <p className="eyebrow">Interactive Diets Hub</p>
          <h2 className="display-lg mt-3">Explore 10 Elite Fitness Diets</h2>
          <p className="max-w-2xl mx-auto text-sm text-muted-foreground mt-3">
            Select a nutrition regimen to analyze macro splits, key food staples, and explore a typical daily menu plan.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* DIET BUTTONS (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {DIETS_DATA.map((diet) => (
              <button
                key={diet.name}
                onClick={() => setActiveDiet(diet)}
                className={`flex justify-between items-center px-5 py-4 text-xs font-mono uppercase tracking-wider rounded-xl border transition text-left ${
                  activeDiet.name === diet.name
                    ? "bg-primary border-primary text-background font-bold"
                    : "border-border bg-surface-2 hover:border-primary/50 text-muted-foreground"
                }`}
              >
                <span>{diet.name}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* DIET DETAILS VIEW (8 cols) */}
          <div className="lg:col-span-8 card-surface p-6 md:p-10 space-y-8 bg-surface/80 backdrop-blur-md">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-bold">
                Selected Diet Plan
              </span>
              <h3 className="display-lg mt-2 text-foreground">{activeDiet.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {activeDiet.description}
              </p>
            </div>

            <div className="bg-surface-2 border border-border p-5 rounded-xl">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-mono font-bold mb-4">
                Recommended Macro Split
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Protein</span>
                    <span className="text-primary font-bold">{activeDiet.macros.protein}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${activeDiet.macros.protein}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Carbs</span>
                    <span className="text-primary font-bold">{activeDiet.macros.carbs}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${activeDiet.macros.carbs}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span>Fat</span>
                    <span className="text-primary font-bold">{activeDiet.macros.fat}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${activeDiet.macros.fat}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-primary font-mono font-bold mb-3 flex items-center gap-2">
                  <Apple className="h-4 w-4" /> Recommended Staples
                </h4>
                <ul className="space-y-2 text-xs">
                  {activeDiet.staples.map((s) => (
                    <li key={s} className="flex items-center gap-2 bg-surface-2 px-3 py-2.5 rounded-lg border border-border/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-primary font-mono font-bold mb-3 flex items-center gap-2">
                  <Flame className="h-4 w-4" /> Sample Daily Menu
                </h4>
                <div className="space-y-3">
                  {activeDiet.sampleMenu.map((m) => (
                    <div key={m.meal} className="bg-surface-2 p-3 rounded-lg border border-border/40">
                      <span className="text-[10px] font-mono uppercase text-muted-foreground block font-bold">
                        {m.meal}
                      </span>
                      <span className="text-xs text-foreground mt-0.5 block font-medium">
                        {m.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground italic">
                {activeDiet.focus}
              </span>
              <Link to="/smart-coach" className="btn-primary !py-2.5 !px-5 text-xs">
                Build this plan in Smart Coach →
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ORIGINAL SPEC SECTION */}
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
    </AuthGuard>
  );
}
