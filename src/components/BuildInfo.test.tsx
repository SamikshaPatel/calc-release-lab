// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import BuildInfo from './BuildInfo'
import { formatBuildInfo } from '../logic/build-info'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('formatBuildInfo', () => {
  it('shows version without build metadata, short SHA and upper-case env', () => {
    expect(formatBuildInfo({ env: 'qa', version: '1.0.0-dev.23+a1b2c3d', commit: 'a1b2c3d4e5f6a7b8' }))
      .toBe('v1.0.0-dev.23 · a1b2c3d · QA')
  })

  it('handles a local build', () => {
    expect(formatBuildInfo({ env: 'local', version: 'local', commit: 'local' })).toBe('local build · LOCAL')
  })
})

describe('BuildInfo footer (CALC-10)', () => {
  it('shows build info from /api/health', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      new Response(JSON.stringify({ status: 'ok', env: 'staging', version: '1.0.0-dev.30+abc1234', commit: 'abc1234def567890' })),
    ))
    render(<BuildInfo />)
    await waitFor(() => expect(screen.getByTestId('build-info').textContent).toBe('v1.0.0-dev.30 · abc1234 · STAGING'))
  })

  it('shows a fallback when health is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch') }))
    render(<BuildInfo />)
    await waitFor(() => expect(screen.getByTestId('build-info').textContent).toBe('Build info unavailable'))
  })
})
