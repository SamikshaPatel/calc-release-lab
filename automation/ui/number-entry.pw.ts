import { test, expect } from '@playwright/test'
import { CalculatorPage } from './pages/CalculatorPage'

test.describe('CALC-6: number entry', () => {
  const cases: { keys: string[]; expected: string }[] = [
    { keys: ['1', '2', '3'], expected: '123' },
    { keys: ['0', '0', '7'], expected: '7' },
    { keys: ['1', '0', '0'], expected: '100' },
    { keys: ['decimal', '5'], expected: '0.5' },
    { keys: ['1', 'decimal', 'decimal', '5'], expected: '1.5' },
    { keys: ['0', 'decimal', '0', '0'], expected: '0.00' },
  ]

  for (const c of cases) {
    test(`keys ${c.keys.join(' ')} show ${c.expected}`, async ({ page }) => {
      const calc = new CalculatorPage(page)
      await calc.goto()
      await calc.press(...c.keys)
      await expect(calc.display).toHaveText(c.expected)
    })
  }

  test('typing a number updates the display @smoke', async ({ page }) => {
    const calc = new CalculatorPage(page)
    await calc.goto()
    await calc.press('4', '2')
    await expect(calc.display).toHaveText('42')
  })
})
