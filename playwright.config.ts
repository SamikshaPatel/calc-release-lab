import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './automation',
  testMatch: '**/*.pw.ts',
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://calc-release-lab-qa.pages.dev',
  },
  projects: [{ name: 'api', testDir: './automation/api' }],
})
