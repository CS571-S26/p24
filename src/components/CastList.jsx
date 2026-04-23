import { Row, Col, Card } from 'react-bootstrap'

export default function CastList({ cast }) {
  if (!cast?.length) return null
  const top = cast.slice(0, 8)

  return (
    <div className="mb-4">
      <h2 className="section-title mb-3">Cast</h2>
      <Row className="g-2">
        {top.map(person => (
          <Col key={person.cast_id ?? person.id} xs={4} sm={3} md={2}>
            <Card className="movie-card h-100 text-center">
              {person.profile_path ? (
                <Card.Img
                  variant="top"
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                />
              ) : (
                <div
                  className="bg-secondary d-flex align-items-center justify-content-center text-white"
                  style={{ height: 110, fontSize: '2rem' }}
                >
                  ?
                </div>
              )}
              <Card.Body className="p-2">
                <p className="mb-0 fw-semibold text-white" style={{ fontSize: '0.75rem' }}>{person.name}</p>
                <p className="mb-0" style={{ fontSize: '0.68rem', color: '#adb5bd' }}>{person.character}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
