import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AuthProvider, useAuth } from "../lib/auth-context";
import { ChatAssistant } from "../components/ChatAssistant";


import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="display-lg mt-4">Off-route</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          That page doesn’t exist on the ANYWHERE FITNESS grid. Let’s get you back on the program.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-primary">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error("Root boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">System error</p>
        <h1 className="display-lg mt-4">Something failed</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          We hit an unexpected error. Reload to retry.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn-ghost">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ANYWHERE FITNESS — Build Your Best Self" },
      {
        name: "description",
        content:
          "Adaptive fitness & nutrition. 500+ workouts, custom plans, personalized coaching, and India-first meal plans in one premium app.",
      },
      { property: "og:title", content: "ANYWHERE FITNESS — Build Your Best Self" },
      {
        property: "og:description",
        content:
          "Adaptive fitness & nutrition built for every level. Personal trainer in your pocket.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0e1626" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const navLinks = [
  { to: "/workouts", label: "Workouts" },
  { to: "/programs", label: "Programs" },
  { to: "/nutrition", label: "Nutrition" },
  { to: "/smart-coach", label: "Smart Coach" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-md"
            style={{ background: "var(--gradient-ember)" }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-background"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M6 4v16M18 4v16M3 9h3M3 15h3M18 9h3M18 15h3M6 12h12" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-2xl tracking-wide leading-none pt-1">
            ANYWHERE FITNESS
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "px-3.5 py-2 text-sm text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span
                className="text-xs text-muted-foreground max-w-[200px] truncate"
                title={`${user.user_metadata?.full_name || user.email}${user.phone ? ` (${user.phone})` : ""}`}
              >
                {user.user_metadata?.full_name || user.email}
                {user.phone && <span className="text-[10px] opacity-70 block">{user.phone}</span>}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-primary hover:underline transition cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Sign in
            </Link>
          )}
          <Link to="/pricing" className="btn-primary !py-2.5 !px-4 text-xs">
            Get the app
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Menu" className="md:hidden p-2 -mr-2">
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-foreground" />
            <span className="block h-0.5 w-6 bg-foreground" />
          </div>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="py-2.5 text-xs text-muted-foreground truncate">
                  Logged in: {user.user_metadata?.full_name || user.email}
                  {user.phone && ` (${user.phone})`}
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="py-2.5 text-sm text-left text-primary hover:underline"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Link>
            )}
            <Link to="/pricing" onClick={() => setOpen(false)} className="btn-primary mt-3 !w-fit">
              Get the app
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="container-x py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-md"
                style={{ background: "var(--gradient-ember)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-background"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    d="M6 4v16M18 4v16M3 9h3M3 15h3M18 9h3M18 15h3M6 12h12"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="font-display text-2xl pt-1">ANYWHERE FITNESS</span>
            </div>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Your personalized fitness & nutrition companion. Built in India for the world.
            </p>
            <p className="mt-6 eyebrow">Build Your Best Self</p>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground/70 mb-4">
                Product
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/workouts" className="hover:text-primary">
                    Workouts
                  </Link>
                </li>
                <li>
                  <Link to="/programs" className="hover:text-primary">
                    Programs
                  </Link>
                </li>
                <li>
                  <Link to="/nutrition" className="hover:text-primary">
                    Nutrition
                  </Link>
                </li>
                <li>
                  <Link to="/smart-coach" className="hover:text-primary">
                    Smart Coach
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground/70 mb-4">
                Company
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Press kit
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground/70 mb-4">
                Legal
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    SOC 2
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hairline mt-16 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ANYWHERE FITNESS Technologies Pvt. Ltd. All rights
            reserved.
          </p>
          <p className="font-mono">v1.0 — India · English / हिंदी</p>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <ChatAssistant />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
