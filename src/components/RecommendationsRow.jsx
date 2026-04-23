import { Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function RecommendationsRow({ recommendations, mediaType }) {
  const items = (recommendations?.results || [])
    .filter(r => r.poster_path)
    .slice(0, 12)

  if (!items.length) return null

  return (
    <div className="mb-4">
      <h2 className="section-title mb-3">More Like This</h2>
      <Row className="g-3">
        {items.map(item => {
          const type = item.media_type || mediaType
          return (
            <Col key={item.id} xs={6} sm={4} md={3} lg={2}>
              <Link to={`/${type}/${item.id}`} style={{ textDecoration: 'none' }}>
                <Card className="movie-card h-100">
                  <Card.Img
                    variant="top"
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt={item.title || item.name}
                  />
                  <Card.Body className="p-2">
                    <p className="movie-card-title mb-0">{item.title || item.name}</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}
