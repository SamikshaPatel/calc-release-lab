import { calculate, isOperation, SUPPORTED_OPERATIONS } from '../../shared/calculator'

type Body = { a?: unknown; b?: unknown; op?: unknown }

const error = (status: number, code: string, message: string) =>
  Response.json({ code, message }, { status })

export const onRequestPost = async ({ request }: { request: Request }) => {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return error(400, 'INVALID_JSON', 'Request body must be valid JSON')
  }

  const { a, b, op } = body ?? {}

  if (!isOperation(op)) {
    return error(400, 'UNSUPPORTED_OPERATION', `op must be one of: ${SUPPORTED_OPERATIONS.join(', ')}`)
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    return error(400, 'INVALID_INPUT', 'a and b must be numbers')
  }

  return Response.json({ a, b, op, result: calculate(a, b, op) })
}
