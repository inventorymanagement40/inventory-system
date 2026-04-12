import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../services/productsService'
import { formatPhpCurrency } from '../utils/currency'

export default function StaffProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return products

    return products.filter((product) => {
      const name = (product.name ?? '').toLowerCase()
      const description = (product.description ?? '').toLowerCase()
      return name.includes(keyword) || description.includes(keyword)
    })
  }, [products, searchTerm])

  return (
    <section>
      <h1>Products</h1>
      {error && <p className="error-text">{error}</p>}
      <input
        className="input"
        type="search"
        placeholder="Search product name or description"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        aria-label="Search products"
      />
      {loading ? (
        <p className="state-message">Loading products...</p>
      ) : (
        <div className="card table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="state-message">
                    No products found for "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.description || '-'}</td>
                    <td>{formatPhpCurrency(product.price)}</td>
                    <td>
                      <span
                        className={
                          Number(product.stock) > 0 ? 'status-pill ok' : 'status-pill warning'
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
