/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const allowedHosts = (env.VITE_ALLOWED_HOSTS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 3000,
      allowedHosts: [
        ".ngrok.io",
        ".ngrok-free.app",
        ...allowedHosts,
      ],
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },
  }
})