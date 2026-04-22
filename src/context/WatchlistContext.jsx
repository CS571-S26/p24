import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { AuthContext } from './AuthContext'

export const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }
    // Subscribe live to the user's watchlist — unsubscribes on sign-out or unmount
    const ref = collection(db, 'users', user.uid, 'watchlist')
    const unsubscribe = onSnapshot(ref, snapshot => {
      setItems(snapshot.docs.map(d => d.data()))
    })
    return unsubscribe
  }, [user])

  function addToWatchlist(movie) {
    if (!user) throw new Error('not-signed-in')
    const ref = doc(db, 'users', user.uid, 'watchlist', String(movie.id))
    return setDoc(ref, {
      id: movie.id,
      title: movie.title || movie.name || '',
      poster_path: movie.poster_path || '',
      media_type: movie.media_type || 'movie',
      addedAt: serverTimestamp(),
    })
  }

  function removeFromWatchlist(movieId) {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'watchlist', String(movieId))
    return deleteDoc(ref)
  }

  function isInWatchlist(movieId) {
    return items.some(item => item.id === movieId)
  }

  return (
    <WatchlistContext.Provider value={{ items, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  return useContext(WatchlistContext)
}
