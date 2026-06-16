import { test, expect } from '@playwright/test';

test.describe('Sangathan Platform Authentication', () => {
  test('should navigate to the login page and show the correct language', async ({ page }) => {
    await page.goto('/en/login');
    await expect(page).toHaveTitle(/Sangathan/);
    
    // Check if the login form renders
    await expect(page.getByRole('heading', { name: 'Log in to Sangathan' })).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('should fail login with invalid credentials gracefully', async ({ page }) => {
    await page.goto('/en/login');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword123');
    await page.click('button[type="submit"]');

    // Wait for the error toast or text
    await expect(page.getByText('Invalid login credentials')).toBeVisible();
  });
});
