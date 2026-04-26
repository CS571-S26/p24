import { useState } from 'react'
import { Container, Card, Row, Col, Button, Tabs, Tab } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import LibraryButton from '../components/LibraryButton'

const TABS = [
  { key: 'watchlist', title: 'Plan to Watch' },
  { key: 'watching',  title: 'Currently Watching' },
  { key: 'watched',   title: 'Watched' },
]

function LibraryGrid({ items }) {
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <Card className="m-2 p-2 text-center">
        <Card.Body>
          <p className="text-muted mb-0">Nothing here yet.</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Row className="g-3 px-2">
      {items.map(item => (
        <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
          <Card
            className="movie-card h-100"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/${item.media_type || 'movie'}/${item.id}`)}
          >
            {item.poster_path && (
              <Card.Img
                variant="top"
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title}
              />
            )}
            <Card.Body className="d-flex flex-column">
              <Card.Title className="movie-card-title mb-auto">{item.title}</Card.Title>
              <LibraryButton movie={item} />
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default function LibraryPage() {
  const { user } = useAuth()
  const { getItemsByStatus } = useLibrary()
  const [activeTab, setActiveTab] = useState('watchlist')

  if (!user) {
    return (
      <div className="w-100 d-flex justify-content-center align-items-start py-4 px-3">
        <Container className="p-0" style={{ maxWidth: '900px' }}>
          <Card className="m-2 p-2 text-center">
            <Card.Body>
              <h1 className="mb-3 fs-3">My Library</h1>
              <p className="text-muted mb-3">Sign in to save and track movies and shows.</p>
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
        <h1 className="mb-4 px-2">My Library</h1>
        <Tabs
          activeKey={activeTab}
          onSelect={k => setActiveTab(k)}
          className="mb-4 px-2"
        >
          {TABS.map(({ key, title }) => (
            <Tab key={key} eventKey={key} title={`${title} (${getItemsByStatus(key).length})`}>
                  <LibraryGrid items={getItemsByStatus(key)} />
            </Tab>
          ))}
        </Tabs>
      </Container>
    </div>
  )
}
