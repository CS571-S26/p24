import { useState, useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import MoodStep from '../components/MoodStep'
import TimeStep from '../components/TimeStep'
import ServicesStep from '../components/ServicesStep'
import PickResult from '../components/PickResult'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const PROVIDER_IDS = {
  netflix: 8, hbo: 1899, disney: 337, prime: 9, hulu: 15, apple: 2,
}

export default function PickForMePage() {
  const { user }  = useAuth()
  const { items } = useLibrary()

  const [step,      setStep]      = useState(1)
  const [mood,      setMood]      = useState(null)
  const [runtime,   setRuntime]   = useState(120)
  const [services,  setServices]  = useState([])
  const [results,   setResults]   = useState([])
  const [resultIdx, setResultIdx] = useState(0)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  // Pre-fill streaming services from user profile
  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid, 'profile', 'settings')).then(snap => {
      const saved = snap.data()?.streamingServices
      if (saved?.length) setServices(saved)
    })
  }, [user])

  function reset() {
    setStep(1)
    setMood(null)
    setRuntime(120)
    setResults([])
    setResultIdx(0)
    setError('')
    // Keep services — user likely has the same ones
  }

  async function fetchResults() {
    setLoading(true)
    setError('')
    try {
      const watchedIds = new Set(
        items.filter(i => i.status === 'watched').map(i => i.id)
      )

      // Use | (OR) for mood genre IDs so any matching genre qualifies
      const genreParam    = mood?.genreIds?.join('|') ?? ''
      const providerParam = services.map(s => PROVIDER_IDS[s]).filter(Boolean).join('|')

      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&vote_average.gte=6.5&with_runtime.lte=${runtime}`
      if (genreParam)    url += `&with_genres=${genreParam}`
      if (providerParam) url += `&with_watch_providers=${providerParam}&watch_region=US`

      const data = await fetch(url).then(r => r.json())
      let pool = (data?.results || [])
        .filter(m => m.poster_path && !watchedIds.has(m.id))
        .slice(0, 10)

      // Retry without provider constraint if services filter yields nothing
      if (pool.length === 0 && providerParam) {
        let fallbackUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&vote_average.gte=6.5&with_runtime.lte=${runtime}`
        if (genreParam) fallbackUrl += `&with_genres=${genreParam}`
        const fallback = await fetch(fallbackUrl).then(r => r.json())
        pool = (fallback?.results || [])
          .filter(m => m.poster_path && !watchedIds.has(m.id))
          .slice(0, 10)
      }

      if (pool.length === 0) {
        setError('Nothing matched those filters. Try a different mood or a longer runtime.')
        return
      }

      setResults(pool)
      setResultIdx(0)
      setStep('result')
    } catch {
      setError('Unable to fetch results. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="homepage d-flex justify-content-center px-3 py-4">
      <div className="homepage-inner">

        {step !== 'result' && (
          <>
            {/* Step progress bar */}
            <div className="d-flex gap-2 mb-5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    background: s <= step ? '#ffc107' : 'rgba(255,255,255,0.15)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            {step === 1 && <MoodStep selected={mood} onSelect={setMood} />}
            {step === 2 && <TimeStep runtime={runtime} onChange={setRuntime} />}
            {step === 3 && <ServicesStep selected={services} onChange={setServices} />}

            {error && <p className="text-danger mt-3">{error}</p>}

            <div className="d-flex justify-content-between mt-5">
              {step > 1
                ? <Button variant="outline-secondary" onClick={() => setStep(s => s - 1)}>Back</Button>
                : <span />
              }
              {step < 3
                ? (
                  <Button
                    variant="warning"
                    disabled={step === 1 && mood === null}
                    onClick={() => setStep(s => s + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button variant="warning" disabled={loading} onClick={fetchResults}>
                    {loading
                      ? <><Spinner animation="border" size="sm" className="me-2" role="status" /><span className="visually-hidden">Searching…</span>Finding your movie…</>
                      : 'Find My Movie'
                    }
                  </Button>
                )
              }
            </div>
          </>
        )}

        {step === 'result' && results.length > 0 && (
          <PickResult
            movie={results[resultIdx]}
            onNext={() => setResultIdx(i => (i + 1) % results.length)}
            onStartOver={reset}
            resultIdx={resultIdx}
            totalResults={results.length}
            maxRuntime={runtime}
          />
        )}

      </div>
    </div>
  )
}
