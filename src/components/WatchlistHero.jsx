import { Button, Carousel } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import LibraryButton from './LibraryButton'

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

  // Oldest first — the "guilt trip" order
  const watchlist = [...getItemsByStatus('watchlist')].sort((a, b) =>
    (a.addedAt?.seconds ?? 0) - (b.addedAt?.seconds ?? 0)
  )

  if (watchlist.length === 0) {
    return (
      <div className="border border-secondary rounded p-4 mb-5 text-center" style={{ borderStyle: 'dashed' }}>
        <p className="text-muted mb-3">Nothing in your watchlist yet. Add movies and shows to see them here.</p>
        <Button variant="warning" size="sm" onClick={() => navigate('/browse')}>Browse Movies</Button>
      </div>
    )
  }

  return (
    <Carousel className="mb-5" interval={6000} pause="hover" touch={false}>
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
                ? { backgroundImage: `url(${backdropUrl})` }
                : { backgroundImage: 'linear-gradient(135deg, #1a1a2e, #16213e)' }
              }
            >
              <div className="featured-content">
                <p className="eyebrow mb-2">{caption}</p>
                <h1 className="featured-title mb-4">{item.title}</h1>
                {/* stopPropagation so clicks on buttons don't trigger carousel slide */}
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
