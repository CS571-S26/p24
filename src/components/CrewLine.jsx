export default function CrewLine({ crew }) {
  if (!crew?.length) return null

  const directors = crew.filter(c => c.job === 'Director').map(c => c.name)
  const writers = [...new Set(
    crew.filter(c => c.department === 'Writing').map(c => c.name)
  )].slice(0, 4)

  if (!directors.length && !writers.length) return null

  return (
    <div className="mb-4">
      <h2 className="section-title mb-2">Crew</h2>
      {directors.length > 0 && (
        <p className="text-white mb-1">
          <span style={{ color: '#adb5bd' }}>Director: </span>{directors.join(', ')}
        </p>
      )}
      {writers.length > 0 && (
        <p className="text-white mb-0">
          <span style={{ color: '#adb5bd' }}>Writers: </span>{writers.join(', ')}
        </p>
      )}
    </div>
  )
}
