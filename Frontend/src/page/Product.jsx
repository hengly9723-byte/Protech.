import React, { useState, useEffect } from "react";
import { getProducts, createProduct, deleteProduct } from "../services/api";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form state for creating a new product
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "General",
    price: "",
    stock: "10",
    description: "",
    image_url: "",
  });

  // Fetch products from Django REST API
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products from backend API. Make sure Django server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      setError("Product name and price are required.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await createProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock || "0", 10),
      });
      setNewProduct({
        name: "",
        category: "General",
        price: "",
        stock: "10",
        description: "",
        image_url: "",
      });
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to create product. Check backend response.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product.");
    }
  };

  return (
    <div className="w-full space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 font-medium text-xs rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Django REST + PostgreSQL Connected
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Product Inventory
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage product items synchronized with Django REST Framework endpoints.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
        >
          🔄 Refresh API Data
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold text-lg leading-none cursor-pointer">
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Product Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-lg h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>➕</span> Add New Product
          </h2>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="e.g. Wireless Ergonomic Mouse"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="29.99"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  placeholder="10"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                placeholder="Electronics, Software, Books..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Brief description of the product..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving to Database..." : "Save Product"}
            </button>
          </form>
        </div>

        {/* Right Column: Product List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold text-gray-800">
              Database Records ({products.length})
            </h2>
            <span className="text-xs text-gray-500">
              Endpoint: <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">GET /api/products/</code>
            </span>
          </div>

          {loading ? (
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 text-center border border-white/60">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600 text-sm">Fetching products from Django backend...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 text-center border border-white/60">
              <p className="text-gray-500 text-base font-medium">No products found in PostgreSQL database.</p>
              <p className="text-gray-400 text-xs mt-1">Use the form on the left to add your first product record.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {item.category || "General"}
                      </span>
                      <span className="text-lg font-bold text-emerald-600">
                        ${parseFloat(item.price).toFixed(2)}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-base mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                      {item.description || "No description provided."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span>Stock: <strong className="text-gray-700">{item.stock}</strong></span>
                    <button
                      onClick={() => handleDeleteProduct(item.id)}
                      className="text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
