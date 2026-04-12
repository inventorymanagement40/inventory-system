import { getOrders } from './ordersService'
import { getProducts } from './productsService'

export async function getReports() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()])

  const totalStock = products.reduce((acc, p) => acc + Number(p.stock ?? 0), 0)
  const lowStock = products.filter((product) => Number(product.stock) <= 10)
  const pendingOrders = orders.filter((order) => order.status === 'pending').length
  const completedOrders = orders.filter((order) => order.status === 'completed').length

  return {
    totalProducts: products.length,
    totalStock,
    lowStock,
    totalOrders: orders.length,
    pendingOrders,
    completedOrders,
  }
}
