import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHeader, Section } from "@/components/Section";
import { AuthGuard } from "@/components/AuthGuard";
import { askCoach } from "../lib/chat-server";
import { LiveCommunity } from "@/components/LiveCommunity";
import { Send, MessageSquare, Shield, Info, Sparkles, User, Cpu, Users } from "lucide-react";

export const Route = createFileRoute("/smart-coach")({
  head: () => ({
    meta: [
      { title: "Smart Coach — ANYWHERE FITNESS" },
      {
        name: "description",
        content:
          "The adaptive engine inside ANYWHERE FITNESS: weekly check-ins, plan recalibration, progress tracking, gamified milestones, and a community that pushes you forward.",
      },
      { property: "og:title", content: "Smart Coach — ANYWHERE FITNESS" },
      { property: "og:description", content: "A coaching engine that rewrites your plan every week." },
    ],
  }),
  component: SmartCoachPage,
});

const FLOW = [
  {
    step: "Sense",
    body: "Logs workouts, sleep, body weight, energy, RPE, adherence and recovery scores.",
  },
  {
    step: "Score",
    body: "Computes weekly readiness, recovery debt, training stimulus and macro accuracy.",
  },
  {
    step: "Adjust",
    body: "Rewrites next week: volume, intensity, exercise selection, calories, macros.",
  },
  {
    step: "Coach",
    body: "Surfaces what changed, why, and what to focus on this week — in plain English.",
  },
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function SmartCoachPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "chat" | "community">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your Anywhere Fitness AI Smart Coach. Let's design a customized training & diet plan tailored exactly to you.\n\nTo start, could you please tell me your:\n1. Age, Weight, and Height\n2. Current Fitness Goal (e.g. Strength, Weight Loss, Muscle Gain, Endurance)\n3. Dietary Preference (e.g. Carnivore, Vegan, Keto, Balanced, Vegetarian) and Budget level?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const newMessages = [...messages, { role: "user", content: userMsg } as const];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const formattedMessages = [
        {
          role: "system" as const,
          content:
            "You are a professional fitness & nutrition coach. Talk to the user. Ask necessary follow-up questions to understand their level, PRs, budget, schedule, and any health considerations (injuries, medical notes like PCOS/diabetes). When they provide enough info or ask for it, generate a detailed 4-week custom workout schedule and weekly macro-budgeted meal plan based on their chosen regimen (Powerlifting, Pehlewani, Hyrox, Hybrid, Cardio, Bodybuilding, etc.). Keep formatting clean, using bold text, list items, and clear sections.",
        },
        ...newMessages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ];

      // Prompt the model to ask guiding questions and output a structured plan
      const response = await askCoach({ data: formattedMessages });

      if (response.success && response.text) {
        setMessages([...newMessages, { role: "assistant", content: response.text }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "I encountered an error trying to connect to my brain. Please make sure your OpenAI API key is configured in your project's .env file.",
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error: Failed to fetch coaching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard
      title="Adaptive Smart Coach"
      description="Unlock Sunday plan recalibration, recovery calculations, metrics, PR charts, and community feeds."
    >
      <PageHeader
        eyebrow="Smart coaching engine"
        title="The plan rewrites itself."
        lead="Static plans break the moment life happens. ANYWHERE FITNESS’s coaching engine learns from every session, every meal, every night of sleep — and ships a fresh plan every Sunday."
      />

      {/* TAB SELECTOR */}
      <Section className="!pt-4">
        <div className="flex justify-center gap-4 border-b border-border pb-4">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-3 text-xs font-mono uppercase tracking-wider rounded-xl border transition flex items-center gap-2 ${
              activeTab === "chat"
                ? "bg-primary border-primary text-background font-bold"
                : "border-border bg-surface-2 hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Smart Chatbot
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`px-6 py-3 text-xs font-mono uppercase tracking-wider rounded-xl border transition flex items-center gap-2 ${
              activeTab === "community"
                ? "bg-primary border-primary text-background font-bold"
                : "border-border bg-surface-2 hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <Users className="h-4 w-4" /> Community Feed
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 text-xs font-mono uppercase tracking-wider rounded-xl border transition flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-primary border-primary text-background font-bold"
                : "border-border bg-surface-2 hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <Cpu className="h-4 w-4" /> Coach Overview
          </button>
        </div>
      </Section>

      {activeTab === "community" && (
        <Section className="!pt-0">
          <LiveCommunity />
        </Section>
      )}

      {activeTab === "chat" && (
        <Section className="!pt-0">
          <div className="card-surface max-w-4xl mx-auto flex flex-col h-[600px] border border-primary/20 bg-surface/85 backdrop-blur-md overflow-hidden rounded-2xl">
            {/* CHAT HEADER */}
            <div className="border-b border-border/80 p-4 bg-surface-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: "var(--gradient-ember)" }}
                >
                  <MessageSquare className="h-5 w-5 text-background" />
                </span>
                <div>
                  <h3 className="font-display text-lg tracking-wide text-foreground">AI Coach Chat</h3>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                    Adaptive Intelligence · Connected
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-green-500 font-mono bg-green-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
                AI Online
              </span>
            </div>

            {/* CHAT BUBBLES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 max-w-[85%] ${
                    m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                      m.role === "user"
                        ? "bg-primary text-background"
                        : "bg-surface-2 border border-border text-foreground"
                    }`}
                  >
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-background font-medium"
                        : "bg-surface-2 border border-border/70 text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 max-w-[50%] mr-auto">
                  <div className="h-8 w-8 rounded-full bg-surface-2 border border-border flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="bg-surface-2 border border-border/70 p-4 rounded-2xl flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* CHAT INPUT */}
            <div className="border-t border-border/80 p-4 bg-surface-2 flex gap-3 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Tell the coach about your goals, diet preferences, budget, or ask questions..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="btn-primary !p-3 rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5 text-background" />
              </button>
            </div>
          </div>
        </Section>
      )}

      {activeTab === "overview" && (
        <>
          {/* FLOW */}
          <Section className="!pt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
              {FLOW.map((s, i) => (
                <div key={s.step} className="bg-surface p-8 hover:bg-surface-2 transition">
                  <p className="mono-num text-primary text-sm">0{i + 1}</p>
                  <h3 className="display-md mt-4">{s.step}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* WEEKLY CHECK-IN MOCK */}
          <Section className="!pt-0">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5">
                <p className="eyebrow">Weekly check-in</p>
                <h2 className="display-lg mt-4">
                  5 questions.
                  <br />A new plan.
                </h2>
                <p className="mt-6 text-muted-foreground">
                  Every Sunday, ANYWHERE FITNESS asks how the week felt — workouts, sleep, mood, weight,
                  hunger. In under 90 seconds, your entire plan recalibrates for the week ahead.
                </p>
              </div>
              <div className="lg:col-span-7 card-surface p-6 md:p-8">
                <div className="space-y-5">
                  {[
                    { q: "How hard did this week’s workouts feel?", a: "8 / 10 · Hard" },
                    { q: "Average sleep this week?", a: "6.4 hrs" },
                    { q: "Body weight today?", a: "74.2 kg · ↓ 0.6" },
                    { q: "Energy levels?", a: "Moderate" },
                    { q: "How hungry between meals?", a: "Often" },
                  ].map((row, i) => (
                    <div key={i}>
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <p className="text-sm text-muted-foreground">
                          Q{i + 1}. {row.q}
                        </p>
                        <p className="mono-num text-sm text-primary whitespace-nowrap">{row.a}</p>
                      </div>
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${[80, 64, 70, 55, 75][i]}%`,
                            background: "var(--gradient-ember)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    Calibrating…
                  </p>
                  <p className="text-sm font-medium text-primary">New plan in 12s →</p>
                </div>
              </div>
            </div>
          </Section>

          {/* PROGRESS + SOCIAL */}
          <Section className="!pt-0">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 card-surface p-8">
                <p className="eyebrow">Progress tracking</p>
                <h3 className="display-md mt-4">Visual analytics, streaks, achievements.</h3>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
                  {[
                    "Body metric tracking (weight, BF%, measurements)",
                    "PR history per lift",
                    "Workout consistency calendar",
                    "Macro adherence trendlines",
                    "Achievement badges & milestones",
                    "Exportable PDF reports for coaches",
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <span className="text-primary mt-1">·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5 card-surface p-8">
                <p className="eyebrow">Social & community</p>
                <h3 className="display-md mt-4">Train alone. Push together.</h3>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    "Community feed: workouts, meals, photos",
                    "7- and 30-day challenges with leaderboards",
                    "Workout buddy matching",
                    "Live sessions with certified trainers (Pro)",
                    "1-1 coach messaging (Pro)",
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <span className="text-primary mt-1">·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </>
      )}

      <Section className="!pt-0 text-center">
        <h2 className="display-lg">A coach in your pocket.</h2>
        <p className="mt-4 text-muted-foreground">From your first push-up to your first PR.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/pricing" className="btn-primary">
            See pricing
          </Link>
          <Link to="/programs" className="btn-ghost">
            Browse programs
          </Link>
        </div>
      </Section>
    </AuthGuard>
  );
}
