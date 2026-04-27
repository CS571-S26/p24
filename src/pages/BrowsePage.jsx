import { useState, useEffect } from 'react'
import '../App.css'
import { Card, Row, Col, Button, ButtonGroup, Pagination, Spinner, Carousel, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import MovieSearchBar from '../components/MovieSearchBar'
import LibraryButton from '../components/LibraryButton'
import SurpriseMeButton from '../components/SurpriseMeButton'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const PROVIDER_IDS = {
  netflix: 8, hbo: 1899, disney: 337, prime: 9, hulu: 15, apple: 2,
}

const GENRES = [
  { id: 28,    label: 'Action' },
  { id: 12,    label: 'Adventure' },
  { id: 16,    label: 'Animation' },
  { id: 35,    label: 'Comedy' },
  { id: 80,    label: 'Crime' },
  { id: 18,    label: 'Drama' },
  { id: 14,    label: 'Fantasy' },
  { id: 27,    label: 'Horror' },
  { id: 9648,  label: 'Mystery' },
  { id: 10749, label: 'Romance' },
  { id: 878,   label: 'Sci-Fi' },
  { id: 53,    label: 'Thriller' },
]

const SORT_OPTIONS = [
  { key: 'popularity.desc',           label: 'Popular' },
  { key: 'vote_average.desc',         label: 'Top Rated' },
  { key: 'primary_release_date.desc', label: 'Newest' },
]

function buildEndpoint({ searchQuery, mediaType, genres, sort, page, providerParam = '' }) {
  if (searchQuery) {
    return `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`
  }
  const hasFilters = genres.length > 0 || mediaType !== 'both' || sort !== 'popularity.desc' || !!providerParam
  if (!hasFilters) {
    return `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&page=${page}`
  }
  const type = mediaType === 'tv' ? 'tv' : 'movie'
  const resolvedSort = mediaType === 'tv' && sort === 'primary_release_date.desc'
    ? 'first_air_date.desc' : sort
  let url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&sort_by=${resolvedSort}&page=${page}`
  if (genres.length > 0) url += `&with_genres=${genres.join(',')}`
  if (resolvedSort === 'vote_average.desc') url += '&vote_count.gte=200'
  if (providerParam) url += `&with_watch_providers=${providerParam}&watch_region=US`
  return url
}

// Returns array of page numbers and '...' ellipsis markers
function getPaginationRange(current, total) {
  const capped = Math.min(total, 125) // our pages = TMDB pages / 4, max 125
  if (capped <= 1) return []
  if (capped <= 7) return Array.from({ length: capped }, (_, i) => i + 1)

  const pages = [1]
  const left  = Math.max(2, current - 2)
  const right = Math.min(capped - 1, current + 2)

  if (left > 2) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < capped - 1) pages.push('...')
  pages.push(capped)

  return pages
}

const DEFAULT_FILTERS = { mediaType: 'both', genres: [], sort: 'popularity.desc' }

export default function BrowsePage() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const { items } = useLibrary()

  const [rawMovies,      setRawMovies]      = useState([])
  const [includeWatched, setIncludeWatched] = useState(false)
  const [query,          setQuery]          = useState('')
  const [activeQuery,    setActiveQuery]    = useState('')
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState('')
  const [page,           setPage]           = useState(1)
  const [totalPages,     setTotalPages]     = useState(1)

  const [mediaType,     setMediaType]     = useState('both')
  const [genres,        setGenres]        = useState([])
  const [sort,          setSort]          = useState('popularity.desc')
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS)

  const [userServices,   setUserServices]   = useState([])
  const [onlyAvailable,  setOnlyAvailable]  = useState(false)
  const [servicesLoaded, setServicesLoaded] = useState(false)

  // Load streaming prefs + toggle state from Firestore
  useEffect(() => {
    if (!user) { setServicesLoaded(true); return }
    getDoc(doc(db, 'users', user.uid, 'profile', 'settings'))
      .then(snap => {
        const data = snap.data() || {}
        setUserServices(data.streamingServices || [])
        setOnlyAvailable(data.onlyAvailable ?? false)
      })
      .finally(() => setServicesLoaded(true))
  }, [user])

  function toggleGenre(id) {
    setGenres(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id])
  }

  // Each UI page fetches 4 TMDB pages in parallel → ~80 results (20 rows at 4 columns)
  function fetchPage({ searchQuery = '', pageToLoad = 1, filters = activeFilters, availableOnly = onlyAvailable }) {
    setLoading(true)
    setError('')

    const providerParam = (availableOnly && userServices.length)
      ? userServices.map(s => PROVIDER_IDS[s]).filter(Boolean).join('|')
      : ''

    const tmdbPages = [0, 1, 2, 3].map(i => (pageToLoad - 1) * 4 + 1 + i)
    const requests  = tmdbPages.map(p =>
      fetch(buildEndpoint({ searchQuery, ...filters, page: p, providerParam })).then(r => r.json())
    )

    Promise.all(requests)
      .then(dataArray => {
        const seen = new Set()
        const results = dataArray
          .flatMap(d => d?.results || [])
          .filter(m => m?.poster_path && !seen.has(m.id) && seen.add(m.id))

        setRawMovies(results)
        setPage(pageToLoad)
        // Our total UI pages = TMDB total_pages / 4, capped at 125 (500 TMDB max / 4)
        const tmdbTotal = dataArray[0]?.total_pages || 1
        setTotalPages(Math.ceil(Math.min(tmdbTotal, 500) / 4))
        setActiveQuery(searchQuery)
        if (results.length === 0) {
          setError(availableOnly
            ? "Nothing on your streaming services matches right now. Try turning the filter off or adding more services in your Profile."
            : 'No results found.'
          )
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
      .catch(() => setError('Unable to load movies right now.'))
      .finally(() => setLoading(false))
  }

  function goToPage(p) {
    fetchPage({ searchQuery: activeQuery, pageToLoad: p, filters: activeFilters })
  }

  function applyFilters() {
    const filters = { mediaType, genres, sort }
    setActiveFilters(filters)
    setQuery('')
    fetchPage({ searchQuery: '', pageToLoad: 1, filters })
  }

  function clearFilters() {
    setMediaType('both'); setGenres([]); setSort('popularity.desc')
    setActiveFilters(DEFAULT_FILTERS)
    fetchPage({ searchQuery: '', pageToLoad: 1, filters: DEFAULT_FILTERS })
  }

  const handleSearch = e => {
    e.preventDefault()
    fetchPage({ searchQuery: query.trim(), pageToLoad: 1 })
  }

  function handleAvailableToggle() {
    const newVal = !onlyAvailable
    setOnlyAvailable(newVal)
    if (user) {
      updateDoc(doc(db, 'users', user.uid, 'profile', 'settings'), { onlyAvailable: newVal }).catch(() => {})
    }
    fetchPage({ searchQuery: activeQuery, pageToLoad: 1, availableOnly: newVal })
  }

  // Wait for prefs to load before initial fetch so toggle state is correct
  useEffect(() => {
    if (!servicesLoaded) return
    const incomingSearch = location.state?.searchQuery?.trim()
    if (typeof incomingSearch === 'string') {
      setQuery(incomingSearch)
      fetchPage({ searchQuery: incomingSearch, pageToLoad: 1 })
    } else {
      fetchPage({ searchQuery: '', pageToLoad: 1 })
    }
  }, [location.key, servicesLoaded])

  const getTitle = m => m?.name || m?.title || 'Untitled'
  const getFeaturedImage = m => {
    if (!m) return ''
    return m.backdrop_path
      ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
      : `https://image.tmdb.org/t/p/w780${m.poster_path}`
  }

  const watchedIds = new Set(items.filter(i => i.status === 'watched').map(i => i.id))
  const movies = (includeWatched || !user)
    ? rawMovies
    : rawMovies.filter(m => !watchedIds.has(m.id))

  const filtersActive = genres.length > 0 || mediaType !== 'both' || sort !== 'popularity.desc'
  const paginationRange = getPaginationRange(page, totalPages)

  return (
    <div className="homepage d-flex justify-content-center px-3 py-4">
      <div className="homepage-inner">

        {movies.length > 0 && !loading && (
          <Carousel className="mb-5" interval={6000} pause="hover" touch={false}>
            {movies.slice(0, 5).map(movie => (
              <Carousel.Item key={movie.id}>
                <section
                  className="featured-movie"
                  style={{ backgroundImage: `url(${getFeaturedImage(movie)})`, cursor: 'pointer' }}
                  onClick={() => navigate(`/${movie.media_type || (activeFilters.mediaType === 'tv' ? 'tv' : 'movie')}/${movie.id}`)}
                >
                  <div className="featured-content">
                    <p className="eyebrow mb-2">FEATURED</p>
                    <h1 className="featured-title mb-3">{getTitle(movie)}</h1>
                    <div className="d-flex flex-wrap align-items-baseline gap-3">
                      <span className="rating-number">
                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                      </span>
                      <span className="rating-label">/ 10</span>
                    </div>
                  </div>
                </section>
              </Carousel.Item>
            ))}
          </Carousel>
        )}

        <section>
          <div className="d-flex align-items-center gap-3 mb-3">
            <MovieSearchBar query={query} onQueryChange={setQuery} onSearch={handleSearch} isSearching={loading} />
            <SurpriseMeButton variant="ghost" />
          </div>

          {/* Media type + sort */}
          <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
            <ButtonGroup size="sm">
              {[['both', 'All'], ['movies', 'Movies'], ['tv', 'TV Shows']].map(([val, lbl]) => (
                <Button key={val} variant={mediaType === val ? 'warning' : 'outline-secondary'} onClick={() => setMediaType(val)}>
                  {lbl}
                </Button>
              ))}
            </ButtonGroup>
            <ButtonGroup size="sm">
              {SORT_OPTIONS.map(s => (
                <Button key={s.key} variant={sort === s.key ? 'warning' : 'outline-secondary'} onClick={() => setSort(s.key)}>
                  {s.label}
                </Button>
              ))}
            </ButtonGroup>
            <Button size="sm" variant="warning" onClick={applyFilters}>Apply</Button>
            {filtersActive && (
              <Button size="sm" variant="outline-secondary" onClick={clearFilters}>Clear</Button>
            )}
            {user && userServices.length > 0 && (
              <Form.Check
                type="switch"
                id="available-toggle"
                label="Only what I can watch"
                checked={onlyAvailable}
                onChange={handleAvailableToggle}
                className="ms-2 text-warning"
              />
            )}
            {user && (
              <Form.Check
                type="switch"
                id="watched-toggle"
                label="Include watched"
                checked={includeWatched}
                onChange={() => setIncludeWatched(v => !v)}
                className="ms-2"
              />
            )}
          </div>

          {/* Genre chips */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {GENRES.map(g => (
              <Button
                key={g.id}
                size="sm"
                variant={genres.includes(g.id) ? 'warning' : 'outline-secondary'}
                onClick={() => toggleGenre(g.id)}
              >
                {g.label}
              </Button>
            ))}
          </div>

          <h2 className="section-title mb-3">
            {activeQuery ? `Results for "${activeQuery}"` : 'Browse'}
          </h2>

          {error && <p className="search-message mb-3">{error}</p>}
          {!error && !loading && movies.length === 0 && rawMovies.length > 0 && (
            <p className="search-message mb-3">
              You've watched everything here. Toggle <strong>Include watched</strong> to see them again.
            </p>
          )}

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : (
            <Row className="g-3">
              {movies.map(movie => (
                <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    className="movie-card"
                    onClick={() => navigate(`/${movie.media_type || (activeFilters.mediaType === 'tv' ? 'tv' : 'movie')}/${movie.id}`)}
                  >
                    {movie.poster_path && (
                      <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={getTitle(movie)} />
                    )}
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="movie-card-rating">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                        <span className="movie-card-votes text-muted small">{movie.vote_count?.toLocaleString()} votes</span>
                      </div>
                      <Card.Title className="movie-card-title">{getTitle(movie)}</Card.Title>
                      <LibraryButton movie={movie} />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Pagination */}
          {paginationRange.length > 1 && !loading && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev disabled={page <= 1} onClick={() => goToPage(page - 1)} />
                {paginationRange.map((p, i) =>
                  p === '...'
                    ? <Pagination.Ellipsis key={`ellipsis-${i}`} disabled />
                    : <Pagination.Item key={p} active={p === page} onClick={() => p !== page && goToPage(p)}>{p}</Pagination.Item>
                )}
                <Pagination.Next disabled={page >= Math.min(totalPages, 125)} onClick={() => goToPage(page + 1)} />
              </Pagination>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
