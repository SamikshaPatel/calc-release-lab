export type Operation = 'add' | 'subtract' | 'multiply' | 'divide'

export const SUPPORTED_OPERATIONS: readonly Operation[] = ['add', 'subtract', 'multiply', 'divide']

export class CalculationError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = 'CalculationError'
    this.code = code
  }
}

export function isOperation(value: unknown): value is Operation {
  return typeof value === 'string' && (SUPPORTED_OPERATIONS as readonly string[]).includes(value)
}

export const DECIMAL_PLACES = 10

/** Round to 10 decimal places so binary floating-point noise never reaches users (CALC-9). */
export function roundResult(value: number): number {
  if (!Number.isFinite(value) || Math.abs(value) >= 1e21) return value
  return Number(value.toFixed(DECIMAL_PLACES))
}

export function calculate(a: number, b: number, op: Operation): number {
  return roundResult(rawCalculate(a, b, op))
}

function rawCalculate(a: number, b: number, op: Operation): number {
  switch (op) {
    case 'add':
      return a + b
    case 'subtract':
      return a - b
    case 'multiply':
      return a * b
    case 'divide':
      if (b === 0) throw new CalculationError('DIVIDE_BY_ZERO', 'Cannot divide by zero')
      return a / b
  }
}
