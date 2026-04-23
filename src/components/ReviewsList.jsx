import { useState } from 'react'
import { Card, Badge } from 'react-bootstrap'

const TRUNCATE_LENGTH = 300

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false)
  const content = review.content || ''
  const isTruncated = content.length > TRUNCATE_LENGTH

  return (
    <Card className="movie-card mb-3 p-3" style={{ cursor: 'default' }}>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="fw-semibold text-light">{review.author}</span>
        {review.author_details?.rating && (
          <Badge bg="warning" text="dark">
            ★ {review.author_details.rating}/10
          </Badge>
        )}
        <span className="text-muted small ms-auto">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-light mb-1" style={{ fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
        {expanded || !isTruncated ? content : `${content.slice(0, TRUNCATE_LENGTH)}…`}
      </p>
      {isTruncated && (
        <button
          className="btn btn-link p-0 text-warning"
          style={{ fontSize: '0.85rem' }}
          onClick={() => setExpanded(prev => !prev)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </Card>
  )
}

export default function ReviewsList({ reviews }) {
  const results = reviews?.results?.slice(0, 5)
  if (!results?.length) return null

  return (
    <div className="mb-4">
      <h2 className="section-title mb-3">Reviews</h2>
      {results.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
