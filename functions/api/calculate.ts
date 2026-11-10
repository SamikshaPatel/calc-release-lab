import { calculate, CalculationError } from '../../shared/calculator'
import { validateCalculateRequest } from '../../shared/validation'

const error = (status: number, code: string, message: string) =>
  Response.json({ code, message }, { status })

export const onRequestPost = async ({ request }: { request: Request }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return error(400, 'INVALID_JSON', 'Request body must be valid JSON')
  }

  const check = validateCalculateRequest(body)
  if (!check.ok) return error(check.status, check.code, check.message)

  const { a, b, op } = check.value
  try {
    return Response.json({ a, b, op, result: calculate(a, b, op) })
  } catch (e) {
    if (e instanceof CalculationError) return error(400, e.code, e.message)
    throw e
  }
}
