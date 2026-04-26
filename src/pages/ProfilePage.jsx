import { useState, useEffect } from 'react'
import { Container, Card, Row, Col, Button, Badge, Modal, Toast, ToastContainer } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth, toUsername } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import OnboardingModal from '../components/OnboardingModal'

const GENRE_LABELS = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 14: 'Fantasy',
  27: 'Horror', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  53: 'Thriller', 10752: 'War', 37: 'Western', 10765: 'Sci-Fi & Fantasy',
}

const SERVICE_LABELS = {
  netflix: 'Netflix', hbo: 'Max (HBO)', disney: 'Disney+',
  prime: 'Prime Video', hulu: 'Hulu', apple: 'Apple TV+',
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { getItemsByStatus } = useLibrary()
  const navigate = useNavigate()

  const [prefs, setPrefs] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'profile', 'settings')
    getDoc(ref).then(snap => {
      if (snap.exists()) setPrefs(snap.data())
    })
  }, [user])

  function handleSignOut() {
    setShowConfirm(false)
    signOut().then(() => {
      navigate('/')
      setShowToast(true)
    })
  }

  function handlePrefsComplete() {
    setShowOnboarding(false)
    // Re-fetch updated prefs
    const ref = doc(db, 'users', user.uid, 'profile', 'settings')
    getDoc(ref).then(snap => {
      if (snap.exists()) setPrefs(snap.data())
    })
  }

  if (!user) {
    return (
      <div className="w-100 d-flex justify-content-center align-items-start py-4 px-3">
        <Container className="p-0" style={{ maxWidth: '600px' }}>
          <Card className="m-2 p-2 text-center">
            <Card.Body>
              <p className="text-muted mb-0">Sign in to view your profile.</p>
            </Card.Body>
          </Card>
        </Container>
      </div>
    )
  }

  const createdDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  const planCount     = getItemsByStatus('watchlist').length
  const watchingCount = getItemsByStatus('watching').length
  const watchedCount  = getItemsByStatus('watched').length

  return (
    <div className="w-100 d-flex justify-content-center align-items-start py-4 px-3">
      <Container className="p-0" style={{ maxWidth: '700px' }}>

        <Card className="m-2 p-2 mb-4">
          <Card.Body>
            <h1 className="mb-1">{toUsername(user.email)}</h1>
            {createdDate && (
              <p className="text-muted small mb-0">Member since {createdDate}</p>
            )}
          </Card.Body>
        </Card>

        <Card className="m-2 p-2 mb-4">
          <Card.Body>
            <h2 className="mb-3 fs-5">Library</h2>
            <Row className="g-3 text-center">
              <Col xs={4}>
                <div className="fw-bold fs-3">{planCount}</div>
                <div className="text-muted small">Plan to Watch</div>
              </Col>
              <Col xs={4}>
                <div className="fw-bold fs-3">{watchingCount}</div>
                <div className="text-muted small">Watching</div>
              </Col>
              <Col xs={4}>
                <div className="fw-bold fs-3">{watchedCount}</div>
                <div className="text-muted small">Watched</div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {prefs && (
          <Card className="m-2 p-2 mb-4">
            <Card.Body>
              <h2 className="mb-3 fs-5">Preferences</h2>

              {prefs.favoriteGenres?.length > 0 && (
                <div className="mb-2">
                  <span className="text-muted small me-2">Genres:</span>
                  <div className="d-inline-flex flex-wrap gap-1">
                    {prefs.favoriteGenres.map(id => (
                      <Badge key={id} bg="secondary">{GENRE_LABELS[id] ?? id}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-2">
                <span className="text-muted small me-2">Shows:</span>
                <Badge bg="warning" text="dark">{prefs.mediaPreference || 'both'}</Badge>
              </div>

              {prefs.streamingServices?.length > 0 && (
                <div className="mb-3">
                  <span className="text-muted small me-2">Streaming:</span>
                  <div className="d-inline-flex flex-wrap gap-1">
                    {prefs.streamingServices.map(id => (
                      <Badge key={id} bg="secondary">{SERVICE_LABELS[id] ?? id}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="outline-warning" size="sm" onClick={() => setShowOnboarding(true)}>
                Edit Preferences
              </Button>
            </Card.Body>
          </Card>
        )}

        {!prefs && (
          <Card className="m-2 p-2 mb-4">
            <Card.Body>
              <h2 className="mb-2 fs-5">Preferences</h2>
              <p className="text-muted small mb-3">You haven't set up your preferences yet.</p>
              <Button variant="warning" size="sm" onClick={() => setShowOnboarding(true)}>
                Set Up Preferences
              </Button>
            </Card.Body>
          </Card>
        )}

        <Card className="m-2 p-2">
          <Card.Body>
            <Button variant="outline-danger" onClick={() => setShowConfirm(true)}>
              Sign Out
            </Button>
          </Card.Body>
        </Card>

      </Container>

      <OnboardingModal
        show={showOnboarding}
        onComplete={handlePrefsComplete}
        initialValues={prefs}
        allowCancel
      />

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to sign out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="warning" onClick={handleSignOut}>Sign Out</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
          <Toast.Body className="text-white fw-semibold">You have been signed out.</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}
