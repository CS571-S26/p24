import { Badge } from 'react-bootstrap'
import '../App.css'

const STACK = [
  { name: 'React 19', desc: 'UI framework' },
  { name: 'Vite 7', desc: 'Build tool' },
  { name: 'React Bootstrap', desc: 'Component library' },
  { name: 'React Router DOM 7', desc: 'Client-side routing' },
  { name: 'Firebase Auth', desc: 'User authentication' },
  { name: 'Firestore', desc: 'Watchlist database' },
  { name: 'TMDB API', desc: 'Movie & TV data' },
  { name: 'GitHub Pages', desc: 'Hosting' },
]

export default function AboutPage() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '800px', position: 'relative' }}>

        <div className="glass-card mb-4">
          <h1 className="mb-3" style={{ fontSize: '2rem', fontFamily: "'Oswald', system-ui, sans-serif", fontWeight: 700, color: "#f5c518" }}>About MOViE?</h1>
          <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            It's almost midnight. The food is ready, the lights are dimmed — but your hand keeps
            scrolling endlessly trying to find something worth watching. <strong style={{ color: '#f5c518'}}>MOViE?</strong> is
            designed to solve exactly that. Search trending movies and TV shows, get full details
            including cast, trailer, and where to stream, and save anything you like to your
            personal watchlist.
          </p>
        </div>

        <div className="glass-card mb-4">
          <h2 className="mb-3" style={{ fontSize: '1.6rem', fontFamily: "'Oswald', system-ui, sans-serif", fontWeight: 700 }}>Tech Stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {STACK.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Badge bg="warning" text="dark" style={{ fontSize: '0.9rem', padding: '0.5rem 0.8rem', flexShrink: 0 }}>{item.name}</Badge>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>{item.desc}</span>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginBottom: 0 }}>
            Movie and TV data provided by{' '}
            <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" style={{ color: '#f5c518', textDecoration: 'none' }}>
              TMDB
            </a>
            . This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>

        <div className="glass-card">
          <h2 className="mb-2" style={{ fontSize: '1.6rem', fontFamily: "'Oswald', system-ui, sans-serif", fontWeight: 700 }}>Developer</h2>
          <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Built by <strong>Hazim Shah and Amirul Azmi</strong> for CS571 — Building User Interfaces,
            UW–Madison, Spring 2026.
          </p>
        </div>

      </div>
    </div>
  )
}
