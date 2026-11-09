import { describe, it, expect } from 'vitest'
import { inputDigit, inputDecimal } from './entry'

const press = (keys: string[], start = '0') =>
  keys.reduce((d, k) => (k === '.' ? inputDecimal(d) : inputDigit(d, k)), start)

describe('number entry (CALC-6)', () => {
  it.each([
    [['7'], '7'],
    [['0', '0', '7'], '7'],
    [['0', '0'], '0'],
    [['1', '2', '3'], '123'],
    [['.'], '0.'],
    [['.', '5'], '0.5'],
    [['1', '.', '.', '5'], '1.5'],
    [['1', '.', '5', '.', '2'], '1.52'],
    [['0', '.', '0', '0'], '0.00'],
    [['1', '0', '0'], '100'],
  ])('keys %j → %s', (keys, expected) => {
    expect(press(keys)).toBe(expected)
  })
})
