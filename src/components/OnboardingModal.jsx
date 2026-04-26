import { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

const GENRES = [
  { id: 28,    label: 'Action' },
  { id: 12,    label: 'Adventure' },
  { id: 16,    label: 'Animation' },
  { id: 35,    label: 'Comedy' },
  { id: 80,    label: 'Crime' },
  { id: 99,    label: 'Documentary' },
  { id: 18,    label: 'Drama' },
  { id: 14,    label: 'Fantasy' },
  { id: 27,    label: 'Horror' },
  { id: 9648,  label: 'Mystery' },
  { id: 10749, label: 'Romance' },
  { id: 878,   label: 'Sci-Fi' },
  { id: 53,    label: 'Thriller' },
  { id: 10752, label: 'War' },
  { id: 37,    label: 'Western' },
  { id: 10765, label: 'Sci-Fi & Fantasy' },
]

const MEDIA_OPTIONS = [
  { key: 'both',   label: 'Both',     desc: 'Show me everything' },
  { key: 'movies', label: 'Movies',   desc: 'Films only' },
  { key: 'tv',     label: 'TV Shows', desc: 'Series & shows' },
]

const SERVICES = [
  { id: 'netflix', label: 'Netflix' },
  { id: 'hbo',     label: 'Max (HBO)' },
  { id: 'disney',  label: 'Disney+' },
  { id: 'prime',   label: 'Prime Video' },
  { id: 'hulu',    label: 'Hulu' },
  { id: 'apple',   label: 'Apple TV+' },
]

const TOTAL_STEPS = 3

export default function OnboardingModal({ show, onComplete, initialValues = null, allowCancel = false }) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [mediaPreference, setMediaPreference] = useState('both')
  const [streamingServices, setStreamingServices] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (show) {
      setStep(1)
      setSelectedGenres(initialValues?.favoriteGenres ?? [])
      setMediaPreference(initialValues?.mediaPreference ?? 'both')
      setStreamingServices(initialValues?.streamingServices ?? [])
    }
  }, [show])

  function toggleGenre(id) {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  function toggleService(id) {
    setStreamingServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  async function savePreferences(genres, media, services) {
    if (!user) return
    try {
      const ref = doc(db, 'users', user.uid, 'profile', 'settings')
      await setDoc(ref, {
        favoriteGenres: genres,
        mediaPreference: media,
        streamingServices: services,
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      })
    } catch {
      // non-critical — if it fails, user still gets in
    }
  }

  async function handleFinish() {
    setSaving(true)
    await savePreferences(selectedGenres, mediaPreference, streamingServices)
    setSaving(false)
    onComplete()
  }

  function handleSkip() {
    onComplete()
  }

  return (
    <Modal show={show} onHide={handleSkip} centered size="lg" backdrop="static">
      <Modal.Header>
        <Modal.Title>Set up your preferences</Modal.Title>
        <span className="text-muted ms-3 small">Step {step} of {TOTAL_STEPS}</span>
      </Modal.Header>

      <Modal.Body>
        {step === 1 && (
          <>
            <p className="mb-3">Pick genres you enjoy — we'll use these to personalise your home page.</p>
            <div className="d-flex flex-wrap gap-2">
              {GENRES.map(g => (
                <Button
                  key={g.id}
                  variant={selectedGenres.includes(g.id) ? 'warning' : 'outline-secondary'}
                  size="sm"
                  onClick={() => toggleGenre(g.id)}
                >
                  {g.label}
                </Button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="mb-3">What do you mostly want to watch?</p>
            <Row className="g-3">
              {MEDIA_OPTIONS.map(opt => (
                <Col key={opt.key} xs={12} sm={4}>
                  <div
                    role="button"
                    onClick={() => setMediaPreference(opt.key)}
                    className={`border rounded p-3 text-center ${
                      mediaPreference === opt.key
                        ? 'border-warning bg-warning bg-opacity-10'
                        : 'border-secondary'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fw-bold">{opt.label}</div>
                    <div className="text-muted small">{opt.desc}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        {step === 3 && (
          <>
            <p className="mb-3">Which streaming services do you subscribe to? (optional)</p>
            <Row className="g-3">
              {SERVICES.map(svc => (
                <Col key={svc.id} xs={12} sm={6} md={4}>
                  <Form.Check
                    type="checkbox"
                    id={`svc-${svc.id}`}
                    label={svc.label}
                    checked={streamingServices.includes(svc.id)}
                    onChange={() => toggleService(svc.id)}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="justify-content-between">
        <Button variant="link" className="text-muted p-0 text-decoration-none" onClick={handleSkip}>
          {allowCancel ? 'Cancel' : 'Skip setup'}
        </Button>
        <div className="d-flex gap-2">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(s => s - 1)}>
              Back
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button variant="warning" onClick={() => setStep(s => s + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="warning" onClick={handleFinish} disabled={saving}>
              {saving ? 'Saving…' : 'Finish'}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  )
}
