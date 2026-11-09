import { test, expect } from '@playwright/test'

const calc = (request: import('@playwright/test').APIRequestContext, data: unknown) =>
  request.post('/api/calculate', { data })

test.describe('CALC-2: add and subtract', () => {
  test('adds two positive numbers @smoke', async ({ request }) => {
    const res = await calc(request, { a: 5, b: 3, op: 'add' })
    expect(res.status()).toBe(200)
    expect((await res.json()).result).toBe(8)
  })

  const cases = [
    { name: 'adds a negative and a positive', a: -5, b: 3, op: 'add', result: -2 },
    { name: 'adds decimals', a: 2.5, b: 1.25, op: 'add', result: 3.75 },
    { name: 'subtracts to a negative result', a: 3, b: 5, op: 'subtract', result: -2 },
    { name: 'subtracts negatives to zero', a: -2.5, b: -2.5, op: 'subtract', result: 0 },
  ]
  for (const c of cases) {
    test(c.name, async ({ request }) => {
      const res = await calc(request, { a: c.a, b: c.b, op: c.op })
      expect(res.status()).toBe(200)
      expect((await res.json()).result).toBe(c.result)
    })
  }

  test('rejects an unsupported operation', async ({ request }) => {
    const res = await calc(request, { a: 1, b: 2, op: 'power' })
    expect(res.status()).toBe(400)
    expect((await res.json()).code).toBe('UNSUPPORTED_OPERATION')
  })

  test('rejects non-numeric input', async ({ request }) => {
    const res = await calc(request, { a: '1', b: 2, op: 'add' })
    expect(res.status()).toBe(400)
    expect((await res.json()).code).toBe('INVALID_INPUT')
  })

  test('rejects invalid JSON', async ({ request }) => {
    const res = await request.post('/api/calculate', {
      headers: { 'content-type': 'application/json' },
      data: Buffer.from('{not json'),
    })
    expect(res.status()).toBe(400)
    expect((await res.json()).code).toBe('INVALID_JSON')
  })

  test('KNOWN ISSUE CALC-9: 0.1 + 0.2 should equal 0.3', async ({ request }) => {
    test.info().annotations.push({ type: 'issue', description: 'CALC-9 decimal precision' })
    test.fail() // expected to fail until CALC-9 ships; Playwright alerts us when it starts passing
    const res = await calc(request, { a: 0.1, b: 0.2, op: 'add' })
    expect((await res.json()).result).toBe(0.3)
  })
})
