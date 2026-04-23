export default function MovieSynopsis({ overview }) {
  if (!overview) return null
  return (
    <div className="mb-4">
      <h2 className="section-title mb-2">Synopsis</h2>
      <p className="text-light">{overview}</p>
    </div>
  )
}
