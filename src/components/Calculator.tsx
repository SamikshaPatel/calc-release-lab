import { useReducer } from 'react'
import Display from './Display'
import Keypad from './Keypad'
import { calcReducer, initialState, type Operator } from '../logic/calculator-state'
import { requestCalculation } from '../api/calculate'
import './calculator.css'

const SYMBOLS: Record<Operator, string> = { add: '+', subtract: '−', multiply: '×', divide: '÷' }
const isOperator = (id: string): id is Operator => id in SYMBOLS

export default function Calculator() {
  const [state, dispatch] = useReducer(calcReducer, initialState)

  const handleEquals = async () => {
    if (state.previous === null || state.operator === null || state.status === 'loading' || state.error) return
    dispatch({ type: 'equalsStart' })
    const r = await requestCalculation(Number(state.previous), Number(state.display), state.operator)
    dispatch(r.ok ? { type: 'equalsSuccess', result: r.result } : { type: 'equalsFailure', message: r.message })
  }

  const handleKey = (id: string) => {
    if (/^\d$/.test(id)) dispatch({ type: 'digit', digit: id })
    else if (id === 'decimal') dispatch({ type: 'decimal' })
    else if (id === 'clear') dispatch({ type: 'clear' })
    else if (isOperator(id)) dispatch({ type: 'operator', op: id })
    else if (id === 'equals') void handleEquals()
  }

  const pending = state.previous !== null && state.operator !== null ? `${state.previous} ${SYMBOLS[state.operator]}` : null

  return (
    <section className="calculator" aria-label="Calculator">
      <Display value={state.display} pending={pending} error={state.error} busy={state.status === 'loading'} />
      <Keypad onKey={handleKey} />
    </section>
  )
}
