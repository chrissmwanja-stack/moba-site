import { test, expect } from '@playwright/test'
import { publicRoutes } from './routes.js'

for (const route of publicRoutes) {
  test(`${route} renders responsively without runtime errors`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
    expect(response.status()).toBe(200)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('main h1')).toHaveCount(1)
    await expect(page).not.toHaveTitle(/Page not found/)

    const layout = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      brokenLoadedImages: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.src),
    }))
    expect(layout.pageWidth, `horizontal overflow on ${route}`).toBeLessThanOrEqual(layout.viewportWidth + 1)
    expect(layout.brokenLoadedImages).toEqual([])
    expect(errors).toEqual([])
  })
}

test('Store adds an item to a persistent cart with the correct price', async ({ page }) => {
  await page.goto('/store')
  const firstCard = page.locator('article').filter({ has: page.getByRole('button', { name: 'Add to cart', exact: true }) }).first()
  await expect(firstCard).toBeVisible()
  const name = await firstCard.locator('h3').innerText()
  const price = await firstCard.locator('.font-bold.text-brand').innerText()
  await firstCard.getByRole('button', { name: 'Add to cart', exact: true }).click()
  await page.goto('/cart')
  await expect(page.locator('main')).toContainText(name)
  await expect(page.locator('main')).toContainText(price)
  await page.reload()
  await expect(page.locator('main')).toContainText(name)
})

test('membership plan selection updates the manual-verification checkout', async ({ page }) => {
  await page.goto('/membership')
  const plans = page.locator('section[aria-label="Membership plans"] > button')
  await expect(plans.first()).toBeVisible()
  const index = await plans.count() > 1 ? 1 : 0
  const name = await plans.nth(index).locator('h3').innerText()
  await plans.nth(index).click()
  await expect(page.locator('#membership-checkout')).toContainText(`Joining as: ${name}`)
  await expect(page.locator('#membership-checkout')).toContainText('manual verification', { ignoreCase: true })
})

test('Contact deep links preselect the requested topic', async ({ page }) => {
  await page.goto('/contact?topic=Events')
  await expect(page.getByLabel('Topic', { exact: true })).toHaveValue('Events')
})

test('cohort lookup calculates the S6 year without a runtime error', async ({ page }) => {
  await page.goto('/cohorts')
  await page.getByLabel('Year your class started S1', { exact: true }).fill('2001')
  await expect(page.getByRole('heading', { name: 'Cohort 2001', exact: true })).toBeVisible()
  await expect(page.getByText('S1 in 2001, S6 in 2006', { exact: true })).toBeVisible()
})

test('leadership profiles and Gallery lightboxes close with Escape', async ({ page }) => {
  await page.goto('/about')
  const profile = page.getByRole('button', { name: /Read .*profile|View .*profile|Full profile/i }).first()
  await expect(profile).toBeVisible()
  await profile.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)

  await page.goto('/gallery')
  const firstPhoto = page.locator('button').filter({ has: page.locator('img') }).first()
  await expect(firstPhoto).toBeVisible()
  await firstPhoto.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('all main tabs remain visible at phone, tablet and laptop widths without a menu', async ({ page }) => {
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main', exact: true })
    await expect(nav).toBeVisible()
    const navLinks = nav.getByRole('link')
    await expect(navLinks).toHaveCount(9)
    for (let i = 0; i < 9; i += 1) await expect(navLinks.nth(i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveCount(0)
    const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: window.innerWidth }))
    expect(widths.page).toBeLessThanOrEqual(widths.viewport + 1)
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('link', { name: 'News & Events', exact: true }).click()
  await expect(page).toHaveURL(/\/news$/)
})
