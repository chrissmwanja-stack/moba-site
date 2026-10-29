import { test, expect } from '@playwright/test'

const routes = [
  '/', '/about', '/history', '/projects', '/gallery', '/store', '/cart', '/membership',
  '/funeral-cover', '/contact', '/news', '/update-details', '/privacy', '/cohorts',
  '/support', '/donate', '/archives', '/prominent-mwirians', '/member/login',
]

for (const route of routes) {
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
  await expect(page.locator('select')).toHaveValue('Events')
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

test('mobile navigation opens, navigates and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Menu', exact: true })
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('link', { name: 'News & Events', exact: true }).click()
  await expect(page).toHaveURL(/\/news$/)
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'false')
})
