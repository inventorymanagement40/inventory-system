import { useEffect, useState } from 'react'
import { useToast } from '../context/useToast'
import { getProducts, updateProduct } from '../services/productsService'

export default function AdminInventoryPage() {
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [stockDrafts, setStockDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
      setStockDrafts(
        data.reduce((acc, product) => ({ ...acc, [product.id]: product.stock }), {}),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleStockUpdate = async (productId) => {
    setError('')
    try {
      const product = products.find((item) => item.id === productId)
      const nextStock = Number(stockDrafts[productId])
      await updateProduct(productId, { stock: nextStock })
      await loadProducts()
      showToast(`Stock updated for "${product?.name ?? 'product'}" to ${nextStock}.`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="page-pale-cards">
      <h1>Inventory Management</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p className="state-message">Loading inventory...</p>
      ) : (
        <div className="card table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="row-actions">
                      <input
                        className="input small-input"
                        type="number"
                        min="0"
                        value={stockDrafts[product.id] ?? 0}
                        onChange={(event) =>
                          setStockDrafts((prev) => ({
                            ...prev,
                            [product.id]: event.target.value,
                          }))
                        }
                      />
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => handleStockUpdate(product.id)}
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
