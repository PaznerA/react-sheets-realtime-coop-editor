import { test, expect } from '@playwright/test';

// Basic tests to verify that the application loads correctly
test.describe('Basic Application Tests', () => {
  test('Homepage should load', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify that the page has loaded
    await expect(page).toHaveTitle(/SpacetimeSheets/);
    
    // Check that the main UI elements are present
    await expect(page.locator('main')).toBeVisible();
  });

  test('Should navigate to editor page', async ({ page }) => {
    // Start from the homepage
    await page.goto('/');
    
    // Click on the first project (if available)
    const projectCard = page.locator('.project-card').first();
    if (await projectCard.isVisible()) {
      await projectCard.click();
      
      // Verify that we're on the editor page
      await expect(page.url()).toContain('/editor/');
      
      // Check that the sheet editor is loaded
      await expect(page.locator('.sheet-editor')).toBeVisible();
    } else {
      // If no projects exist, test should be skipped
      test.skip();
    }
  });

  test('Should handle creating a new project', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Click the create new project button
    await page.locator('button:has-text("New Project")').click();
    
    // Fill out the new project form
    await page.locator('input[name="name"]').fill('Test Project');
    await page.locator('textarea[name="description"]').fill('Created by automated test');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Verify that the project was created
    await expect(page.locator('text=Test Project')).toBeVisible();
  });

  // Test that the enums page loads correctly
  test('Should navigate to enums page', async ({ page }) => {
    await page.goto('/enums');
    
    // Verify that we're on the enums page
    await expect(page.url()).toContain('/enums');
    
    // Check that the enums UI is loaded
    await expect(page.locator('h1:has-text("Enums")')).toBeVisible();
  });
});
