import { supabase } from './supabase'
import { withTimeout } from './withTimeout'

export async function getProducts() {
  const { data, error } = await withTimeout(
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    10000,
    'Loading products is taking too long. Please try again.',
  )

  if (error) throw error
  return data ?? []
}

export async function createProduct(payload) {
  const { data, error } = await withTimeout(
    supabase.from('products').insert(payload).select('*').single(),
    10000,
    'Creating product timed out. Please try again.',
  )

  if (error) throw error
  return data
}

export async function updateProduct(id, payload) {
  const { data, error } = await withTimeout(
    supabase.from('products').update(payload).eq('id', id).select('*').single(),
    10000,
    'Updating product timed out. Please try again.',
  )

  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await withTimeout(
    supabase.from('products').delete().eq('id', id),
    10000,
    'Deleting product timed out. Please try again.',
  )
  if (error) throw error
}
