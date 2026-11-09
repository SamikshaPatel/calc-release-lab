import { inputDigit, inputDecimal } from './entry'

export type Operator = 'add' | 'subtract' | 'multiply' | 'divide'

export type CalcState = {
  display: string
  previous: string | null
  operator: Operator | null
  waitingForOperand: boolean // next digit starts a new number
  status: 'idle' | 'loading'
  error: boolean
  lastAction: 'digit' | 'decimal' | 'clear' | 'operator' | 'equals' | null
}

export const initialState: CalcState = {
  display: '0', previous: null, operator: null, waitingForOperand: false, status: 'idle', error: false, lastAction: null,
}

export type CalcAction =
  | { type: 'digit'; digit: string }
  | { type: 'decimal' }
  | { type: 'clear' }
  | { type: 'operator'; op: Operator }
  | { type: 'equalsStart' }
  | { type: 'equalsSuccess'; result: number }
  | { type: 'equalsFailure'; message: string }

export function calcReducer(state: CalcState, action: CalcAction): CalcState {
  if (state.status === 'loading' && action.type !== 'equalsSuccess' && action.type !== 'equalsFailure') {
    return state // ignore keys while waiting for the API
  }
  const fresh = state.waitingForOperand || state.error

  switch (action.type) {
    case 'digit':
      return { ...state, display: inputDigit(fresh ? '0' : state.display, action.digit), waitingForOperand: false, error: false, lastAction: 'digit' }
    case 'decimal':
      return { ...state, display: inputDecimal(fresh ? '0' : state.display), waitingForOperand: false, error: false, lastAction: 'decimal' }
    case 'clear':
      if (state.lastAction === 'clear') return { ...initialState, lastAction: 'clear' } // AC
      return { ...state, display: '0', waitingForOperand: false, error: false, lastAction: 'clear' } // C
    case 'operator':
      if (state.error) return state
      // chaining (5 + 3 x 2) is CALC-205; for now a new operator replaces the pending one
      return { ...state, previous: state.waitingForOperand && state.previous ? state.previous : state.display, operator: action.op, waitingForOperand: true, lastAction: 'operator' }
    case 'equalsStart':
      return { ...state, status: 'loading' }
    case 'equalsSuccess':
      return { ...state, display: String(action.result), previous: null, operator: null, waitingForOperand: true, status: 'idle', error: false, lastAction: 'equals' }
    case 'equalsFailure':
      return { ...state, display: action.message, previous: null, operator: null, waitingForOperand: true, status: 'idle', error: true, lastAction: 'equals' }
  }
}
