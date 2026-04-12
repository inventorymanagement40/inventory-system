import { useEffect, useMemo, useState } from 'react'
import AuthContext from './authContext'
import { supabase } from '../services/supabase'
import { withTimeout } from '../services/withTimeout'

async function fetchProfile(userId) {
  const { data, error } = await withTimeout(
    supabase.from('profiles').select('*').eq('id', userId).single(),
    10000,
    'Loading account profile timed out. Please refresh.',
  )

  if (error) throw error
  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await withTimeout(
          supabase.auth.getSession(),
          10000,
          'Checking user session timed out. Please refresh.',
        )

        if (sessionError) throw sessionError

        if (session?.user) {
          const currentProfile = await fetchProfile(session.user.id)
          if (!mounted) return

          setUser(session.user)
          setProfile(currentProfile)
          setRole(currentProfile?.role ?? 'staff')
        } else if (mounted) {
          setUser(null)
          setProfile(null)
          setRole(null)
        }
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      if (!session?.user) {
        setUser(null)
        setRole(null)
        setProfile(null)
        return
      }

      setUser(session.user)

      try {
        const currentProfile = await fetchProfile(session.user.id)
        if (!mounted) return
        setProfile(currentProfile)
        setRole(currentProfile?.role ?? 'staff')
      } catch (err) {
        if (!mounted) return
        setError(err.message)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    setError('')
    const { error: signInError } = await withTimeout(
      supabase.auth.signInWithPassword({
        email,
        password,
      }),
      10000,
      'Login request timed out. Please try again.',
    )
    if (signInError) throw signInError
  }

  const signup = async (email, password) => {
    setError('')
    const { data, error: signUpError } = await withTimeout(
      supabase.auth.signUp({
        email,
        password,
      }),
      10000,
      'Signup request timed out. Please try again.',
    )
    if (signUpError) throw signUpError
    return data
  }

  const logout = async () => {
    const { error: signOutError } = await withTimeout(
      supabase.auth.signOut(),
      10000,
      'Logout request timed out. Please try again.',
    )
    if (signOutError) throw signOutError
  }

  const value = useMemo(
    () => ({
      user,
      role,
      profile,
      loading,
      error,
      login,
      signup,
      logout,
    }),
    [user, role, profile, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
