import { useState } from 'react'

const emptyProduct = Object.freeze({
  name: '',
  description: '',
  price: '',
  stock: '',
})

function getInitialProduct(initialData) {
  if (!initialData) {
    return { ...emptyProduct }
  }

  return {
    name: initialData.name ?? '',
    description: initialData.description ?? '',
    price: initialData.price ?? '',
    stock: initialData.stock ?? '',
  }
}

export default function ProductForm({
  onSubmit,
  initialData,
  submitLabel = 'Save',
  withCard = true,
  showTitle = true,
}) {
  const [form, setForm] = useState(() => getInitialProduct(initialData))

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    })

    if (!initialData) setForm({ ...emptyProduct })
  }

  return (
    <form className={`${withCard ? 'card ' : ''}form-grid`} onSubmit={handleSubmit}>
      {showTitle && <h3>{initialData ? 'Edit Product' : 'New Product'}</h3>}
      <label className="form-label" htmlFor="product-name">
        Product Name
      </label>
      <input
        id="product-name"
        className="input"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <label className="form-label" htmlFor="product-description">
        Description
      </label>
      <textarea
        id="product-description"
        className="input"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={3}
      />
      <div className="grid-two">
        <div className="form-grid">
          <label className="form-label" htmlFor="product-price">
            Price (PHP)
          </label>
          <input
            id="product-price"
            className="input"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-grid">
          <label className="form-label" htmlFor="product-stock">
            Stock Quantity
          </label>
          <input
            id="product-stock"
            className="input"
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <button className="btn btn-primary" type="submit">
        {submitLabel}
      </button>
    </form>
  )
}
