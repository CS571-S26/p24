import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../firebase'
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { AuthContext } from './AuthContext'

export const LibraryContext = createContext(null)

export function LibraryProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }
    const ref = collection(db, 'users', user.uid, 'library')
    const unsubscribe = onSnapshot(ref, snapshot => {
      setItems(snapshot.docs.map(d => d.data()))
    })
    return unsubscribe
  }, [user])

  function addToLibrary(movie, status = 'watchlist') {
    if (!user) throw new Error('not-signed-in')
    const ref = doc(db, 'users', user.uid, 'library', String(movie.id))
    return setDoc(ref, {
      id: movie.id,
      title: movie.title || movie.name || '',
      poster_path: movie.poster_path || '',
      backdrop_path: movie.backdrop_path || '',
      media_type: movie.media_type || 'movie',
      status,
      addedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: null,
    })
  }

  function updateStatus(movieId, status) {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'library', String(movieId))
    return updateDoc(ref, { status, updatedAt: serverTimestamp() })
  }

  function removeFromLibrary(movieId) {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'library', String(movieId))
    return deleteDoc(ref)
  }

  function getItemsByStatus(status) {
    return items.filter(item => item.status === status)
  }

  function getItem(movieId) {
    return items.find(item => item.id === movieId) || null
  }

  return (
    <LibraryContext.Provider value={{ items, addToLibrary, updateStatus, removeFromLibrary, getItemsByStatus, getItem }}>
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  return useContext(LibraryContext)
}
