import { Card, Container } from 'react-bootstrap'

export default function WatchListPage() {
  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-start py-4 px-3">
      <Container className="p-0" style={{ maxWidth: '900px' }}>
        <Card className="m-2 p-2">
          <Card.Body>
            <h2 className="mb-2">Watch List</h2>
            <p className="mb-0 text-muted">
              Your saved movies will appear here.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
