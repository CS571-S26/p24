import { Spinner, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import LibraryButton from './LibraryButton'
import RecommendationReason from './RecommendationReason'

export default function MovieRow({ title, movies, loading, reason }) {
  const navigate = useNavigate()

  return (
    <section className="mb-5">
      <h2 className="section-title mb-3">{title}</h2>

      {loading ? (
        <div className="d-flex justify-content-center py-4">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <div
          className="d-flex gap-3 pb-2"
          style={{ overflowX: 'auto', scrollbarWidth: 'thin' }}
        >
          {movies.map(movie => {
            const label = movie.name || movie.title || 'Untitled'
            return (
              <div key={movie.id} style={{ minWidth: '155px', maxWidth: '155px', flexShrink: 0 }}>
                <Card
                  className="movie-card h-100"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/${movie.media_type || 'movie'}/${movie.id}`)}
                >
                  {movie.poster_path && (
                    <Card.Img
                      variant="top"
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={label}
                    />
                  )}
                  <Card.Body className="p-2">
                    <div className="movie-card-rating small mb-1">
                      {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </div>
                    <Card.Title className="movie-card-title small mb-0">{label}</Card.Title>
                    <RecommendationReason reason={reason} />
                    <LibraryButton movie={movie} />
                  </Card.Body>
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
