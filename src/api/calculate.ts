export type CalcResponse = { ok: true; result: number } | { ok: false; message: string }

/** Calls POST /api/calculate. Never throws: every failure becomes a readable message. */
export async function requestCalculation(
  a: number,
  b: number,
  op: string,
  fetchFn: typeof fetch = fetch,
): Promise<CalcResponse> {
  try {
    const res = await fetchFn('/api/calculate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ a, b, op }),
    })
    const body = await res.json().catch(() => null)
    if (res.ok && typeof body?.result === 'number') return { ok: true, result: body.result }
    if (!res.ok && typeof body?.message === 'string') return { ok: false, message: body.message }
    return { ok: false, message: 'Unexpected response from server' }
  } catch {
    return { ok: false, message: 'Network error, try again' }
  }
}
