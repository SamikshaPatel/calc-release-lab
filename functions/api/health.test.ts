import { describe, it, expect } from 'vitest'
import { onRequestGet } from './health'

const fakeAssets = (body: object | null) => ({
  fetch: async () =>
    body ? new Response(JSON.stringify(body)) : new Response('not found', { status: 404 }),
})

describe('GET /api/health', () => {
  it('returns status, environment, version and commit from version.json', async () => {
    const res = await onRequestGet({
      request: new Request('https://example.com/api/health'),
      env: { APP_ENV: 'qa', ASSETS: fakeAssets({ version: '1.0.0-dev.5+abc1234', commit: 'abc1234def' }) },
    })
    expect(await res.json()).toEqual({
      status: 'ok',
      env: 'qa',
      version: '1.0.0-dev.5+abc1234',
      commit: 'abc1234def',
    })
  })

  it('falls back to "local" when version.json is missing', async () => {
    const res = await onRequestGet({
      request: new Request('http://localhost/api/health'),
      env: { ASSETS: fakeAssets(null) },
    })
    const body = await res.json()
    expect(body.version).toBe('local')
    expect(body.env).toBe('local')
  })
})
