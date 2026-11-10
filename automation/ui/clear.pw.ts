import { test, expect } from '@playwright/test'
import { CalculatorPage } from './pages/CalculatorPage'

test.describe('CALC-7: clear', () => {
  let calc: CalculatorPage

  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page)
    await calc.goto()
  })

  test('C resets the display to 0 @smoke', async () => {
    await calc.press('1', '2', 'clear')
    await expect(calc.display).toHaveText('0')
  })

  test('typing after C starts a new number', async () => {
    await calc.press('1', '2', 'clear', '3')
    await expect(calc.display).toHaveText('3')
  })

  test('C clears a decimal entry so a new decimal can be typed', async () => {
    await calc.press('1', 'decimal', '5', 'clear', 'decimal', '2')
    await expect(calc.display).toHaveText('0.2')
  })

  test('double C (AC) leaves the display at 0', async () => {
    await calc.press('4', '5', 'clear', 'clear')
    await expect(calc.display).toHaveText('0')
  })
})
