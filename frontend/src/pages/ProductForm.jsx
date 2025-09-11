import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";
const createProduct = (body) => axios.post(`${API}/products`, body);
const suggestName = (text) => axios.post(`${API}/llm/suggest`, { text });
const improveNotes = (text, tone = "profesional") =>
  axios.post(`${API}/llm/rewrite`, { text, tone });

export default function ProductForm() {
  const [form, setForm] = useState({ name: "", quantity: "", price: "", notes: "" });
  const [sugs, setSugs] = useState([]);
  const [sugsLoading, setSugsLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);

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
    try {
      await createProduct({
        name: form.name.trim(),
        quantity: Number(form.quantity) || 0,
        price: Number(form.price) || 0,
        notes: form.notes || "",
      });
      alert("Producto agregado correctamente");
      setForm({ name: "", quantity: "", price: "", notes: "" });
      setSugs([]);
    } catch (e) {
      console.error("Error creando producto:", e?.message || e);
    }
  };

  return (
    <div className="card-style">
      <h2 className="section-title mb-4">Registrar Producto</h2>
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
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Precio</label>
            <input
              type="number"
              className="input-style"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Notas del producto</label>
          <textarea
            rows={4}
            className="input-style"
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
                  const { data } = await improveNotes(form.notes);
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
          Guardar Producto
        </button>
      </form>
    </div>
  );
}
