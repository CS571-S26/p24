# MOViE?

> It's almost midnight. The food is ready, the lights are dimmed — but your hand keeps scrolling endlessly trying to find something worth watching. **MOViE?** is designed to solve exactly that.

MOViE? is a movie & TV discovery website that helps you quickly decide what to watch. Search trending titles, browse by mood, save anything you like, and see exactly which platform it's streaming on — all in one place.

---

## Features

- **Trending titles** — home page pulls real-time trending movies & TV shows from TMDB
- **Search** — find any movie or series by title, with infinite scroll through results
- **Movie detail page** — full synopsis, cast, trailer, streaming providers, and similar recommendations
- **Watchlist** — save titles to a personal watchlist synced to your account across devices
- **Sign in / Sign up** — username & password accounts (no email required)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 |
| UI Components | React Bootstrap 2.10 |
| Routing | React Router DOM 7 (HashRouter) |
| Auth & Database | Firebase Authentication + Firestore |
| Data | TMDB API |
| Hosting | GitHub Pages |

---

## Live Site

**[cs571-s26.github.io/p24/](https://cs571-s26.github.io/p24/)**

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for GitHub Pages
npm run build
```

> Requires a `.env` file with `VITE_TMDB_API_KEY` and Firebase config keys. See `.env.example`.
