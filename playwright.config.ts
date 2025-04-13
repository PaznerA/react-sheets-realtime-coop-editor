import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // Fail the build on CI if tests aren't passing
  forbidOnly: !!process.env.CI,
  // Retry failed tests on CI, but not in local development
  retries: process.env.CI ? 2 : 0,
  // Maximum time one test can run for
  timeout: 30 * 1000,
  // Reporter to use
  reporter: 'html',
  
  // Configure browser settings
  use: {
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    // Record video only on failures
    video: 'on-first-retry',
    // Capture screenshots on failure
    screenshot: 'only-on-failure',
    // Base URL to use in all tests
    baseURL: 'http://localhost:5173',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Folder for test artifacts like screenshots and videos
  outputDir: 'test-results/',

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
