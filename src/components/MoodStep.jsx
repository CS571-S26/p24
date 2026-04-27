const MOODS = [
  { key: 'light',        emoji: '😊', label: 'Light & Fun',   genreIds: [35, 10751, 16] },
  { key: 'emotional',    emoji: '😢', label: 'Emotional',      genreIds: [18, 10749]     },
  { key: 'intense',      emoji: '😱', label: 'Intense',        genreIds: [53, 27, 28]    },
  { key: 'mind-bending', emoji: '🤔', label: 'Mind-Bending',  genreIds: [878, 9648]     },
]

export default function MoodStep({ selected, onSelect }) {
  return (
    <>
      <h2 className="section-title mb-4">What's your mood tonight?</h2>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {MOODS.map(mood => (
          <div
            key={mood.key}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(mood)}
            onKeyDown={e => e.key === 'Enter' && onSelect(mood)}
            className={`border rounded p-4 text-center ${
              selected?.key === mood.key
                ? 'border-warning bg-warning bg-opacity-10'
                : 'border-secondary'
            }`}
            style={{ cursor: 'pointer', minWidth: '150px', flex: '1 1 150px', maxWidth: '220px' }}
          >
            <div style={{ fontSize: '2.5rem' }}>{mood.emoji}</div>
            <div className="fw-bold mt-2">{mood.label}</div>
          </div>
        ))}
      </div>
    </>
  )
}
