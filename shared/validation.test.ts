import { describe, it, expect } from 'vitest'
import { validateCalculateRequest } from './validation'

describe('validateCalculateRequest', () => {
  it('accepts a valid request', () => {
    expect(validateCalculateRequest({ a: 1, b: 2, op: 'add' })).toEqual({ ok: true, value: { a: 1, b: 2, op: 'add' } })
  })

  it.each([['hello'], [42], [[]], [null], [true]])('rejects non-object body %j with 422 INVALID_BODY', (body) => {
    expect(validateCalculateRequest(body)).toMatchObject({ ok: false, status: 422, code: 'INVALID_BODY' })
  })

  it('lists every missing field', () => {
    expect(validateCalculateRequest({ op: 'add' })).toMatchObject({
      ok: false, status: 422, code: 'MISSING_FIELD', message: 'Missing field(s): a, b',
    })
  })

  it('rejects an unsupported operation with 400', () => {
    expect(validateCalculateRequest({ a: 1, b: 2, op: 'power' })).toMatchObject({ status: 400, code: 'UNSUPPORTED_OPERATION' })
  })

  it.each([
    [{ a: '5', b: 2, op: 'add' }, 'a must be a number'],
    [{ a: 5, b: 'x', op: 'add' }, 'b must be a number'],
    [{ a: '1', b: '2', op: 'add' }, 'a and b must be a number'],
  ])('rejects non-numeric input %j with 422 INVALID_NUMBER', (body, message) => {
    expect(validateCalculateRequest(body)).toMatchObject({ status: 422, code: 'INVALID_NUMBER', message })
  })
})
