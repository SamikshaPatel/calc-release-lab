import { describe, it, expect } from 'vitest'
import { calcReducer, initialState, type CalcState } from './calculator-state'

const pending: CalcState = { display: '12', previous: '5', operator: 'add', lastAction: 'digit' }

describe('Clear and All Clear (CALC-7)', () => {
  it('C clears the current entry but keeps the pending operation', () => {
    const s = calcReducer(pending, { type: 'clear' })
    expect(s).toMatchObject({ display: '0', previous: '5', operator: 'add' })
  })

  it('pressing C twice (AC) resets everything', () => {
    const once = calcReducer(pending, { type: 'clear' })
    const twice = calcReducer(once, { type: 'clear' })
    expect(twice).toMatchObject({ display: '0', previous: null, operator: null })
  })

  it('typing after C starts a fresh number', () => {
    const cleared = calcReducer(pending, { type: 'clear' })
    expect(calcReducer(cleared, { type: 'digit', digit: '7' }).display).toBe('7')
  })

  it('C on the initial state keeps the display at 0', () => {
    expect(calcReducer(initialState, { type: 'clear' }).display).toBe('0')
  })
})
