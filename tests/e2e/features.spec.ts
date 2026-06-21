import { test, expect } from '@playwright/test';

test.describe('Sangathan Platform Features Page', () => {
  test('1. Verify features page loads successfully with correct title and initial default state (NGO tab selected)', async ({ page }) => {
    // Navigate to English version of the features page
    await page.goto('/en/features');
    await page.waitForLoadState('networkidle');
    
    // Verify title
    await expect(page).toHaveTitle(/Features \| Sangathan/);
    
    // Verify header heading
    await expect(page.getByRole('heading', { name: 'Purpose-Built Features for Civic Collectives' })).toBeVisible();

    // NGO tab should be active by default.
    const ngoTabButton = page.getByRole('button', { name: 'Non-Governmental Organisations' });
    await expect(ngoTabButton).toBeVisible();
    
    // Verify the NGO heading in the content hero (which is visible on all viewports)
    await expect(page.getByRole('heading', { name: 'Non-Governmental Organisations', exact: true }).filter({ visible: true })).toBeVisible();
    
    const isMobile = page.viewportSize()!.width < 1024;
    if (isMobile) {
      // In mobile accordion, check if default accordion header is visible
      const defaultAccordionHeader = page.getByRole('button', { name: 'Donor CRM Database' });
      await expect(defaultAccordionHeader).toBeVisible();
      
      // And since it is active, the description should be visible inside the mobile container
      const descText = page.locator('.lg\\:hidden p', { hasText: 'Centralized profiles, giving history, and engagement tracking.' });
      await expect(descText).toBeVisible();
    } else {
      // In desktop view, check left pane has Donor CRM Database
      const featureItem = page.locator('.hidden.lg\\:grid button', { hasText: 'Donor CRM Database' }).first();
      await expect(featureItem).toBeVisible();
      
      // Check right pane detail panel shows the feature title and description
      const detailHeading = page.locator('.hidden.lg\\:grid h3', { hasText: 'Donor CRM Database' }).first();
      await expect(detailHeading).toBeVisible();
      
      const detailDesc = page.locator('.hidden.lg\\:grid p', { hasText: 'Centralized profiles, giving history, and engagement tracking.' }).first();
      await expect(detailDesc).toBeVisible();
    }
  });

  test('2. Verify switching between organization tabs reveals respective categories and features', async ({ page }) => {
    await page.goto('/en/features');
    await page.waitForLoadState('networkidle');

    const isMobile = page.viewportSize()!.width < 1024;

    // --- Switch to Student Unions ---
    const studentUnionTab = page.getByRole('button', { name: 'Student Unions' });
    await expect(studentUnionTab).toBeVisible();
    await studentUnionTab.click();

    // Verify Student Unions heading is visible in the hero card
    await expect(page.getByRole('heading', { name: 'Student Unions', exact: true }).filter({ visible: true })).toBeVisible();
    
    if (isMobile) {
      await expect(page.locator('.lg\\:hidden button', { hasText: 'Central Student DB' })).toBeVisible();
    } else {
      await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Central Student DB' }).first()).toBeVisible();
    }

    // --- Switch to Workers Unions ---
    const workerUnionTab = page.getByRole('button', { name: 'Workers Unions' });
    await expect(workerUnionTab).toBeVisible();
    await workerUnionTab.click();

    // Verify Workers Unions heading is visible in the hero card
    await expect(page.getByRole('heading', { name: 'Workers Unions', exact: true }).filter({ visible: true })).toBeVisible();
    
    if (isMobile) {
      await expect(page.locator('.lg\\:hidden button', { hasText: 'Member Database' })).toBeVisible();
    } else {
      await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Member Database' }).first()).toBeVisible();
    }

    // --- Switch to Resident Welfare Associations ---
    const rwaTab = page.getByRole('button', { name: 'Resident Welfare Associations' });
    await expect(rwaTab).toBeVisible();
    await rwaTab.click();

    // Verify Resident Welfare Associations heading is visible in the hero card
    await expect(page.getByRole('heading', { name: 'Resident Welfare Associations', exact: true }).filter({ visible: true })).toBeVisible();
    
    if (isMobile) {
      await expect(page.locator('.lg\\:hidden button', { hasText: 'Maintenance Billing' })).toBeVisible();
    } else {
      await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Maintenance Billing' }).first()).toBeVisible();
    }
  });

  test('3. Verify deep linking via URL hash values sets correct active tab', async ({ page }) => {
    // Navigate with hash for student-union
    await page.goto('/en/features#student-union');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Student Unions', exact: true }).filter({ visible: true })).toBeVisible();
    
    const isMobile = page.viewportSize()!.width < 1024;
    if (isMobile) {
      await expect(page.locator('.lg\\:hidden button', { hasText: 'Central Student DB' })).toBeVisible();
    } else {
      await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Central Student DB' }).first()).toBeVisible();
    }

    // Navigate with hash for worker-union in Hindi
    await page.goto('/hi/features#worker-union');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'श्रमिक संघ', exact: true }).filter({ visible: true })).toBeVisible();
    if (isMobile) {
      await expect(page.locator('.lg\\:hidden button', { hasText: 'Member Database' })).toBeVisible();
    } else {
      await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Member Database' }).first()).toBeVisible();
    }
  });

  test('4. Verify bilingual page titles and text rendering (English and Hindi)', async ({ page }) => {
    // English version
    await page.goto('/en/features');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Features \| Sangathan/);
    await expect(page.getByRole('heading', { name: 'Purpose-Built Features for Civic Collectives' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Non-Governmental Organisations' })).toBeVisible();
    
    // Hindi version
    await page.goto('/hi/features');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/सुविधाएं \| संगठन/);
    await expect(page.getByRole('heading', { name: 'नागरिक समूहों के लिए तैयार की गई सुविधाएं' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'गैर सरकारी संगठन (NGO)' })).toBeVisible();
  });

  test('5. Verify clicking on a feature item dynamically updates detail panel / accordion', async ({ page }) => {
    await page.goto('/en/features');
    await page.waitForLoadState('networkidle');

    const isMobile = page.viewportSize()!.width < 1024;

    if (isMobile) {
      // NGO - click on 'Tax Receipts Automation' accordion
      const accordionHeader = page.locator('.lg\\:hidden button', { hasText: 'Tax Receipts Automation' });
      await expect(accordionHeader).toBeVisible();
      await accordionHeader.click();
      
      // The content of the accordion should be visible now inside the mobile container
      const descText = page.locator('.lg\\:hidden p', { hasText: 'Auto-generate 80G/501c3 compliant tax receipts for donors.' });
      await expect(descText).toBeVisible();
    } else {
      // NGO - verify default detail panel is Donor CRM Database
      await expect(page.locator('.hidden.lg\\:grid h3', { hasText: 'Donor CRM Database' }).first()).toBeVisible();
      
      // Click 'Tax Receipts Automation' feature in left panel
      const featureBtn = page.locator('.hidden.lg\\:grid button', { hasText: 'Tax Receipts Automation' }).first();
      await expect(featureBtn).toBeVisible();
      await featureBtn.click();
      
      // Verify detail panel updates to 'Tax Receipts Automation'
      const detailHeading = page.locator('.hidden.lg\\:grid h3', { hasText: 'Tax Receipts Automation' }).first();
      await expect(detailHeading).toBeVisible();
      
      const detailDesc = page.locator('.hidden.lg\\:grid p', { hasText: 'Auto-generate 80G/501c3 compliant tax receipts for donors.' }).first();
      await expect(detailDesc).toBeVisible();
    }
  });
});
