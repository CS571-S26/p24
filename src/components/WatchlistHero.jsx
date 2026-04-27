import { useState, useEffect } from 'react'
import { Button, Carousel } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import LibraryButton from './LibraryButton'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

function getDaysAgo(timestamp) {
  if (!timestamp) return null
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
}

function getCaption(days) {
  if (days === null) return 'Still on your list. Tonight?'
  if (days <= 1)     return 'Added recently. Tonight?'
  if (days < 7)      return `You saved this ${days} days ago. Tonight?`
  if (days < 14)     return 'On your list for over a week. Time to watch?'
  if (days < 30)     return `Still on your list after ${days} days. Tonight?`
  return `You saved this ${days} days ago. Still interested?`
}

export default function WatchlistHero() {
  const navigate = useNavigate()
  const { getItemsByStatus } = useLibrary()
  const [tonightsPicks, setTonightsPicks] = useState([])

  const watchlist = [...getItemsByStatus('watchlist')].sort((a, b) =>
    (a.addedAt?.seconds ?? 0) - (b.addedAt?.seconds ?? 0)
  )

  useEffect(() => {
    if (watchlist.length > 0) return
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(data => {
        const picks = (data?.results || [])
          .filter(m => m.vote_average > 7.5 && m.poster_path)
          .slice(0, 5)
        setTonightsPicks(picks)
      })
      .catch(() => {})
  }, [watchlist.length])

  if (watchlist.length === 0) {
    if (tonightsPicks.length === 0) return <div className="mb-5" style={{ minHeight: '300px' }} />

    return (
      <Carousel className="mb-5" interval={8000} pause="hover" touch={false}>
        {tonightsPicks.map(pick => {
          const backdropUrl = pick.backdrop_path
            ? `https://image.tmdb.org/t/p/original${pick.backdrop_path}`
            : `https://image.tmdb.org/t/p/w780${pick.poster_path}`
          return (
            <Carousel.Item key={pick.id}>
              <section
                className="featured-movie"
                style={{ backgroundImage: `url(${backdropUrl})`, cursor: 'pointer' }}
                onClick={() => navigate(`/${pick.media_type || 'movie'}/${pick.id}`)}
              >
                <div className="featured-content">
                  <p className="eyebrow mb-2">Tonight's Pick</p>
                  <h1 className="featured-title mb-4">{pick.title || pick.name}</h1>
                  <div className="d-flex flex-wrap gap-3 align-items-center" onClick={e => e.stopPropagation()}>
                    <Button
                      variant="warning"
                      onClick={() => navigate(`/${pick.media_type || 'movie'}/${pick.id}`)}
                    >
                      Watch Now
                    </Button>
                    <LibraryButton movie={pick} />
                  </div>
                </div>
              </section>
            </Carousel.Item>
          )
        })}
      </Carousel>
    )
  }

  return (
    <Carousel className="mb-5" interval={8000} pause="hover" touch={false}>
      {watchlist.map(item => {
        const days      = getDaysAgo(item.addedAt)
        const caption   = getCaption(days)
        const backdropUrl = item.backdrop_path
          ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
          : item.poster_path
          ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
          : ''

        return (
          <Carousel.Item key={item.id}>
            <section
              className="featured-movie"
              style={backdropUrl
                ? { backgroundImage: `url(${backdropUrl})`, cursor: 'pointer' }
                : { backgroundImage: 'linear-gradient(135deg, #1a1a2e, #16213e)', cursor: 'pointer' }
              }
              onClick={() => navigate(`/${item.media_type || 'movie'}/${item.id}`)}
            >
              <div className="featured-content">
                <p className="eyebrow mb-2">{caption}</p>
                <h1 className="featured-title mb-4">{item.title}</h1>
                <div className="d-flex flex-wrap gap-3 align-items-center" onClick={e => e.stopPropagation()}>
                  <Button
                    variant="warning"
                    onClick={() => navigate(`/${item.media_type || 'movie'}/${item.id}`)}
                  >
                    Watch Now
                  </Button>
                  <LibraryButton movie={item} />
                </div>
              </div>
            </section>
          </Carousel.Item>
        )
      })}
    </Carousel>
  )
}
