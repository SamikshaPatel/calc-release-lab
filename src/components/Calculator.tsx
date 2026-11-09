import { useState } from 'react'
import Display from './Display'
import Keypad from './Keypad'
import './calculator.css'

export default function Calculator() {
  const [display] = useState('0') // entry logic arrives in CALC-6
  return (
    <section className="calculator" aria-label="Calculator">
      <Display value={display} />
      <Keypad />
    </section>
  )
}
