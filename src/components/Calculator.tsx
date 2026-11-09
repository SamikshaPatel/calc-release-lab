import { useReducer } from 'react'
import Display from './Display'
import Keypad from './Keypad'
import { calcReducer, initialState } from '../logic/calculator-state'
import './calculator.css'

export default function Calculator() {
  const [state, dispatch] = useReducer(calcReducer, initialState)

  const handleKey = (id: string) => {
    if (/^\d$/.test(id)) dispatch({ type: 'digit', digit: id })
    else if (id === 'decimal') dispatch({ type: 'decimal' })
    else if (id === 'clear') dispatch({ type: 'clear' })
    // operators and equals arrive in CALC-8
  }

  return (
    <section className="calculator" aria-label="Calculator">
      <Display value={state.display} />
      <Keypad onKey={handleKey} />
    </section>
  )
}
