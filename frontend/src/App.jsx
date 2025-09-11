import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductsList from "./pages/ProductsList";
import ProductForm from "./pages/ProductForm";
import QueryDB from "./pages/QueryDB";
import Navbar from "./components/Navbar";
import "./index.css";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors pb-16">
      <header className="pt-8 pb-6 text-center">
        <h1 className="app-title">Gestor de Productos</h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<ProductsList />} />
          <Route path="/add" element={<ProductForm />} />
          <Route path="/query" element={<QueryDB />} />
        </Routes>
      </main>

      <Navbar />
    </div>
  );
}
