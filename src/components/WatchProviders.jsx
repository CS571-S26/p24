import { useState } from 'react'

export default function WatchProviders({ providers }) {
  const [hovered, setHovered] = useState(false)

  const usData = providers?.results?.US
  const flatrate = usData?.flatrate
  const link = usData?.link
  const hasProviders = flatrate?.length > 0

  return (
    <div className="mb-4">
      <h2 className="section-title mb-2">Where to Watch</h2>

      {hasProviders && link ? (
        // Wrapping in <a> so the whole block (logos + hint) is one keyboard-focusable target
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="See all watch options on TMDB"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          <div
            className="d-flex flex-wrap gap-3 align-items-center p-3"
            style={{
              borderRadius: '0.75rem',
              border: `1px solid ${hovered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
              background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
              transition: 'border-color 0.15s ease, background 0.15s ease',
              cursor: 'pointer',
            }}
          >
            {flatrate.map(p => (
              <img
                key={p.provider_id}
                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                alt={p.provider_name}
                title={p.provider_name}
                style={{ width: 52, height: 52, borderRadius: 10 }}
              />
            ))}
          </div>
          <p className="text-warning small mt-2 mb-0">See all watch options →</p>
        </a>
      ) : (
        <p className="text-muted small mb-0">Streaming info not available for this region.</p>
      )}
    </div>
  )
}
