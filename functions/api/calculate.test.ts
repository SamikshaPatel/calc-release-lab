import { describe, it, expect } from 'vitest'
import { onRequestPost } from './calculate'

const post = (body: unknown) =>
  onRequestPost({
    request: new Request('https://example.com/api/calculate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  })

describe('POST /api/calculate', () => {
  it('adds two numbers', async () => {
    const res = await post({ a: 5, b: 3, op: 'add' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ a: 5, b: 3, op: 'add', result: 8 })
  })

  it('subtracts with negatives and decimals', async () => {
    const res = await post({ a: -2.5, b: 1.5, op: 'subtract' })
    expect((await res.json()).result).toBe(-4)
  })

  it('rejects an unsupported operation', async () => {
    const res = await post({ a: 1, b: 2, op: 'power' })
    expect(res.status).toBe(400)
    expect((await res.json()).code).toBe('UNSUPPORTED_OPERATION')
  })

  it('rejects non-numeric input with 422 INVALID_NUMBER', async () => {
    const res = await post({ a: '1', b: 2, op: 'add' })
    expect(res.status).toBe(422)
    expect((await res.json()).code).toBe('INVALID_NUMBER')
  })

  it('rejects invalid JSON', async () => {
    const res = await post('{not json')
    expect(res.status).toBe(400)
    expect((await res.json()).code).toBe('INVALID_JSON')
  })
})

describe('POST /api/calculate - divide by zero (CALC-16)', () => {
  it('returns 400 DIVIDE_BY_ZERO', async () => {
    const res = await post({ a: 5, b: 0, op: 'divide' })
    expect(res.status).toBe(400)
    expect((await res.json()).code).toBe('DIVIDE_BY_ZERO')
  })
})

describe('POST /api/calculate - validation (CALC-5)', () => {
  it('rejects a non-object JSON body with 422 INVALID_BODY', async () => {
    const res = await post('"hello"')
    expect(res.status).toBe(422)
    expect((await res.json()).code).toBe('INVALID_BODY')
  })

  it('rejects missing fields with 422 MISSING_FIELD', async () => {
    const res = await post({ a: 1 })
    expect(res.status).toBe(422)
    expect(await res.json()).toEqual({ code: 'MISSING_FIELD', message: 'Missing field(s): b, op' })
  })
})
