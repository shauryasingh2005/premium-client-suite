import { Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
  title = "Unlock Premium Feature",
  description = "This page contains premium content. Sign in to access guided workouts, customized nutrition plans, and smart coaching.",
}: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
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
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="max-w-md w-full card-surface p-8 sm:p-10 text-center relative overflow-hidden backdrop-blur-md bg-surface/80">
          <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-primary/20 blur-xl pointer-events-none" />

          <p className="eyebrow">Premium Access</p>
          <h2 className="display-md mt-4">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth" className="btn-primary w-full sm:w-auto">
              Sign In with OTP
            </Link>
            <Link to="/pricing" className="btn-ghost w-full sm:w-auto">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
