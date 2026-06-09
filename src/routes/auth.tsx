import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { sendOtp, verifyOtp } from "../lib/supabase";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authenticate — ANYWHERE FITNESS" },
      { name: "description", content: "Sign in with Email and OTP" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const { user, loginMockUser } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to home or workouts
  if (user) {
    navigate({ to: "/workouts" });
    return null;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      // Generate a random 6 digit code as requested
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setStep("otp");
      setInfoMessage(`DEMO MODE: Your OTP code is ${code}`);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to generate OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError(null);

    try {
      if (otp === generatedOtp) {
        loginMockUser(email);
        navigate({ to: "/workouts" });
      } else {
        throw new Error("Invalid OTP code. Please check the code provided above.");
      }
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md card-surface p-8 sm:p-10 relative overflow-hidden backdrop-blur-md bg-surface/80">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-primary/20 blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-primary/10 blur-xl pointer-events-none" />

        <div className="text-center mb-8">
          <p className="eyebrow">Secure Gateway</p>
          <h1 className="display-md mt-3">
            {step === "email" ? "Enter your Grid" : "Verify access"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "email"
              ? "Access your premium coaching, custom plans, and workout logs."
              : "Input the 6-digit security code sent to your email."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/15 border border-destructive/30 p-4 text-sm text-destructive-foreground">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="mb-6 rounded-lg bg-primary/10 border border-primary/30 p-4 text-sm text-primary-foreground text-center">
            {infoMessage}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@example.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending Code...
                </>
              ) : (
                "Send OTP Code"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label
                htmlFor="otp"
                className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"
              >
                One-Time Passcode (OTP)
              </label>
              <input
                id="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                pattern="\d{6}"
                className="w-full text-center tracking-widest font-mono rounded-lg border border-border bg-background px-4 py-3 text-lg placeholder:text-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Verifying Code...
                </>
              ) : (
                "Verify & Authorize"
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition cursor-pointer mt-2"
              disabled={loading}
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
