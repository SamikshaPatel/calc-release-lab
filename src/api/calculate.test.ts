import { describe, it, expect } from 'vitest'
import { requestCalculation } from './calculate'

const fakeFetch = (status: number, body: unknown) =>
  (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch

describe('requestCalculation', () => {
  it('returns the result on success', async () => {
    expect(await requestCalculation(5, 3, 'add', fakeFetch(200, { result: 8 }))).toEqual({ ok: true, result: 8 })
  })

  it('returns the API error message on failure', async () => {
    const r = await requestCalculation(5, 0, 'divide', fakeFetch(400, { code: 'DIVIDE_BY_ZERO', message: 'Cannot divide by zero' }))
    expect(r).toEqual({ ok: false, message: 'Cannot divide by zero' })
  })

  it('treats a 200 without a numeric result as an error', async () => {
    const r = await requestCalculation(1e308, 10, 'multiply', fakeFetch(200, { result: null }))
    expect(r).toEqual({ ok: false, message: 'Unexpected response from server' })
  })

  it('turns a network failure into a message instead of throwing', async () => {
    const failing = (async () => { throw new TypeError('Failed to fetch') }) as unknown as typeof fetch
    expect(await requestCalculation(1, 2, 'add', failing)).toEqual({ ok: false, message: 'Network error, try again' })
  })
})
