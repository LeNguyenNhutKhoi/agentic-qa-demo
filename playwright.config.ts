import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: 'tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    headless: process.env.HEADLESS === '1',
    launchOptions: { slowMo: process.env.HEADLESS === '1' ? 0 : 400 },
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
})
