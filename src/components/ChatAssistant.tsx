import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { askCoach } from "../lib/chat-server";

export function ChatAssistant() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const newMessages = [...messages, { role: "user", content: input } as const];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await askCoach({
        data: newMessages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      });
      if (res.success && res.text) {
        setMessages([...newMessages, { role: "assistant", content: res.text }]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Sorry, I encountered an error. Please ensure your OpenAI API Key is configured." },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error connecting to the coaching system." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="btn-primary rounded-full p-4 h-12 w-12 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        >
          <MessageSquare className="h-5 w-5 text-background" />
        </button>
      ) : (
        <div className="card-surface w-80 sm:w-96 h-[450px] flex flex-col p-4 shadow-xl border border-border backdrop-blur-md bg-surface/90">
          <div className="flex justify-between items-center border-b border-border pb-3 mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary font-mono">Anywhere Fitness</p>
              <h3 className="font-semibold text-sm">Smart Coach Chat</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-surface-2 rounded-md transition text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xs text-muted-foreground leading-relaxed px-4">
                  Ask me anything about your workout program, nutrition swaps, or recovery routines!
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-background ml-auto font-medium"
                    : "bg-surface-2 text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1 bg-surface-2 p-3 rounded-xl text-xs max-w-[60%]">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-border pt-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ask a coach..."
            />
            <button
              onClick={sendMessage}
              className="btn-primary !p-2 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <Send className="h-4 w-4 text-background" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
