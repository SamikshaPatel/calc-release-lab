import { test, expect } from '@playwright/test'

test('health endpoint is up and serves the expected build @smoke', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.status()).toBe(200)

  const body = await res.json()
  expect(body.status).toBe('ok')
  if (process.env.EXPECTED_ENV) expect(body.env).toBe(process.env.EXPECTED_ENV)
  if (process.env.EXPECTED_COMMIT) expect(body.commit).toBe(process.env.EXPECTED_COMMIT)
})
