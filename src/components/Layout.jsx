import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Navbar, Container, Form, Button, NavDropdown, Modal, Toast, ToastContainer } from 'react-bootstrap'
import '../App.css'
import { useAuth, toUsername } from '../context/AuthContext'

export default function Layout() {
  const [globalQuery, setGlobalQuery] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  function handleSignOut() {
    setShowConfirm(false)
    signOut().then(() => {
      navigate('/')
      setShowToast(true)
    })
  }

  const getTabClass = ({ isActive }) =>
    `nav-link fw-semibold px-3 ${isActive ? 'text-warning' : 'text-light'}`

  const handleGlobalSearch = e => {
    e.preventDefault()
    navigate('/', { state: { searchQuery: globalQuery.trim() } })
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
        <Container fluid className="justify-content-center align-items-center gap-3 flex-wrap">
          <Navbar.Brand as={Link} to="/" className="fw-bold text-white mb-0">
            MOViE?
          </Navbar.Brand>

          <nav className="d-flex align-items-center gap-1 flex-wrap">
            <NavLink to="/" end className={getTabClass}>Home</NavLink>
            <NavLink to="/watch-list" className={getTabClass}>Watchlist</NavLink>
            <NavLink to="/about" className={getTabClass}>About</NavLink>
          </nav>

          <Form className="d-flex align-items-center gap-2 flex-nowrap" onSubmit={handleGlobalSearch}>
            <Form.Control
              type="text"
              size="sm"
              placeholder="Search movie..."
              value={globalQuery}
              onChange={e => setGlobalQuery(e.target.value)}
              aria-label="Search movie from top navigation"
            />
            <Button type="submit" variant="warning" size="sm">Search</Button>
          </Form>

          {user ? (
            <NavDropdown
              title={<span className="text-warning fw-semibold">{toUsername(user.email)}</span>}
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item onClick={() => setShowConfirm(true)}>
                Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <NavLink to="/sign-in" className={getTabClass}>Sign In</NavLink>
          )}
        </Container>
      </Navbar>

      <main>
        <Outlet />
      </main>

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
