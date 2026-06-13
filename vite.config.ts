import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import fs from "node:fs";
import path from "node:path";

function getSentryAuthToken() {
  if (process.env.SENTRY_AUTH_TOKEN) {
    return process.env.SENTRY_AUTH_TOKEN;
  }
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/^SENTRY_AUTH_TOKEN\s*=\s*(.*)$/m);
      if (match && match[1]) {
        return match[1].trim().replace(/^['"]|['"]$/g, "");
      }
    }
  } catch (e) {
    // Ignore
  }
  return undefined;
}

export default defineConfig({
  nitro: true,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      sentryVitePlugin({
        authToken: getSentryAuthToken(),
        org: "shaurya-singh-1o",
        project: "react",
      }),
    ],
    build: {
      sourcemap: true,
    },
  },
});

