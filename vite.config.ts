import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

// ─── Vite Configuration ────────────────────────────────────────────────────
// Docs: https://vitejs.dev/config/

export default defineConfig(({ mode }) => ({

  // ── Dev Server ────────────────────────────────────────────────────────────
  server: {
    host: "::",
    port: 8080,
  },

  // ── Plugins ───────────────────────────────────────────────────────────────
  plugins: [react()],

  // ── Path Aliases ──────────────────────────────────────────────────────────
  // "@/..." resolves to "src/..."
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ── esbuild (applies to both dev + build) ─────────────────────────────────
  // Drop console/debugger statements in production only
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },

  // ── Production Build ──────────────────────────────────────────────────────
  build: {
    target: "ES2020",
    minify: "esbuild",

    rollupOptions: {
      output: {
        // Split vendor code into named, cache-friendly chunks
        manualChunks: {
          "vendor-react":   ["react", "react-dom"],
          "vendor-routing": ["react-router-dom"],
          "vendor-query":   ["@tanstack/react-query"],
          "vendor-state":   ["zustand", "zustand/middleware"],
          "vendor-motion":  ["framer-motion"],
          "vendor-forms":   ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-charts":  ["recharts"],
          "vendor-http":    ["axios"],
          "vendor-ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-popover",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
        },
        // Predictable output paths for browser caching
        chunkFileNames: "chunks/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? ""
          const ext  = name.split(".").pop() ?? ""
          if (ext === "css") return "css/[name]-[hash].css"
          if (["png", "jpg", "jpeg", "gif", "svg"].includes(ext)) return "images/[name]-[hash][extname]"
          return "assets/[name]-[hash][extname]"
        },
      },
    },

    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    // Hidden source maps in production — useful for error monitoring (e.g. Sentry)
    sourcemap: mode === "production" ? "hidden" : true,
  },

  // ── Dependency Pre-Bundling ───────────────────────────────────────────────
  // Pre-bundle heavy deps so cold starts are fast in development
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "zustand",
      "@tanstack/react-query",
      "zod",
      "axios",
      "recharts",
      "lucide-react",
      "sonner",
    ],
  },

  // ── Vitest Test Configuration ───────────────────────────────────────────────
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}))
