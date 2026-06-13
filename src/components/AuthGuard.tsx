import { Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { ShieldAlert, LogIn } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
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

  return (
    <>
      {!user && (
        <div className="bg-primary/10 border-b border-primary/20 text-foreground py-3 px-4 text-center text-xs backdrop-blur-md sticky top-16 z-40 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-primary">
              <ShieldAlert className="h-4 w-4" /> Guest Mode Active
            </span>
            <span className="text-muted-foreground">
              You have full access to workouts, diets, and AI tools. Sign in to sync your training calendar and progress logs to the cloud.
            </span>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-background font-bold text-[10px] hover:bg-primary/95 transition uppercase tracking-wider font-mono"
            >
              <LogIn className="h-3 w-3" /> Sign In Now
            </Link>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
