import { Container, Card, Row, Col, Badge } from 'react-bootstrap'
import '../App.css'

const STACK = [
  { name: 'React 19', desc: 'UI framework' },
  { name: 'Vite 7', desc: 'Build tool' },
  { name: 'React Bootstrap', desc: 'Component library' },
  { name: 'React Router DOM 7', desc: 'Client-side routing' },
  { name: 'Firebase Auth', desc: 'User authentication' },
  { name: 'Firestore', desc: 'Watchlist database' },
  { name: 'TMDB API', desc: 'Movie & TV data' },
  { name: 'GitHub Pages', desc: 'Hosting' },
]

export default function AboutPage() {
  return (
    <div className="w-100 d-flex justify-content-center align-items-start py-4 px-3">
      <Container className="p-0" style={{ maxWidth: '800px' }}>

        <Card className="m-2 p-2 mb-4">
          <Card.Body>
            <h2 className="mb-3">About MOViE?</h2>
            <p className="mb-0">
              It's almost midnight. The food is ready, the lights are dimmed — but your hand keeps
              scrolling endlessly trying to find something worth watching. <strong>MOViE?</strong> is
              designed to solve exactly that. Search trending movies and TV shows, get full details
              including cast, trailer, and where to stream, and save anything you like to your
              personal watchlist.
            </p>
          </Card.Body>
        </Card>

        <Card className="m-2 p-2 mb-4">
          <Card.Body>
            <h3 className="mb-3">Tech Stack</h3>
            <Row className="g-2">
              {STACK.map(item => (
                <Col key={item.name} xs={12} sm={6}>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="warning" text="dark" className="flex-shrink-0">{item.name}</Badge>
                    <span className="text-muted small">{item.desc}</span>
                  </div>
                </Col>
              ))}
            </Row>
            <p className="text-muted small mt-3 mb-0">
              Movie and TV data provided by{' '}
              <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
                TMDB
              </a>
              . This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </Card.Body>
        </Card>

        <Card className="m-2 p-2">
          <Card.Body>
            <h3 className="mb-2">Developer</h3>
            <p className="mb-0">
              Built by <strong>Hazim Shah and Amirul Azmi</strong> for CS571 — Building User Interfaces,
              UW–Madison, Spring 2026.
            </p>
          </Card.Body>
        </Card>

      </Container>
    </div>
  )
}
