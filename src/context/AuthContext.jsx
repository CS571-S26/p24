import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'

// Firebase requires an email address, but we want a plain username UX.
// We append a fixed fake domain so "tungtung" becomes "tungtung@movie.local" internally.
const EMAIL_DOMAIN = "@movie.local"
const toEmail = (username) => `${username.trim().toLowerCase()}${EMAIL_DOMAIN}`
// Strip the domain back to a display username (used in navbar, etc.)
export const toUsername = (email) => email?.replace(EMAIL_DOMAIN, "") ?? ""

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe fn — return it so the effect cleans up on unmount
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  function signUp(username, password) {
    return createUserWithEmailAndPassword(auth, toEmail(username), password)
  }

  function signIn(username, password) {
    return signInWithEmailAndPassword(auth, toEmail(username), password)
  }

  function signOut() {
    return firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Convenience hook so consumers don't have to import AuthContext directly
export function useAuth() {
  return useContext(AuthContext)
}
