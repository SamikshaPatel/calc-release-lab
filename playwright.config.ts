import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './automation',
  testMatch: '**/*.pw.ts',
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://calc-release-lab-qa.pages.dev',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'api', testDir: './automation/api' },
    { name: 'ui', testDir: './automation/ui', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'ui-mobile',
      testDir: './automation/ui',
      use: { browserName: 'chromium', viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true },
    },
  ],
})
