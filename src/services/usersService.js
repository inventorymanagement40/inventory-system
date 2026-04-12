import { supabase } from './supabase'
import { withTimeout } from './withTimeout'

export async function getUsers() {
  const { data, error } = await withTimeout(
    supabase.from('profiles').select('*').order('email', { ascending: true }),
    10000,
    'Loading users is taking too long. Please try again.',
  )

  if (error) throw error
  return data ?? []
}

export async function updateUserRole(id, role) {
  const { data, error } = await withTimeout(
    supabase.from('profiles').update({ role }).eq('id', id).select('*').single(),
    10000,
    'Updating user role timed out. Please try again.',
  )

  if (error) throw error
  return data
}
