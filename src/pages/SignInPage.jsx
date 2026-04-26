import { useState } from 'react'
import { Card, Container, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import OnboardingModal from '../components/OnboardingModal'

// Usernames become the local-part of a fake email, so only these chars are safe
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/

function mapFirebaseError(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'Username is already taken'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':   return 'Wrong username or password'
    case 'auth/weak-password':    return 'Password must be at least 6 characters'
    default:                      return 'Something went wrong. Please try again.'
  }
}

export default function SignInPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('signin')
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Sign-in form state
  const [siUsername, setSiUsername] = useState('')
  const [siPassword, setSiPassword] = useState('')
  const [siError,    setSiError]    = useState('')
  const [siLoading,  setSiLoading]  = useState(false)

  // Sign-up form state
  const [suUsername, setSuUsername] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suError,    setSuError]    = useState('')
  const [suLoading,  setSuLoading]  = useState(false)

  function validate(username, password) {
    if (!username)                      return 'Username is required'
    if (!USERNAME_REGEX.test(username)) return 'Username can only contain letters, numbers, and underscores'
    if (password.length < 6)            return 'Password must be at least 6 characters'
    return null
  }

  function handleSignIn(e) {
    e.preventDefault()
    const err = validate(siUsername, siPassword)
    if (err) { setSiError(err); return }
    setSiError('')
    setSiLoading(true)
    signIn(siUsername, siPassword)
      .then(() => navigate('/'))
      .catch(err => setSiError(mapFirebaseError(err.code)))
      .finally(() => setSiLoading(false))
  }

  function handleSignUp(e) {
    e.preventDefault()
    const err = validate(suUsername, suPassword)
    if (err) { setSuError(err); return }
    setSuError('')
    setSuLoading(true)
    signUp(suUsername, suPassword)
      .then(() => setShowOnboarding(true))
      .catch(err => setSuError(mapFirebaseError(err.code)))
      .finally(() => setSuLoading(false))
  }

  return (
    <div className="w-100 d-flex justify-content-center align-items-start py-4 px-3">
      <Container className="p-0" style={{ maxWidth: '500px' }}>
        <Card className="m-2 p-2">
          <Card.Body>
            <h1 className="mb-3 fs-3">Welcome to MOViE?</h1>
            <Tabs
              activeKey={activeTab}
              onSelect={k => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="signin" title="Sign In">
                <Form onSubmit={handleSignIn}>
                  {siError && <Alert variant="danger">{siError}</Alert>}
                  <Form.Group className="mb-3" controlId="siUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. tungtung"
                      value={siUsername}
                      onChange={e => setSiUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="siPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={siPassword}
                      onChange={e => setSiPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </Form.Group>
                  <Button type="submit" variant="warning" disabled={siLoading}>
                    {siLoading ? 'Signing in…' : 'Sign In'}
                  </Button>
                </Form>
              </Tab>

              <Tab eventKey="signup" title="Sign Up">
                <Form onSubmit={handleSignUp}>
                  {suError && <Alert variant="danger">{suError}</Alert>}
                  <Form.Group className="mb-3" controlId="suUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. tungtung"
                      value={suUsername}
                      onChange={e => setSuUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="suPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Min 6 characters"
                      value={suPassword}
                      onChange={e => setSuPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Form.Group>
                  <Button type="submit" variant="warning" disabled={suLoading}>
                    {suLoading ? 'Creating account…' : 'Sign Up'}
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>

      <OnboardingModal
        show={showOnboarding}
        onComplete={() => { setShowOnboarding(false); navigate('/') }}
      />
    </div>
  )
}
