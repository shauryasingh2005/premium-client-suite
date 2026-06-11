import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Section } from "@/components/Section";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ANYWHERE FITNESS" },
      {
        name: "description",
        content:
          "Start free. Upgrade to Anywhere Fitness Pro for unlimited AI plans, nutrition, live trainer sessions and 1-1 coach messaging.",
      },
      { property: "og:title", content: "Pricing — Anywhere Fitness Pro" },
      { property: "og:description", content: "Freemium. Cancel anytime." },
    ],
  }),
  component: PricingPage,
});

const FEATURES_FREE = [
  "Access to 50 starter workouts",
  "1 AI-generated plan / month",
  "Basic progress tracking",
  "Community feed access",
  "Water intake reminders",
];

const FEATURES_PRO = [
  "Full library — 500+ workouts",
  "Unlimited AI plans & recalibration",
  "Personalised diet plans + grocery lists",
  "Barcode + Indian food database",
  "Weekly adaptive coaching",
  "Live trainer sessions",
  "1-1 in-app coach messaging",
  "Offline downloads",
  "Exportable PDF progress reports",
];

function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [utr, setUtr] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // GPay Phone OTP Verification States
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  const monthly = 499;
  const annualMo = 299;
  const yearly = annualMo * 12;

  const handleSendPhoneOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setOtpError("Please enter a valid 10-digit phone number.");
      return;
    }
    setOtpError(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPhoneOtp(code);
    setOtpSent(true);
    // Simulate SMS notification popup
    setSmsNotification(`SMS to ${phone}: Your ANYWHERE FITNESS GPay subscription OTP code is ${code}`);
  };

  const handleVerifyPhoneOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (phoneOtp === generatedPhoneOtp) {
      setPhoneVerified(true);
      setOtpError(null);
      setSmsNotification(null);
    } else {
      setOtpError("Invalid Phone OTP code. Please check the code provided above.");
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneVerified) {
      setOtpError("GPay Phone OTP verification is required to subscribe.");
      return;
    }
    if (utr.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Start free. Upgrade when you’re ready."
        lead="No credit card to try. Cancel anytime. Pro pays for itself the first week you stop buying a trainer."
      />

      <Section className="!pt-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-2 rounded-full text-sm transition ${!annual ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${annual ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}
          >
            Annual{" "}
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${annual ? "bg-background/20" : "bg-primary/15 text-primary"}`}
            >
              SAVE 40%
            </span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* FREE */}
          <div className="card-surface p-9 flex flex-col">
            <div>
              <p className="eyebrow">ANYWHERE FITNESS Free</p>
              <p className="mt-5 mono-num text-6xl">₹0</p>
              <p className="text-xs text-muted-foreground mt-1">Forever. Get the habit started.</p>
            </div>
            <ul className="mt-8 space-y-3 text-sm flex-1">
              {FEATURES_FREE.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => alert("Free plan activated! Welcome to ANYWHERE FITNESS.")}
              className="btn-ghost mt-10 w-full"
            >
              Activate Free
            </button>
          </div>

          {/* PRO */}
          <div
            className="relative p-9 rounded-2xl border border-primary/40 grain"
            style={{
              background: "linear-gradient(160deg, oklch(0.22 0.03 240), oklch(0.16 0.012 240))",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <span className="absolute -top-3 left-9 mono-num text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-primary text-primary-foreground">
              Most popular
            </span>
            <p className="eyebrow">ANYWHERE FITNESS Pro</p>
            <div className="mt-5 flex items-baseline gap-2">
              <p className="mono-num text-6xl text-foreground">₹{annual ? annualMo : monthly}</p>
              <p className="text-sm text-muted-foreground">/ month</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {annual ? (
                <>
                  Billed ₹{yearly}/year · ₹{(monthly - annualMo) * 12} saved
                </>
              ) : (
                <>Cancel anytime</>
              )}
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {FEATURES_PRO.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1 text-primary">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowPayment(true)} className="btn-primary mt-10 w-full">
              Upgrade to Pro Now
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Payments secured via instant UPI QR Code verification. Prices include applicable taxes.
        </p>
      </Section>

      {/* UPI QR PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="card-surface p-6 md:p-8 max-w-md w-full relative bg-surface border-primary/30 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setShowPayment(false);
                setSubmitted(false);
                setUtr("");
                setPhone("");
                setOtpSent(false);
                setPhoneOtp("");
                setPhoneVerified(false);
                setOtpError(null);
                setSmsNotification(null);
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl font-bold font-mono"
            >
              ✕
            </button>

            {smsNotification && (
              <div className="absolute top-2 left-6 right-6 z-50 bg-primary border border-primary-foreground/30 p-3 rounded-lg text-xs font-mono text-primary-foreground flex flex-col gap-1 shadow-lg animate-bounce">
                <span className="font-bold">💬 SMS Notification Simulation:</span>
                <span>{smsNotification}</span>
              </div>
            )}

            {!submitted ? (
              <div className="text-center">
                <h3 className="display-md text-primary">Google Pay Subscription</h3>
                <p className="text-xs text-muted-foreground mt-2 mb-6">
                  Verify your Google Pay linked phone number with a 6-digit SMS OTP to continue.
                </p>

                {otpError && (
                  <div className="mb-4 text-xs bg-destructive/15 border border-destructive/30 p-2.5 rounded text-destructive-foreground text-left">
                    {otpError}
                  </div>
                )}

                {!phoneVerified ? (
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        Google Pay Phone Number
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          disabled={otpSent}
                          className="flex-1 bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                        {!otpSent && (
                          <button
                            type="button"
                            onClick={handleSendPhoneOtp}
                            className="btn-primary text-xs !py-2.5"
                          >
                            Send OTP
                          </button>
                        )}
                      </div>
                    </div>

                    {otpSent && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                            Enter SMS OTP
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={phoneOtp}
                            onChange={(e) => setPhoneOtp(e.target.value)}
                            placeholder="123456"
                            className="w-full text-center tracking-widest font-mono bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setPhoneOtp("");
                            }}
                            className="btn-ghost text-xs flex-1 !py-2"
                          >
                            Change Number
                          </button>
                          <button
                            type="button"
                            onClick={handleVerifyPhoneOtp}
                            className="btn-primary text-xs flex-1 !py-2"
                          >
                            Verify OTP
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-4 bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-xs text-green-400 font-semibold flex items-center justify-center gap-1.5">
                      ✓ GPay Phone Number Verified ({phone})
                    </div>

                    <div className="mx-auto max-w-[200px] border border-border p-2 bg-white rounded-2xl mb-4">
                      <img
                        src="/upi-qr.jpg"
                        alt="Payment QR Code"
                        className="w-full h-auto object-contain rounded-xl"
                      />
                    </div>

                    <p className="text-xs font-mono bg-surface-2 py-2 px-3 rounded text-primary mb-4">
                      UPI ID: shauryasinghthakur108@oksbi
                    </p>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                          Enter UPI Transaction ID / UTR
                        </label>
                        <input
                          type="text"
                          required
                          value={utr}
                          onChange={(e) => setUtr(e.target.value)}
                          placeholder="e.g. 12-digit reference number"
                          className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <button type="submit" className="btn-primary w-full mt-2">
                        Submit for Verification
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✓
                </div>
                <h3 className="display-md text-primary">Payment Submitted</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Your reference ID{" "}
                  <span className="font-mono text-foreground font-semibold">{utr}</span> has been
                  submitted. Our team will verify the payment and activate your Pro subscription
                  within 15 minutes!
                </p>
                <button
                  onClick={() => {
                    setShowPayment(false);
                    setSubmitted(false);
                    setUtr("");
                  }}
                  className="btn-ghost mt-6 w-full text-xs"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAQ */}
      <Section className="!pt-0">
        <p className="eyebrow text-center">FAQ</p>
        <h2 className="display-lg text-center mt-4">Answers, fast.</h2>
        <div className="mt-12 max-w-3xl mx-auto divide-y divide-border border-y border-border">
          {[
            {
              q: "Is there a free trial?",
              a: "Yes — 7 days of full Pro access. No credit card required for the Free tier.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel from the app in two taps. You keep Pro access through the end of your billing period.",
            },
            {
              q: "Does it work without a gym?",
              a: "Absolutely. The AI builds plans around the equipment you tell it you have — including none.",
            },
            {
              q: "Is the content in Hindi?",
              a: "Yes. Anywhere Fitness launches with Hindi and English. More Indian languages roll out in Phase 2.",
            },
            {
              q: "Is my health data safe?",
              a: "End-to-end encrypted, SOC 2 Type II compliant, and GDPR-ready. We never sell health data — full stop.",
            },
          ].map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-medium">{item.q}</span>
                <span className="text-primary text-xl transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
