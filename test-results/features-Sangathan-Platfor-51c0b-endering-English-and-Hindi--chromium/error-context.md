# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: features.spec.ts >> Sangathan Platform Features Page >> 4. Verify bilingual page titles and text rendering (English and Hindi)
- Location: tests\e2e\features.spec.ts:118:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Features \| Sangathan/
Received string:  "Sangathan"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × unexpected value "Sangathan"

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- heading "Page Not Found" [level=3]
- paragraph: We couldn't find the page you're looking for. It might have been moved or deleted.
- link "Go Home":
  - /url: /
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  22  |     const isMobile = page.viewportSize()!.width < 1024;
  23  |     if (isMobile) {
  24  |       // In mobile accordion, check if default accordion header is visible
  25  |       const defaultAccordionHeader = page.getByRole('button', { name: 'Donor CRM Database' });
  26  |       await expect(defaultAccordionHeader).toBeVisible();
  27  |       
  28  |       // And since it is active, the description should be visible inside the mobile container
  29  |       const descText = page.locator('.lg\\:hidden p', { hasText: 'Centralized profiles, giving history, and engagement tracking.' });
  30  |       await expect(descText).toBeVisible();
  31  |     } else {
  32  |       // In desktop view, check left pane has Donor CRM Database
  33  |       const featureItem = page.locator('.hidden.lg\\:grid button', { hasText: 'Donor CRM Database' }).first();
  34  |       await expect(featureItem).toBeVisible();
  35  |       
  36  |       // Check right pane detail panel shows the feature title and description
  37  |       const detailHeading = page.locator('.hidden.lg\\:grid h3', { hasText: 'Donor CRM Database' }).first();
  38  |       await expect(detailHeading).toBeVisible();
  39  |       
  40  |       const detailDesc = page.locator('.hidden.lg\\:grid p', { hasText: 'Centralized profiles, giving history, and engagement tracking.' }).first();
  41  |       await expect(detailDesc).toBeVisible();
  42  |     }
  43  |   });
  44  | 
  45  |   test('2. Verify switching between organization tabs reveals respective categories and features', async ({ page }) => {
  46  |     await page.goto('/en/features');
  47  |     await page.waitForLoadState('networkidle');
  48  | 
  49  |     const isMobile = page.viewportSize()!.width < 1024;
  50  | 
  51  |     // --- Switch to Student Unions ---
  52  |     const studentUnionTab = page.getByRole('button', { name: 'Student Unions' });
  53  |     await expect(studentUnionTab).toBeVisible();
  54  |     await studentUnionTab.click();
  55  | 
  56  |     // Verify Student Unions heading is visible in the hero card
  57  |     await expect(page.getByRole('heading', { name: 'Student Unions', exact: true }).filter({ visible: true })).toBeVisible();
  58  |     
  59  |     if (isMobile) {
  60  |       await expect(page.locator('.lg\\:hidden button', { hasText: 'Central Student DB' })).toBeVisible();
  61  |     } else {
  62  |       await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Central Student DB' }).first()).toBeVisible();
  63  |     }
  64  | 
  65  |     // --- Switch to Workers Unions ---
  66  |     const workerUnionTab = page.getByRole('button', { name: 'Workers Unions' });
  67  |     await expect(workerUnionTab).toBeVisible();
  68  |     await workerUnionTab.click();
  69  | 
  70  |     // Verify Workers Unions heading is visible in the hero card
  71  |     await expect(page.getByRole('heading', { name: 'Workers Unions', exact: true }).filter({ visible: true })).toBeVisible();
  72  |     
  73  |     if (isMobile) {
  74  |       await expect(page.locator('.lg\\:hidden button', { hasText: 'Member Database' })).toBeVisible();
  75  |     } else {
  76  |       await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Member Database' }).first()).toBeVisible();
  77  |     }
  78  | 
  79  |     // --- Switch to Resident Welfare Associations ---
  80  |     const rwaTab = page.getByRole('button', { name: 'Resident Welfare Associations' });
  81  |     await expect(rwaTab).toBeVisible();
  82  |     await rwaTab.click();
  83  | 
  84  |     // Verify Resident Welfare Associations heading is visible in the hero card
  85  |     await expect(page.getByRole('heading', { name: 'Resident Welfare Associations', exact: true }).filter({ visible: true })).toBeVisible();
  86  |     
  87  |     if (isMobile) {
  88  |       await expect(page.locator('.lg\\:hidden button', { hasText: 'Maintenance Billing' })).toBeVisible();
  89  |     } else {
  90  |       await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Maintenance Billing' }).first()).toBeVisible();
  91  |     }
  92  |   });
  93  | 
  94  |   test('3. Verify deep linking via URL hash values sets correct active tab', async ({ page }) => {
  95  |     // Navigate with hash for student-union
  96  |     await page.goto('/en/features#student-union');
  97  |     await page.waitForLoadState('networkidle');
  98  |     await expect(page.getByRole('heading', { name: 'Student Unions', exact: true }).filter({ visible: true })).toBeVisible();
  99  |     
  100 |     const isMobile = page.viewportSize()!.width < 1024;
  101 |     if (isMobile) {
  102 |       await expect(page.locator('.lg\\:hidden button', { hasText: 'Central Student DB' })).toBeVisible();
  103 |     } else {
  104 |       await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Central Student DB' }).first()).toBeVisible();
  105 |     }
  106 | 
  107 |     // Navigate with hash for worker-union in Hindi
  108 |     await page.goto('/hi/features#worker-union');
  109 |     await page.waitForLoadState('networkidle');
  110 |     await expect(page.getByRole('heading', { name: 'श्रमिक संघ', exact: true }).filter({ visible: true })).toBeVisible();
  111 |     if (isMobile) {
  112 |       await expect(page.locator('.lg\\:hidden button', { hasText: 'Member Database' })).toBeVisible();
  113 |     } else {
  114 |       await expect(page.locator('.hidden.lg\\:grid button', { hasText: 'Member Database' }).first()).toBeVisible();
  115 |     }
  116 |   });
  117 | 
  118 |   test('4. Verify bilingual page titles and text rendering (English and Hindi)', async ({ page }) => {
  119 |     // English version
  120 |     await page.goto('/en/features');
  121 |     await page.waitForLoadState('networkidle');
> 122 |     await expect(page).toHaveTitle(/Features \| Sangathan/);
      |                        ^ Error: expect(page).toHaveTitle(expected) failed
  123 |     await expect(page.getByRole('heading', { name: 'Purpose-Built Features for Civic Collectives' })).toBeVisible();
  124 |     await expect(page.getByRole('button', { name: 'Non-Governmental Organisations' })).toBeVisible();
  125 |     
  126 |     // Hindi version
  127 |     await page.goto('/hi/features');
  128 |     await page.waitForLoadState('networkidle');
  129 |     await expect(page).toHaveTitle(/सुविधाएं \| संगठन/);
  130 |     await expect(page.getByRole('heading', { name: 'नागरिक समूहों के लिए तैयार की गई सुविधाएं' })).toBeVisible();
  131 |     await expect(page.getByRole('button', { name: 'गैर सरकारी संगठन (NGO)' })).toBeVisible();
  132 |   });
  133 | 
  134 |   test('5. Verify clicking on a feature item dynamically updates detail panel / accordion', async ({ page }) => {
  135 |     await page.goto('/en/features');
  136 |     await page.waitForLoadState('networkidle');
  137 | 
  138 |     const isMobile = page.viewportSize()!.width < 1024;
  139 | 
  140 |     if (isMobile) {
  141 |       // NGO - click on 'Tax Receipts Automation' accordion
  142 |       const accordionHeader = page.locator('.lg\\:hidden button', { hasText: 'Tax Receipts Automation' });
  143 |       await expect(accordionHeader).toBeVisible();
  144 |       await accordionHeader.click();
  145 |       
  146 |       // The content of the accordion should be visible now inside the mobile container
  147 |       const descText = page.locator('.lg\\:hidden p', { hasText: 'Auto-generate 80G/501c3 compliant tax receipts for donors.' });
  148 |       await expect(descText).toBeVisible();
  149 |     } else {
  150 |       // NGO - verify default detail panel is Donor CRM Database
  151 |       await expect(page.locator('.hidden.lg\\:grid h3', { hasText: 'Donor CRM Database' }).first()).toBeVisible();
  152 |       
  153 |       // Click 'Tax Receipts Automation' feature in left panel
  154 |       const featureBtn = page.locator('.hidden.lg\\:grid button', { hasText: 'Tax Receipts Automation' }).first();
  155 |       await expect(featureBtn).toBeVisible();
  156 |       await featureBtn.click();
  157 |       
  158 |       // Verify detail panel updates to 'Tax Receipts Automation'
  159 |       const detailHeading = page.locator('.hidden.lg\\:grid h3', { hasText: 'Tax Receipts Automation' }).first();
  160 |       await expect(detailHeading).toBeVisible();
  161 |       
  162 |       const detailDesc = page.locator('.hidden.lg\\:grid p', { hasText: 'Auto-generate 80G/501c3 compliant tax receipts for donors.' }).first();
  163 |       await expect(detailDesc).toBeVisible();
  164 |     }
  165 |   });
  166 | });
  167 | 
```