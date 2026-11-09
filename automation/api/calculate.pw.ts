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

  test('rejects invalid JSON', async ({ request }) => {
    const res = await request.post('/api/calculate', {
      headers: { 'content-type': 'application/json' },
      data: Buffer.from('{not json'),
    })
    expect(res.status()).toBe(400)
    expect((await res.json()).code).toBe('INVALID_JSON')
  })

  test('CALC-9: 0.1 + 0.2 equals 0.3 @smoke', async ({ request }) => {
    const res = await calc(request, { a: 0.1, b: 0.2, op: 'add' })
    expect((await res.json()).result).toBe(0.3)
  })
})

test.describe('CALC-4: multiply and divide', () => {
  const cases = [
    { name: 'multiplies', a: 4, b: 3, op: 'multiply', result: 12 },
    { name: 'multiplies negative by decimal', a: -4, b: 2.5, op: 'multiply', result: -10 },
    { name: 'divides', a: 12, b: 4, op: 'divide', result: 3 },
    { name: 'divides to a negative decimal', a: -9, b: 2, op: 'divide', result: -4.5 },
  ]
  for (const c of cases) {
    test(c.name, async ({ request }) => {
      const res = await request.post('/api/calculate', { data: { a: c.a, b: c.b, op: c.op } })
      expect(res.status()).toBe(200)
      expect((await res.json()).result).toBe(c.result)
    })
  }

  for (const a of [5, 0]) {
    test(`BUG CALC-16: ${a} / 0 returns 400 DIVIDE_BY_ZERO @smoke`, async ({ request }) => {
      const res = await request.post('/api/calculate', { data: { a, b: 0, op: 'divide' } })
      expect(res.status()).toBe(400)
      expect((await res.json()).code).toBe('DIVIDE_BY_ZERO')
    })
  }
})

test.describe('CALC-5: input validation', () => {
  const invalid = [
    { name: 'non-object body (string)', body: Buffer.from('"hello"'), status: 422, code: 'INVALID_BODY' },
    { name: 'non-object body (array)', body: Buffer.from('[1,2]'), status: 422, code: 'INVALID_BODY' },
    { name: 'missing b and op', body: { a: 1 }, status: 422, code: 'MISSING_FIELD' },
    { name: 'string number', body: { a: '5', b: 2, op: 'add' }, status: 422, code: 'INVALID_NUMBER' },
    { name: 'non-numeric b', body: { a: 5, b: 'x', op: 'add' }, status: 422, code: 'INVALID_NUMBER' },
    { name: 'unsupported op', body: { a: 1, b: 2, op: 'power' }, status: 400, code: 'UNSUPPORTED_OPERATION' },
  ]

  for (const c of invalid) {
    test(`${c.name} → ${c.status} ${c.code}`, async ({ request }) => {
      const res = await request.post('/api/calculate', {
        headers: { 'content-type': 'application/json' },
        data: c.body,
      })
      expect(res.status()).toBe(c.status)
      const body = await res.json()
      expect(body.code).toBe(c.code)
      expect(typeof body.message).toBe('string') // one error format: {code, message}
    })
  }
})
