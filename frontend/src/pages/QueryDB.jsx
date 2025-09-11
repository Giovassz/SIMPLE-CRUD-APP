import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";
const queryDB = (query) => axios.post(`${API}/llm/query`, { query });

export default function QueryDB() {
  const [dbQuery, setDbQuery] = useState("");
  const [dbAnswer, setDbAnswer] = useState("");
  const [dbRaw, setDbRaw] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);

  const handleQuery = async () => {
    if (!dbQuery.trim()) return;
    try {
      setDbLoading(true);
      setDbAnswer("");
      setDbRaw([]);
      const { data } = await queryDB(dbQuery);

      // 🔹 Limpia texto eliminando los ** de Markdown
      const cleanAnswer = (data?.answer || "Sin respuesta").replace(/\*\*/g, "");

      setDbAnswer(cleanAnswer);
      setDbRaw(data?.raw || []);
    } catch (e) {
      console.error("Error en consulta IA:", e?.message || e);
      setDbAnswer("Error procesando la consulta");
    } finally {
      setDbLoading(false);
    }
  };

  // 🔹 Render con formato bonito
  const renderFormattedAnswer = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    return (
      <div className="space-y-3">
        {lines.map((line, idx) => {
          if (line.includes(":")) {
            const [key, ...rest] = line.split(":");
            return (
              <p key={idx} className="text-sm">
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {key.trim()}:
                </span>{" "}
                {rest.join(":").trim()}
              </p>
            );
          }
          return (
            <p key={idx} className="text-sm leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="card-style">
      <h2 className="section-title mb-4">Consulta la base de datos</h2>
      <div className="space-y-4">
        <input
          type="text"
          className="input-style"
          placeholder="Ej. últimos 5 productos registrados"
          value={dbQuery}
          onChange={(e) => setDbQuery(e.target.value)}
        />
        <button
          className="btn-primary w-full"
          onClick={handleQuery}
          disabled={dbLoading}
        >
          {dbLoading ? "Consultando..." : "Consultar"}
        </button>

        {dbRaw.length > 0 && (
          <div className="query-card mt-4">
            <p className="query-title mb-2">📊 Resultados crudos</p>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              {dbRaw.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.name}</strong> — Cantidad: {item.quantity}, Precio: ${item.price}
                </li>
              ))}
            </ul>
          </div>
        )}

        {dbAnswer && (
          <div className="query-interpretation">
            <h3>🤖 Interpretación de la IA</h3>
            {renderFormattedAnswer(dbAnswer)}
          </div>
        )}
      </div>
    </div>
  );
}
