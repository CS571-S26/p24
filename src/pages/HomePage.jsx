import { Spinner } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import PersonalizedHome from './PersonalizedHome'
import BrowsePage from './BrowsePage'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="warning" />
      </div>
    )
  }

  return user ? <PersonalizedHome /> : <BrowsePage />
}
