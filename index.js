const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // 👈 necesario para frontend
const productRoute = require("./routes/product.route.js");

const app = express();

// middleware
app.use(cors()); // 👈 habilita CORS para permitir peticiones desde frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/products", productRoute);

app.get("/", (req, res) => {
  res.send("Hello from Node API Server 🚀");
});

// conexión a MongoDB Atlas
async function startServer() {
  try {
    await mongoose.connect(
      "mongodb+srv://Giovassz:IenXm9YGvdvMeRt4@backend.sjvge78.mongodb.net/backend",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
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
