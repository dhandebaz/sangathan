import { test, expect } from '@playwright/test';

const routes = [
  { path: '/en', title: 'Sangathan' },
  { path: '/en/solutions', title: 'Civic Solutions' },
  { path: '/en/compare', title: 'Sangathan vs Other Apps' },
  { path: '/en/features', title: 'Features | Sangathan' },
  { path: '/en/about', title: 'About' },
  { path: '/en/transparency', title: 'Transparency' },
  { path: '/en/changelog', title: 'Changelog' },
  { path: '/hi', title: 'संगठन' },
  { path: '/hi/solutions', title: 'नागरिक समाधान' },
  { path: '/hi/compare', title: 'ऐप तुलना' },
  { path: '/hi/features', title: 'सुविधाएं' },
  { path: '/hi/about', title: 'हमारे बारे में' },
  { path: '/hi/transparency', title: 'पारदर्शिता' },
  { path: '/hi/changelog', title: 'परिवर्तन लॉग' },
];

for (const route of routes) {
  test(`[smoke] ${route.path} loads successfully`, async ({ page }) => {
    await page.goto(route.path);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(new RegExp(route.title));
    // Verify no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await expect(errors.length).toBe(0);
  });
}