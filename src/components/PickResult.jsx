import { useState, useEffect, useRef } from 'react'
import { Button, Badge, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import LibraryButton from './LibraryButton'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export default function PickResult({ movie, onNext, onStartOver, resultIdx, totalResults, maxRuntime }) {
  const navigate = useNavigate()
  const [detail, setDetail] = useState(null)
  const autoSkipCount = useRef(0)

  // Reset skip counter whenever a new result set arrives
  useEffect(() => { autoSkipCount.current = 0 }, [totalResults])

  // Fetch runtime + full genre names for the picked movie
  useEffect(() => {
    if (!movie?.id) return
    setDetail(null)
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(setDetail)
      .catch(() => {})
  }, [movie?.id])

  // Client-side runtime guard — TMDB's with_runtime.lte skips movies with no runtime data
  useEffect(() => {
    if (!detail || !maxRuntime) return
    if (detail.runtime > 0 && detail.runtime > maxRuntime) {
      if (autoSkipCount.current < totalResults - 1) {
        autoSkipCount.current += 1
        onNext()
      }
    } else {
      autoSkipCount.current = 0
    }
  }, [detail])

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : null

  const runtime = detail?.runtime
  const genres  = (detail?.genres || []).slice(0, 3)
  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}/watch`

  return (
    <div>
      {/* Hero */}
      <div
        className="featured-movie mb-4"
        style={backdrop ? { backgroundImage: `url(${backdrop})`, cursor: 'pointer' } : {}}
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        <div className="featured-content">
          <p className="eyebrow mb-2">YOUR PICK</p>
          <h1 className="featured-title mb-3">{movie.title}</h1>

          <div className="d-flex flex-wrap align-items-baseline gap-3 mb-2">
            <span className="rating-number">{movie.vote_average?.toFixed(1) ?? '—'}</span>
            <span className="rating-label">/ 10</span>
            {runtime
              ? <span className="rating-label">{Math.floor(runtime / 60)}h {runtime % 60 > 0 ? `${runtime % 60}m` : ''}</span>
              : <Spinner animation="border" size="sm" variant="secondary" />
            }
          </div>

          {genres.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {genres.map(g => (
                <Badge key={g.id} bg="secondary">{g.name}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex flex-wrap gap-3 align-items-start justify-content-between">
        <div className="d-flex flex-wrap gap-2 align-items-start">
          <Button
            as="a"
            href={tmdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="warning"
            onClick={e => e.stopPropagation()}
          >
            Watch Now
          </Button>
          <div style={{ minWidth: '160px' }}>
            <LibraryButton movie={movie} />
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 align-items-center">
          <span className="text-muted small">{resultIdx + 1} / {totalResults}</span>
          <Button variant="outline-secondary" size="sm" onClick={onNext}>
            Not feeling it? Next →
          </Button>
          <Button
            variant="link"
            className="text-muted text-decoration-none p-0"
            size="sm"
            onClick={onStartOver}
          >
            Start over
          </Button>
        </div>
      </div>

      {movie.overview && (
        <p className="text-muted mt-4" style={{ maxWidth: '680px', lineHeight: 1.6 }}>
          {movie.overview}
        </p>
      )}
    </div>
  )
}
