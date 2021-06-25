import { createContext, ReactNode, useState, useEffect } from 'react'

import { auth, firebase } from '../services/firebase'

import { useToast } from '../hooks/useToast'

type User = {
  id: string
  name: string
  avatar: string
}

type AuthProviderType = {
  children: ReactNode
}

type AuthContextType = {
  user: User | undefined
  signInWithGoogle: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderType) {
  const [user, setUser] = useState<User>()
  const { handleToastError } = useToast()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL)
          return handleToastError('Missing information from Google Account.')

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => unsubscribe()
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    try {
      const result = await auth.signInWithPopup(provider)

      if (result.user) {
        const { displayName, photoURL, uid } = result.user

        if (!displayName || !photoURL)
          return handleToastError('Missing information from Google Account.')

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}