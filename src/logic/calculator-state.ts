import { inputDigit, inputDecimal } from './entry'

export type CalcState = {
  display: string
  previous: string | null // pending first number (used from CALC-8)
  operator: string | null // pending operator (used from CALC-8)
  lastAction: 'digit' | 'decimal' | 'clear' | null
}

export const initialState: CalcState = { display: '0', previous: null, operator: null, lastAction: null }

export type CalcAction = { type: 'digit'; digit: string } | { type: 'decimal' } | { type: 'clear' }

export function calcReducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'digit':
      return { ...state, display: inputDigit(state.display, action.digit), lastAction: 'digit' }
    case 'decimal':
      return { ...state, display: inputDecimal(state.display), lastAction: 'decimal' }
    case 'clear':
      // second press in a row = All Clear: reset everything
      if (state.lastAction === 'clear') return { ...initialState, lastAction: 'clear' }
      // first press = Clear entry: keep anything pending
      return { ...state, display: '0', lastAction: 'clear' }
  }
}
