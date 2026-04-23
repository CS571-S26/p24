import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Spinner, Alert } from 'react-bootstrap'
import MovieHero from '../components/MovieHero'
import MovieSynopsis from '../components/MovieSynopsis'
import GenrePills from '../components/GenrePills'
import WatchProviders from '../components/WatchProviders'
import TrailerEmbed from '../components/TrailerEmbed'
import CastList from '../components/CastList'
import CrewLine from '../components/CrewLine'
import RecommendationsRow from '../components/RecommendationsRow'
import ReviewsList from '../components/ReviewsList'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const APPEND = 'credits,videos,watch/providers,release_dates,content_ratings,recommendations,reviews'

export default function MovieDetailPage({ mediaType }) {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    setMovie(null)
    fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=${APPEND}`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => setMovie(data))
      .catch(() => setError('Could not load this title. It may not exist or was removed.'))
      .finally(() => setLoading(false))
  }, [id, mediaType])

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="warning" />
      </div>
    )
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <div className="homepage d-flex justify-content-center px-3 py-4">
      <div className="homepage-inner">
        <MovieHero movie={movie} mediaType={mediaType} />
        <MovieSynopsis overview={movie.overview} />
        <GenrePills genres={movie.genres} />
        <WatchProviders providers={movie['watch/providers']} />
        <TrailerEmbed videos={movie.videos} />
        <CastList cast={movie.credits?.cast} />
        <CrewLine crew={movie.credits?.crew} />
        <ReviewsList reviews={movie.reviews} />
        <RecommendationsRow recommendations={movie.recommendations} mediaType={mediaType} />
      </div>
    </div>
  )
}
