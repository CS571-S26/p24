import { Badge } from 'react-bootstrap'

export default function GenrePills({ genres }) {
  if (!genres?.length) return null
  return (
    <div className="mb-4">
      <h2 className="section-title mb-2">Genres</h2>
      <div className="d-flex flex-wrap gap-2">
        {genres.map(g => (
          <Badge key={g.id} bg="warning" text="dark" className="px-3 py-2" style={{ fontSize: '0.85rem' }}>
            {g.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
