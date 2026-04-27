import { Row, Col, Form } from 'react-bootstrap'

const SERVICES = [
  { id: 'netflix', label: 'Netflix'      },
  { id: 'hbo',     label: 'Max (HBO)'   },
  { id: 'disney',  label: 'Disney+'     },
  { id: 'prime',   label: 'Prime Video' },
  { id: 'hulu',    label: 'Hulu'        },
  { id: 'apple',   label: 'Apple TV+'   },
]

export default function ServicesStep({ selected, onChange }) {
  function toggle(id) {
    onChange(
      selected.includes(id)
        ? selected.filter(s => s !== id)
        : [...selected, id]
    )
  }

  return (
    <>
      <h2 className="section-title mb-2">Where can you watch?</h2>
      <p className="text-muted mb-4">Leave blank to see everything.</p>
      <Row className="g-3">
        {SERVICES.map(svc => (
          <Col key={svc.id} xs={12} sm={6} md={4}>
            <Form.Check
              type="checkbox"
              id={`pick-svc-${svc.id}`}
              label={svc.label}
              checked={selected.includes(svc.id)}
              onChange={() => toggle(svc.id)}
            />
          </Col>
        ))}
      </Row>
    </>
  )
}
