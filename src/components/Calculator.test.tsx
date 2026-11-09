// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
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
