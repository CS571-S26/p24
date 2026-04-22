import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWatchlist } from '../context/WatchlistContext'

export default function WatchlistButton({ movie }) {
  const { user } = useAuth()
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [showPrompt, setShowPrompt] = useState(false)

  const inList = isInWatchlist(movie.id)

  function handleClick(e) {
    e.stopPropagation() // don't fire the card's onClick (hero preview)
    if (!user) { setShowPrompt(true); return }
    if (inList) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant={inList ? 'warning' : 'outline-warning'}
        onClick={handleClick}
        className="w-100 mt-2"
      >
        {inList ? '✓ In Watchlist' : '+ Watchlist'}
      </Button>

      <Modal show={showPrompt} onHide={() => setShowPrompt(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign in to save movies</Modal.Title>
        </Modal.Header>
        <Modal.Body>Create a free account to build your personal watchlist.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrompt(false)}>Not now</Button>
          <Button as={Link} to="/sign-in" variant="warning" onClick={() => setShowPrompt(false)}>
            Sign In / Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}