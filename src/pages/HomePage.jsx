import { useState, useEffect, useRef } from 'react'
import '../App.css'
import { Card, Row, Col } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import MovieSearchBar from '../components/MovieSearchBar'
import WatchlistButton from '../components/WatchlistButton'

export default function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const sentinelRef = useRef(null)
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeQuery, setActiveQuery] = useState('')

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const fetchMoviesPage = ({ searchQuery = '', pageToLoad = 1, append = false }) => {
    const trimmedQuery = searchQuery.trim()
    const endpoint = trimmedQuery
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(trimmedQuery)}&page=${pageToLoad}`
      : `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&page=${pageToLoad}`

    if (pageToLoad === 1) {
      setIsSearching(true)
      setError('')
    } else {
      setIsLoadingMore(true)
    }

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = (data?.results || []).filter(m => m && m.poster_path)
        const totalPages = data?.total_pages || 1

        setMovies(prev => {
          if (!append) return results

          const existingIds = new Set(prev.map(movie => movie.id))
          const uniqueNew = results.filter(movie => !existingIds.has(movie.id))
          return [...prev, ...uniqueNew]
        })

        setSelectedMovie(prev => {
          if (append) return prev || results[0] || null
          return results[0] || null
        })

        setPage(pageToLoad)
        setHasMore(pageToLoad < totalPages)
        setActiveQuery(trimmedQuery)

        if (!append && results.length === 0) {
          setError(trimmedQuery ? 'No movies found for that search.' : 'No trending movies found right now.')
        }
      })
      .catch(() => {
        setError(pageToLoad === 1 ? 'Unable to load movies right now.' : 'Unable to load more movies.')
      })
      .finally(() => {
        if (pageToLoad === 1) {
          setIsSearching(false)
        } else {
          setIsLoadingMore(false)
        }
      })
  }

  const loadFirstPage = searchQuery => {
    fetchMoviesPage({ searchQuery, pageToLoad: 1, append: false })
  }

  const handleSubmit = e => {
    e.preventDefault()
    loadFirstPage(query)
  }

  useEffect(() => {
    const incomingSearch = location.state?.searchQuery?.trim()

    if (typeof incomingSearch === 'string') {
      setQuery(incomingSearch)
      loadFirstPage(incomingSearch)
    } else {
      loadFirstPage('')
    }
  }, [location.key])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0]
        if (!firstEntry?.isIntersecting) return
        if (!hasMore || isSearching || isLoadingMore) return

        fetchMoviesPage({
          searchQuery: activeQuery,
          pageToLoad: page + 1,
          append: true
        })
      },
      {
        root: null,
        rootMargin: '280px 0px',
        threshold: 0.01
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, isSearching, isLoadingMore, activeQuery, page])

  const getTitle = movie => movie?.name || movie?.title || 'Untitled'

  const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
    10759: 'Action & Adventure',
    10762: 'Kids',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics'
  }

  const getMoodTags = movie => {
    const genreTags = (movie?.genre_ids || [])
      .map(id => genreMap[id])
      .filter(Boolean)

    const moodTags = []
    if ((movie?.vote_average || 0) >= 7.5) moodTags.push('Critics Favorite')
    if ((movie?.popularity || 0) >= 100) moodTags.push('Trending Energy')
    if (movie?.adult === false) moodTags.push('General Audience')

    return [...genreTags, ...moodTags].slice(0, 6)
  }

  const getFeaturedImage = movie => {
    if (!movie) return ''
    if (movie.backdrop_path) {
      return `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    }
    if (movie.poster_path) {
      return `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    }
    return ''
  }

  return (
    <div className="homepage d-flex justify-content-center px-3 py-4">
      <div className="homepage-inner">
        {selectedMovie && (
          <section
            className="featured-movie mb-5"
            style={{
              backgroundImage: `url(${getFeaturedImage(selectedMovie)})`
            }}
          >
            <div className="featured-content">
              <p className="eyebrow mb-2">FEATURED FILM</p>
              <h1 className="featured-title mb-3">
                {getTitle(selectedMovie)}
              </h1>

              <div className="d-flex flex-wrap align-items-baseline gap-3 mb-3">
                <span className="rating-number">
                  {selectedMovie.vote_average
                    ? selectedMovie.vote_average.toFixed(1)
                    : 'N/A'}
                </span>
                <span className="rating-label">
                  / 10 • based on {selectedMovie.vote_count?.toLocaleString()} reviews
                </span>
              </div>

              <div className="word-pills d-flex flex-wrap gap-2">
                {getMoodTags(selectedMovie).map((tag, index) => (
                  <span key={index} className="word-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <MovieSearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSubmit}
            isSearching={isSearching}
          />

          <h2 className="section-title mb-3">Quick picks</h2>

          {error && <p className="search-message mb-3">{error}</p>}

          <Row className="g-3">
            {movies.map(movie => (
              <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  className="movie-card"
                  onClick={() => navigate(`/${movie.media_type || 'movie'}/${movie.id}`)}
                >
                  {movie.poster_path && (
                    <Card.Img
                      variant="top"
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={getTitle(movie)}
                    />
                  )}
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="movie-card-rating">
                        {movie.vote_average
                          ? movie.vote_average.toFixed(1)
                          : 'N/A'}
                      </span>
                      <span className="movie-card-votes text-muted small">
                        {movie.vote_count?.toLocaleString()} votes
                      </span>
                    </div>
                    <Card.Title className="movie-card-title">
                      {getTitle(movie)}
                    </Card.Title>
                    <WatchlistButton movie={movie} />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div ref={sentinelRef} className="infinite-scroll-sentinel" />

          {isLoadingMore && (
            <p className="text-muted small mt-3 mb-0">Loading more movies...</p>
          )}

          {!hasMore && movies.length > 0 && (
            <p className="text-muted small mt-3 mb-0">You reached the end of the list.</p>
          )}
        </section>
      </div>
    </div>
  )
}
