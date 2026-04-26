import { useState } from 'react'
import { Dropdown, Modal, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'

const STATUSES = [
  { key: 'watchlist', label: '+ Plan to Watch' },
  { key: 'watching',  label: '▶ Watching' },
  { key: 'watched',   label: '✓ Watched' },
]

export default function LibraryButton({ movie }) {
  const { user } = useAuth()
  const { getItem, addToLibrary, updateStatus, removeFromLibrary } = useLibrary()
  const [showPrompt, setShowPrompt] = useState(false)

  const item = getItem(movie.id)
  const currentLabel = item
    ? STATUSES.find(s => s.key === item.status)?.label
    : 'Add to Library'
  const toggleVariant = item ? 'warning' : 'outline-warning'

  function handleStatus(status) {
    if (!user) { setShowPrompt(true); return }
    if (item) {
      updateStatus(movie.id, status)
    } else {
      addToLibrary(movie, status)
    }
  }

  function handleRemove() {
    if (!user) return
    removeFromLibrary(movie.id)
  }

  return (
    <div onClick={e => e.stopPropagation()} className="mt-2">
      <Dropdown>
        <Dropdown.Toggle variant={toggleVariant} size="sm" className="w-100">
          {currentLabel}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {STATUSES.map(({ key, label }) => (
            <Dropdown.Item
              key={key}
              active={item?.status === key}
              onClick={() => handleStatus(key)}
            >
              {label}
            </Dropdown.Item>
          ))}
          {item && (
            <>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger" onClick={handleRemove}>
                Remove
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={showPrompt} onHide={() => setShowPrompt(false)} centered onClick={e => e.stopPropagation()}>
        <Modal.Header closeButton>
          <Modal.Title>Sign in to save movies</Modal.Title>
        </Modal.Header>
        <Modal.Body>Create a free account to build your personal library.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrompt(false)}>Not now</Button>
          <Button as={Link} to="/sign-in" variant="warning" onClick={() => setShowPrompt(false)}>
            Sign In / Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
