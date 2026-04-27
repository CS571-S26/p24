import { Button } from 'react-bootstrap'

const PRESETS = [
  { value: 60,  label: '1h'     },
  { value: 90,  label: '1h 30m' },
  { value: 120, label: '2h'     },
  { value: 150, label: '2h 30m' },
  { value: 180, label: '3h'     },
]

export default function TimeStep({ runtime, onChange }) {
  return (
    <>
      <h2 className="section-title mb-4">How long do you have?</h2>
      <div className="d-flex flex-wrap justify-content-center gap-3">
        {PRESETS.map(p => (
          <Button
            key={p.value}
            variant={runtime === p.value ? 'warning' : 'outline-secondary'}
            onClick={() => onChange(p.value)}
            style={{ minWidth: '100px' }}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </>
  )
}
