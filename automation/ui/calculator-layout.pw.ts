import { test, expect } from '@playwright/test'
import { CalculatorPage } from './pages/CalculatorPage'

test.describe('CALC-3: calculator layout', () => {
  let calc: CalculatorPage

  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page)
    await calc.goto()
  })

  test('page loads with display 0 and 17 keys @smoke', async ({ page }) => {
    await expect(page).toHaveTitle('calc-release-lab | Calculator')
    await expect(calc.display).toHaveText('0')
    await expect(calc.keys).toHaveCount(17)
  })

  test('shows every digit key 0-9', async () => {
    for (let d = 0; d <= 9; d++) {
      await expect(calc.key(String(d))).toHaveText(String(d))
    }
  })

  test('operator keys have accessible names', async ({ page }) => {
    for (const name of ['add', 'subtract', 'multiply', 'divide', 'equals', 'clear', 'decimal point']) {
      await expect(page.getByRole('button', { name, exact: true })).toBeVisible()
    }
  })

  test('equals and plus span two rows, zero spans two columns', async () => {
    const three = await calc.key('3').boundingBox()
    const equals = await calc.key('equals').boundingBox()
    const plus = await calc.key('add').boundingBox()
    const zero = await calc.key('0').boundingBox()
    const decimal = await calc.key('decimal').boundingBox()

    expect(equals!.height).toBeGreaterThan(three!.height * 1.8)
    expect(plus!.height).toBeGreaterThan(three!.height * 1.8)
    expect(zero!.width).toBeGreaterThan(decimal!.width * 1.8)
  })

  test('display is right-aligned', async () => {
    await expect(calc.display).toHaveCSS('text-align', 'right')
  })

  test('no horizontal scroll at this viewport', async ({ page }) => {
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(overflows).toBe(false)
  })
})
