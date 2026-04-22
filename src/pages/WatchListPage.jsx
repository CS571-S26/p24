import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWatchlist } from '../context/WatchlistContext'

export default function WatchListPage() {
  const { user } = useAuth()
  const { items, removeFromWatchlist } = useWatchlist()

  if (!user) {
    return (
      <div className="w-100 d-flex justify-content-center align-items-start py-4 px-3">
        <Container className="p-0" style={{ maxWidth: '900px' }}>
          <Card className="m-2 p-2 text-center">
            <Card.Body>
              <h2 className="mb-3">My Watchlist</h2>
              <p className="text-muted mb-3">Sign in to save and view your watchlist.</p>
              <Button as={Link} to="/sign-in" variant="warning">Sign In / Sign Up</Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    )
  }

  return (
    <div className="w-100 d-flex justify-content-center align-items-start py-4 px-3">
      <Container className="p-0" style={{ maxWidth: '1100px' }}>
        <h2 className="mb-4 px-2">My Watchlist</h2>

        {items.length === 0 ? (
          <Card className="m-2 p-2 text-center">
            <Card.Body>
              <p className="text-muted mb-0">No movies saved yet. Go browse and hit <strong>+ Watchlist</strong>!</p>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-3 px-2">
            {items.map(item => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="movie-card h-100">
                  {item.poster_path && (
                    <Card.Img
                      variant="top"
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="movie-card-title mb-auto">{item.title}</Card.Title>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="mt-2 w-100"
                      onClick={() => removeFromWatchlist(item.id)}
                    >
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  )
}
