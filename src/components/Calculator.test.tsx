// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
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

  it('operator and equals keys do not change the display yet', () => {
    render(<Calculator />)
    click('4', 'add', 'equals')
    expect(screen.getByTestId('display').textContent).toBe('4')
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
