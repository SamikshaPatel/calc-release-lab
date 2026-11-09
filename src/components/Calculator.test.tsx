// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import Calculator from './Calculator'

afterEach(cleanup)

describe('Calculator layout (CALC-3)', () => {
  it('shows 0 on the display at start', () => {
    render(<Calculator />)
    expect(screen.getByTestId('display').textContent).toBe('0')
  })

  it('renders exactly 17 keys', () => {
    render(<Calculator />)
    expect(screen.getAllByRole('button')).toHaveLength(17)
  })

  it('renders every digit 0-9', () => {
    render(<Calculator />)
    for (let d = 0; d <= 9; d++) {
      expect(screen.getByTestId(`key-${d}`).textContent).toBe(String(d))
    }
  })

  it('gives operators accessible names', () => {
    render(<Calculator />)
    for (const name of ['add', 'subtract', 'multiply', 'divide', 'equals', 'clear', 'decimal point']) {
      expect(screen.getByRole('button', { name })).toBeTruthy()
    }
  })
})

describe('Number entry on screen (CALC-6)', () => {
  const click = (...ids: string[]) => ids.forEach((id) => fireEvent.click(screen.getByTestId(`key-${id}`)))

  it('shows pressed digits', () => {
    render(<Calculator />)
    click('1', '2', '3')
    expect(screen.getByTestId('display').textContent).toBe('123')
  })

  it('drops leading zeros', () => {
    render(<Calculator />)
    click('0', '0', '7')
    expect(screen.getByTestId('display').textContent).toBe('7')
  })

  it('allows only one decimal point', () => {
    render(<Calculator />)
    click('1', 'decimal', 'decimal', '5')
    expect(screen.getByTestId('display').textContent).toBe('1.5')
  })
})

describe('Clear key on screen (CALC-7)', () => {
  const click = (...ids: string[]) => ids.forEach((id) => fireEvent.click(screen.getByTestId(`key-${id}`)))

  it('C resets the display to 0', () => {
    render(<Calculator />)
    click('1', '2', 'clear')
    expect(screen.getByTestId('display').textContent).toBe('0')
  })

  it('typing after C starts a new number', () => {
    render(<Calculator />)
    click('1', '2', 'clear', '3')
    expect(screen.getByTestId('display').textContent).toBe('3')
  })

  it('C also clears a decimal entry', () => {
    render(<Calculator />)
    click('1', 'decimal', '5', 'clear', 'decimal', '2')
    expect(screen.getByTestId('display').textContent).toBe('0.2')
  })
})

describe('Equals calls the API (CALC-8)', () => {
  const click = (...ids: string[]) => ids.forEach((id) => fireEvent.click(screen.getByTestId(`key-${id}`)))
  const respond = (status: number, body: unknown) =>
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body), { status })))

  afterEach(() => vi.unstubAllGlobals())

  it('shows the pending operation, then the result', async () => {
    respond(200, { result: 8 })
    render(<Calculator />)
    click('5', 'add')
    expect(screen.getByTestId('pending').textContent).toBe('5 +')
    click('3', 'equals')
    await waitFor(() => expect(screen.getByTestId('display').textContent).toBe('8'))
    expect(fetch).toHaveBeenCalledWith('/api/calculate', expect.objectContaining({ body: JSON.stringify({ a: 5, b: 3, op: 'add' }) }))
  })

  it('shows the API error message', async () => {
    respond(400, { code: 'DIVIDE_BY_ZERO', message: 'Cannot divide by zero' })
    render(<Calculator />)
    click('5', 'divide', '0', 'equals')
    await waitFor(() => expect(screen.getByTestId('display').textContent).toBe('Cannot divide by zero'))
  })

  it('equals without an operator does nothing and calls no API', () => {
    respond(200, { result: 0 })
    render(<Calculator />)
    click('7', 'equals')
    expect(screen.getByTestId('display').textContent).toBe('7')
    expect(fetch).not.toHaveBeenCalled()
  })
})
