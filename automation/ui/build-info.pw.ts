import { test, expect } from '@playwright/test'

test.describe('CALC-10: build info footer', () => {
  test('footer shows the deployed build and environment @smoke', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByTestId('build-info')
    await expect(footer).toHaveText(/^v\d+\.\d+\.\d+.* · [0-9a-f]{7} · [A-Z]+$/)

    if (process.env.EXPECTED_ENV) await expect(footer).toContainText(`· ${process.env.EXPECTED_ENV.toUpperCase()}`)
    if (process.env.EXPECTED_COMMIT) await expect(footer).toContainText(process.env.EXPECTED_COMMIT.slice(0, 7))
  })

  test('calculator still works when build info is unavailable', async ({ page }) => {
    await page.route('**/api/health', (route) => route.abort())
    await page.goto('/')
    await expect(page.getByTestId('build-info')).toHaveText('Build info unavailable')
    for (const id of ['5', 'add', '3', 'equals']) await page.getByTestId(`key-${id}`).click()
    await expect(page.getByTestId('display')).toHaveText('8')
  })
})
