import { Link, Outlet } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import '../App.css'

export default function Layout() {
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
        <Container fluid className="justify-content-center">
          <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
            MovieApp
          </Navbar.Brand>
          <Nav className="ms-3">
            <Nav.Link as={Link} to="/" className="text-light fw-semibold">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about/" className="text-light fw-semibold">
              About
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
