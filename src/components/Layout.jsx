import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Container, Form, Button, NavDropdown, Modal, Toast, ToastContainer, Badge } from 'react-bootstrap'
import '../App.css'
import { useAuth, toUsername } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'

export default function Layout() {
  const [globalQuery, setGlobalQuery] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const { getItemsByStatus } = useLibrary()
  const watchlistCount = user ? getItemsByStatus('watchlist').length : 0

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

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
          <Navbar.Brand as={Link} to="/" className="mb-0 brand-logo">
            MOViE?
          </Navbar.Brand>

          <nav className="d-flex align-items-center gap-1 flex-wrap">
            <NavLink to="/" end className={getTabClass}>Home</NavLink>
            {user && <NavLink to="/browse" className={getTabClass}>Browse</NavLink>}
            <NavLink to="/library" className={getTabClass}>
              Library
              {watchlistCount > 0 && (
                <Badge
                  bg="warning"
                  pill
                  text="dark"
                  className="ms-2"
                  aria-label={`${watchlistCount > 99 ? '99+' : watchlistCount} ${watchlistCount === 1 ? 'item' : 'items'} in watchlist`}
                >
                  {watchlistCount > 99 ? '99+' : watchlistCount}
                </Badge>
              )}
            </NavLink>
            <NavLink to="/about" className={getTabClass}>About</NavLink>
          </nav>

          <Form className="d-flex align-items-center gap-2 flex-nowrap" onSubmit={handleGlobalSearch}>
            <Form.Group controlId="navSearch" className="mb-0">
              <Form.Label className="visually-hidden">Search movies</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Search movie..."
                value={globalQuery}
                onChange={e => setGlobalQuery(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="warning" size="sm">Search</Button>
          </Form>

          {user ? (
            <NavDropdown
              title={<span className="text-warning fw-semibold">{toUsername(user.email)}</span>}
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
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
