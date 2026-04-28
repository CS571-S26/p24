import { useState, useEffect } from 'react'
import { Button, Badge, Modal, Toast, ToastContainer } from 'react-bootstrap'
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
      <div className="profile-page">
        <div className="profile-wrapper">
          <div className="glass-card text-center">
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: 0 }}>Sign in to view your profile.</p>
          </div>
        </div>
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
    <div className="profile-page">
      <div className="profile-wrapper">

        {/* Primary card — identity + stats */}
        <div className="glass-card text-center" style={{ position: 'relative' }}>
          <div className="glass-card-glow" />

          {/* Avatar — username initial */}
          <div className="profile-avatar">
            {toUsername(user.email).charAt(0).toUpperCase()}
          </div>

          <h1 className="profile-username">{toUsername(user.email)}</h1>
          {createdDate && (
            <p className="profile-since">Member since {createdDate}</p>
          )}

          <hr className="glass-divider" />

          {/* Library stats */}
          <p className="glass-section-label">Library</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-number">{planCount}</div>
              <div className="profile-stat-label">Plan to Watch</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-number">{watchingCount}</div>
              <div className="profile-stat-label">Watching</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-number">{watchedCount}</div>
              <div className="profile-stat-label">Watched</div>
            </div>
          </div>
        </div>

        {/* Preferences card */}
        <div className="glass-card">
          <p className="glass-section-label">Preferences</p>

          {prefs ? (
            <>
              {prefs.favoriteGenres?.length > 0 && (
                <div className="mb-3">
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem' }} className="me-2">Genres:</span>
                  <div className="d-inline-flex flex-wrap gap-2 justify-content-center">
                    {prefs.favoriteGenres.map(id => (
                      <Badge key={id} bg="secondary" style={{ fontSize: '0.95rem' }}>{GENRE_LABELS[id] ?? id}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-3">
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem' }} className="me-2">Shows:</span>
                <Badge bg="warning" text="dark" style={{ fontSize: '0.95rem' }}>{prefs.mediaPreference || 'both'}</Badge>
              </div>
              {prefs.streamingServices?.length > 0 && (
                <div className="mb-4">
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem' }} className="me-2">Streaming:</span>
                  <div className="d-inline-flex flex-wrap gap-2 justify-content-center">
                    {prefs.streamingServices.map(id => (
                      <Badge key={id} bg="secondary" style={{ fontSize: '0.95rem' }}>{SERVICE_LABELS[id] ?? id}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="outline-warning" size="sm" onClick={() => setShowOnboarding(true)}>
                Edit Preferences
              </Button>
            </>
          ) : (
            <>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem' }} className="mb-3">You haven't set up your preferences yet.</p>
              <Button variant="warning" size="sm" onClick={() => setShowOnboarding(true)}>
                Set Up Preferences
              </Button>
            </>
          )}
        </div>

        {/* Sign out card */}
        <div className="glass-card">
          <Button variant="outline-danger" onClick={() => setShowConfirm(true)}>
            Sign Out
          </Button>
        </div>

      </div>

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
