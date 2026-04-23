import { Badge } from 'react-bootstrap'
import WatchlistButton from './WatchlistButton'

export default function MovieHero({ movie, mediaType }) {
  const title = movie.title || movie.name
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4)
  const runtime = mediaType === 'movie'
    ? movie.runtime ? `${movie.runtime} min` : null
    : movie.episode_run_time?.[0] ? `${movie.episode_run_time[0]} min/ep` : null

  // Pull US age rating — movies use release_dates, TV uses content_ratings
  let ageRating = null
  if (mediaType === 'movie') {
    const us = movie.release_dates?.results?.find(r => r.iso_3166_1 === 'US')
    ageRating = us?.release_dates?.find(d => d.certification)?.certification
  } else {
    const us = movie.content_ratings?.results?.find(r => r.iso_3166_1 === 'US')
    ageRating = us?.rating
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w780${movie.poster_path}`

  return (
    <section className="featured-movie mb-4" style={{ backgroundImage: `url(${backdropUrl})` }}>
      <div className="featured-content">
        <h1 className="featured-title mb-2">{title}</h1>
        {movie.tagline && (
          <p className="fst-italic mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {movie.tagline}
          </p>
        )}
        <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
          <span className="rating-number">{movie.vote_average?.toFixed(1) ?? 'N/A'}</span>
          <span className="rating-label">/ 10</span>
          {ageRating && <Badge bg="secondary">{ageRating}</Badge>}
          {runtime && <span className="text-light small">{runtime}</span>}
          {year && <span className="text-light small">{year}</span>}
        </div>
        <WatchlistButton movie={{ ...movie, media_type: mediaType }} />
      </div>
    </section>
  )
}
