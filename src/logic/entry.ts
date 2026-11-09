// Number entry rules (CALC-6)

/** Append a digit; a lone "0" is replaced so "007" becomes "7". */
export function inputDigit(current: string, digit: string): string {
  if (current === '0') return digit
  return current + digit
}

/** Add a decimal point unless the number already has one; "0" becomes "0.". */
export function inputDecimal(current: string): string {
  return current.includes('.') ? current : current + '.'
}
