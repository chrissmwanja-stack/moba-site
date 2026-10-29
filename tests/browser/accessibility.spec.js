import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { publicRoutes } from './routes.js'

for (const route of publicRoutes) {
  test(`WCAG A/AA automated checks: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('main h1')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // This single aria-hidden watermark is decorative by design and conveys no information.
      .exclude('#about-founding-year-watermark')
      .analyze()

    const details = results.violations.map(violation => [
      `${violation.id} (${violation.impact}): ${violation.help}`,
      ...violation.nodes.map(node => `  ${node.target.join(' ')}\n  ${node.failureSummary || node.html}`),
    ].join('\n')).join('\n\n')

    expect(results.violations, details).toEqual([])
  })
}
