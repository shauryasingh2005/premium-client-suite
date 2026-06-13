import "./lib/error-capture";
import * as Sentry from "@sentry/react";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// Initialize Sentry on the server
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
  tracesSampleRate: 0.05,
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

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  const error = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  console.error(error);
  Sentry.captureException(error);

  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

