import { test, expect } from '@playwright/test';

test.describe('Sangathan Platform Features Page', () => {
  test('1. Verify features page loads successfully with correct title and initial default state (Civic Collectives tab selected)', async ({ page }) => {
    await page.goto('/en/features');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/Features & Movement Tools/);
    await expect(page.getByRole('heading', { name: 'Every Tool an Organizer Needs to Build Power and Win.' })).toBeVisible();

    // Civic Collectives tab should be active by default (orgs[0]).
    const civicTabButton = page.getByRole('button', { name: 'Civic Collectives & Grassroots Movements' });
    await expect(civicTabButton).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Civic Collectives & Grassroots Movements', exact: true }).filter({ visible: true })).toBeVisible();

    const isMobile = page.viewportSize()!.width < 1024;
    if (isMobile) {
      const defaultAccordionHeader = page.getByRole('button', { name: 'Smart Organization-Specific Parent Feature Hubs' });
      await expect(defaultAccordionHeader).toBeVisible();
    } else {
      const featureItem = page.locator('.hidden.lg\\:grid button', { hasText: 'Smart Organization-Specific Parent Feature Hubs' }).first();
      await expect(featureItem).toBeVisible();

      const detailHeading = page.locator('.hidden.lg\\:grid h3', { hasText: 'Smart Organization-Specific Parent Feature Hubs' }).first();
      await expect(detailHeading).toBeVisible();
    }
  });

  test('2. Verify switching between organization tabs reveals respective categories and features', async ({ page }) => {
    await page.goto('/en/features');
    await page.waitForLoadState('networkidle');

    const isMobile = page.viewportSize()!.width < 1024;

    // --- Switch to Registered NGO ---
    const ngoTab = page.getByRole('button', { name: 'Registered Non-Governmental Organisations' });
    await expect(ngoTab).toBeVisible();
    await ngoTab.click();

    await expect(page.getByRole('heading', { name: 'Registered Non-Governmental Organisations', exact: true }).filter({ visible: true })).toBeVisible();

    if (isMobile) {
      await expect(page.locator('.lg\\:hidden button', { hasText: 'Donor CRM Database' })).toBeVisible();
    } else {
      await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Donor CRM Database' }).first()).toBeVisible();
    }

    // --- Switch back to Civic Collectives ---
    const civicTab = page.getByRole('button', { name: 'Civic Collectives & Grassroots Movements' });
    await expect(civicTab).toBeVisible();
    await civicTab.click();

    await expect(page.getByRole('heading', { name: 'Civic Collectives & Grassroots Movements', exact: true }).filter({ visible: true })).toBeVisible();

    if (isMobile) {
      await expect(page.locator('.lg\\:hidden button', { hasText: 'Field Spot Audits & Sensor Logger' })).toBeVisible();
    } else {
      await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Field Spot Audits & Sensor Logger' }).first()).toBeVisible();
    }
  });

  test('3. Verify deep linking via URL hash values sets correct active tab', async ({ page }) => {
    await page.goto('/en/features#ngo');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Registered Non-Governmental Organisations', exact: true }).filter({ visible: true })).toBeVisible();

    const isMobile = page.viewportSize()!.width < 1024;
    if (isMobile) {
      await expect(page.locator('.lg\\:hidden button', { hasText: 'Donor CRM Database' })).toBeVisible();
    } else {
      await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Donor CRM Database' }).first()).toBeVisible();
    }
  });

  test('4. Verify bilingual page titles and text rendering (English and Hindi)', async ({ page }) => {
    await page.goto('/en/features');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Features & Movement Tools/);
    await expect(page.getByRole('heading', { name: 'Every Tool an Organizer Needs to Build Power and Win.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Registered Non-Governmental Organisations' })).toBeVisible();

    await page.goto('/hi/features');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/नागरिक सुविधाएं/);
    await expect(page.getByRole('heading', { name: 'हर आंदोलनकारी और नागरिक समूह की डिजिटल ताकत' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'पंजीकृत स्वयंसेवी संगठन (NGO)' })).toBeVisible();
  });

  test('5. Verify clicking on a feature item dynamically updates detail panel / accordion', async ({ page }) => {
    await page.goto('/en/features');
    await page.waitForLoadState('networkidle');

    const isMobile = page.viewportSize()!.width < 1024;

    if (isMobile) {
      const ngoTab = page.getByRole('button', { name: 'Registered Non-Governmental Organisations' });
      await ngoTab.click();

      const accordionHeader = page.locator('.lg\\:hidden button', { hasText: 'Tax Receipts Automation' });
      await expect(accordionHeader).toBeVisible();
      await accordionHeader.click();

      const descText = page.locator('.lg\\:hidden p', { hasText: 'Generate sequentially-numbered 80G/12A-ready PDF receipts for donors' });
      await expect(descText).toBeVisible();
    } else {
      const ngoTab = page.getByRole('button', { name: 'Registered Non-Governmental Organisations' });
      await ngoTab.click();

      const featureBtn = page.locator('.hidden.lg\\:grid button', { hasText: 'Tax Receipts Automation' }).first();
      await expect(featureBtn).toBeVisible();
      await featureBtn.click();

      const detailHeading = page.locator('.hidden.lg\\:grid h3', { hasText: 'Tax Receipts Automation' }).first();
      await expect(detailHeading).toBeVisible();

      const detailDesc = page.locator('.hidden.lg\\:grid p', { hasText: 'Generate sequentially-numbered 80G/12A-ready PDF receipts for donors' }).first();
      await expect(detailDesc).toBeVisible();
    }
  });
});