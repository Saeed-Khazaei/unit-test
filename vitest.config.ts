import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    // coverage: {
    //   reporter: ["text", "json", "html"],
    // },

    onConsoleLog(log) {
      if (log.includes("Download the Vue Devtools extension")) return false;
      if (log.includes("Lit is in dev mode.")) return false;
    },
  },
});
