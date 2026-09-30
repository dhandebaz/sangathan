import { test, expect } from '@playwright/test';

test.describe('Sangathan Platform Authentication', () => {
  test('should navigate to the login page and show the correct language', async ({ page }) => {
    await page.goto('/en/login');
    await expect(page).toHaveTitle(/Sangathan/);

    // Check if the login form renders
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should fail login with invalid credentials gracefully', async ({ page }) => {
    await page.goto('/en/login');

    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword123');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Graceful failure contract: an error banner with a message must appear.
    // (Exact text varies by environment: Supabase credential errors, lockout
    // messages, or a network failure when a dependency is unreachable.)
    const banner = page.locator('div.bg-red-50').first();
    await expect(banner).toBeVisible({ timeout: 15000 });
    await expect(banner).not.toBeEmpty();
  });
});
