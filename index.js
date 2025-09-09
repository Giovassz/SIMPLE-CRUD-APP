const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoute = require("./routes/product.route.js");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/products", productRoute);

app.get("/", (req, res) => res.send("Hello from Node API Server 🚀"));

// ✅ Endpoint IA: sugerencias de nombres
app.post("/api/llm/suggest", async (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) return res.json({ suggestions: [] });

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en marketing. Genera EXACTAMENTE 3 nombres creativos y atractivos en ESPAÑOL para el producto descrito. Devuelve solo los nombres, uno por línea.",
          },
          {
            role: "user",
            content: `Producto: """${text}"""`,
          },
        ],
      }),
    });

    const data = await r.json();
    let content = data?.choices?.[0]?.message?.content || "";

    // limpiar nombres
    let suggestions = content
      .split(/\r?\n/)
      .map((s) => s.replace(/^[\s\-*\d\.\|:"']+/, "").trim())
      .filter((s) => s.length > 1)
      .slice(0, 3);

    return res.json({ suggestions });
  } catch (e) {
    console.error("❌ LLM error:", e);
    return res.status(500).json({
      suggestions: [],
    });
  }
});

// ✅ Endpoint IA: mejorar notas
app.post("/api/llm/rewrite", async (req, res) => {
  const { text, tone } = req.body || {};
  if (!text || !text.trim()) return res.json({ improved: "" });

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 250,
        messages: [
          {
            role: "system",
            content:
              "Eres un redactor publicitario experto. Reescribe el texto en ESPAÑOL para hacerlo más atractivo, detallado y persuasivo. Destaca beneficios y genera interés de compra. Devuelve solo el texto final, sin explicaciones.",
          },
          {
            role: "user",
            content: `Texto: """${text}"""\nTono: ${tone || "profesional"}`,
          },
        ],
      }),
    });

    const data = await r.json();
    let improved = data?.choices?.[0]?.message?.content?.trim() || text;

    return res.json({ improved });
  } catch (e) {
    console.error("LLM rewrite error:", e);
    return res.status(500).json({ improved: text });
  }
});

// Conexión MongoDB
async function startServer() {
  try {
    await mongoose.connect(
      "mongodb+srv://Giovassz:IenXm9YGvdvMeRt4@backend.sjvge78.mongodb.net/backend"
    );
    console.log("✅ Connected to MongoDB Atlas!");
    app.listen(3000, () => {
      console.log("🚀 Server is running on port 3000");
    });
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  }
}

startServer();
