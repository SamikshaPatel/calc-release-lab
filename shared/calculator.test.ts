import { describe, it, expect } from 'vitest'
import { calculate, isOperation, roundResult } from './calculator'

describe('calculate', () => {
  it.each([
    [5, 3, 'add', 8],
    [-5, 3, 'add', -2],
    [2.5, 1.25, 'add', 3.75],
    [5, 3, 'subtract', 2],
    [3, 5, 'subtract', -2],
    [-2.5, -2.5, 'subtract', 0],
    [4, 3, 'multiply', 12],
    [-4, 2.5, 'multiply', -10],
    [7, 0, 'multiply', 0],
    [12, 4, 'divide', 3],
    [-9, 2, 'divide', -4.5],
  ] as const)('%d %s %d', (a, b, op, expected) => {
    expect(calculate(a, b, op)).toBe(expected)
  })
})

describe('isOperation', () => {
  it('accepts supported operations', () => {
    for (const op of ['add', 'subtract', 'multiply', 'divide']) expect(isOperation(op)).toBe(true)
  })
  it('rejects anything else', () => {
    expect(isOperation('power')).toBe(false)
    expect(isOperation(undefined)).toBe(false)
    expect(isOperation(42)).toBe(false)
  })
})

describe('divide by zero (CALC-16)', () => {
  it.each([[5, 0], [0, 0], [-3, -0]])('%d / %d throws DIVIDE_BY_ZERO', (a, b) => {
    expect(() => calculate(a, b, 'divide')).toThrowError(expect.objectContaining({ code: 'DIVIDE_BY_ZERO' }))
  })
})

describe('decimal precision (CALC-9)', () => {
  it.each([
    [0.1, 0.2, 'add', 0.3],
    [0.3, 0.1, 'subtract', 0.2],
    [0.1, 3, 'multiply', 0.3],
    [1.1, 1.1, 'multiply', 1.21],
    [1, 3, 'divide', 0.3333333333],
    [2, 3, 'divide', 0.6666666667],
    [0.7, 0.1, 'divide', 7],
  ] as const)('%d %s %d = %d', (a, b, op, expected) => {
    expect(calculate(a, b, op)).toBe(expected)
  })

  it('rounds to exactly 10 decimal places', () => {
    expect(roundResult(1.23456789012345)).toBe(1.2345678901)
  })

  it('leaves large and non-finite values untouched', () => {
    expect(roundResult(1e22)).toBe(1e22)
    expect(roundResult(Infinity)).toBe(Infinity)
  })

  it('normalises negative zero to 0', () => {
    expect(Object.is(calculate(-0.1, -0.1, 'subtract'), 0)).toBe(true)
  })
})
