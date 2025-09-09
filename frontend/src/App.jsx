import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

const API = "http://localhost:3000/api";

const getProducts = () => axios.get(`${API}/products`);
const createProduct = (body) => axios.post(`${API}/products`, body);
const deleteProduct = (id) => axios.delete(`${API}/products/${id}`);
const suggestName = (text) => axios.post(`${API}/llm/suggest`, { text });
const improveNotes = (text, tone = "profesional") =>
  axios.post(`${API}/llm/rewrite`, { text, tone });

export default function App() {
  const [dark, setDark] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(true);

  const [form, setForm] = useState({ name: "", quantity: "", price: "", notes: "" });
  const [sugs, setSugs] = useState([]);
  const [sugsLoading, setSugsLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getProducts();
        setProducts(data || []);
      } catch (e) {
        console.error("Error cargando productos:", e?.message || e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!form.name.trim()) {
      setSugs([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setSugsLoading(true);
        const { data } = await suggestName(form.name);
        setSugs(data?.suggestions?.slice(0, 3) || []);
      } catch {
        setSugs([]);
      } finally {
        setSugsLoading(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [form.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("El nombre es obligatorio");
    try {
      await createProduct({
        name: form.name.trim(),
        quantity: Number(form.quantity) || 0,
        price: Number(form.price) || 0,
        notes: form.notes || "",
      });
      setForm({ name: "", quantity: "", price: "", notes: "" });
      setSugs([]);
      const { data } = await getProducts();
      setProducts(data || []);
    } catch (e) {
      console.error("Error creando producto:", e?.message || e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      const { data } = await getProducts();
      setProducts(data || []);
    } catch (e) {
      console.error("Error eliminando producto:", e?.message || e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black transition-colors">
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <header className="relative pt-8 pb-6">
          <h1 className="app-title">📦 Gestor de Productos</h1>
          <div
            className={`switch ${dark ? "switch-dark" : "switch-light"} absolute right-2 top-6`}
            role="button"
            aria-label="Cambiar tema"
            onClick={() => setDark((v) => !v)}
          >
            <div className="switch-circle" />
          </div>
        </header>

        <div className="card-style mb-8">
          <h2 className="section-title mb-4">➕ Añadir un nuevo producto</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Nombre del producto</label>
              <input
                type="text"
                className="input-style"
                placeholder="Ej. Laptop Gamer"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {sugsLoading && <span className="pill pill-neutral">Sugiriendo…</span>}
                {sugs.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    className="pill"
                    onClick={() => setForm({ ...form, name: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Cantidad</label>
                <input
                  type="number"
                  className="input-style"
                  placeholder="Ej. 10"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Precio</label>
                <input
                  type="number"
                  className="input-style"
                  placeholder="Ej. 1500"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            </div>

            {/* Notas con botón de IA */}
            <div>
              <label className="label">Notas del producto</label>
              <textarea
                rows={4}
                className="input-style"
                placeholder="Ej. Detalles, materiales, garantía..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={!form.notes.trim() || rewriting}
                  onClick={async () => {
                    try {
                      setRewriting(true);
                      const { data } = await improveNotes(form.notes, "profesional");
                      if (data?.improved) setForm({ ...form, notes: data.improved });
                    } catch (e) {
                      console.error("Error mejorando notas:", e?.message || e);
                    } finally {
                      setRewriting(false);
                    }
                  }}
                >
                  {rewriting ? "Mejorando..." : "Mejorar con IA"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Agregar Producto
            </button>
          </form>
        </div>

        <div className="card-style">
          <button
            className="section-title flex items-center justify-between w-full"
            onClick={() => setShowList((v) => !v)}
          >
            📋 Lista de Productos
            <span className="text-sm text-purple-600 dark:text-purple-300">
              {showList ? "▲ Ocultar" : "▼ Mostrar"}
            </span>
          </button>

          <AnimatePresence>
            {showList && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                {loading ? (
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    ⏳ Cargando productos...
                  </p>
                ) : products.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    ⚠️ No hay productos registrados
                  </p>
                ) : (
                  <div className="space-y-4">
                    {products.map((p) => (
                      <div key={p._id} className="product-card">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {p.name}
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            📦 Cantidad: {p.quantity}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            💲 Precio: ${p.price}
                          </p>
                          {p.notes && (
                            <details className="mt-2">
                              <summary className="text-sm text-purple-600 dark:text-purple-300 cursor-pointer">
                                Notas del producto
                              </summary>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                                {p.notes}
                              </p>
                            </details>
                          )}
                        </div>
                        <button className="btn-danger" onClick={() => handleDelete(p._id)}>
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
    </div>
  );
}
