import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import * as Sentry from "@sentry/react";
import { routeTree } from "./routeTree.gen";

if (typeof window !== "undefined") {
  const scrubPii = (obj: any): any => {
    if (!obj || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(scrubPii);
    const scrubbed: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes("password") ||
          lowerKey.includes("token") ||
          lowerKey.includes("auth") ||
          lowerKey.includes("key") ||
          lowerKey.includes("secret") ||
          lowerKey.includes("credential")
        ) {
          scrubbed[key] = "[REDACTED]";
        } else {
          scrubbed[key] = scrubPii(obj[key]);
        }
      }
    }
    return scrubbed;
  };

  Sentry.init({
    dsn: "https://8b557a6567e59865f986ec2dae792671@o4511559492239360.ingest.us.sentry.io/4511559578025984",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.05,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      if (event.request) {
        if (event.request.headers) {
          event.request.headers = scrubPii(event.request.headers);
        }
        if (event.request.data) {
          event.request.data = scrubPii(event.request.data);
        }
      }
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((breadcrumb: any) => {
          if (breadcrumb.data) {
            breadcrumb.data = scrubPii(breadcrumb.data);
          }
          return breadcrumb;
        });
      }
      if (event.extra) {
        event.extra = scrubPii(event.extra);
      }
      return event;
    },
  });
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

