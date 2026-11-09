import { test, expect } from '@playwright/test'
import { CalculatorPage } from './pages/CalculatorPage'

test.describe('CALC-8: UI to API end to end', () => {
  let calc: CalculatorPage

  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page)
    await calc.goto()
  })

  test('5 + 3 = 8 through the real API @smoke', async () => {
    await calc.press('5', 'add')
    await expect(calc.pending).toHaveText('5 +')
    await calc.press('3', 'equals')
    await expect(calc.display).toHaveText('8')
  })

  const cases = [
    { keys: ['1', '2', 'divide', '4', 'equals'], expected: '3' },
    { keys: ['4', 'multiply', '2', 'decimal', '5', 'equals'], expected: '10' },
    { keys: ['3', 'subtract', '5', 'equals'], expected: '-2' },
  ]
  for (const c of cases) {
    test(`${c.keys.join(' ')} → ${c.expected}`, async () => {
      await calc.press(...c.keys)
      await expect(calc.display).toHaveText(c.expected)
    })
  }

  test('divide by zero shows the API error, then a digit starts fresh', async () => {
    await calc.press('5', 'divide', '0', 'equals')
    await expect(calc.display).toHaveText('Cannot divide by zero')
    await calc.press('4')
    await expect(calc.display).toHaveText('4')
  })

  test('C keeps the pending operation; C C clears it (CALC-7 carry-over)', async () => {
    await calc.press('5', 'add', '3', 'clear')
    await expect(calc.pending).toHaveText('5 +')
    await calc.press('clear')
    await expect(calc.pending).toHaveText('\u00a0')
  })

  test('shows a loading state while the API is slow', async ({ page }) => {
    await page.route('**/api/calculate', async (route) => {
      await new Promise((r) => setTimeout(r, 1500))
      await route.continue()
    })
    await calc.press('5', 'add', '3', 'equals')
    await expect(calc.display).toHaveAttribute('aria-busy', 'true')
    await expect(calc.display).toHaveText('8')
    await expect(calc.display).toHaveAttribute('aria-busy', 'false')
  })

  test('network failure shows a message instead of crashing', async ({ page }) => {
    await page.route('**/api/calculate', (route) => route.abort('internetdisconnected'))
    await calc.press('5', 'add', '3', 'equals')
    await expect(calc.display).toHaveText('Network error, try again')
  })

  test('unexpected API response is handled safely', async ({ page }) => {
    await page.route('**/api/calculate', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"result":null}' }),
    )
    await calc.press('9', 'multiply', '9', 'equals')
    await expect(calc.display).toHaveText('Unexpected response from server')
  })
})
