type Props = { value: string; pending?: string | null; error?: boolean; busy?: boolean }

export default function Display({ value, pending = null, error = false, busy = false }: Props) {
  return (
    <div className={`display${error ? ' display--error' : ''}${busy ? ' display--busy' : ''}`}>
      <div className="display__pending" data-testid="pending">{pending ?? '\u00a0'}</div>
      <output data-testid="display" aria-label="Calculator display" aria-busy={busy}>
        {value}
      </output>
    </div>
  )
}
