import { useMemo, useState } from 'react'
import { formatPhpCurrency } from '../utils/currency'

const emptyItem = { product_id: '', quantity: 1 }

export default function OrderForm({ products, onSubmit }) {
  const [items, setItems] = useState([emptyItem])

  const availableProducts = useMemo(
    () => products.filter((product) => Number(product.stock) > 0),
    [products],
  )

  const updateItem = (index, key, value) => {
    setItems((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: value }
      return next
    })
  }

  const addItem = () => {
    setItems((prev) => [...prev, emptyItem])
  }

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index))
  }

  const itemRows = useMemo(() => {
    return items.map((item) => {
      const product = products.find((candidate) => candidate.id === item.product_id)
      const price = Number(product?.price ?? 0)
      const quantity = Math.max(0, Number(item.quantity) || 0)

      return {
        productName: product?.name ?? 'Select product',
        stock: Number(product?.stock ?? 0),
        price,
        quantity,
        subtotal: price * quantity,
      }
    })
  }, [items, products])

  const orderSubtotal = useMemo(
    () => itemRows.reduce((sum, row) => sum + row.subtotal, 0),
    [itemRows],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validItems = items
      .filter((item) => item.product_id)
      .map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity),
      }))

    await onSubmit(validItems)
    setItems([emptyItem])
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h3>Create Order</h3>
      <div className="order-summary-card">
        {items.map((item, index) => (
          <div key={`${item.product_id}-${index}`} className="order-item-card">
            <div className="grid-order">
              <select
                className="input"
                value={item.product_id}
                onChange={(event) => updateItem(index, 'product_id', event.target.value)}
                required
              >
                <option value="">Select product</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock})
                  </option>
                ))}
              </select>
              <input
                className="input"
                type="number"
                min="1"
                max={itemRows[index].stock || undefined}
                step="1"
                value={item.quantity}
                onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                required
              />
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
              >
                Remove
              </button>
            </div>
            <div className="order-item-meta">
              <span>
                Price: <strong>{formatPhpCurrency(itemRows[index].price)}</strong>
              </span>
              <span>
                Subtotal: <strong>{formatPhpCurrency(itemRows[index].subtotal)}</strong>
              </span>
            </div>
          </div>
        ))}
        <div className="order-subtotal-row">
          <span>Order Subtotal</span>
          <strong>{formatPhpCurrency(orderSubtotal)}</strong>
        </div>
      </div>
      <div className="row-actions">
        <button className="btn" type="button" onClick={addItem}>
          Add Item
        </button>
        <button className="btn btn-primary" type="submit">
          Submit Order
        </button>
      </div>
    </form>
  )
}
