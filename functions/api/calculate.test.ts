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

  it('rejects non-numeric input', async () => {
    const res = await post({ a: '1', b: 2, op: 'add' })
    expect(res.status).toBe(400)
    expect((await res.json()).code).toBe('INVALID_INPUT')
  })

  it('rejects invalid JSON', async () => {
    const res = await post('{not json')
    expect(res.status).toBe(400)
    expect((await res.json()).code).toBe('INVALID_JSON')
  })
})
