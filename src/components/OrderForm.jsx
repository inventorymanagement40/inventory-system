import { useMemo, useState } from 'react'

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
      {items.map((item, index) => (
        <div key={`${item.product_id}-${index}`} className="grid-order">
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
      ))}
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
