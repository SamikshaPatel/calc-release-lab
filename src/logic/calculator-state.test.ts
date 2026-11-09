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

describe('operators and equals (CALC-8)', () => {
  const run = (actions: Parameters<typeof calcReducer>[1][]) => actions.reduce(calcReducer, initialState)

  it('an operator stores the first number and the next digit starts a new one', () => {
    const s = run([{ type: 'digit', digit: '5' }, { type: 'operator', op: 'add' }, { type: 'digit', digit: '3' }])
    expect(s).toMatchObject({ previous: '5', operator: 'add', display: '3' })
  })

  it('a second operator replaces the pending one (chaining is CALC-205)', () => {
    const s = run([{ type: 'digit', digit: '5' }, { type: 'operator', op: 'add' }, { type: 'operator', op: 'multiply' }])
    expect(s).toMatchObject({ previous: '5', operator: 'multiply' })
  })

  it('a successful result shows and clears the pending operation', () => {
    const s = run([{ type: 'digit', digit: '5' }, { type: 'operator', op: 'add' }, { type: 'equalsStart' }, { type: 'equalsSuccess', result: 8 }])
    expect(s).toMatchObject({ display: '8', previous: null, operator: null, status: 'idle' })
  })

  it('an error shows the message, and the next digit starts fresh', () => {
    const failed = run([{ type: 'equalsStart' }, { type: 'equalsFailure', message: 'Cannot divide by zero' }])
    expect(failed).toMatchObject({ display: 'Cannot divide by zero', error: true })
    expect(calcReducer(failed, { type: 'digit', digit: '4' })).toMatchObject({ display: '4', error: false })
  })

  it('keys are ignored while loading', () => {
    const loading = run([{ type: 'equalsStart' }])
    expect(calcReducer(loading, { type: 'digit', digit: '9' })).toBe(loading)
  })

  it('CALC-7 carry-over: C after "5 + 3" keeps "5 +"; C C clears it', () => {
    const typed = run([{ type: 'digit', digit: '5' }, { type: 'operator', op: 'add' }, { type: 'digit', digit: '3' }])
    const c = calcReducer(typed, { type: 'clear' })
    expect(c).toMatchObject({ display: '0', previous: '5', operator: 'add' })
    expect(calcReducer(c, { type: 'clear' })).toMatchObject({ previous: null, operator: null })
  })
})
