import { useState } from 'react'
import Display from './Display'
import Keypad from './Keypad'
import { inputDigit, inputDecimal } from '../logic/entry'
import './calculator.css'

export default function Calculator() {
  const [display, setDisplay] = useState('0')

  const handleKey = (id: string) => {
    if (/^\d$/.test(id)) setDisplay((d) => inputDigit(d, id))
    else if (id === 'decimal') setDisplay(inputDecimal)
    // operators, equals and clear arrive in CALC-7 and CALC-8
  }

  return (
    <section className="calculator" aria-label="Calculator">
      <Display value={display} />
      <Keypad onKey={handleKey} />
    </section>
  )
}
