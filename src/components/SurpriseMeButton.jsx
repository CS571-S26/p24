import { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const PROVIDER_IDS = {
  netflix: 8, hbo: 1899, disney: 337, prime: 9, hulu: 15, apple: 2,
}

export default function SurpriseMeButton({ variant = 'primary', className = '' }) {
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const { items }  = useLibrary()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      let providerParam = ''
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid, 'profile', 'settings'))
        const data = snap.data() || {}
        if (data.onlyAvailable && data.streamingServices?.length) {
          const ids = data.streamingServices.map(s => PROVIDER_IDS[s]).filter(Boolean)
          if (ids.length) providerParam = ids.join('|')
        }
      }

      const watchedIds = new Set(
        items.filter(i => i.status === 'watched').map(i => i.id)
      )

      const page = Math.floor(Math.random() * 5) + 1
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&vote_average.gte=7&page=${page}`
      if (providerParam) url += `&with_watch_providers=${providerParam}&watch_region=US`

      const data = await fetch(url).then(r => r.json())
      let results = (data?.results || []).filter(m => m.poster_path && !watchedIds.has(m.id))

      // If streaming filter yields nothing, retry without provider constraint
      if (results.length === 0 && providerParam) {
        const fallback = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&vote_average.gte=7&page=${page}`
        ).then(r => r.json())
        results = (fallback?.results || []).filter(m => m.poster_path && !watchedIds.has(m.id))
      }

      if (!results.length) return

      const pick = results[Math.floor(Math.random() * results.length)]
      navigate(`/movie/${pick.id}`)
    } catch {
      // silently no-op on network error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant === 'ghost' ? 'outline-warning' : 'warning'}
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading
        ? <><Spinner animation="border" size="sm" className="me-2" role="status" /><span className="visually-hidden">Finding a movie…</span>Searching…</>
        : '🎲 Surprise Me'
      }
    </Button>
  )
}
