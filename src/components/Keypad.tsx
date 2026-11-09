import { KEYS } from './keys'

export default function Keypad({ onKey }: { onKey?: (id: string) => void }) {
  return (
    <div className="keypad">
      {KEYS.map((k) => (
        <button
          key={k.id}
          type="button"
          className={`key key--${k.kind}`}
          style={{ gridArea: k.area }}
          data-testid={`key-${k.id}`}
          aria-label={k.ariaLabel}
          onClick={() => onKey?.(k.id)}
        >
          {k.label}
        </button>
      ))}
    </div>
  )
}
