export default function Display({ value }: { value: string }) {
  return (
    <output className="display" data-testid="display" aria-label="Calculator display">
      {value}
    </output>
  )
}
