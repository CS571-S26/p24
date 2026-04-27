export default function RecommendationReason({ reason }) {
  if (!reason) return null
  return (
    <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.7rem', lineHeight: 1.3 }}>
      {reason}
    </p>
  )
}
