import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/mealmate/',  // ← ADD THIS (matches your repository name)
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/tests/setup.js'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            threshold: {
                lines: 30,
                functions: 30,
                branches: 30,
                statements: 30
            }
        }
    }
})