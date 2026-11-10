export type KeyKind = 'digit' | 'operator' | 'equals' | 'clear' | 'decimal'

export type KeyDef = {
  id: string
  label: string
  area: string
  kind: KeyKind
  ariaLabel?: string
}

// 17 keys on a 4x5 grid; "+" and "=" span two rows, "0" spans two columns
export const KEYS: KeyDef[] = [
  { id: 'clear', label: 'C', area: 'clear', kind: 'clear', ariaLabel: 'clear' },
  { id: 'divide', label: '÷', area: 'div', kind: 'operator', ariaLabel: 'divide' },
  { id: 'multiply', label: '×', area: 'mul', kind: 'operator', ariaLabel: 'multiply' },
  { id: 'subtract', label: '−', area: 'sub', kind: 'operator', ariaLabel: 'subtract' },
  { id: '7', label: '7', area: 'k7', kind: 'digit' },
  { id: '8', label: '8', area: 'k8', kind: 'digit' },
  { id: '9', label: '9', area: 'k9', kind: 'digit' },
  { id: 'add', label: '+', area: 'add', kind: 'operator', ariaLabel: 'add' },
  { id: '4', label: '4', area: 'k4', kind: 'digit' },
  { id: '5', label: '5', area: 'k5', kind: 'digit' },
  { id: '6', label: '6', area: 'k6', kind: 'digit' },
  { id: '1', label: '1', area: 'k1', kind: 'digit' },
  { id: '2', label: '2', area: 'k2', kind: 'digit' },
  { id: '3', label: '3', area: 'k3', kind: 'digit' },
  { id: 'equals', label: '=', area: 'eq', kind: 'equals', ariaLabel: 'equals' },
  { id: '0', label: '0', area: 'k0', kind: 'digit' },
  { id: 'decimal', label: '.', area: 'dot', kind: 'decimal', ariaLabel: 'decimal point' },
]
