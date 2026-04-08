import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Navbar, Container, Form, Button } from 'react-bootstrap'
import '../App.css'


export default function Layout() {
  const [globalQuery, setGlobalQuery] = useState('')
  const navigate = useNavigate()

  const getTabClass = ({ isActive }) =>
    `nav-link fw-semibold px-3 ${isActive ? 'text-warning' : 'text-light'}`

  const handleGlobalSearch = e => {
    e.preventDefault()
    const trimmed = globalQuery.trim()

    navigate('/', {
      state: {
        searchQuery: trimmed
      }
    })
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
        <Container fluid className="justify-content-center align-items-center gap-3 flex-wrap">
          <Navbar.Brand as={Link} to="/" className="fw-bold text-white mb-0">
            MOViE?
          </Navbar.Brand>

          <nav className="d-flex align-items-center gap-1 flex-wrap">
            <NavLink to="/" end className={getTabClass}>
              Home
            </NavLink>
            <NavLink to="/watch-list" className={getTabClass}>
              Watch List
            </NavLink>
            <NavLink to="/sign-in" className={getTabClass}>
              Sign In
            </NavLink>
            <NavLink to="/about" className={getTabClass}>
              About
            </NavLink>
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
            <Button type="submit" variant="warning" size="sm">
              Search
            </Button>
          </Form>
        </Container>
      </Navbar>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
