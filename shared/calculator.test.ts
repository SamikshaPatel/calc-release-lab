import { describe, it, expect } from 'vitest'
import { calculate, isOperation } from './calculator'

describe('calculate', () => {
  it.each([
    [5, 3, 'add', 8],
    [-5, 3, 'add', -2],
    [2.5, 1.25, 'add', 3.75],
    [5, 3, 'subtract', 2],
    [3, 5, 'subtract', -2],
    [-2.5, -2.5, 'subtract', 0],
  ] as const)('%d %s %d', (a, b, op, expected) => {
    expect(calculate(a, b, op)).toBe(expected)
  })
})

describe('isOperation', () => {
  it('accepts supported operations', () => {
    expect(isOperation('add')).toBe(true)
    expect(isOperation('subtract')).toBe(true)
  })
  it('rejects anything else', () => {
    expect(isOperation('multiply')).toBe(false)
    expect(isOperation(undefined)).toBe(false)
    expect(isOperation(42)).toBe(false)
  })
})
