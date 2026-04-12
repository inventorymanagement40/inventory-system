import { supabase } from './supabase'
import { withTimeout } from './withTimeout'

export async function getOrders() {
  const { data, error } = await withTimeout(
    supabase.from('orders').select(`
      *,
      profiles:user_id (email, role),
      order_items (
        id,
        quantity,
        product:product_id (id, name, price)
      )
    `)
    .order('created_at', { ascending: false }),
    10000,
    'Loading orders is taking too long. Please try again.',
  )

  if (error) throw error
  return data ?? []
}

export async function getMyOrders(userId) {
  const { data, error } = await withTimeout(
    supabase.from('orders').select(`
      *,
      order_items (
        id,
        quantity,
        product:product_id (id, name, price)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false }),
    10000,
    'Loading your orders is taking too long. Please try again.',
  )

  if (error) throw error
  return data ?? []
}

export async function createOrder(userId, items) {
  const productIds = items.map((item) => item.product_id)
  const { data: products, error: productsError } = await withTimeout(
    supabase.from('products').select('id, stock').in('id', productIds),
    10000,
    'Checking product stock timed out. Please try again.',
  )

  if (productsError) throw productsError

  const stockMap = new Map((products ?? []).map((product) => [product.id, Number(product.stock)]))

  for (const item of items) {
    const available = stockMap.get(item.product_id)
    const requested = Number(item.quantity)
    if (available === undefined) {
      throw new Error('One or more selected products no longer exist.')
    }
    if (requested > available) {
      throw new Error('Insufficient stock for one or more selected products.')
    }
  }

  const { data: order, error: orderError } = await withTimeout(
    supabase.from('orders').insert({ user_id: userId, status: 'pending' }).select('*').single(),
    10000,
    'Creating order timed out. Please try again.',
  )

  if (orderError) throw orderError

  const orderItemsPayload = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: Number(item.quantity),
  }))

  const { error: itemsError } = await withTimeout(
    supabase.from('order_items').insert(orderItemsPayload),
    10000,
    'Saving order items timed out. Please try again.',
  )

  if (itemsError) throw itemsError

  for (const item of items) {
    const currentStock = stockMap.get(item.product_id)
    const nextStock = currentStock - Number(item.quantity)

    const { error: stockError } = await withTimeout(
      supabase.from('products').update({ stock: nextStock }).eq('id', item.product_id),
      10000,
      'Updating product stock timed out. Please try again.',
    )

    if (stockError) throw stockError
  }

  return order
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await withTimeout(
    supabase.from('orders').update({ status }).eq('id', orderId).select('*').single(),
    10000,
    'Updating order status timed out. Please try again.',
  )

  if (error) throw error
  return data
}
