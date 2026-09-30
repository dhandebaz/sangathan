import { test, expect } from '@playwright/test';

const routes = [
  { path: '/en', title: 'Sangathan - Digital Operating System' },
  { path: '/en/solutions', title: 'Civic Solutions & Movement Archetypes' },
  { path: '/en/compare', title: 'Sangathan vs Other Apps' },
  { path: '/en/features', title: 'Features & Movement Tools' },
  { path: '/en/about', title: 'About Us' },
  { path: '/en/transparency', title: 'Transparency & Governance' },
  { path: '/en/changelog', title: 'Changelog | Sangathan' },
  { path: '/hi', title: 'संगठन - नागरिक समूहों' },
  { path: '/hi/solutions', title: 'नागरिक समाधान व संगठन प्रकार' },
  { path: '/hi/compare', title: 'ऐप तुलना व विकल्प' },
  { path: '/hi/features', title: 'नागरिक सुविधाएं' },
  { path: '/hi/about', title: 'हमारे बारे में' },
  { path: '/hi/transparency', title: 'पारदर्शिता और शासन' },
  { path: '/hi/changelog', title: 'परिवर्तन लॉग' },
];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

for (const route of routes) {
  test(`[smoke] ${route.path} loads successfully`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(new RegExp(escapeRegExp(route.title)));

    const pageTitle = await page.title();
    expect(pageTitle).not.toContain(' | Sangathan | Sangathan');
    expect(pageTitle).not.toContain(' | संगठन | संगठन');

    expect(errors).toEqual([]);
  });
}
