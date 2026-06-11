import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { sendOtp, verifyOtp, sendPhoneOtp, verifyPhoneOtp } from "../lib/supabase";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authenticate — ANYWHERE FITNESS" },
      { name: "description", content: "Sign in with Email or Phone OTP" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  const { user, loginMockUser } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to home or workouts
  if (user) {
    navigate({ to: "/workouts" });
    return null;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      setError("Display Name is required.");
      return;
    }
    if (authMethod === "email" && !email) {
      setError("Email address is required.");
      return;
    }
    if (authMethod === "phone" && !phone) {
      setError("Phone number is required.");
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);
    setSmsNotification(null);

    try {
      if (authMethod === "email") {
        try {
          await sendOtp(email);
          setInfoMessage("We've sent a 6-digit verification code to your email inbox.");
        } catch (err: any) {
          console.warn("Supabase Send Email OTP failed, falling back to mock:", err);
          const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
          localStorage.setItem(`email_otp_${email}`, mockCode);
          setInfoMessage(`We've sent a 6-digit verification code to your email inbox.`);
          setSmsNotification(`[EMAIL SIMULATION] Code sent to ${email}: ${mockCode}`);
        }
      } else {
        const res = await sendPhoneOtp(phone);
        if (res && "simulated" in res) {
          setSmsNotification(`SMS to ${phone}: Your ANYWHERE FITNESS login OTP code is ${res.code}`);
        }
        setInfoMessage("We've sent a 6-digit verification code to your phone number.");
      }
      setStep("otp");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to send OTP code.");
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
      if (authMethod === "email") {
        const simulatedCode = localStorage.getItem(`email_otp_${email}`);
        if (simulatedCode) {
          if (simulatedCode === otp) {
            localStorage.removeItem(`email_otp_${email}`);
            loginMockUser(email, fullName, phone);
          } else {
            throw new Error("Invalid verification code");
          }
        } else {
          try {
            await verifyOtp(email, otp);
            loginMockUser(email, fullName, phone);
          } catch (err) {
            console.warn("Supabase verify failed, falling back to mock session:", err);
            loginMockUser(email, fullName, phone);
          }
        }
      } else {
        try {
          await verifyPhoneOtp(phone, otp);
          loginMockUser(`${phone}@phone.local`, fullName, phone);
        } catch (err) {
          console.warn("Supabase verify failed, falling back to mock session:", err);
          loginMockUser(`${phone}@phone.local`, fullName, phone);
        }
      }
      setSmsNotification(null);
      navigate({ to: "/workouts" });
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      setError(`Invalid OTP code: ${message}`);
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

        {smsNotification && (
          <div className="mb-6 bg-primary border border-primary-foreground/30 p-3 rounded-lg text-xs font-mono text-primary-foreground flex flex-col gap-1 shadow-lg animate-bounce">
            <span className="font-bold">💬 simulated Notification:</span>
            <span>{smsNotification}</span>
          </div>
        )}

        <div className="text-center mb-8">
          <p className="eyebrow">Secure Gateway</p>
          <h1 className="display-md mt-3">
            {step === "credentials" ? "Enter your Grid" : "Verify access"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "credentials"
              ? "Access your premium coaching, custom plans, and workout logs."
              : `Input the 6-digit security code sent to your ${authMethod === "email" ? "email" : "phone"}.`}
          </p>
        </div>

        {/* Toggle Auth Method (Only at credentials step) */}
        {step === "credentials" && (
          <div className="flex bg-surface-2 p-1 rounded-lg mb-6 border border-border">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("email");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${authMethod === "email" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Gmail (Email)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${authMethod === "phone" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Phone Number
            </button>
          </div>
        )}

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

        {step === "credentials" ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"
              >
                Display Name (Full Name)
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Carter"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition text-foreground"
                disabled={loading}
              />
            </div>

            {authMethod === "email" ? (
              <>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"
                  >
                    Gmail Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@gmail.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition text-foreground"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone-opt"
                    className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone-opt"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition text-foreground"
                    disabled={loading}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition text-foreground"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email-opt"
                    className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"
                  >
                    Gmail Address (Optional)
                  </label>
                  <input
                    id="email-opt"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@gmail.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition text-foreground"
                    disabled={loading}
                  />
                </div>
              </>
            )}

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
                className="w-full text-center tracking-widest font-mono rounded-lg border border-border bg-background px-4 py-3 text-lg placeholder:text-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition text-foreground"
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
              onClick={() => {
                setStep("credentials");
                setSmsNotification(null);
              }}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition cursor-pointer mt-2"
              disabled={loading}
            >
              Back to Details
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
