import { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/auth-context";
import { Send, Users, Activity, Sparkles, MessageSquare, AlertCircle } from "lucide-react";

interface ChatMsg {
  user: string;
  text: string;
  timestamp: string;
}

export function LiveCommunity() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [onlineCount, setOnlineCount] = useState(1);
  const [notifications, setNotifications] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial message history from Express server via HTTP
  useEffect(() => {
    fetch("http://localhost:5000/api/messages")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch((err) => {
        console.warn("Express HTTP server offline. Relying on WebSocket events.");
      });
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    socketRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 4) + 1); // Simulate other online users
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "history" && messages.length === 0) {
          setMessages(parsed.data);
        } else if (parsed.type === "chat") {
          setMessages((prev) => [...prev, parsed.data]);
        } else if (parsed.type === "notification") {
          setNotifications((prev) => [parsed.data, ...prev.slice(0, 4)]);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      setStatus("disconnected");
    };

    ws.onerror = () => {
      setStatus("disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    const username = user?.user_metadata?.full_name || user?.email || "Guest Athlete";
    const payload = {
      type: "chat",
      user: username,
      text: input.trim(),
    };

    socketRef.current.send(JSON.stringify(payload));
    setInput("");
  };

  const simulateActivity = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    const actions = [
      "completed a Powerlifting Squat session @ 140kg!",
      "unlocked the 'Gada Champion' milestone badge!",
      "logged a perfect 2200 kcal Vegan Diet thali thali!",
      "finished 100 consecutive Hindu Squats (Bethaks)!",
      "registered a new 5k Run PR of 22:45!",
    ];
    const athletes = ["Rohan K.", "Anika S.", "Vikram M.", "Rahul J.", "Priya G."];
    const randomAthlete = athletes[Math.floor(Math.random() * athletes.length)];
    const randomAction = actions[Math.floor(actions.length * Math.random())];

    const payload = {
      type: "notification",
      data: `🔥 ${randomAthlete} ${randomAction}`,
    };
    socketRef.current.send(JSON.stringify(payload));
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 max-w-5xl mx-auto h-[600px]">
      {/* CHAT BOARD (8 cols) */}
      <div className="lg:col-span-8 flex flex-col bg-surface-2 border border-border rounded-2xl overflow-hidden shadow-xl">
        {/* HEADER */}
        <div className="p-4 bg-surface border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h4 className="font-display text-lg uppercase tracking-wider text-foreground">Live Athlete Feed</h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-4.5 w-4.5 text-primary" /> {onlineCount} Trainees</span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${
              status === "connected" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            }`}>
              {status === "connected" ? "Sync Active" : "Offline / Retry"}
            </span>
          </div>
        </div>

        {/* FEED BUBBLES */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
              <MessageSquare className="h-8 w-8 text-primary/40" />
              <p className="text-xs text-muted-foreground">No recent messages in the Akhada feed. Start the conversation!</p>
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className="bg-surface p-3.5 rounded-xl border border-border/40 space-y-1 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-primary font-bold">{m.user}</span>
                <span className="text-muted-foreground">{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{m.text}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* MESSAGE INPUT */}
        <div className="p-4 bg-surface border-t border-border flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={status === "connected" ? "Share your training target or ask advice..." : "Connecting to community server..."}
            disabled={status !== "connected"}
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={status !== "connected" || !input.trim()}
            className="btn-primary !p-3.5 rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5 text-background" />
          </button>
        </div>
      </div>

      {/* TELEMETRY FEED (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* LIVE WORKOUT NOTIFICATIONS */}
        <div className="card-surface p-5 flex-1 flex flex-col justify-between bg-surface-2 border border-border">
          <div className="space-y-4">
            <h5 className="font-display text-sm uppercase tracking-wider text-primary flex items-center gap-1.5 border-b border-border pb-2">
              <Activity className="h-4 w-4" /> Global Completions
            </h5>
            {notifications.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-surface rounded-lg border border-border/50 text-[11px] text-muted-foreground">
                <AlertCircle className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                <span>Simulate user check-ins to view incoming real-time notifications.</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {notifications.map((n, i) => (
                  <div key={i} className="p-2.5 bg-surface border border-primary/10 rounded-lg text-[10px] font-mono text-foreground leading-relaxed animate-in fade-in duration-300">
                    {n}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={simulateActivity}
            disabled={status !== "connected"}
            className="btn-ghost w-full uppercase font-bold py-2.5 text-[9px] font-mono tracking-widest mt-4 flex items-center justify-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" /> Trigger Check-in
          </button>
        </div>

        {/* MOCK CONNECTIVITY CARD */}
        <div className="card-surface p-5 bg-surface-2 border border-border space-y-2 text-xs font-mono">
          <h5 className="font-bold text-foreground">Community Server Specs</h5>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Runs an Express REST API + WebSocket pipeline persisting data to MongoDB. Connects automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
