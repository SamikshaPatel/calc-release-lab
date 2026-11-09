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

export function calculate(a: number, b: number, op: Operation): number {
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
