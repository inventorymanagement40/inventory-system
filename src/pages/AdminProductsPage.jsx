import { useEffect, useMemo, useState } from 'react'
import ProductForm from '../components/ProductForm'
import { useToast } from '../context/useToast'
import { formatPhpCurrency } from '../utils/currency'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../services/productsService'

export default function AdminProductsPage() {
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleCreate = async (payload) => {
    setError('')
    setSaving(true)
    try {
      await createProduct(payload)
      await loadProducts()
      setIsCreateModalOpen(false)
      showToast(`Product "${payload.name}" created successfully.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (payload) => {
    if (!editingProduct) return
    setError('')
    setSaving(true)
    try {
      await updateProduct(editingProduct.id, payload)
      setEditingProduct(null)
      await loadProducts()
      showToast(`Product "${payload.name}" updated successfully.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    setError('')
    setDeleting(true)
    try {
      await deleteProduct(deletingProduct.id)
      await loadProducts()
      setDeletingProduct(null)
      showToast('Product deleted successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

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
      <h1>Products Management</h1>
      {error && <p className="error-text">{error}</p>}
      <div className="row-actions">
        <input
          className="input"
          type="search"
          placeholder="Search product name or description"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search products"
        />
        <button className="btn btn-primary" type="button" onClick={() => setIsCreateModalOpen(true)}>
          Add New Product
        </button>
      </div>

      <div className="card">
        <h3>Product List</h3>
        {loading ? (
          <p className="state-message">Loading products...</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
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
                      <td>{formatPhpCurrency(product.price)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn"
                            type="button"
                            onClick={() => setEditingProduct(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Create Product">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Create Product</h3>
              <button className="btn" type="button" onClick={() => setIsCreateModalOpen(false)}>
                Close
              </button>
            </div>
            <ProductForm
              key="create-product-form"
              onSubmit={handleCreate}
              submitLabel={saving ? 'Saving...' : 'Create Product'}
              withCard={false}
              showTitle={false}
            />
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Edit Product">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button className="btn" type="button" onClick={() => setEditingProduct(null)}>
                Close
              </button>
            </div>
            <ProductForm
              key={editingProduct.id}
              onSubmit={handleUpdate}
              initialData={editingProduct}
              submitLabel={saving ? 'Saving...' : 'Update Product'}
              withCard={false}
              showTitle={false}
            />
          </div>
        </div>
      )}

      {deletingProduct && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Delete Product">
          <div className="modal-card">
            <div className="form-grid">
              <h3>Delete Product</h3>
              <p>
                Are you sure you want to delete <strong>{deletingProduct.name}</strong>? This action
                cannot be undone.
              </p>
              <div className="row-actions">
                <button
                  className="btn"
                  type="button"
                  onClick={() => setDeletingProduct(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
