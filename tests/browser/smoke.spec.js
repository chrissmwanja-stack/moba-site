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

test('Group Last Expense Insurance shows the approved benefits and payment details', async ({ page }) => {
  await page.goto('/funeral-cover')
  const main = page.locator('main')
  await expect(page).toHaveTitle(/MOBA Group Last Expense Insurance/)
  await expect(main).toContainText('UGX 120,000 per year')
  await expect(page.getByRole('heading', { name: 'Benefits and coverage', exact: true })).toBeVisible()
  for (const text of ['UGX 10,000,000', 'UGX 5,000,000', 'UGX 1,500,000', 'UGX 1,000,000']) {
    await expect(main).toContainText(text)
  }
  await expect(main).toContainText('the principal member’s two parents and the spouse’s two parents')
  await expect(main).toContainText('777888')
  await expect(main).toContainText('4365142')
  await expect(main).toContainText('0102886324900')
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

test('responsive navigation keeps priority tabs visible and More accessible', async ({ page }) => {
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main', exact: true })
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link')).toHaveCount(4)
    for (const label of ['Home', 'Our Mwiri', 'News', 'Membership']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible()
    }
    await expect(nav.getByRole('button', { name: 'More', exact: true })).toHaveAttribute('aria-expanded', 'false')
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveCount(0)
    const heights = await nav.locator('a, button').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height))
    expect(Math.min(...heights)).toBeGreaterThanOrEqual(44)
    const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: window.innerWidth }))
    expect(widths.page).toBeLessThanOrEqual(widths.viewport + 1)
  }

  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto('/')
  const more = page.getByRole('button', { name: 'More', exact: true })
  const panel = page.getByRole('navigation', { name: 'More navigation', exact: true })
  await more.click()
  await expect(more).toHaveAttribute('aria-expanded', 'true')
  await expect(panel).toBeVisible()
  await expect(panel.getByRole('link')).toHaveCount(5)
  for (const label of ['About MOBA', 'Projects & Impact', 'Gallery', 'Support MOBA', 'Contact']) {
    await expect(panel.getByRole('link', { name: label, exact: true })).toBeVisible()
  }
  await page.keyboard.press('Escape')
  await expect(more).toHaveAttribute('aria-expanded', 'false')
  await expect(panel).toBeHidden()
  await expect(more).toBeFocused()

  await more.click()
  await panel.getByRole('link', { name: 'Projects & Impact', exact: true }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(panel).toBeHidden()
  await expect(more).toHaveClass(/text-gold/)

  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main', exact: true })
    await expect(nav).toBeVisible()
    const navLinks = nav.getByRole('link')
    await expect(navLinks).toHaveCount(9)
    for (let i = 0; i < 9; i += 1) await expect(navLinks.nth(i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'More', exact: true })).toHaveCount(0)
    const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: window.innerWidth }))
    expect(widths.page).toBeLessThanOrEqual(widths.viewport + 1)
  }
})

test('managed life members and headmasters replace fallbacks with automatic numbering', async ({ page }) => {
  const content = {
    managed: ['life_member', 'headmaster'],
    rows: [
      ...['One', 'Two', 'Three', 'Four', 'Five'].map((name, index) => ({
        id: `life-${index + 1}`, kind: 'life_member', key: null, data: { name: `Managed Member ${name}` },
      })),
      { id: 'head-1', kind: 'headmaster', key: null, data: { name: 'Managed Headmaster One', note: '2000 to 2001' } },
      { id: 'head-2', kind: 'headmaster', key: null, data: { name: 'Managed Headmaster Two', note: '2001 to 2002, Acting' } },
    ],
  }
    // Do not let a configured live Supabase project overwrite this test's managed-content fixture.
  await page.route('**/rest/v1/rpc/site_content_public', route => route.abort())
  await page.addInitScript(value => {
    localStorage.setItem('moba-content-v1', JSON.stringify(value))
  }, content)

  await page.goto('/membership')
  const lifeSection = page.locator('section[aria-labelledby="life-members-heading"]')
  await expect(lifeSection.getByText('Managed Member One', { exact: true })).toBeVisible()
  await expect(lifeSection.getByText('Boniface Egwoku', { exact: true })).toHaveCount(0)
  await expect(lifeSection.locator('ol')).toHaveCount(4)
  const lifeItems = lifeSection.locator('ol li')
  await expect(lifeItems).toHaveCount(5)
  await expect(lifeItems.nth(4)).toContainText('5')
  await expect(lifeItems.nth(4)).toContainText('Managed Member Five')

  await page.goto('/history')
  const headmasterSection = page.locator('section[aria-labelledby="headmasters-heading"]')
  await expect(headmasterSection.getByText('Managed Headmaster One', { exact: true })).toBeVisible()
  await expect(headmasterSection.getByText('2001 to 2002, Acting', { exact: true })).toBeVisible()
  await expect(headmasterSection.getByText('Rev. W. B. Gill', { exact: true })).toHaveCount(0)
  await expect(headmasterSection.locator('ul li')).toHaveCount(2)
})
