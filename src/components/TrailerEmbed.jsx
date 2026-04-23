export default function TrailerEmbed({ videos }) {
  // Prefer an official Trailer, fall back to a Teaser
  const clip = videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer')
    ?? videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Teaser')

  if (!clip) return null

  return (
    <div className="mb-4">
      <h2 className="section-title mb-2">Trailer</h2>
      <div className="ratio ratio-16x9" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
        <iframe
          src={`https://www.youtube.com/embed/${clip.key}`}
          title={clip.name}
          allowFullScreen
        />
      </div>
    </div>
  )
}
