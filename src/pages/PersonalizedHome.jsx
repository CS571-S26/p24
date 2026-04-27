import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import WatchlistHero from '../components/WatchlistHero'
import MovieRow from '../components/MovieRow'
import OnboardingModal from '../components/OnboardingModal'
import SurpriseMeButton from '../components/SurpriseMeButton'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const GENRE_LABELS = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 18: 'Drama', 14: 'Fantasy', 27: 'Horror',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western', 99: 'Documentary', 10765: 'Sci-Fi & Fantasy',
}

const PROVIDER_IDS = {
  netflix: 8,
  hbo:     1899,
  disney:  337,
  prime:   9,
  hulu:    15,
  apple:   2,
}

function buildProviderParam(services) {
  if (!services?.length) return ''
  const ids = services.map(s => PROVIDER_IDS[s]).filter(Boolean)
  return ids.join('|')
}

export default function PersonalizedHome() {
  const { user } = useAuth()
  const [prefs,           setPrefs]           = useState(null)
  const [showOnboarding,  setShowOnboarding]  = useState(false)
  const [genreRows,       setGenreRows]       = useState([])
  const [trending,        setTrending]        = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [topRated,        setTopRated]        = useState([])
  const [topRatedLoading, setTopRatedLoading] = useState(true)

  // Load prefs + auto-open onboarding once per session if not completed
  useEffect(() => {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'profile', 'settings')
    getDoc(ref).then(snap => {
      const data = snap.exists() ? snap.data() : null
      if (data) setPrefs(data)
      if (!data?.onboardingCompleted && !sessionStorage.getItem('onboardingShown')) {
        setShowOnboarding(true)
        sessionStorage.setItem('onboardingShown', '1')
      }
    })
  }, [user])

  function handleOnboardingComplete() {
    setShowOnboarding(false)
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'profile', 'settings')
    getDoc(ref).then(snap => { if (snap.exists()) setPrefs(snap.data()) })
  }

  // Always-on: Trending Now
  useEffect(() => {
    setTrendingLoading(true)
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(data => setTrending((data?.results || []).filter(m => m.poster_path)))
      .catch(() => {})
      .finally(() => setTrendingLoading(false))
  }, [])

  // Always-on: Top Rated
  useEffect(() => {
    setTopRatedLoading(true)
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(data => setTopRated((data?.results || []).filter(m => m.poster_path)))
      .catch(() => {})
      .finally(() => setTopRatedLoading(false))
  }, [])

  // One row per genre preference, filtered by streaming services if set
  useEffect(() => {
    if (!prefs?.favoriteGenres?.length) return

    const providerParam = buildProviderParam(prefs.streamingServices)

    setGenreRows(
      prefs.favoriteGenres.map(id => ({
        genreId: id,
        label:   GENRE_LABELS[id] ?? 'This Genre',
        movies:  [],
        loading: true,
      }))
    )

    prefs.favoriteGenres.forEach((genreId, idx) => {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
      if (providerParam) url += `&with_watch_providers=${providerParam}&watch_region=US`

      fetch(url)
        .then(r => r.json())
        .then(data => {
          const movies = (data?.results || []).filter(m => m.poster_path).slice(0, 20)
          setGenreRows(prev => prev.map((row, i) =>
            i === idx ? { ...row, movies, loading: false } : row
          ))
        })
        .catch(() => {
          setGenreRows(prev => prev.map((row, i) =>
            i === idx ? { ...row, loading: false } : row
          ))
        })
    })
  }, [prefs])

  return (
    <div className="homepage d-flex justify-content-center px-3 py-4">
      <div className="homepage-inner">
        <WatchlistHero />

        <div className="d-flex justify-content-center gap-3 mb-4">
          <SurpriseMeButton variant="primary" />
          <Button as={Link} to="/pick" variant="outline-warning">Pick for Me</Button>
        </div>

        {genreRows
          .filter(row => row.loading || row.movies.length > 0)
          .map(row => (
            <MovieRow
              key={row.genreId}
              title={`Because you like ${row.label}`}
              movies={row.movies}
              loading={row.loading}
            />
          ))
        }

        <MovieRow
          title="Trending Now"
          movies={trending}
          loading={trendingLoading}
        />

        <MovieRow
          title="Top Rated"
          movies={topRated}
          loading={topRatedLoading}
        />
      </div>

      <OnboardingModal
        show={showOnboarding}
        onComplete={handleOnboardingComplete}
        allowCancel={false}
      />
    </div>
  )
}
