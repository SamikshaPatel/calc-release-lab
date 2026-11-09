import { isOperation, SUPPORTED_OPERATIONS, type Operation } from './calculator'

export type ValidRequest = { a: number; b: number; op: Operation }
export type ValidationResult =
  | { ok: true; value: ValidRequest }
  | { ok: false; status: number; code: string; message: string }

const fail = (status: number, code: string, message: string): ValidationResult => ({ ok: false, status, code, message })

export function validateCalculateRequest(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return fail(422, 'INVALID_BODY', 'Body must be a JSON object with a, b and op')
  }

  const { a, b, op } = body as Record<string, unknown>

  const missing = (['a', 'b', 'op'] as const).filter((k) => (body as Record<string, unknown>)[k] === undefined)
  if (missing.length > 0) {
    return fail(422, 'MISSING_FIELD', `Missing field(s): ${missing.join(', ')}`)
  }

  if (!isOperation(op)) {
    return fail(400, 'UNSUPPORTED_OPERATION', `op must be one of: ${SUPPORTED_OPERATIONS.join(', ')}`)
  }

  const notNumbers = (['a', 'b'] as const).filter((k) => {
    const v = k === 'a' ? a : b
    return typeof v !== 'number' || !Number.isFinite(v)
  })
  if (notNumbers.length > 0) {
    return fail(422, 'INVALID_NUMBER', `${notNumbers.join(' and ')} must be a number`)
  }

  return { ok: true, value: { a: a as number, b: b as number, op } }
}
