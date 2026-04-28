import { useState } from 'react'
import { Card, Badge } from 'react-bootstrap'

const TRUNCATE_LENGTH = 300

const POSITIVE_WORDS = [
  'masterpiece', 'brilliant', 'outstanding', 'incredible', 'stunning',
  'gripping', 'excellent', 'fantastic', 'amazing', 'beautiful',
  'perfect', 'superb', 'compelling', 'mesmerizing', 'unforgettable',
  'loved', 'breathtaking', 'riveting', 'exceptional', 'powerful'
]

const NEGATIVE_WORDS = [
  'disappointing', 'boring', 'terrible', 'waste', 'predictable',
  'dull', 'awful', 'weak', 'poor', 'bland', 'forgettable',
  'overrated', 'mediocre', 'painful', 'unwatchable', 'tedious',
  'ridiculous', 'pointless', 'horrible', 'disaster'
]

function highlightText(text) {
  const allWords = [...POSITIVE_WORDS, ...NEGATIVE_WORDS]
  const regex = new RegExp(`\\b(${allWords.join('|')})\\b`, 'gi')

  const segments = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), type: 'plain' })
    }
    const isPositive = POSITIVE_WORDS.some(w => w.toLowerCase() === match[0].toLowerCase())
    segments.push({ text: match[0], type: isPositive ? 'positive' : 'negative' })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), type: 'plain' })
  }

  return segments
}

function renderHighlighted(text) {
  return highlightText(text).map((seg, i) => {
    if (seg.type === 'positive')
      return <mark key={i} className="review-highlight review-highlight-positive">{seg.text}</mark>
    if (seg.type === 'negative')
      return <mark key={i} className="review-highlight review-highlight-negative">{seg.text}</mark>
    return seg.text
  })
}

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
        {expanded || !isTruncated
          ? renderHighlighted(content)
          : renderHighlighted(`${content.slice(0, TRUNCATE_LENGTH)}…`)
        }
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
