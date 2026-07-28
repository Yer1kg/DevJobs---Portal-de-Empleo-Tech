import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Esto permite usar describe, it y expect sin imports
  },
})