import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

const getProducts = () => axios.get(`${API}/products`);
const deleteProduct = (id) => axios.delete(`${API}/products/${id}`);

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts();
      setProducts(data || []);
    } catch (e) {
      console.error("Error cargando productos:", e?.message || e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      load();
    } catch (e) {
      console.error("Error eliminando producto:", e?.message || e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card-style">
      <h2 className="section-title mb-4">Lista de Productos</h2>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">Cargando...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">
          No hay productos registrados
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
                  Cantidad: {p.quantity}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Precio: ${p.price}
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
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
