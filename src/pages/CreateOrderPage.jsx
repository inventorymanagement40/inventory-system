import { useEffect, useState } from 'react'
import OrderForm from '../components/OrderForm'
import { useAuth } from '../context/useAuth'
import { useToast } from '../context/useToast'
import { createOrder } from '../services/ordersService'
import { getProducts } from '../services/productsService'

export default function CreateOrderPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleCreateOrder = async (items) => {
    setError('')
    setSuccess('')

    if (!items.length) {
      setError('Add at least one order item.')
      return
    }

    try {
      await createOrder(user.id, items)
      setSuccess('Order created successfully.')
      showToast('Order created successfully.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h1>Create Order</h1>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      {loading ? (
        <p className="state-message">Loading products...</p>
      ) : (
        <OrderForm products={products} onSubmit={handleCreateOrder} />
      )}
    </section>
  )
}
