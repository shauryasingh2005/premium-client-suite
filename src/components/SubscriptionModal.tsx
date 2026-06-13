import { useState } from "react";
import { X, Check, ShieldCheck, QrCode, ClipboardCopy, Send } from "lucide-react";
import gpayQr from "@/assets/gpay.jpeg";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (intakeAnswers: any) => void;
}

export function SubscriptionModal({ isOpen, onClose, onSuccess }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "threeMonth" | "yearly">("yearly");
  const [checkoutStep, setCheckoutStep] = useState<"options" | "payment" | "intake">("options");
  
  // Intake Form states
  const [intakeGoal, setIntakeGoal] = useState("");
  const [intakeDiet, setIntakeDiet] = useState("Balanced");
  const [intakeSchedule, setIntakeSchedule] = useState("4 Days / Week");
  const [intakeMedical, setIntakeMedical] = useState("");

  if (!isOpen) return null;

  const handleConfirmPayment = () => {
    if (selectedPlan === "yearly") {
      setCheckoutStep("intake");
    } else {
      onSuccess({ goal: "General", diet: "Standard", schedule: "Standard", medical: "None" });
      onClose();
    }
  };

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      goal: intakeGoal,
      diet: intakeDiet,
      schedule: intakeSchedule,
      medical: intakeMedical,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      <div className="card-surface w-full max-w-2xl bg-surface/95 border border-primary/20 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="border-b border-border p-5 flex justify-between items-center bg-surface-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-display text-xl tracking-wider uppercase text-foreground">
              {checkoutStep === "options" && "WarriorForge Premium OS"}
              {checkoutStep === "payment" && "UPI Google Pay Checkout"}
              {checkoutStep === "intake" && "Elite Athlete Intake Form"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface rounded-lg transition text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {checkoutStep === "options" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="eyebrow">Level Up Your Training</p>
                <h4 className="text-xl font-bold text-foreground">Unlock Advanced Core Features</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Unlock advanced micronutrient meal plans, customized hydration curves, and database syncing to save your weekly progress.
                </p>
              </div>

              {/* TIER CARDS */}
              <div className="grid sm:grid-cols-3 gap-4">
                {/* MONTHLY */}
                <div
                  onClick={() => setSelectedPlan("monthly")}
                  className={`card-surface p-5 cursor-pointer transition flex flex-col justify-between border ${
                    selectedPlan === "monthly"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div>
                    <h5 className="font-bold text-xs font-mono uppercase text-muted-foreground">Monthly</h5>
                    <p className="mt-3 font-mono text-xl font-black text-foreground">₹199</p>
                    <p className="text-[10px] text-muted-foreground">Billed monthly</p>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-[10px] text-muted-foreground">
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-primary flex-shrink-0" /> Full App Access</li>
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-primary flex-shrink-0" /> Cloud Backup</li>
                  </ul>
                </div>

                {/* 3 MONTHS */}
                <div
                  onClick={() => setSelectedPlan("threeMonth")}
                  className={`card-surface p-5 cursor-pointer transition flex flex-col justify-between border relative ${
                    selectedPlan === "threeMonth"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-primary text-background font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Popular
                  </span>
                  <div>
                    <h5 className="font-bold text-xs font-mono uppercase text-muted-foreground mt-1">3 Months</h5>
                    <p className="mt-3 font-mono text-xl font-black text-foreground">₹299</p>
                    <p className="text-[10px] text-muted-foreground">Billed quarterly</p>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-[10px] text-muted-foreground">
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-primary flex-shrink-0" /> Save ₹298 total</li>
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-primary flex-shrink-0" /> Full App Access</li>
                  </ul>
                </div>

                {/* YEARLY */}
                <div
                  onClick={() => setSelectedPlan("yearly")}
                  className={`card-surface p-5 cursor-pointer transition flex flex-col justify-between border relative ${
                    selectedPlan === "yearly"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-ember text-foreground font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Elite
                  </span>
                  <div>
                    <h5 className="font-bold text-xs font-mono uppercase text-muted-foreground mt-1">1 Year</h5>
                    <p className="mt-3 font-mono text-xl font-black text-foreground">₹599</p>
                    <p className="text-[10px] text-muted-foreground">Billed annually</p>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-[10px] text-muted-foreground">
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-primary flex-shrink-0" /> Elite Intake Form</li>
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-primary flex-shrink-0" /> Custom Diet Analysis</li>
                  </ul>
                </div>
              </div>

              <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-2 text-xs text-muted-foreground">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Advanced Membership Benefits:
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 pl-4 list-disc">
                  <li>Custom micronutrient recovery layer</li>
                  <li>Intelligent EAA (Essential Amino Acids) thali splits</li>
                  <li>HRV CNS recovery tracker scaling</li>
                  <li>AI Chatbot advanced plan details</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setCheckoutStep("payment")}
                className="btn-primary w-full py-3 text-xs font-mono uppercase tracking-wider font-bold"
              >
                Proceed to Checkout
              </button>
            </div>
          )}

          {checkoutStep === "payment" && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-bold text-foreground">Scan QR to Complete Payment</h4>
                <p className="text-xs text-muted-foreground">
                  Scan the UPI code below with Google Pay, PhonePe, or PayTM.
                </p>
              </div>

              {/* QR CODE CONTAINER */}
              <div className="relative border-4 border-primary/20 bg-white p-3 rounded-2xl shadow-xl w-60 h-60 flex items-center justify-center overflow-hidden">
                <img
                  src={gpayQr}
                  alt="Google Pay UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center gap-2 justify-center bg-surface-2 px-4 py-2.5 rounded-lg border border-border">
                  <span className="text-xs font-mono text-foreground font-bold">
                    shauryasinghthakur108@oksbi
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("shauryasinghthakur108@oksbi");
                      alert("UPI ID copied!");
                    }}
                    className="p-1 hover:bg-surface rounded text-primary"
                    title="Copy UPI ID"
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest font-bold text-primary">
                  Amount: ₹{selectedPlan === "monthly" ? "199" : selectedPlan === "threeMonth" ? "299" : "599"}
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("options")}
                  className="btn-ghost flex-1 text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="btn-primary flex-1 text-xs font-mono uppercase tracking-wider font-bold"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          )}

          {checkoutStep === "intake" && (
            <form onSubmit={handleIntakeSubmit} className="space-y-4 text-xs">
              <div className="text-center space-y-1 mb-6">
                <h4 className="text-lg font-bold text-foreground">Welcome to the Elite Tier</h4>
                <p className="text-muted-foreground">
                  Fill out this intake form so we can construct your advanced customized plans.
                </p>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1.5 uppercase tracking-wider">
                  What is your primary athletic goal?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build heavy squat & run a half-marathon, wrestling strength"
                  value={intakeGoal}
                  onChange={(e) => setIntakeGoal(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Advanced Diet Preference
                  </label>
                  <select
                    value={intakeDiet}
                    onChange={(e) => setIntakeDiet(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Advanced Balanced">Advanced Balanced (High recovery)</option>
                    <option value="Advanced Vegan">Advanced Vegan (EAA tracked)</option>
                    <option value="Advanced Carnivore">Advanced Carnivore (CNS anti-inflammatory)</option>
                    <option value="Advanced Keto">Advanced Keto (Cognitive focus)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Weekly Commitment
                  </label>
                  <select
                    value={intakeSchedule}
                    onChange={(e) => setIntakeSchedule(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="3 Days / Week">3 Days / Week (Standard)</option>
                    <option value="4 Days / Week">4 Days / Week (Optimized)</option>
                    <option value="5 Days / Week">5 Days / Week (Elite Split)</option>
                    <option value="6 Days / Week">6 Days / Week (Pehelwani / Akhada)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1.5 uppercase tracking-wider">
                  List any injuries, medical notes, or limitations
                </label>
                <textarea
                  placeholder="e.g. Left knee tendonitis, lactose intolerant, etc."
                  value={intakeMedical}
                  onChange={(e) => setIntakeMedical(e.target.value)}
                  className="w-full h-20 bg-surface-2 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-xs font-mono uppercase tracking-wider font-bold mt-4 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4 text-background" /> Submit Elite Profile
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
