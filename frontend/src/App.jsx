import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts, createProduct, deleteProduct } from "./api";
import "./index.css";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("El nombre del producto es obligatorio");
      return;
    }
    try {
      await createProduct({
        name: form.name,
        quantity: Number(form.quantity) || 0,
        price: Number(form.price) || 0,
      });
      setForm({ name: "", quantity: "", price: "" });
      loadProducts();
    } catch (err) {
      console.error("Error creando producto:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center px-6 py-10 font-sans transition-colors">
      {/* HEADER */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-10">
        <h1 className="app-title flex-1 text-center">📦 Gestor de Productos</h1>

        {/* Switch Modo Oscuro */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          className={`switch ${darkMode ? "switch-dark" : "switch-light"}`}
        >
          <div className="switch-circle" />
        </div>
      </header>

      {/* FORM */}
      <div className="card-style w-full max-w-2xl mb-10">
        <h2 className="section-title mb-4 flex items-center gap-2">
          ➕ Agregar Producto
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Ej. Laptop Gamer"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="input-style"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Cantidad
              </label>
              <input
                type="number"
                placeholder="Ej. 10"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
                className="input-style"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Precio
              </label>
              <input
                type="number"
                placeholder="Ej. 1500"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-style"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            Agregar Producto
          </button>
        </form>
      </div>

      {/* LISTA */}
      <div className="card-style w-full max-w-2xl">
        <button
          onClick={() => setShowProducts(!showProducts)}
          className="section-title flex justify-between items-center w-full"
        >
          📋 Lista de Productos
          <span className="text-sm text-purple-600 dark:text-purple-300">
            {showProducts ? "▲ Ocultar" : "▼ Mostrar"}
          </span>
        </button>

        <AnimatePresence>
          {showProducts && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-4"
            >
              {loading ? (
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  ⏳ Cargando productos...
                </p>
              ) : products.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  ⚠️ No hay productos aún
                </p>
              ) : (
                <div className="space-y-4">
                  {products.map((p) => (
                    <div key={p._id} className="product-card">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {p.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          📦 Cantidad: {p.quantity}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          💲 Precio: ${p.price}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="btn-danger"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
